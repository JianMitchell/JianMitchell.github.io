// Event Listeners
document.querySelector("button").addEventListener("click", gradeQuiz);

// Global Variables
let score = 0;
let attempts = parseInt(localStorage.getItem("total_attempts")) || 0;

// Display Questions in random order
displayQ4Choices();
displayQ7Choices();
displayQ10Choices();

function displayQ4Choices() {
  let q4ChoicesArray = ["Maine", "Rhode Island", "Maryland", "Delaware"];
  q4ChoicesArray = _.shuffle(q4ChoicesArray);

  for (let i = 0; i < q4ChoicesArray.length; i++) {
    document.querySelector("#q4Choices").innerHTML += `
            <input type="radio" name="q4" id="${q4ChoicesArray[i]}" value="${q4ChoicesArray[i]}">
            <label for="${q4ChoicesArray[i]}">${q4ChoicesArray[i]}</label><br>
        `;
  }
}

function displayQ7Choices() {
  let q7ChoicesArray = ["Mount Whitney", "Denali", "Mount Rainier",
    "Pikes Peak"];
  q7ChoicesArray = _.shuffle(q7ChoicesArray);

  for (let i = 0; i < q7ChoicesArray.length; i++) {
    document.querySelector("#q7Choices").innerHTML += `
            <input type="radio" name="q7" id="${q7ChoicesArray[i]}" value="${q7ChoicesArray[i]}">
            <label for="${q7ChoicesArray[i]}">${q7ChoicesArray[i]}</label><br>
        `;
  }
}

function displayQ10Choices() {
  let q10ChoicesArray = ["48", "49", "50", "52"];
  q10ChoicesArray = _.shuffle(q10ChoicesArray);

  for (let i = 0; i < q10ChoicesArray.length; i++) {
    document.querySelector("#q10Choices").innerHTML += `
            <input type="radio" name="q10" id="${q10ChoicesArray[i]}" value="${q10ChoicesArray[i]}">
            <label for="${q10ChoicesArray[i]}">${q10ChoicesArray[i]}</label><br>
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
  let q1Response = document.querySelector("#q1").value.toLowerCase();
  if (q1Response === "sacramento") {
    rightAnswer(1);
  } else {
    wrongAnswer(1);
  }

  // Grade Question 2
  let q2Response = document.querySelector("#q2").value;
  if (q2Response === "Mississippi") {
    rightAnswer(2);
  } else {
    wrongAnswer(2);
  }

  // Grade Question 3
  let jeffersonChecked = document.querySelector("#Jefferson").checked;
  let rooseveltChecked = document.querySelector("#Roosevelt").checked;
  let jacksonChecked = document.querySelector("#Jackson").checked;
  let franklinChecked = document.querySelector("#Franklin").checked;

  if (jeffersonChecked && rooseveltChecked && !jacksonChecked
      && !franklinChecked) {
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

  // Grade Question 5
  let q5Response = document.querySelector("#q5").value.toLowerCase();
  if (q5Response === "missouri" || q5Response === "missouri river") {
    rightAnswer(5);
  } else {
    wrongAnswer(5);
  }

  // Grade Question 6
  let q6Response = document.querySelector("#q6").value;
  if (q6Response === "California") {
    rightAnswer(6);
  } else {
    wrongAnswer(6);
  }

  // Grade Question 7
  let q7Response = document.querySelector("input[name=q7]:checked").value;
  if (q7Response === "Denali") {
    rightAnswer(7);
  } else {
    wrongAnswer(7);
  }

  // Grade Question 8
  let superiorChecked = document.querySelector("#Superior").checked;
  let michiganChecked = document.querySelector("#Michigan").checked;
  let erieChecked = document.querySelector("#Erie").checked;
  let tahoeChecked = document.querySelector("#Tahoe").checked;
  let powellChecked = document.querySelector("#Powell").checked;

  if (superiorChecked && michiganChecked && erieChecked && !tahoeChecked
      && !powellChecked) {
    rightAnswer(8);
  } else {
    wrongAnswer(8);
  }

  // Grade Question 9
  let q9Response = document.querySelector("#q9").value.toLowerCase();
  if (q9Response === "arizona") {
    rightAnswer(9);
  } else {
    wrongAnswer(9);
  }

  // Grade Question 10
  let q10Response = document.querySelector("input[name=q10]:checked").value;
  if (q10Response === "50") {
    rightAnswer(10);
  } else {
    wrongAnswer(10);
  }

  // Display Total Score
  let scoreColor = score >= 80 ? "bg-success text-white"
      : "bg-danger text-white";
  document.querySelector(
      "#totalScore").innerHTML = `Total Score: ${score} / 100`;
  document.querySelector("#totalScore").className = scoreColor;

  if (score > 80) {
    document.querySelector(
        "#congratsMsg").innerHTML = "Congratulations! Excellent work!";
    document.querySelector("#congratsMsg").className = "bg-warning";
  } else {
    document.querySelector("#congratsMsg").innerHTML = "";
  }

  attempts++;
  document.querySelector(
      "#totalAttempts").innerHTML = `Total Times Taken: ${attempts}`;
  localStorage.setItem("total_attempts", attempts);
}

function isFormValid() {
  let isValid = true;

  let q1 = document.querySelector("#q1").value;
  if (q1 === "") {
    document.querySelector(
        "#validationFdbk").innerHTML = "Please answer Question 1!<br>";
    isValid = false;
  }

  let q2 = document.querySelector("#q2").value;
  if (q2 === "") {
    document.querySelector(
        "#validationFdbk").innerHTML = "Please answer Question 2!<br>";
    isValid = false;
  }

  let q3Checked = document.querySelector("#Jackson").checked ||
      document.querySelector("#Franklin").checked ||
      document.querySelector("#Jefferson").checked ||
      document.querySelector("#Roosevelt").checked;
  if (!q3Checked) {
    document.querySelector(
        "#validationFdbk").innerHTML = "Please answer Question 3!<br>";
    isValid = false;
  }

  let q4Checked = document.querySelector("input[name=q4]:checked");
  if (!q4Checked) {
    document.querySelector(
        "#validationFdbk").innerHTML = "Please answer Question 4!<br>"
    isValid = false;
  }

  let q5 = document.querySelector("#q5").value;
  if (q5 === "") {
    document.querySelector(
        "#validationFdbk").innerHTML = "Please answer Question 5!<br>"
    isValid = false;
  }

  // Validate Question 6
  let q6 = document.querySelector("#q6").value;
  if (q6 === "") {
    document.querySelector(
        "#validationFdbk").innerHTML = "Please answer Question 6!<br>"
    isValid = false;
  }

  // Validate Question 7
  let q7Checked = document.querySelector("input[name=q7]:checked");
  if (!q7Checked) {
    document.querySelector(
        "#validationFdbk").innerHTML = "Please answer Question 7!<br>"
    isValid = false;
  }

  // Validate Question 8
  let q8Checked = document.querySelector("#Superior").checked ||
      document.querySelector("#Michigan").checked ||
      document.querySelector("#Tahoe").checked ||
      document.querySelector("#Erie").checked ||
      document.querySelector("#Powell").checked;
  if (!q8Checked) {
    document.querySelector(
        "#validationFdbk").innerHTML = "Please answer Question 8!<br>"
    isValid = false;
  }

  // Validate Question 9
  let q9 = document.querySelector("#q9").value;
  if (q9 === "") {
    document.querySelector(
        "#validationFdbk").innerHTML = "Please answer Question 9!<br>"
    isValid = false;
  }

  // Validate Question 10
  let q10Checked = document.querySelector("input[name=q10]:checked");
  if (!q10Checked) {
    document.querySelector(
        "#validationFdbk").innerHTML = "Please answer Question 10!<br>"
    isValid = false;
  }

  return isValid;
}

function rightAnswer(index) {
  document.querySelector(`#q${index}Feedback`).innerHTML = "Correct!";
  document.querySelector(`#q${index}Feedback`).className = "bg-success text-white";
  document.querySelector(
      `#markImg${index}`).innerHTML = `<img src="img/checkmark.png" alt="checkmark">`;
  score += 10;
}

function wrongAnswer(index) {
  document.querySelector(`#q${index}Feedback`).innerHTML = "Incorrect";
  document.querySelector(`#q${index}Feedback`).className = "bg-danger text-white";
  document.querySelector(
      `#markImg${index}`).innerHTML = `<img src="img/xmark.png" alt="xmark">`;
}