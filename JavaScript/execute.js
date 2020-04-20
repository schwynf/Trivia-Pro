(function ($) {
  $(function () {

    $('.sidenav').sidenav();
    $('.parallax').parallax();

  }); // end of document ready
})(jQuery); // end of jQuery name space

$(document).ready(function () {

  console.log("ready!");

  //=========================
  //Declare the DOM variables
  //=========================
  const questionContainerElement = $("#question-container");
  const cardTitle = $(".card-title");
  const codeElement = $("#code");
  const codeButton = $("#code-button");
  const nextBtn = $("#next-button");
  let startButton = $("#start-button");
  const questionElement = $("#question-element");
  const answerElement = $("#answer-buttons");
  const quitButton = $("#quit-button");
  let resetButton = $("#reset-button");
  let timer;
  let code = codeElement.val();
  // let questions = JSON.parse(localStorage.getItem("questions"));
  let key = localStorage.key(0);
  let questions;
  if (!localStorage.getItem("questions")) {
    questions = JSON.parse(localStorage.getItem(key));
  }
  else {
    questions = JSON.parse(localStorage.getItem("questions"));
  }
  console.log(questions);
  let numberOfQuestions;
  console.log(localStorage.length);
  checkLocalStorage(questions);

  let currentQuestionIndex;
  let timerCount = 5;
  const MAX_TIME = 5;
  let questionTimer = MAX_TIME;
  let radioValue;

  function determineHowManyQuestions(questions) {
    let numberOfQuestions = 0;
    for (let i = 0; i < questions.length; i++) {
      numberOfQuestions += 1;
    }
    return numberOfQuestions;
  }


  function checkLocalStorage(questions) {
    if (localStorage.getItem("lastPassword") === null) {
      $("#how-long").addClass("hide");
      startButton.addClass("hide");
      questionContainerElement.removeClass("hide");
      questionElement.removeClass("hide")
      questionElement.text("You didn't associate a code with a trivia quiz or select any questions for your trivia game. Go back to the create quiz page to create a quiz.");
      quitButton.removeClass("hide");
    }
    else {

      numberOfQuestions = determineHowManyQuestions(questions);
      console.log(questions);
    }

  }


  //Event Listeners
  startButton.on("click", function (e) {
    radioValue = $("input[name='how-long']:checked").val();
    radioValue = parseInt(radioValue);
    console.log(radioValue);
    questionTimer = radioValue;
    $("#code-div").addClass("hide");
    resetButton.removeClass("hide");
    startGame();

  })

  resetButton.on("click", function () {
    $("#code-div").removeClass("hide");
    answerElement.addClass("hide");
    reset();
  })

  codeButton.on("click", function () {
    code = codeElement.val();
    questions = code;
    questions = JSON.parse(localStorage.getItem(questions));
    console.log(questions);
    if(!localStorage.getItem(code)) {
      $("#code-success").show();
      $("#code-success").attr("style", "color: red;");
      $("#code-success").text("That code isn't associated with a trivia quiz.");
      $("#code-success").hide(5000);
    }
    else {
      $("#code-success").show();
      $("#code-success").attr("style", "color: green;");
      $("#code-success").text("Successfully added your code. That quiz has " + numberOfQuestions + " question(s).");
      $("#code-success").hide(10000);
      reset();
    }
  })


  function reset() {
    questionElement.text("Click the button below to start. You will have no more than 10 minutes to complete the whole trivia quiz.");
    quitButton.addClass("hide");
    startButton.removeClass("hide");
    resetButton.addClass("hide");
    clearInterval(timer);
    nextBtn.addClass("hide");
    $("#how-long").removeClass("hide");
  }

  function startGame() {
    console.log("game started");
    startButton.addClass("hide");
    quitButton.removeClass("hide");
    $("#how-long").addClass("hide");
    questionContainerElement.removeClass("hide");
    questionElement.removeClass("hide")
    nextBtn.removeClass("hide");
    nextBtn.attr('disabled', 'disabled');
    answerElement.removeClass("hide");
    currentQuestionIndex = 0;
    setNextQuestion();
  }
  function setNextQuestion() {
    showQuestion(questions[currentQuestionIndex]);
  }

  //==================================================
  //Generate the questions and answers to be displayed
  //==================================================
  function showQuestion(question) {
    answerElement.empty();
    nextBtn.removeClass("hide");
    nextBtn.attr('disabled', 'disabled');
    nextBtn.text(`Time remaining: ${radioValue}`);
    cardTitle.text("");
    if (!question) {
      endGame();
    }
    else {
      questionElement.html(question.q);
      answerElement.removeClass("hide");
      questionTimerFunction();
      for (let i = 0; i < question.o.length; i++) {
        const pTag = $("<p>");
        if (question.o[i] === question.o[0]) {
          pTag.html("a.) " + question.o[i]);
          answerElement.append(pTag);
        }
        if (question.o[i] === question.o[1]) {
          pTag.html("b.) " + question.o[i]);
          answerElement.append(pTag);
        }
        if (question.o[i] === question.o[2] && question.o[i].length > 0) {
          pTag.html("c.) " + question.o[i]);
          answerElement.append(pTag);
        }
        if (question.o[i] === question.o[3] && question.o[i].length > 0) {
          pTag.html("d.) " + question.o[i]);
          answerElement.append(pTag);
        }

      }

    }
  }

  function questionTimerFunction() {
    timer = setInterval(function () {
      if (questionTimer < 1) {
        clearInterval(timer);
        currentQuestionIndex++;
        questionTimer = radioValue;
        setNextQuestion();
      }
      nextBtn.text(`Time Remaining: ${questionTimer}`);
      questionTimer--;
    }, 1000);
  }

  function endGame() {
    nextBtn.addClass("hide");
    answerElement.addClass("hide");
    questionElement.text("That's it! The trivia quiz is over!");
    resetButton.attr("class", "waves-effect waves-light btn center-align");
    $("#button-div").append(resetButton);
    $.ajax({
      headers: {
        "Accept": "application/json",
        "userkey": "dc6zaTOxFJmzC",
        "Access-Control-Allow-Origin": "*"
      },
      url: "https://cors-anywhere.herokuapp.com/https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=congrats",
      method: "GET"
    }).then(function (response) {
      console.log(response);
      console.log(response.data[0].url);
      let img = $("<img>").attr("src", response.data[0].images.downsized_large.url);
      questionElement.append("<br>").append(img);

    })

  }

});




