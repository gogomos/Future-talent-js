var modal;
var body;
document.addEventListener("DOMContentLoaded", function() {
  var currentUser = JSON.parse(localStorage.getItem("currentUser"));
  var username = document.getElementById("name");
  username.innerHTML = `<p>${currentUser.username}</p>`
})
document.addEventListener("DOMContentLoaded", function () {
  modal = document.getElementById("addModal");
  body = document.querySelector("body");
  var modalBtn = document.getElementById("addModal-btn");

  var closeBtn = document.querySelector("#addModal .close");
  modalBtn.addEventListener("click", function () {
    modal.style.display = "block";
    body.classList.add("body-overlay");
  });

  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
    body.classList.remove("body-overlay");
  });

  window.addEventListener("click", function (event) {
    if (event.target == body) {
      modal.style.display = "none";
      body.classList.remove("body-overlay");
    }
  });
});

// dashboard.js
function saveFormData(formData) {
  var currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    if (!currentUser.formData || !Array.isArray(currentUser.formData)) {
      currentUser.formData = [];
    }
    var currentDate = new Date();
    // Format date as YYYY-MM-DD
    var formattedDate =
      currentDate.getFullYear() +
      "-" +
      ("0" + (currentDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + currentDate.getDate()).slice(-2);
    // Add formatted date to formData
    formData.date = formattedDate;
    currentUser.formData.push(formData);
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  } else {
    console.error("Current user not found in local storage.");
  }
}
function savedUser() {
  var savedUserData = JSON.parse(localStorage.getItem("savedUserData") || "[]");

  var currentUserData = JSON.parse(localStorage.getItem("currentUser") || "{}");

  if (currentUserData) {
    var existingUserIndex = savedUserData.findIndex(function (user) {
      return user.username === currentUserData.username;
    });
    if (existingUserIndex !== -1) {
      var index = currentUserData.formData.length;
      console.log(index - 1);
      savedUserData[existingUserIndex].formData.push(
        currentUserData.formData[index - 1]
      );
    } else {
      savedUserData.push(currentUserData);
    }
    localStorage.setItem("savedUserData", JSON.stringify(savedUserData));
  } else {
    alert("User data not found. Please log in again.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var dataForm = document.getElementById("dataForm");

  if (dataForm) {
    dataForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var validDef = "NotValid";
      var formData = {
        formateur: document.getElementById("formateur").value,
        bootcamp: document.getElementById("bootcamp").value,
        title: document.getElementById("title").value,
        brief: document.getElementById("brief").value,
        difficulty: document.getElementById("notes").value,
        valid: validDef,
      };
      saveFormData(formData);
      savedUser();
      alert("Form data saved successfully!");
      dataForm.reset();
      modal.style.display = "none";
      body.classList.remove("body-overlay");
      location.reload();
    });
  } else {
    console.error("Data form element not found.");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("currentUser");

      window.location.href = "login.html";
    });
  } else {
    console.error("Logout button element not found.");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var table = document.getElementById("customers");

  // Retrieve data from local storage
  var savedUserData = JSON.parse(localStorage.getItem("savedUserData")) || [];

  if (table && savedUserData.length > 0) {
    // Function to create a table row
    function createRow(data, userDataIndex, formDataIndex) {
      var row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.formateur}</td>
        <td>${data.date}</td>
        <td>
          <div>
            <i class="fas fa-eye" style="color: black;"></i> <!-- Eye icon -->
          </div>
        </td>
        <td class="ddk">
          <div class="valid-btn">Valid</div>
        </td>
        <td class="action">
          <div class="update"> <i class="fas fa-pencil-alt" style="color: blue;"></i></div>
          <div class="delete"><i class="fas fa-trash" style="color: red;"></i></div>
        </td>
      `;
      // Add event listener to the delete icon in this row
      var deleteBtn = row.querySelector(".delete");
      deleteBtn.addEventListener("click", function (event) {
        var userData = savedUserData[userDataIndex];
        // Remove data from current user's formData array
        userData.formData.splice(formDataIndex, 1);
        // Update local storage with modified data
        localStorage.setItem("savedUserData", JSON.stringify(savedUserData));
        // Remove row from table
        row.remove();
      });
      return row;
    }

    // Populate table with data from savedUserData
    savedUserData.forEach(function (userData, userDataIndex) {
      userData.formData.forEach(function (formData, formDataIndex) {
        var row = createRow(formData, userDataIndex, formDataIndex);
        table.appendChild(row);
      });
    });
  } else {
    console.error("Table or user data not found.");
  }
});
