$(document).ready(function () {
  $('.dropdown-trigger').dropdown();
  // $('select').formSelect();

});
// material jquery

// removing local storage key to be used again
// localStorage.removeItem("questions");

$(document).ready(function () {
  $('.sidenav').sidenav();
  console.log("ready!");

  let questions = localStorage.getItem("questions");
  questions = JSON.parse(questions);
  if (questions === null) {
    questions = [];
  }
  for (let i = 0; i < questions.length; i++) {
    let eleD = $("<div>");
    let eleQ = $("<p>");
    eleQ.addClass("selectP");
    eleQ.attr("id", i);
    eleQ.html((i + 1) + ") " + questions[i].q + "<br>" + "<br>" + questions[i].o[0] + "<br>" + questions[i].o[1] + "<br>" + questions[i].o[2] + "<br>" + questions[i].o[3] + "<br>" + "<br>");
    eleD.append(eleQ);
    $("#demo").append(eleD);
  }

  if (questions.length > 0) {
    let clearButton = $("<a>").attr("class", "waves-effect waves-light btn center-align");
    clearButton.attr("id", "clearButton");
    clearButton.text("Clear");
    $("#demo").append(clearButton);
  }
  $("#number").text("Generated Quiz Displayed Here. Question counter: ");
    let numberCount = $("#number").text();
    console.log(numberCount);
    numberCount += questions.length;
    $("#number").text(numberCount);



  $("#apiButton").on("click", function () {

    let eleI = $("<i>");
    eleI.addClass("fa fa-spinner fa-spin");
    eleI.css("font-size", "24px");
    $("#form").append(eleI);

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

    console.log(apiDif);
    console.log(apiCat);
    console.log(apiNum);

    let queryURL = "https://api.giphy.com/v1/gifs/trending?api_key=VYV7WuUWYvqBEkmL3ntG5ElTynntIv4e";
    let quizApi = "https://opentdb.com/api.php?";
    $.ajax({
      url: quizApi + apiNum + apiCat + apiDif,
      method: "GET"
    }).then(function (response) {
      $(".fa-spin").remove();
      // Checking the JSON object recieved from the "Open Trivia Database" API
      console.log(response);
      console.log(response.results[0].question);
      console.log(response.results[0].correct_answer);
      console.log(response.results[0].incorrect_answers);
      // Using local storage to save/recieve user's quiz and to pass information in and out of the AJAX call
      let questions = localStorage.getItem("questions");
      questions = JSON.parse(questions);
      if (questions === null) {
        questions = [];
      }

      // limiting the length to 20 so they purchase premium lol
      let checkNumber = $("#apiNumber").val();
      if (checkNumber === null) {
        checkNumber = 1;
      }
      console.log(checkNumber);
      checkNumber = parseInt(checkNumber);
      let addedCheck = questions.length + checkNumber;
      if (questions.length < 20 && addedCheck < 21) {
        let inquiry;
        let wrongAnswers;
        let rightAnswer;

        // Editing each question due to the syntax incompatibility and setting up the array for questions
        for (let q = 0; q < response.results.length; q++) {
          inquiry = response.results[q].question;
          wrongAnswers = response.results[q].incorrect_answers;
          rightAnswer = response.results[q].correct_answer;

          // editing the question syntax
          text = inquiry.split("");
          console.log(typeof text + text.length);
          for (let i = 0; i < text.length; i++) {
            if (text[i] === "&" && text[i + 1] === "q") {
              text.splice(i, 6, "\"");
            }
            if (text[i] === "&" && text[i + 1] === "a") {
              text.splice(i, 5, "&");
            }
            if (text[i] === "&" && text[i + 1] === "e") {
              text.splice(i, 8, "\'", "e");
            }
            if (text[i] === "&" && text[i + 1] === "#") {
              text.splice(i, 6, "\'");
            }
          }
          response.results[q].question = text.join("")
          console.log(response.results[q].question);

          // edit the answer syntax
          let textA = rightAnswer.split("");
          console.log("textA " + textA)
          for (let i = 0; i < textA.length; i++) {
            if (textA[i] === "&" && textA[i + 1] === "q") {
              textA.splice(i, 6, "\"");
            }
            if (textA[i] === "&" && textA[i + 1] === "a") {
              textA.splice(i, 5, "&");
            }
            if (textA[i] === "&" && textA[i + 1] === "e") {
              textA.splice(i, 8, "\'", "e");
            }
            if (textA[i] === "&" && textA[i + 1] === "#") {
              textA.splice(i, 6, "\'");
            }
          }
          response.results[q].correct_answer = textA.join("")
          console.log(response.results[q].correct_answer);

          // Inserting the answer radomly into the wrong answer list
          let randomNumber = Math.floor(Math.random() * 4);
          wrongAnswers.splice(randomNumber, 0, rightAnswer);

          // editing the options syntax
          for (let i = 0; i < wrongAnswers.length; i++) {
            let optionFix = wrongAnswers[i];
            optionFix = optionFix.split("");
            console.log("options " + optionFix);
            for (let z = 0; z < optionFix.length; z++) {
              if (optionFix[z] === "&" && optionFix[z + 1] === "q") {
                console.log("55555");
                optionFix.splice(z, 6, "\"");
              }
              if (optionFix[z] === "&" && optionFix[z + 1] === "a") {
                optionFix.splice(z, 5, "&");
              }
              if (optionFix[z] === "&" && optionFix[z + 1] === "e") {
                optionFix.splice(z, 8, "\'", "e");
              }
              if (optionFix[z] === "&" && optionFix[z + 1] === "#") {
                console.log("6666");
                optionFix.splice(z, 6, "\'");
              }
            }
            wrongAnswers[i] = optionFix.join("");
            console.log(wrongAnswers[i]);
          }
        }
        // fixing options for True/False then putting each questions into an object to be pushed into the final array
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
        $("#demo").empty();
        console.log(questions);
        for (let i = 0; i < questions.length; i++) {
          console.log(i);
          let eleD = $("<div>");
          let eleQ = $("<p>");
          eleQ.addClass("selectP");
          eleQ.attr("id", i);
          eleQ.html((i + 1) + ") " + questions[i].q + "<br>" + "<br>" + questions[i].o[0] + "<br>" + questions[i].o[1] + "<br>" + questions[i].o[2] + "<br>" + questions[i].o[3] + "<br>" + "<br>");
          eleD.append(eleQ);
          $("#demo").append(eleD);
        }
        let clearButton = $("<a>").attr("class", "waves-effect waves-light btn center-align");
        clearButton.attr("id", "clearButton");
        clearButton.text("Clear");
        $("#demo").append(clearButton);
        $("#number").text("Generated Quiz Displayed Here. Question counter: ");
        let numberCount = $("#number").text();
        console.log(numberCount);
        numberCount += questions.length;
        $("#number").text(numberCount);

        // Saving object to localStorage
        let json = JSON.stringify(questions);
        console.log(json);
        localStorage.setItem("questions", json);
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
    let questions = localStorage.getItem("questions");
    questions = JSON.parse(questions);
    let deletePick = $("#deleteInput").val();
    deletePick = parseInt(deletePick);
    deletePick = deletePick - 1;
    if (deletePick <= questions.length && deletePick >= 0 && typeof deletePick === "number") {
      console.log("delete" + deletePick);
      questions.splice(deletePick, 1);
      json = JSON.stringify(questions);
      localStorage.setItem("questions", json);
      console.log(deletePick);
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
      $("#demo").append(clearButton);
      $("#number").text("Generated Quiz Displayed Here. Question counter: ");
      let numberCount = $("#number").text();
      console.log(numberCount);
      numberCount += questions.length;
      $("#number").text(numberCount);
    }

  })

  //  sort button
  $("#sortB").on("click", function () {
    console.log(1);
    let questions = localStorage.getItem("questions");
    questions = JSON.parse(questions);
    let sort1 = $("#sort1").val();
    sort1 = parseInt(sort1);
    sort1 = sort1 - 1;
    let sort2 = $("#sort2").val();
    sort2 = parseInt(sort2);
    sort2 = sort2 - 1;
    if (questions[sort1] !== undefined && questions[sort2] !== undefined) {
      console.log(sort1);
      console.log(sort2);

      let temp = questions[sort1];
      questions[sort1] = questions[sort2];
      questions[sort2] = temp;
      json = JSON.stringify(questions);
      localStorage.setItem("questions", json);
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
      clearButton.attr("id", "clearButton");
      clearButton.text("Clear");
      $("#demo").append(clearButton);
      $("#number").text("Generated Quiz Displayed Here. Question counter: ");
      let numberCount = $("#number").text();
      console.log(numberCount);
      numberCount += questions.length;
      $("#number").text(numberCount);
    }


  });

  // multiple choice button
  $("#mButton").on("click", function () {
    console.log("coool");
    let currentQuestion;
    let questions = localStorage.getItem("questions");
    questions = JSON.parse(questions);
    if (questions === null) {
      questions = [];
    }
    let mQuestion = $("#mQuestion").val();
    console.log(mQuestion);
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
          json = JSON.stringify(questions);
          localStorage.setItem("questions", json);
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
          clearButton.attr("id", "clearButton");
          clearButton.text("Clear");
          $("#demo").append(clearButton);
          $("#number").text("Generated Quiz Displayed Here. Question counter: ");
          let numberCount = $("#number").text();
          console.log(numberCount);
          numberCount += questions.length;
          $("#number").text(numberCount);
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
    console.log("bButton");
    let currentQuestion;
    let questions = localStorage.getItem("questions");
    questions = JSON.parse(questions);
    if (questions === null) {
      questions = [];
    }
    let bQuestion = $("#bQuestion").val();
    console.log(bQuestion);
    let bAnswer = $("#bAnswer").val();
    console.log(bAnswer);
    if (bQuestion !== "" && bAnswer !== "") {
      console.log("got it");
      if (bAnswer.toUpperCase() == "TRUE" || bAnswer.toUpperCase() == "FALSE") {
        console.log("done");
        if (questions.length < 20) {
          currentQuestion = {
            q: bQuestion,
            a: bAnswer,
            o: ["True", "False", "", ""]

          }
          questions.push(currentQuestion);
          json = JSON.stringify(questions);
          localStorage.setItem("questions", json);
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
          clearButton.attr("id", "clearButton");
          clearButton.text("Clear");
          $("#demo").append(clearButton);
          $("#number").text("Generated Quiz Displayed Here. Question counter: ");
          let numberCount = $("#number").text();
          console.log(numberCount);
          numberCount += questions.length;
          $("#number").text(numberCount);
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
  let lastPassword = localStorage.getItem("lastPassword");
  lastPassword = JSON.parse(lastPassword);
  if (lastPassword === null) {
    lastPassword = [];
  }
  let a = 0;
  $("#next").on("click", function () {
    let x = $("#pword").val();
    console.log(x);
    let questions = localStorage.getItem("questions");
    questions = JSON.parse(questions);
    console.log(questions.length);
    if (x.length > 3 && a > 0 && questions.length > 0) {
      console.log(lastPassword);
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
        pWord: x
      }
      lastPassword[len] = newObj;
      json = JSON.stringify(lastPassword);
      localStorage.setItem("lastPassword", json);
      questions = localStorage.getItem("questions")
      questions = JSON.parse(questions);
      json = JSON.stringify(questions);
      localStorage.setItem(x, json);
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


  $(document).on("dblclick", ".selectP", function () {
    console.log("schwyn");
    let questions = localStorage.getItem("questions");
    questions = JSON.parse(questions);
    console.log(questions[0].a);
    let choice = $(this).attr("id");
    console.log(choice);
    $("#mQuestion").val(questions[choice].q);
    $("#mAnswer").val(questions[choice].a);
    $("#mOption1").val(questions[choice].o[0]);
    $("#mOption2").val(questions[choice].o[1]);
    $("#mOption3").val(questions[choice].o[2]);
    $("#mOption4").val(questions[choice].o[3]);
  });

  $(document).on("click", "#clearButton", function () {
    console.log("clear button");
    $("#demo").empty();
    let questions = JSON.parse(localStorage.getItem("questions"));
    questions = [];
    let json = JSON.stringify(questions);
    localStorage.setItem("questions", json);
    $("#number").text("Generated Quiz Displayed Here. Question counter: ");
      let numberCount = $("#number").text();
      console.log(numberCount);
      numberCount += questions.length;
      $("#number").text(numberCount);


  });

});