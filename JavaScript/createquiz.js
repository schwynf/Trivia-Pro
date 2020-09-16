// material jquery
$(document).ready(function () {
  $('.dropdown-trigger').dropdown();
  $('.sidenav').sidenav();


  // grabing the temporary quiz
  let questions = JSON.parse(localStorage.getItem("questions"));
  if (questions === null) {
    questions = [];
  }
  // displaying temporary quiz
  populateQuiz(questions);
  // ===============
  // apiButton for API
  // ===============
  $("#apiButton").on("click", function () {
    // pinning spinner to display for API call
    spinner();
    // apiNumber
    let apiNum = $("#apiNumber").val();
    if (apiNum === null) {
      apiNum = 1;
    }
    apiNum = "amount=" + apiNum;
    // apiCategory
    let apiCat = $("#apiCategory").val();
    if (apiCat === null) {
      apiCat = "";
    } else {
      apiCat = "&category=" + apiCat;
    }
    // apiDificulty
    let apiDif = $("#apiDifficulty").val();
    if (apiDif === null) {
      apiDif = "easy"
    }
    apiDif = "&difficulty=" + apiDif;
    // API url and API start
    let quizApi = "https://opentdb.com/api.php?";
    $.ajax({
      url: quizApi + apiNum + apiCat + apiDif,
      method: "GET"
    }).then(function (response) {
      $(".fa-spin").remove();
      // Checking the JSON object recieved from the "Open Trivia Database" API
      console.log(response);
      // Using local storage to save/recieve user's quiz and to pass information in and out of the AJAX call
      let questions = JSON.parse(localStorage.getItem("questions"));
      if (questions === null) {
        questions = [];
      }
      // limiting the length to 20 so they purchase premium lol
      let checkNumber = $("#apiNumber").val();
      if (checkNumber === null) {
        checkNumber = 1;
      }
      checkNumber = parseInt(checkNumber);
      let addedCheck = questions.length + checkNumber;

      // quiz + apiNumber.val() is under 20 so lettsss goooo
      if (questions.length < 20 && addedCheck < 21) {
        let wrongAnswers;
        let rightAnswer;

        // Editing each question due to the syntax incompatibility and setting up the array for questions
        for (let q = 0; q < response.results.length; q++) {
          wrongAnswers = response.results[q].incorrect_answers;
          rightAnswer = response.results[q].correct_answer;
          // Inserting the answer radomly into the wrong answer list
          let randomNumber = Math.floor(Math.random() * 4);
          wrongAnswers.splice(randomNumber, 0, rightAnswer);
        }
        // fixing options for True/False then putting each question into an object to be pushed into the final array
        for (let y = 0; y < response.results.length; y++) {
          console.log(response.results[y].incorrect_answers[2]);
          if (response.results[y].incorrect_answers[2] === undefined) {
            response.results[y].incorrect_answers[2] = "";
          }
          if (response.results[y].incorrect_answers[3] === undefined) {
            response.results[y].incorrect_answers[3] = "";
          }
          let currentQuestion = {
            q: response.results[y].question,
            a: response.results[y].correct_answer,
            o: [response.results[y].incorrect_answers[0], response.results[y].incorrect_answers[1], response.results[y].incorrect_answers[2], response.results[y].incorrect_answers[3]]
          };
          questions.push(currentQuestion);
        }
        //  appending questions to HTML
        populateQuiz(questions);

        // Saving object to localStorage
        // let json = JSON.stringify(questions);
        // console.log(json);
        localStorage.setItem("questions", JSON.stringify(questions));
      } else {
        $("#apiError").show();
        $("#apiError").text("Sorry! No more than 20. Delete to add more.");
        setTimeout(function () {
          $("#apiError").hide();
        }, 2000);
      }
    });
  })


  // delete button
  $("#deleteButton").on("click", function () {
    let questions = JSON.parse(localStorage.getItem("questions"));
    let deletePick = $("#deleteInput").val();
    deletePick = parseInt(deletePick);
    deletePick = deletePick - 1;
    if (deletePick <= questions.length && deletePick >= 0 && typeof deletePick === "number") {
      questions.splice(deletePick, 1);
      localStorage.setItem("questions", JSON.stringify(questions));
      populateQuiz(questions);
    }

  })

  //  sort button
  $("#sortB").on("click", function () {
    let questions = JSON.parse(localStorage.getItem("questions"));
    let sort1 = $("#sort1").val();
    sort1 = parseInt(sort1);
    sort1 = sort1 - 1;
    let sort2 = $("#sort2").val();
    sort2 = parseInt(sort2);
    sort2 = sort2 - 1;
    if (questions[sort1] !== undefined && questions[sort2] !== undefined) {
      let temp = questions[sort1];
      questions[sort1] = questions[sort2];
      questions[sort2] = temp;
      localStorage.setItem("questions", JSON.stringify(questions));
      populateQuiz(questions);
    }
  });

  // multiple choice button
  $("#mButton").on("click", function () {
    let questions = JSON.parse(localStorage.getItem("questions"));
    if (questions === null) {
      questions = [];
    }
    let mQuestion = $("#mQuestion").val();
    let mAnswer = $("#mAnswer").val();
    let mOption1 = $("#mOption1").val();
    let mOption2 = $("#mOption2").val();
    let mOption3 = $("#mOption3").val();
    let mOption4 = $("#mOption4").val();
    if (mQuestion !== "" && mAnswer !== "" && mOption1 !== "" && mOption2 !== "" && mOption3 !== "" && mOption4 !== "") {
      if ((mAnswer === mOption1) || (mAnswer === mOption2) || (mAnswer === mOption3) || (mAnswer === mOption4)) {
        if (questions.length < 20) {
          currentQuestion = {
            q: mQuestion,
            a: mAnswer,
            o: [mOption1, mOption2, mOption3, mOption4]

          }
          questions.push(currentQuestion);
          localStorage.setItem("questions", JSON.stringify(questions));
          populateQuiz(questions);
        } else {
          $("#multipleError").show();
          $("#multipleError").text("Sorry! No more than 20. Delete to add more.");
          setTimeout(function () {
            $("#multipleError").hide();
          }, 2000);
        }
      } else {
        $("#multipleError").show();
        $("#multipleError").text("Please match answer to an option.");
        setTimeout(function () {
          $("#multipleError").hide();
        }, 2000);
      }
    } else {
      $("#multipleError").show();
      $("#multipleError").text("A value can not be left blank.");
      setTimeout(function () {
        $("#multipleError").hide();
      }, 2000);
    }
  });

  // boolean button
  $("#bButton").on("click", function () {
    let questions = JSON.parse(localStorage.getItem("questions"));
    if (questions === null) {
      questions = [];
    }
    let bQuestion = $("#bQuestion").val();
    let bAnswer = $("#bAnswer").val();
    if (bQuestion !== "" && bAnswer !== "") {
      if (bAnswer.toUpperCase() == "TRUE" || bAnswer.toUpperCase() == "FALSE") {
        if (questions.length < 20) {
          currentQuestion = {
            q: bQuestion,
            a: bAnswer,
            o: ["True", "False", "", ""]
          }
          questions.push(currentQuestion);
          localStorage.setItem("questions", JSON.stringify(questions));
          populateQuiz(questions);
        } else {
          $("#booleanError").show();
          $("#booleanError").text("Sorry! No more than 20. Delete to add more.");
          setTimeout(function () {
            $("#booleanError").hide();
          }, 2000);
        }

      } else {
        $("#booleanError").show();
        $("#booleanError").text("Sorry! Anwer must be True or False.");
        setTimeout(function () {
          $("#booleanError").hide();
        }, 2000);
      }
    }

  });

  // Multiple Clear Button
  $("#mClear").on("click", function () {
    $("#mQuestion").val("");
    $("#mAnswer").val("");
    $("#mOption1").val("");
    $("#mOption2").val("");
    $("#mOption3").val("");
    $("#mOption4").val("");
  });

  // next button
  let lastPassword = JSON.parse(localStorage.getItem("lastPassword"));
  if (lastPassword === null) {
    lastPassword = [];
  }
  let a = 0;
  $("#next").on("click", function () {
    let key = $("#pword").val();
    let questions = JSON.parse(localStorage.getItem("questions"));
    if (key.length > 3 && a > 0 && questions.length > 0) {
      let len = lastPassword.length;
      let d = new Date();
      let day = d.getDate();
      let year = d.getUTCFullYear();
      let month = parseInt(d.getMonth());
      month = month + 1;
      let today = new Date(month + "/" + day + "/" + year).getTime();
      today = Math.floor(today / 1000 / 60 / 60 / 24);
      let newObj = {
        time: today,
        pWord: key
      }
      lastPassword[len] = newObj;
      localStorage.setItem("lastPassword", JSON.stringify(lastPassword));
      localStorage.setItem(key, JSON.stringify(questions));
      window.location.href = "./print.html";
    } else if (a === 0) {
      $("#lastCheck").show();
      $("#lastCheck").text("Once you submit, no more edits. Click one more time to save your quiz.");
      setTimeout(function () {
        $("#lastCheck").hide();
      }, 2000);
      a++;
    } else {
      $("#lastCheck").show();
      $("#lastCheck").text("Length must be at least 4 characters and quiz contain at least one question.");
      setTimeout(function () {
        $("#lastCheck").hide();
      }, 5000);
    }

  })

  // Boolean Clear Button
  $("#bClear").on("click", function () {
    $("#bQuestion").val("");
    $("#bAnswer").val("");
  });

  // API Clear Button
  $("#apiClear").on("click", function () {
    $("#apiNumber").val("");
    $("#apiCategory").val("");
    $("#apiDifficulty").val("");
    $("#apiType").val("");
  });

  // double click to autofill the multiple choice field
  $(document).on("dblclick", ".selectP", function () {
    let questions = JSON.parse(localStorage.getItem("questions"));
    let choice = $(this).attr("id");
    $("#mQuestion").val(questions[choice].q);
    $("#mAnswer").val(questions[choice].a);
    $("#mOption1").val(questions[choice].o[0]);
    $("#mOption2").val(questions[choice].o[1]);
    $("#mOption3").val(questions[choice].o[2]);
    $("#mOption4").val(questions[choice].o[3]);
  });

  // adding the functionality for clear button
  $(document).on("click", "#clearButton", function () {
    $("#demo").empty();
    let questions = [];
    localStorage.setItem("questions", JSON.stringify(questions));
    $("#number").text("Generated Quiz Displayed Here. Question counter: 0");
  });

  // starting the edits
  function populateQuiz(questions) {
    $("#demo").empty();
    for (let i = 0; i < questions.length; i++) {
      let eleD = $("<div>");
      let eleQ = $("<p>");
      eleQ.addClass("selectP");
      eleQ.attr("id", i);
      eleQ.html((i + 1) + ") " + questions[i].q + "<br>" + "<br>" + questions[i].o[0] + "<br>" + questions[i].o[1] + "<br>" + questions[i].o[2] + "<br>" + questions[i].o[3] + "<br>" + "<br>");
      eleD.append(eleQ);
      $("#demo").append(eleD);
    }
    let clearButton = $("<a>").attr("class", "waves-effect waves-light btn center-align");
    clearButton.text("Clear");
    clearButton.attr("id", "clearButton");
    $("#demo").append(clearButton);
    $("#number").text("Generated Quiz Displayed Here. Question Counter: ");
    let numberCount = $("#number").text();
    console.log(numberCount);
    numberCount += questions.length;
    $("#number").text(numberCount);
  }

  function spinner() {
    let eleI = $("<i>");
    eleI.addClass("fa fa-spinner fa-spin");
    eleI.css("font-size", "24px");
    $("#form").append(eleI);
  }
});