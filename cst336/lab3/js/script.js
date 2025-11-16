loadStates();

async function loadStates() {
  try {
    let url = `https://csumb.space/api/allStatesAPI.php`;

    let response = await fetch(url);
    let data = await response.json();

    console.log("States loaded:", data);

    let stateDropdown = document.querySelector("#state");
    stateDropdown.innerHTML = '<option>Select One</option>';

    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        stateDropdown.innerHTML += `<option value="${data[i].usps}">${data[i].state}</option>`;
      }
    } else {
      console.error("No states data received from API");
    }
  } catch (error) {
    console.error("Error loading states:", error);
  }
}

document.querySelector("#zip").addEventListener("change", displayCity);

async function displayCity() {
  let zipCode = document.querySelector("#zip").value;
  let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;

  let response = await fetch(url);
  let data = await response.json();

  console.log(data);

  let zipError = document.querySelector("#zipError");

  if (data.city) {
    document.querySelector("#city").textContent = data.city;
    document.querySelector("#latitude").textContent = data.latitude;
    document.querySelector("#longitude").textContent = data.longitude;
    zipError.textContent = "";
  } else {
    document.querySelector("#city").textContent = "";
    document.querySelector("#latitude").textContent = "";
    document.querySelector("#longitude").textContent = "";
    zipError.textContent = "Zip code not found";
    zipError.className = "error";
  }
}

document.querySelector("#state").addEventListener("change", displayCounties);

async function displayCounties() {
  try {
    let state = document.querySelector("#state").value;

    if (state === "Select One" || !state) {
      return;
    }

    let url = `https://csumb.space/api/countyListAPI.php?state=${state.toLowerCase()}`;

    let response = await fetch(url);
    let data = await response.json();

    console.log("Counties data:", data);

    let countyList = document.querySelector("#county");
    countyList.innerHTML = '<option>Select a County</option>';

    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let countyName = data[i].county || data[i].name || data[i].County;
        if (countyName) {
          countyList.innerHTML += `<option>${countyName}</option>`;
        }
      }
    } else {
      countyList.innerHTML = '<option>No counties found</option>';
    }
  } catch (error) {
    console.error("Error loading counties:", error);
    let countyList = document.querySelector("#county");
    countyList.innerHTML = '<option>Error loading counties</option>';
  }
}

document.querySelector("#username").addEventListener("change", checkUsername);

async function checkUsername() {
  let username = document.querySelector("#username").value;
  let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;

  let response = await fetch(url);
  let data = await response.json();

  console.log(data);

  let usernameError = document.querySelector("#usernameError");

  if (data.available) {
    usernameError.textContent = "Username is available!";
    usernameError.className = "success";
  } else {
    usernameError.textContent = "Username is already taken!";
    usernameError.className = "error";
  }
}

document.querySelector("#password").addEventListener("focus", suggestPassword);

async function suggestPassword() {
  let url = `https://csumb.space/api/suggestedPassword.php?length=8`;

  let response = await fetch(url);
  let data = await response.json();

  console.log("Suggested password:", data);

  let suggestedPwd = document.querySelector("#suggestedPwd");
  suggestedPwd.textContent = `Suggested: ${data.password}`;
  suggestedPwd.className = "info";
}

document.querySelector("#signupForm").addEventListener("submit", validateForm);

function validateForm(e) {
  e.preventDefault();

  let username = document.querySelector("#username").value;
  let password = document.querySelector("#password").value;
  let password2 = document.querySelector("#password2").value;
  let passwordError = document.querySelector("#passwordError");

  passwordError.textContent = "";

  if (username === "") {
    alert("Username cannot be blank!");
    return false;
  }

  if (password.length < 6) {
    passwordError.textContent = "Password must be at least 6 characters!";
    passwordError.className = "error";
    return false;
  }

  if (password !== password2) {
    passwordError.textContent = "Passwords do not match!";
    passwordError.className = "error";
    return false;
  }

  e.target.submit();
}