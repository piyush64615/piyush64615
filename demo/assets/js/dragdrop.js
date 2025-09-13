var items;
var itemContainer;
var answers = false;
var _text;

$(document).ready(function(e) {
    items = MASTER_DB.OPTIONS;
    var container = "#container-box";
    itemContainer = "#container-items-box";
	var footerContainer = "#btn-wrapper-holder";
	var feedbackTracker;
	var attempt = 0;
	var lastDrag, lastDrop;
	
	_text = MASTER_DB.QUESTIONS;
	var table_content = '';
	init();
	
	$('#activity_title, title').html(MASTER_DB.CONFIG.TITLE);
	$("#app-instruction").html(MASTER_DB.CONFIG.INSTRUCTION);
	
function init() {
    for (var i = 1; i <= _text.length; i++) {
        var str = "";
        var j = 0;
        var val = _text[i - 1];

        var count = (val.match(/[<>]/g) || []).length;
        count = count / 2;

        for (var k = 1; k <= count; k++) {
            val = val.replace('[<>]', '<div class="addHere" style="display:inline-block; height: auto; max-width: 100%;" id="' + i + '_' + k + '"></div>');
        }
        table_content += "<li><div class='div_parent'>" + val + "</div></li>";
    }

    $('#container-box > ol').append(table_content);

    $('.addHere').each(function () {
        var id = $(this).attr('id');
        var exp = id.split('_');
        var i = exp[0];
        var k = exp[1];
        cleanText = items[i - 1][k - 1].replace(/<\/?[^>]+(>|$)/g, "");
        $(this).html('<div class="drop" id="drop_' + id + '" data-ans="' + cleanText + '"></div>');
    });



	
        $(itemContainer).empty()
		
		$.each(items, function(index, value, ele)
		{
			for(var k = 1; k <= value.length; k++)
			{
				$('<div class="item"></div>')
					.html(value[k-1])
					.appendTo(itemContainer);
			}
		});
		
		$(itemContainer).find('.item').each(function(index, element) {
            var i = Math.floor(Math.random() * 6);
			$(itemContainer).find('.item').eq(i).detach().prependTo(itemContainer);
        });

        //$('<div class="footer">').appendTo('.stage');
        				
		$('.item').draggable(
		{
			containment: ".body-container",
			revert: 'invalid',
			revertDuration: 600
		});
		
		$('.drop').droppable(
		{
			//activeClass: "itemHover",
			//hoverClass: "drop-hover",
			accept: '.item',
			drop: function(event, ui)
			{
				var userAns = $(ui.draggable).html();
				var ans = $(event.target).attr('data-ans');
	
				$("#feedback-incorrect, #feedback-correct").hide();
				lastDrag = $(ui.draggable);
				lastDrop = $(event.target)
				
				if(userAns != ans) 
				{
					lastDrop.attr('data-drop', 'wrong_put');
					attempt++;
					/*$(ui.draggable).draggable('option', 'revert', true);
					
					MasterApp.playAudio('audioIncorrectList');
					$("#feedback-incorrect").show();
					attempt++;

					if(attempt >= MASTER_DB.CONFIG.HINT) {
						$("#btn-hint").removeAttr('disabled');
					}*/
				} else {
					lastDrop.attr('data-drop', 'right_put');
					
					/*MasterApp.playAudio('audioCorrectList');
					$("#feedback-correct").show();*/
				}
				
				$(this).html($(ui.draggable).html());
				$(ui.draggable).remove();
				$(this).droppable( "disable" );
				
				checkemptyContainer();
								
				try {
					clearTimeout(feedbackTracker);
				} catch(err) {

				}
				feedbackTracker = setTimeout(function(e) {
					$("#feedback-incorrect, #feedback-correct").hide();
				}, MASTER_DB.CONFIG.FEEDBACK_TIME);
			}
		});

	}
});

function checkemptyContainer()
{
	if($(itemContainer).is(':empty'))
	{
		$(itemContainer).hide();
		if(!answers) $('#submit').removeAttr('disabled');
	}
}

function checkAnswers() {
    $('.drop').each(function(index, value) {
        var dataDropValue = $(this).attr('data-drop');
        console.log("Data Drop Value:", dataDropValue); // Debugging line
        if (dataDropValue === "right_put") {
            $(this).append("<span class='ans-correct'></span>");
        } else {
            $(this).append("<span class='ans-incorrect'></span>");
        }
    });


  if (!$('.ans-incorrect').length) {
        console.log('All answers are correct.');
        //playFullscreenGif('../../assets/img/welldone.gif');
        playAudio('well-done');
    } else {
        console.log('At least one answer is incorrect.');
        playAudio('try-again');
        //playFullscreenGif('../../assets/img/TryAgain.gif');
    }


    $('#submit').attr('disabled', 'disabled');
    $('#next').removeAttr('disabled');
}

function showAnswers() {
    answers = true;

    $('.drop').each(function (index, value) {
        var _ind = $(this).attr('id').replace('drop_', '');
        var ind = _ind.indexOf('_');
        var last_ind = Number(_ind.lastIndexOf('_')) + 1;

        var ques_id = Number(String(_ind).substring(0, ind));
        var option_id = Number(String(_ind).substring(last_ind, String(_ind).length));
        $('#drop_' + ques_id + '_' + (option_id)).html(items[ques_id - 1][option_id - 1]);
        $('.item, .ans-correct, .ans-incorrect').remove();
    });

    checkemptyContainer();

    $("#next").attr('disabled', 'disabled');
}

function playFullscreenGif(gifPath) {
    // Create a fullscreen div to display the gif
    var fullscreenDiv = $("<div id='fullscreen-gif-container'></div>");
    fullscreenDiv.css({
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    });

    // Create an img element for the gif
    var gifImg = $("<img src='" + gifPath + "' alt='fullscreen-gif'>");
    gifImg.css({
        maxWidth: '100%',
        maxHeight: '100%',
    });

    // Append the gif img to the fullscreen div
    fullscreenDiv.append(gifImg);

    // Append the fullscreen div to the body
    $('body').append(fullscreenDiv);

    // Remove the fullscreen div after a few seconds (adjust as needed)
    setTimeout(function () {
        fullscreenDiv.remove();
    }, 5000); // Display the gif for 5 seconds (adjust as needed)
}

function playAudio(audioPath) {
    // Use an appropriate method to play the audio file
    // For example, you can use the HTML5 Audio API:
    var audio = new Audio(audioPath);
    audio.play();
}


function replaceBlackToDrop(_txt, sNo)
{
	var word = _txt.split(" ");
	var _string = "";
	
	var indNO = 0;
	for(var i= 0; i < word.length; i++)
	{
		_string += '<span class = "words">'+word[i]+ '</span>';
		
		if(_string.indexOf("[<>]") != -1)
		{
			indNO++;
			var Dropable_ele = "<div class = 'drop' id = drop_"+ sNo + "_" + indNO + " data-ans = "+ items[sNo-1][indNO-1] +"></div>";
			_string = _string.replace("[<>]", Dropable_ele);	
		}
	}
	
	return _string;
}

function playAudio(file_name)
{
	var _audio = new Audio('assets/audio/'+file_name+'.mp3');
	$(_audio).attr('type','audio/mp3');
	_audio.play();
}