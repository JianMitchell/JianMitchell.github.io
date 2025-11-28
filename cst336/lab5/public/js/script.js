let authorLinks = document.querySelectorAll(".author-link");

for (authorLink of authorLinks) {
  authorLink.addEventListener("click", getAuthorInfo);
}

async function getAuthorInfo() {
  let myModal = new bootstrap.Modal(document.getElementById('authorModal'));
  myModal.show();

  try {
  let url = `/api/author/${this.id}`;
  let response = await fetch(url);
  let data = await response.json();
  //console.log(data);

  let authorInfo = document.querySelector("#authorInfo");

  authorInfo.innerHTML = `
            <strong>Name:</strong> ${data[0].firstName} ${data[0].lastName}<br>
            <strong>Date of Birth:</strong> ${data[0].dob || 'N/A'}<br>
            <strong>Date of Death:</strong> ${data[0].dod || 'N/A'}<br>
            <strong>Sex:</strong> ${data[0].sex || 'N/A'}<br>
            <strong>Profession:</strong> ${data[0].profession || 'N/A'}<br>
            <strong>Country:</strong> ${data[0].country || 'N/A'}<br>
            <strong>Biography:</strong> ${data[0].biography || 'N/A'}<br>`;
  authorInfo.innerHTML += `<img src="${data[0].portrait}" width="200"> <br>`;
  } catch (error) {
    console.error("Error fetching author info:", error);
    document.getElementById('authorInfo').innerHTML = "Error loading author information.";
  }
}