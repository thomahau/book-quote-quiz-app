'use strict';

function handleProceedBtnClick() {
	$('main').on('click', '.js-proceed-btn', function() {
		renderQuestionPage();
	});
}

function generateRadioElement(answer, index) {
	const answerParts = answer.split(",");
	const author = answerParts[0];
	const title = answerParts[1];
	return `
	<div class="radio-container">
		<input type="radio" name="answer" id="${index}" value="${index}" required>
		<label for="${index}">${author}, <span class="book-title">${title}</span></label><br>
	</div>`;
}

function generateFormInputs(answers) {
	const radios = answers.map((answer, index) => generateRadioElement(answer, index));
	return radios.join("");
}

function renderForm(questionCount) {
	const formInputs = generateFormInputs(DATA[questionCount].answers);
	$('.js-game-container').append(`
		<form class="answer-form row" action="#" method="GET">
			<div class="col-8 radio-wrap">
				<fieldset name="books">
					<legend><em>Which book does the quote come from?</em></legend>
					${formInputs}
				</fieldset>
				<button type="submit" class="btn js-submit-answer-btn">Submit</button>
			</div>
		</form>`);
}

function renderQuestionPage() {
	let questionCount = $('.js-question-count').text();
	$('.js-intro').remove();
	if (parseInt(questionCount) < 10) {
		$('.js-game-container').html(`
		<div class="row">
			<div class="col-8 quote">
				&ldquo;${DATA[questionCount].quote}&rdquo;
			</div>
		</div>`);
		renderForm(questionCount);
		questionCount++;
		$('.js-question-count').text(questionCount);
	} else {
		renderFinalPage();
	}
}

function renderCorrectAnswer(questionCount) {
	const answerParts = DATA[questionCount].answers[DATA[questionCount].correctAnswer].split(",");
	const author = answerParts[0];
	const title = answerParts[1];
	const newScore = parseInt($('.js-score-count').text()) + 1;
	const possibleScoreCount = questionCount + 1;

	$('.js-game-container').append(`
		<div class="row citation">
			<em>&mdash; ${author}, <span class="book-title">${title}</span></em>
		</div>
		<div class="row">
			<div class="col-8 feedback-container">
				<img class="icon" src="images/icon_correct.jpg" alt="Correct answer icon">
				<p class="feedback">You got it right!<br>Keep up the good work.</p>
			</div>
		</div>
		<button class="btn js-proceed-btn">Next</button>`);
	$('.js-score-count').text(newScore);
	$('.js-possible-score-count').text(`/${possibleScoreCount}`);
}

function renderWrongAnswer(questionCount) {
	const answerParts = DATA[questionCount].answers[DATA[questionCount].correctAnswer].split(",");
	const author = answerParts[0];
	const title = answerParts[1];
	const possibleScoreCount = questionCount + 1;

	$('.js-game-container').append(`
		<div class="row citation">
			<em>&mdash; ${author}, <span class="book-title">${title}</span></em>
		</div>
		<div class="row">
			<div class="col-8 feedback-container">
				<img class="icon" src="images/icon_wrong.jpg" alt="Wrong answer icon">
				<p class="feedback">That's wrong! See<br>answer above.</p>
			</div>
		</div>
		<button class="btn js-proceed-btn">Next</button>`);
	$('.js-possible-score-count').text(`/${possibleScoreCount}`);
}

function renderFinalPage() {
	const finalScore = $('.js-score-count').text();
	const customMessage = generateCustomMessage(finalScore);

	$('.js-question-count').text('10');
	$('.js-possible-score-count').text('/10');
	$('.js-game-container').html(`
		<div class="row">
			<p>You scored <em>${finalScore}/10</em> points</p>
			<img class="final-image" src="http://bestanimations.com/Books/pretty-book-bench-nature-water-outdoors-animated-gif.gif" alt="Book animation">
			<p>${customMessage}</p>
		</div>
		<button class="btn js-restart-btn">Restart Quiz</button>`);
}

function generateCustomMessage(score) {
	let message;
	if (score < 4) {
		message = 'Do you even read? Try harder next time.';
	} else if (score >= 4 && score < 8) {
		message = "Not bad, I bet you've read a book or two. Can you do better?";
	} else {
		message = 'Good job! A true bibliophile. Want to play again?'
	}
	return message;
}

function handleRadioSelection() {
	$('.js-game-container').on('change', 'input[type="radio"]', function(event) {
		$('.highlight').toggleClass('highlight');
		$(this).parent().toggleClass('highlight');
	});
}

function handleAnswerSubmit() {
	$('main').on('click', '.js-submit-answer-btn', function(event) {
		if (!$('input[name="answer"]').is(':checked')) {
			alert('Please provide an answer');
			event.preventDefault();
		}
	});

	$('.js-game-container').on('submit', '.answer-form', function(event) {
		event.preventDefault();
		const submittedAnswer = $('input[name="answer"]:checked').val();
		const questionCount = $('.js-question-count').text() - 1;
		const gotItRight = submittedAnswer === DATA[questionCount].correctAnswer.toString();
		console.log(submittedAnswer);

		this.remove();
		if (gotItRight) {
			renderCorrectAnswer(questionCount);
		} else {
			renderWrongAnswer(questionCount);
		}
	});
}

function handleRestartBtnClick() {
	$('main').on('click', '.js-restart-btn', function() {
		$('.js-question-count').text('0');
		$('.js-score-count').text('0');
		$('.js-possible-score-count').text('');
		$('main').html(`
			<div class="js-intro row">
			<p class="welcome-text">
				Think you know your literature?<br>
				See if you can match these quotes<br>
				to the books they came from.
			</p>
			<button class="btn js-proceed-btn">Start Quiz</button>
		</div>
		<div class="js-game-container row"></div>`);
	});
}

function handleQuiz() {
	handleProceedBtnClick();
	handleRadioSelection();
	handleAnswerSubmit();
	handleRestartBtnClick();
}

$(handleQuiz);