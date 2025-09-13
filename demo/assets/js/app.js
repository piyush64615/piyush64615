/*
* Author: Ashok Shah
* https://www.shahnashok.com
* Date: 16/09/2017
*/

function MainApp () {
	this.init();
}

MainApp.prototype.init = function() {
	$('#activity_title, title').html(MASTER_DB.CONFIG.TITLE);
	$("#app-instruction").html(MASTER_DB.CONFIG.INSTRUCTION);
	$("#instructions-info").html("<li>" + MASTER_DB.CONFIG.INSTRUCTIONS.join("</li><li>") + "</li>");
// 	$("#btn-wrapper-holder").html('<button disabled class="btn btn-primary" id="btn-hint">Answer</button>' +
// '<button disabled class="btn btn-primary" id="btn-answers">Answer Key</button>' +
// '<button disabled class="btn btn-primary" id="btn-again">Retry Activity</button>');

	this.total = MASTER_DB.QUESTIONS.length;
	this.current = 1;
	//this.loadQuestion();
	this.loadAudio();
	this.attempt = 0;
};

MainApp.prototype.loadAudio = function() {
	/*this.audioCorrectList = [];
	this.audioIncorrectList = [];
	this.audioCompleteList = [];

	var AUDIO_COMPLETE = MASTER_DB.AUDIO.COMPLETE;
	for(var i=0; i<AUDIO_COMPLETE.length; i++) {
		var id = "complete-" + i;
		this.audioCompleteList.push(id);
		soundManager.createSound({
			id:id,
			url:AUDIO_COMPLETE[i],
			autoLoad:true,
			autoPlay:false
		});
	}

	var AUDIO_POSITIVE = MASTER_DB.AUDIO.POSITIVE;
	for(var i=0; i<AUDIO_POSITIVE.length; i++) {
		var id = "positive-" + i;
		this.audioCorrectList.push(id);
		soundManager.createSound({
			id:id,
			url:AUDIO_POSITIVE[i],
			autoLoad:true,
			autoPlay:false
		});
	}

	var AUDIO_NEGATIVE = MASTER_DB.AUDIO.NEGATIVE;
	for(var i=0; i<AUDIO_NEGATIVE.length; i++) {
		var id = "negative-" + i;
		this.audioIncorrectList.push(id);
		soundManager.createSound({
			id:id,
			url:AUDIO_NEGATIVE[i],
			autoLoad:true,
			autoPlay:false
		});
	}*/
};

MainApp.prototype.playAudio = function(type) {
	/*var randomIndex = Math.floor(Math.random() * this[type].length);
	var id = this[type][randomIndex];
	soundManager.stopAll();
	soundManager.getSoundById(id).play();
	return randomIndex;*/
}

MainApp.prototype.setAppActions = function () {
	var $dragItems = $(".draggable_list li");
	var $dropArea = $("#drop-box-area");
	var _this = this;

	$dragItems.draggable({
		revert: 'invalid',
		containment: '.question-section'
	});

	$dropArea.droppable({
		accept: '.dragItem',
		activeClass: 'dropActiveHighlight',
		drop: function(event, ui) {
			var dragItem = ui.draggable;
			var guessIndex = ui.draggable.attr('data-index');
			var textInfo = ui.draggable.text();
			var moreInfo = _this.getQuestion(guessIndex);
			var $feedbackTxt = $("#feedback-text");
			var submitStatus = "";
			$("#feedback-incorrect, #feedback-correct").hide();
			_this.attempt++;
			if(guessIndex == _this.current) {
				// correct attempt
				if(typeof moreInfo.feedback == 'object')
					$feedbackTxt.text(moreInfo.feedback.positive);
				_this.current++;
				_this.playAudio('audioCorrectList');
				$(".drop-box-area .static-box:first").remove();
				ui.draggable.addClass('dragHideTrick');
				var serialNum = $(".droppedItem").length + 1;
				var resHTML = '<div class="droppedItem animated fadeIn">' + serialNum + '. ' + textInfo + '</div>';
				$(resHTML).insertBefore(this);
				$('#btn-hint').attr('disabled', 'disabled');
				$("#feedback-correct").show();
				submitStatus = true;
				_this.attempt = 0;
				// completion
				if(_this.current > _this.total) {
					$("#drop-box-area").hide();
					setTimeout(function() {
						_this.showFinalScreen();
					}, MASTER_DB.CONFIG.RESULT_TIME)
					
				}
			} else {
				// incorrect attempt
				if(typeof moreInfo.feedback == 'object')
					$feedbackTxt.text(moreInfo.feedback.negative);
				ui.draggable.draggable('option', 'revert', true);
				
				_this.playAudio('audioIncorrectList');
				$("#feedback-incorrect").show();
				submitStatus = false;
			}
			$('.feedback_img').show();
			try {
				clearTimeout(kidTimeout);
			} catch(e) {}
			window.kidTimeout = setTimeout(function() {
				$("#feedback-incorrect, #feedback-correct").hide();
				$('.feedback_img').hide();

			}, MASTER_DB.CONFIG.FEEDBACK_TIME);
			/** MOVE 1 LINE UP FOR DELAY BUTTON SHOW */
			if(!submitStatus) {
				if (_this.attempt >= MASTER_DB.CONFIG.HINT) {
					$('#btn-hint').removeAttr('disabled');
				}
			}
			/* --- */

			if(typeof moreInfo.feedback == 'object')
				$("#modal-feedback").show();
		}
	})
}

MainApp.prototype.showFinalScreen = function() {
	$("#screen-result").show();
	$("#screen-activity").hide();
	$("#btn-again, #btn-answers").removeAttr('disabled');
	$("body").addClass('completed');
	$("#btn-hint").hide();
	var index = this.playAudio('audioCompleteList');
	$("#completeText").html(MASTER_DB.COMPLETE.TEXT[index]);
}

MainApp.prototype.loadQuestion = function(index) {

	var qList = MASTER_DB.QUESTIONS;
	var dgListHTML = "";
	for(var i=0; i<qList.length; i++) {
		var itemObj = qList[i];
		dgListHTML += '<li class="dragItem" id="dragItem-' + itemObj.order + '" data-index="' + itemObj.order + '">' + itemObj.options + '</li>';
	}
	$("#draggable_list").html(dgListHTML);
	this.setAppActions();
};

MainApp.prototype.enableDoneBtn = function (e) {
	if($('input[type="radio"]:checked').length)
		$("#btn-done").removeAttr('disabled')
};

MainApp.prototype.showHint = function () {
	$("#btn-hint").attr('disabled', 'disabled');

	var rightEles = "#dragItem-" + this.current;
	$(rightEles).css({visibility: 'hidden'});
	var textInfo = $(rightEles).text();
	var serialNum = $(".drop-box-area .droppedItem").length + 1;
	var resHTML = '<div class="droppedItem animated fadeIn">' + serialNum + '. ' + textInfo + '</div>';
	$(resHTML).insertBefore('#drop-box-area');
	$(".drop-box-area .static-box:first").remove();
	this.current++;
	this.attempt = 0;
}

MainApp.prototype.showHints = function () {
	$("#btn-hint").attr('disabled', 'disabled');

	var rightEles = "#dragItem-" + this.current;
	$(rightEles).addClass('blinking');
	
	var intervalHolder;
	$('.blinking').each(function() {
		var elem = $(this);
		intervalHolder = setInterval(function() {
			if (elem.css('visibility') == 'hidden') {
				elem.css('visibility', 'visible');
			} else {
				elem.css('visibility', 'hidden');
			}    
		}, 500);
	});
	
	setTimeout(function() {
		//_this.submitAgain();
		clearInterval(intervalHolder);
		$('.blinking').removeClass('blinking');
		$('.blinking').css('visibility', 'visible');
	}, 3100);
	
}

MainApp.prototype.getQuestion = function (orderId) {
	var q = MASTER_DB.QUESTIONS;
	for(var i=0; i<q.length; i++) {
		if(q[i].order == orderId) {
			return q[i];
		}
	}
};

MainApp.prototype.showAnswers = function () {
	$("#screen-activity").show();
	$("#screen-result").hide();
	$("#btn-answers").attr('disabled', 'disabled'); 
	$("#app-instruction").html('');
	$(".sub-header").show();
	$("#q-title").html(MASTER_DB.CONFIG.ANSWER_TITLE);
};

function closeModal (eleId) {
	$("#" + eleId).fadeOut();
}

var MasterApp;
$(document).ready(function(e) {
	MasterApp = new MainApp();

	$("#btn-hint").on('click', function(e) {
		MasterApp.showHint();
	});

	$("#btn-again").on('click', function(e) {
		window.location.reload();
	});

	$("#btn-answers").on('click', function(e) {
		MasterApp.showAnswers();
	});

	$('#startButton').click(function() {
		$('.starterScreen').hide();	
		$('.container').show();
	});
});
/*
* Author: Ashok Shah
* https://www.shahnashok.com
* Date: 16/09/2017
*/

function MainApp () {
	this.init();
}

MainApp.prototype.init = function() {
	$('#activity_title, title').html(MASTER_DB.CONFIG.TITLE);
	$("#app-instruction").html(MASTER_DB.CONFIG.INSTRUCTION);
	$("#instructions-info").html("<li>" + MASTER_DB.CONFIG.INSTRUCTIONS.join("</li><li>") + "</li>");
// 	$("#btn-wrapper-holder").html('<button disabled class="btn btn-primary" id="btn-hint">Answer</button>' +
// '<button disabled class="btn btn-primary" id="btn-answers">Answer Key</button>' +
// '<button disabled class="btn btn-primary" id="btn-again">Retry Activity</button>');

	this.total = MASTER_DB.QUESTIONS.length;
	this.current = 1;
	//this.loadQuestion();
	this.loadAudio();
	this.attempt = 0;
};

MainApp.prototype.loadAudio = function() {
	/*this.audioCorrectList = [];
	this.audioIncorrectList = [];
	this.audioCompleteList = [];

	var AUDIO_COMPLETE = MASTER_DB.AUDIO.COMPLETE;
	for(var i=0; i<AUDIO_COMPLETE.length; i++) {
		var id = "complete-" + i;
		this.audioCompleteList.push(id);
		soundManager.createSound({
			id:id,
			url:AUDIO_COMPLETE[i],
			autoLoad:true,
			autoPlay:false
		});
	}

	var AUDIO_POSITIVE = MASTER_DB.AUDIO.POSITIVE;
	for(var i=0; i<AUDIO_POSITIVE.length; i++) {
		var id = "positive-" + i;
		this.audioCorrectList.push(id);
		soundManager.createSound({
			id:id,
			url:AUDIO_POSITIVE[i],
			autoLoad:true,
			autoPlay:false
		});
	}

	var AUDIO_NEGATIVE = MASTER_DB.AUDIO.NEGATIVE;
	for(var i=0; i<AUDIO_NEGATIVE.length; i++) {
		var id = "negative-" + i;
		this.audioIncorrectList.push(id);
		soundManager.createSound({
			id:id,
			url:AUDIO_NEGATIVE[i],
			autoLoad:true,
			autoPlay:false
		});
	}*/
};

MainApp.prototype.playAudio = function(type) {
var randomIndex = Math.floor(Math.random() * this[type].length);
	var id = this[type][randomIndex];
	soundManager.stopAll();
	soundManager.getSoundById(id).play();
	return randomIndex;
}

MainApp.prototype.setAppActions = function () {
	var $dragItems = $(".draggable_list li");
	var $dropArea = $("#drop-box-area");
	var _this = this;

	$dragItems.draggable({
		revert: 'invalid',
		containment: '.question-section'
	});

	$dropArea.droppable({
		accept: '.dragItem',
		activeClass: 'dropActiveHighlight',
		drop: function(event, ui) {
			var dragItem = ui.draggable;
			var guessIndex = ui.draggable.attr('data-index');
			var textInfo = ui.draggable.text();
			var moreInfo = _this.getQuestion(guessIndex);
			var $feedbackTxt = $("#feedback-text");
			var submitStatus = "";
			$("#feedback-incorrect, #feedback-correct").hide();
			_this.attempt++;
			if(guessIndex == _this.current) {
				// correct attempt
				if(typeof moreInfo.feedback == 'object')
					$feedbackTxt.text(moreInfo.feedback.positive);
				_this.current++;
				_this.playAudio('audioCorrectList');
				$(".drop-box-area .static-box:first").remove();
				ui.draggable.addClass('dragHideTrick');
				var serialNum = $(".droppedItem").length + 1;
				var resHTML = '<div class="droppedItem animated fadeIn">' + serialNum + '. ' + textInfo + '</div>';
				$(resHTML).insertBefore(this);
				$('#btn-hint').attr('disabled', 'disabled');
				$("#feedback-correct").show();
				submitStatus = true;
				_this.attempt = 0;
				// completion
				if(_this.current > _this.total) {
					$("#drop-box-area").hide();
					setTimeout(function() {
						_this.showFinalScreen();
					}, MASTER_DB.CONFIG.RESULT_TIME)
					
				}
			} else {
				// incorrect attempt
				if(typeof moreInfo.feedback == 'object')
					$feedbackTxt.text(moreInfo.feedback.negative);
				ui.draggable.draggable('option', 'revert', true);
				
				_this.playAudio('audioIncorrectList');
				$("#feedback-incorrect").show();
				submitStatus = false;
			}
			$('.feedback_img').show();
			try {
				clearTimeout(kidTimeout);
			} catch(e) {}
			window.kidTimeout = setTimeout(function() {
				$("#feedback-incorrect, #feedback-correct").hide();
				$('.feedback_img').hide();

			}, MASTER_DB.CONFIG.FEEDBACK_TIME);
			/** MOVE 1 LINE UP FOR DELAY BUTTON SHOW */
			if(!submitStatus) {
				if (_this.attempt >= MASTER_DB.CONFIG.HINT) {
					$('#btn-hint').removeAttr('disabled');
				}
			}
			/* --- */

			if(typeof moreInfo.feedback == 'object')
				$("#modal-feedback").show();
		}
	})
}

MainApp.prototype.showFinalScreen = function() {
	$("#screen-result").show();
	$("#screen-activity").hide();
	$("#btn-again, #btn-answers").removeAttr('disabled');
	$("body").addClass('completed');
	$("#btn-hint").hide();
	var index = this.playAudio('audioCompleteList');
	$("#completeText").html(MASTER_DB.COMPLETE.TEXT[index]);
}

MainApp.prototype.loadQuestion = function(index) {

	var qList = MASTER_DB.QUESTIONS;
	var dgListHTML = "";
	for(var i=0; i<qList.length; i++) {
		var itemObj = qList[i];
		dgListHTML += '<li class="dragItem" id="dragItem-' + itemObj.order + '" data-index="' + itemObj.order + '">' + itemObj.options + '</li>';
	}
	$("#draggable_list").html(dgListHTML);
	this.setAppActions();
};

MainApp.prototype.enableDoneBtn = function (e) {
	if($('input[type="radio"]:checked').length)
		$("#btn-done").removeAttr('disabled')
};

MainApp.prototype.showHint = function () {
	$("#btn-hint").attr('disabled', 'disabled');

	var rightEles = "#dragItem-" + this.current;
	$(rightEles).css({visibility: 'hidden'});
	var textInfo = $(rightEles).text();
	var serialNum = $(".drop-box-area .droppedItem").length + 1;
	var resHTML = '<div class="droppedItem animated fadeIn">' + serialNum + '. ' + textInfo + '</div>';
	$(resHTML).insertBefore('#drop-box-area');
	$(".drop-box-area .static-box:first").remove();
	this.current++;
	this.attempt = 0;
}

MainApp.prototype.showHints = function () {
	$("#btn-hint").attr('disabled', 'disabled');

	var rightEles = "#dragItem-" + this.current;
	$(rightEles).addClass('blinking');
	
	var intervalHolder;
	$('.blinking').each(function() {
		var elem = $(this);
		intervalHolder = setInterval(function() {
			if (elem.css('visibility') == 'hidden') {
				elem.css('visibility', 'visible');
			} else {
				elem.css('visibility', 'hidden');
			}    
		}, 500);
	});
	
	setTimeout(function() {
		//_this.submitAgain();
		clearInterval(intervalHolder);
		$('.blinking').removeClass('blinking');
		$('.blinking').css('visibility', 'visible');
	}, 3100);
	
}

MainApp.prototype.getQuestion = function (orderId) {
	var q = MASTER_DB.QUESTIONS;
	for(var i=0; i<q.length; i++) {
		if(q[i].order == orderId) {
			return q[i];
		}
	}
};

MainApp.prototype.showAnswers = function () {
	$("#screen-activity").show();
	$("#screen-result").hide();
	$("#btn-answers").attr('disabled', 'disabled'); 
	$("#app-instruction").html('');
	$(".sub-header").show();
	$("#q-title").html(MASTER_DB.CONFIG.ANSWER_TITLE);
};

function closeModal (eleId) {
	$("#" + eleId).fadeOut();
}

var MasterApp;
$(document).ready(function(e) {
	MasterApp = new MainApp();

	$("#btn-hint").on('click', function(e) {
		MasterApp.showHint();
	});

	$("#btn-again").on('click', function(e) {
		window.location.reload();
	});

	$("#btn-answers").on('click', function(e) {
		MasterApp.showAnswers();
	});

	$('#startButton').click(function() {
		$('.starterScreen').hide();	
		$('.container').show();
	});
});
