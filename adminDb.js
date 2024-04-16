document.addEventListener("DOMContentLoaded", function () {
  var currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser || !currentUser.username  || currentUser.role != "admin" ) {
    alert("Invalid User Please Login!");
    window.location.href = "login.html";
    return;
  }
  // When something is added in the admin interface
function somethingAddedInAdmin() {
    // Set a flag in local storage
    localStorage.setItem('adminDataChanged', 'true');
}
// Check for changes in local storage periodically
setInterval(function() {
    // Check if the flag is set in local storage
    if (localStorage.getItem('StudentDataChanged')) {
        // Reload the student dashboard
        window.location.reload();
        // Clear the flag from local storage
        localStorage.removeItem('StudentDataChanged');
    }
}, 5000); // Check every 5 seconds (adjust this interval as needed)
  var modal;
  var body;
  var userId;
  var formDataId;
  var firstName;
  var savedUserData = JSON.parse(localStorage.getItem("savedUserData") || "[]");

  var currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser || !currentUser.username) {
    alert("Invalid User Please Login!");
    window.location.href = "login.html";
    return;
  }
  modal = document.getElementById("addModal");
  body = document.querySelector("body");

  var logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("currentUser");

      window.location.href = "login.html";
    });
  } else {
    console.error("Logout button element not found.");
  }

  var table = document.getElementById("customers");

  if (table && savedUserData.length > 0) {
    savedUserData.forEach(function (user) {
      user.formData.forEach(function (formData, index) {
        var row = createRow(user, formData);
        table.appendChild(row);
      });
    });
  } else {
    console.error("Table or saved user data not found.");
  }

  // Function to create table row
  function createRow(user, data) {
    var row = document.createElement("tr");
    row.innerHTML = `
            <td>${user.username}</td>
            <td>${data.date}</td>
            <td>
                <div class="blockageBtn" style="cursor: pointer;" data-form-id="${data.id}">
                    <i class="fas fa-eye" style="color: black;"></i>
                </div>
            </td>
            <td class="ddk">
                <div class="valid-btn">${data.valid}</div>
            </td>
            <td class="action">
                <div class="addComment" id="addComment" data-name-id="${user.username}" data-form-id="${data.id}" data-user-id="${data.id}" style="cursor: pointer;">
                    <i class="fas fa-plus"></i>
                </div>
            </td>
        `;
    if (data.valid === "valid") {
      row.querySelector(".valid-btn").style.backgroundColor =
        "rgba(0, 128, 0, 0.32)";
      row.querySelector(".valid-btn").style.color = "green";
    }
    var adminCheckModal = document.getElementById("adminCheck");
    var addCommentBtn = row.querySelector(".addComment");
    addCommentBtn.addEventListener("click", function () {
      adminCheckModal.style.display = "flex";
      var studentName = adminCheckModal.querySelector(".modal-nav h3");
      studentName.textContent = user.username;
      userId = parseInt(this.dataset.userId);
      formDataId = parseInt(this.dataset.formId);
      firstName = this.dataset.nameId;
    });
    return row;
  }

  // Function to handle blockage button click
  function handleBlockageClick(event) {
    var blockageBtn = event.target.closest(".blockageBtn");
    if (!blockageBtn) return; // If the click is not on a blockage button, exit

    var formDataId = parseInt(blockageBtn.dataset.formId); // Get the ID from the dataset
    var userData = savedUserData.find((user) =>
      user.formData.some((data) => data.id === formDataId)
    ); // Find the user data containing the form data with the clicked ID
    var blockageModal = document.querySelector(".blockageModal");
    var blockageOverLay = document.getElementById("blockageOverLay");
    // var body = document.querySelector("body");

    if (userData) {
      var formData = userData.formData.find((data) => data.id === formDataId); // Find the form data with the clicked ID
      if (formData) {
        blockageModal.querySelector("#theBlockage").textContent =
          formData.difficulty;
        blockageModal.querySelector("#formateurName").textContent =
          formData.formateur;
        blockageModal.querySelector("#blockageTitle").textContent =
          formData.title;
        blockageModal.querySelector("#bootcampType").textContent =
          formData.bootcamp;
        blockageModal.querySelector("#briefContent").textContent =
          formData.brief;
          blockageOverLay.style.display = "flex";
        // body.classList.add("body-overlay");
        return;
      }
    }

    console.error("User data or form data not found for the selected user.");
  }

  // Attach blockage button click event listener to each blockage button
  var blockageButtons = document.querySelectorAll(".blockageBtn");
  blockageButtons.forEach(function (blockageBtn) {
    blockageBtn.addEventListener("click", handleBlockageClick);
  });

  var closeBlBtn = document.querySelector(".blockageModal .close");
  var blockageOverLay = document.getElementById("blockageOverLay")
  closeBlBtn.addEventListener("click", function () {
    // var blockageModal = document.querySelector(".blockageModal");

    blockageOverLay.style.display = "none";
    // body.classList.remove("body-overlay");
  });
  window.addEventListener("click", function (event) {
    if (event.target == blockageOverLay) {
      blockageOverLay.style.display = "none";
      // body.classList.remove("body-overlay");
    }
  });

  // });
  var adminCheckForm = document.getElementById("dataForm");
  adminCheckForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission behavior
    var selectedOption = document.querySelector(
      'input[name="adminOption"]:checked'
    );
    var textareaValue = document.getElementById(selectedOption.value).value;
    var textTitle;
    if (selectedOption.value == "encadreTextarea") {
      textTitle = "Encadré dans leurs recherches de solutions";
    } else if (selectedOption.value == "aideTextarea") {
      textTitle = "Aidé par leurs pairs";
    } else {
      textTitle = "Intervention directe de formateur";
    }
    var newData = {
      text: textTitle,
      value: textareaValue,
    };

    // Find the corresponding user in savedUserData
    var userData = savedUserData.find((user) => user.username === firstName);
    // Add newData to the formData array of the corresponding user
    if (userData) {
      var existingFormData = userData.formData.find(
        (data) => data.id === formDataId
      );
      if (existingFormData) {
        // If formData with the same ID already exists, update it
        existingFormData.text = newData.text;
        existingFormData.value = newData.value;
        existingFormData.valid = "valid";
      } else {
        // If formData with the same ID doesn't exist, push newData
        userData.formData.push(newData);
      }

      // Update savedUserData in localStorage
      localStorage.setItem("savedUserData", JSON.stringify(savedUserData));
      somethingAddedInAdmin();

      // Close admin check modal
      var adminCheckModal = document.getElementById("adminCheck");
      adminCheckModal.style.display = "none";
      // body.classList.remove("body-overlay");
      location.reload();
      // Optionally, you can update the table with the new data
    } else {
      console.error("User data not found for the selected user.");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Get the radio buttons and textareas
  var encadreRadio = document.getElementById("encadreRadio");
  var aideRadio = document.getElementById("aideRadio");
  var interventionRadio = document.getElementById("interventionRadio");
  var encadreTextarea = document.getElementById("encadreTextarea");
  var aideTextarea = document.getElementById("aideTextarea");
  var interventionTextarea = document.getElementById("interventionTextarea");
  var adminCheckModal = document.getElementById("adminCheck");
  var body = document.querySelector("body");
  var adminCheckBtn = document.getElementById("addComment"); // Corrected selector
  var closeAdminCheckBtn = document.querySelector("#adminCheck .close");

  // Open admin check modal

  adminCheckBtn.addEventListener("click", function () {
    adminCheckModal.style.display = "flex";
    // body.classList.add("body-overlay");
  });

  // Close admin check modal when close button is clicked
  closeAdminCheckBtn.addEventListener("click", function () {
    adminCheckModal.style.display = "none";
    document.getElementById("encadreTextarea").value = "";
    document.getElementById("aideTextarea").value = "";
    document.getElementById("interventionTextarea").value = "";
    // body.classList.remove("body-overlay");
  });

  // Close admin check modal when clicking outside the modal
  window.addEventListener("click", function (event) {
    if (event.target == adminCheckModal) {
      adminCheckModal.style.display = "none";
      document.getElementById("encadreTextarea").value = "";
    document.getElementById("aideTextarea").value = "";
    document.getElementById("interventionTextarea").value = "";
    }
  });

  // Add event listeners to radio buttons
  encadreRadio.addEventListener("change", function () {
    if (this.checked) {
      encadreTextarea.style.display = "block";
      aideTextarea.style.display = "none";
      interventionTextarea.style.display = "none";
      document.getElementById("aideTextarea").value = "";
      document.getElementById("interventionTextarea").value = "";
    }
  });

  aideRadio.addEventListener("change", function () {
    if (this.checked) {
      encadreTextarea.style.display = "none";
      aideTextarea.style.display = "block";
      interventionTextarea.style.display = "none";
      document.getElementById("interventionTextarea").value = "";
      document.getElementById("encadreTextarea").value = "";
    }
  });

  interventionRadio.addEventListener("change", function () {
    if (this.checked) {
      encadreTextarea.style.display = "none";
      aideTextarea.style.display = "none";
      interventionTextarea.style.display = "block";
      document.getElementById("encadreTextarea").value = "";
      document.getElementById("aideTextarea").value = "";
    }
  });
});
