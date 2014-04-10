// Setup Timeing
var h = 0,m = 5, s = 0;

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
            m = 59;
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

/**
 * Navigate between Questions
 * @param now int
 */
function showQuiz(now){
    // Display Question count
    $("#qnum").html(now+1+'/'+totalQ);

    // Display Question
    $("#qus").text(d.quiz[now].question);

    // Display Options
    $.each(d.quiz[now].option, function(i,op){
        $("ul.radioList").append('<li class="btn" data-val="'+i+'">'+op+'</li>');
    })
    $("ul.radioList li").click(function(){
        var Ans = $(this).data("val");
        setAns(currQ, Ans);
        $(".radioList li").removeClass("btn-success");
        $(this).addClass("btn-success");
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
        $("button#prev-btn").hide();
    } else {
        $("button#prev-btn").show();
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
    var dict = {
		"Dirigir" : 0,
		"Persuadir" : 0,
		"Delegar" : 0,
		"Participar" : 0
	};
    $.each(d.quiz, function(i,op){
	   var ans = d.quiz[i].ans[selAns[i]]; 
	   dict[ans]++;
    });
    var arr = [];

	for (var key in dict) {
		if (dict.hasOwnProperty(key)) {
			var key2 ={};
			key2[key] = dict[key];
			arr.push(key2);
		}
	}

	arr.sort();
    $("div.screen-finish > h2").append("<div id="+Object.keys(arr[0])[0]+"></div>");
    $("div.screen-finish > h2").append("<div id="+Object.keys(arr[1])[0]+"></div>");
    $("div.screen-finish > h2").append("<div id="+Object.keys(arr[2])[0]+"></div>");
    $("div.screen-finish > h2").append("<div id="+Object.keys(arr[3])[0]+"></div>");
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
        $(".mujer, .logo1, h1").animate({opacity:0},1000);
	$("video").fadeIn(1000).get(0).play();
	$("video").fadeIn(1000).get(0).play();
        $(".screen-start").delay(13000).slideUp(1000);
        timerF = setInterval(timer,1000);
        // Load question on start
        showQuiz(currQ);
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
    });
    // Go to previous question
    $("button#prev-btn").click(function(){
        clearOptions();
        showQuiz(--currQ);
    });
    // Finish Quiz
    $("button#fin-btn").click(function(){
        finish();
    });
    $("button#show-ans").click(function(){
        showAns();
        $(".screen-finish").slideUp(1000);
    });
});
