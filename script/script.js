// Setup Timeing
var h = 0,m = 15, s = 0;

var d, totalQ, currQ = 0;

var selAns = new Array();

/**
* Add leading 0 to int
* @param num int
* @return string
*/
function pad(num) {
    var s = num+"";
    if(s.length < 2) s = "0" + s;
    return s;
}

/**
* Countdown Timer
*/
function timer(){
    if(s == 0){
        if(m > 0){
            s = 59;
            m--;
        }
    } else {
        s--;
    }
    if(m == 0){
        if(h > 0){
            m = 59;video
            h--;
        }
    }
    if(h == 0 && m == 0 && s == 0){
    finish();
    }
    // Setting time in span#time
    $("#time").text(h+':'+pad(m)+':'+pad(s));
}

/**
 * Get JSON data from file
 */
function getData(){
    $.getJSON("quiz.js",function(data){
        d = data;
        // Get numbers of questions in set
        totalQ = data.quiz.length;
    });
}

function showOptions(){
	$('.scroleable').animate('slideFromRight', {
		complete: function() {
			scroll();
		}
    });	
}

function scroll(){
			$('.scroleable').animate({scrollTop:0, duration:1000, complete: $('.scroleable').animate({scrollTop:$('.scroleable').height(),duration:1000})});
		
}

/**
 * Navigate between Questions
 * @param now int
 */
function showQuiz(now){
    // Display Question count
    $("#qnum").html(now+1+'/'+totalQ);

    // Display Question
    $("#qus").text(d.quiz[now].question);

	var optionsLetter=["a","b","c","d"];
    // Display Options
    $.each(d.quiz[now].option, function(i,op){
        $("ul.radioList").append('<li class="btn" data-val="'+i+'">'+'<span>'+i+'</span>'+'<p>'+op+'</p>'+'</li>');
    })
   
			 
	
    $("ul.radioList li").click(function(){
		
        var Ans = $(this).data("val");
        setAns(currQ, Ans);
        $(".radioList li").removeClass("btn-success");
        $(this).addClass("btn-success");
        
        document.getElementById('elige-pregunta').play();
		JSInterface.playAudio("Quizer/audio/elige_pregunta.ogg");
    });
    retrieveAns(now);
    btnHandler(now);
}

/**
 * Show or hide buttons
 * @param now int
 */
function btnHandler(now){
    if(now+1 == totalQ){
        $("button#next-btn").hide();
        $("button#fin-btn").show();
    } else {
        $("button#fin-btn").hide();
        $("button#next-btn").show();
    }
    if(now == 0){
        $("button#prev-btn").css("opacity","0");
    } else {
        $("button#prev-btn").css("opacity","1");
    }
}

/**
 * Do finish and reset actions
 */
function finish(){
    // Timeup, Stop timer
    clearInterval(timerF);
    checkAns();
    $(".screen-finish").slideDown(1000);
    $("#quiz").hide();
}

/**
 * save selected answer in array
 * @param qNum int Current question number
 * @param Ans string Selected answer
 */
function setAns(qNum,Ans){
    selAns[qNum] = Ans;
}

/**
 * Clear displaying options
 */
function clearOptions(){
    $("ul.radioList").html("");
}

/**
 * Retrive previously selected answer
 * @param qNum int Current question number
 */
function retrieveAns(qNum){
    var a = selAns[qNum];
    $('.radioList li[data-val|="'+a+'"]').addClass('btn-success');
}

/**
 * Check answer and calculate score
 */
function checkAns(){
  var arr = []
  arr.push({leaderName:"Dirigir",amount:0});
  arr.push({leaderName:"Persuadir",amount:0});
  arr.push({leaderName:"Delegar",amount:0});
  arr.push({leaderName:"Participar",amount:0});

  $.each(d.quiz, function(i,op){
	   var ans = d.quiz[i].ans[selAns[i]]; 
     $.each(arr,function(i,leader){
       if(leader["leaderName"]==ans) {
          leader["amount"]++;        
        }
      });          
    });

  arr = arr.sort(function(a,b){return b["amount"]-a["amount"]});
  $("#"+arr[0]["leaderName"]).addClass("1").prepend("<span>1</span>");
  $("#"+arr[1]["leaderName"]).addClass("2").prepend("<span>2</span>");
  $("#"+arr[2]["leaderName"]).addClass("3").prepend("<span>3</span>");
  $("#"+arr[3]["leaderName"]).addClass("4").prepend("<span>4</span>");
  $(".tipoLider").tsort({attr:'class'}); 
}

function playVideo(video){
    window.JSInterface.startVideo(video);
  }

/**
 * show selected answers right or wrong
 */
function showAns(){
    var prep = "", qKey;
    $.each(d.quiz, function(i,q){
        qKey = i;
        prep +="<li>"+q.question+"<ol>";
        $.each(q.option,function(i,o){
            prep += "<li>"+o;
            if(selAns[qKey] == i){    
				prep +=" <span class='check'>&#x2713;</span>";
				prep += "</li>";
            }
        });
        prep += "</ol></li>"
    });
    $("#result>ol").html(prep);
}


$(document).ready(function(){
	
	
    getData();
    $("body").fadeIn(2000);
    // Display Questions and start timer
    $("button#qstart").click(function(){
	$('.scroleable').css("display","block");
	//$(".scroleable-finish").perfectScrollbar(); Por que mas de una vez esto?
        $(".mujer, .hombre, .logo1, h1, #qstart").animate({opacity:0},1000);
	var startQuiz = function() {
		$("video").fadeOut(1000);
		$(".screen-start").slideUp(1000);
		$("#quiz").delay(1000).animate({opacity:"1"}, 500);
		$("#nav").slideDown(1000);
		$('.screen-instrucciones-wrap, .screen-instrucciones').css("display","block");
		$('.screen-instrucciones').click(function(){scroll();});
		timerF = setInterval(timer,1000);
		// Load question on start
		showQuiz(currQ);
        $('.scroleable').perfectScrollbar('update');
		
        }
	
	$("video").fadeIn(1000, "swing", function() {
		$("video").bind("ended", startQuiz);
		this.play();
		});
	
   });
    // Clear selected answer
    $("button#ans-clear").click(function(){
        $(".radioList li").removeClass("btn-success");
        setAns(currQ, "");
    });
    // Go to next Question
    $("button#next-btn").click(function(){
        clearOptions();
        showQuiz(++currQ);
	$("#nav").delay(8000).slideDown(1000);

    });
    // Go to previous question
    $("button#prev-btn").click(function(){
        clearOptions();
        showQuiz(--currQ);
    });
    // Finish Quiz
    $("button#fin-btn").click(function(){
        finish();
	$('.scroleable-finish').perfectScrollbar();

    });
    $("button#show-ans").click(function(){
        showAns();
        $(".screen-finish").slideUp(1000);
//(".screen-finish .logo1").animate({opacity:1},1000);
    });

});
