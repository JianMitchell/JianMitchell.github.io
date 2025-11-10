// Event Listeners
document.querySelector("button").addEventListener("click", gradeQuiz);

// Global Variables
var score = 0;
var attempts = parseInt(localStorage.getItem("total_attempts")) || 0;

// Display Question 4 choices in random order
displayQ4Choices();

function displayQ4Choices() {
  let q4ChoicesArray = ["Maine", "Rhode Island", "Maryland", "Delaware"];
  q4ChoicesArray = _.shuffle(q4ChoicesArray);

  for (let i = 0; i < q4ChoicesArray.length; i++) {
    document.querySelector("#q4Choices").innerHTML += `
            <input type="radio" name="q4" id="${q4ChoicesArray[i]}" value="${q4ChoicesArray[i]}">
            <label for="${q4ChoicesArray[i]}">${q4ChoicesArray[i]}</label>
        `;
  }
}

function gradeQuiz() {
  console.log("Grading quiz...");

  if (!isFormValid()) {
    return;
  }

  document.querySelector("#validationFdbk").innerHTML = "";
  score = 0;

  // Grade Question 1
  let q1Response = document.querySelector("#q1").value;
  q1Response = q1Response.toLowerCase();

  if (q1Response === "sacramento") {
    rightAnswer(1);
  } else {
    wrongAnswer(1);
  }

  // Grade Question 2
  let q2Response = document.querySelector("#q2").value;

  if (q2Response === "Florida") {
    rightAnswer(2);
  } else {
    wrongAnswer(2);
  }

  // Grade Question 3
  let jeffersonChecked = document.querySelector("#Jefferson").checked;
  let rooseveltChecked = document.querySelector("#Roosevelt").checked;
  let jacksonChecked = document.querySelector("#Jackson").checked;
  let franklinChecked = document.querySelector("#Franklin").checked;

  if (jeffersonChecked && rooseveltChecked && !jacksonChecked && !franklinChecked) {
    rightAnswer(3);
  } else {
    wrongAnswer(3);
  }

  // Grade Question 4
  let q4Response = document.querySelector("input[name=q4]:checked").value;

  if (q4Response === "Rhode Island") {
    rightAnswer(4);
  } else {
    wrongAnswer(4);
  }

  // Display Total Score
  document.querySelector("#totalScore").innerHTML = `Total Score: ${score}`;

  // Update and display attempts
  attempts++;
  document.querySelector("#totalAttempts").innerHTML = `Total Times Taken: ${attempts}`;
  localStorage.setItem("total_attempts", attempts);
}

function isFormValid() {
  let isValid = true;
  let q1 = document.querySelector("#q1").value;

  if (q1 === "") {
    document.querySelector("#validationFdbk").innerHTML = "Please answer Question 1!";
    isValid = false;
  }

  return isValid;
}

function rightAnswer(index) {
  document.querySelector(`#q${index}Feedback`).innerHTML = "Correct!";
  document.querySelector(`#q${index}Feedback`).className = "bg-success";
  document.querySelector(`#markImg${index}`).innerHTML = `<img src="img/checkmark.png">`;
  score += 25;
}

function wrongAnswer(index) {
  document.querySelector(`#q${index}Feedback`).innerHTML = "Incorrect";
  document.querySelector(`#q${index}Feedback`).className = "bg-danger";
  document.querySelector(`#markImg${index}`).innerHTML = `<img src="img/xmark.png">`;
}