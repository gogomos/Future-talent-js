var modal;
var body;
document.addEventListener("DOMContentLoaded", function () {
  var savedUserData = JSON.parse(localStorage.getItem("savedUserData"));
  console.log(savedUserData.formData);
  var currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser || !currentUser.username) {
    alert("Invalid User Please Login!");
    window.location.href = "login.html";
    return;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var currentUser = JSON.parse(localStorage.getItem("currentUser"));
  var username = document.getElementById("name");
  username.innerHTML = `<p>${currentUser.username}</p>`;
});
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
// dashboard.js
function generateRandomId(length) {
  let randomId = "";
  for (let i = 0; i < length; i++) {
    randomId += Math.floor(Math.random() * 10); // Generate a random number between 0 and 9
  }
  return parseInt(randomId); // Parse the string to an integer
}

function savedUser() {
  var savedUserData = JSON.parse(localStorage.getItem("savedUserData") || "[]");
  var currentUserData = JSON.parse(localStorage.getItem("currentUser") || "{}");

  if (currentUserData && currentUserData.username) {
      var existingUser = savedUserData.find(function (user) {
          return user.username === currentUserData.username;
      });

      if (existingUser) {
          // If the user exists, push the latest form data
          var latestFormData = currentUserData.formData[currentUserData.formData.length - 1];

          // Generate a unique random ID
          var randomId;
          do {
              randomId = generateRandomId(4); // Adjust the length as needed
          } while (existingUser.formData.some((data) => data.id === randomId));

          latestFormData.id = randomId; // Set the generated ID
          existingUser.formData.push(latestFormData);
      } else {
          // If the user doesn't exist, add the entire current user's data
          savedUserData.push(currentUserData);
      }

      localStorage.setItem("savedUserData", JSON.stringify(savedUserData));
  } else {
      alert("Invalid or missing current user data.");
  }
}


document.addEventListener("DOMContentLoaded", function () {
  var dataForm = document.getElementById("dataForm");

  if (dataForm) {
    dataForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var validDef = "NotValid";
      var formData = {
        id: Math.floor(Math.random() * 200),
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
  var body = document.querySelector("body");
  var table = document.getElementById("customers");

  // Function to handle delete button click
  function handleDeleteClick(event) {
    var deleteBtn = event.target.closest(".delete");
    if (!deleteBtn) return; // If the click is not on a delete button, exit

    var formDataId = parseInt(deleteBtn.dataset.formId); // Get the ID from the dataset
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    var savedUserData = JSON.parse(localStorage.getItem("savedUserData")) || [];

    if (currentUser && savedUserData.length > 0) {
      var userData = savedUserData.find(function (user) {
        return user.username === currentUser.username;
      });

      if (userData && userData.formData) {
        var formDataIndex = userData.formData.findIndex(function (data) {
          return data.id === formDataId;
        });
        if (formDataIndex !== -1) {
          // Remove the form data entry from the array
          userData.formData.splice(formDataIndex, 1);
          // Update local storage with modified data
          localStorage.setItem("savedUserData", JSON.stringify(savedUserData));
          // Remove the row from the table
          deleteBtn.closest("tr").remove();
          return; // Exit the function if the form data is deleted and row removed
        }
      }
    }
    console.error("User data or form data not found for the current user.");
  }

  // Attach delete button click event listener to each delete button
  table.addEventListener("click", handleDeleteClick);

  // Function to display all data in the table
  function displayUserData() {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    var savedUserData = JSON.parse(localStorage.getItem("savedUserData")) || [];

    if (currentUser && savedUserData.length > 0) {
        var userData = savedUserData.find(function (user) {
            return user.username === currentUser.username;
        });

        if (userData && userData.formData) {
            userData.formData.forEach(function (formData) {
                var row = createRow(formData);
                table.appendChild(row);
            });
        } else {
            console.error("Form data not found for the current user.");
        }
    } else {
        console.error("Current user data not found.");
    }
}

// Function to create table row
function createRow(data) {
    var row = document.createElement("tr");
    row.innerHTML = `
        <td>${data.formateur}</td>
        <td>${data.date}</td>
        <td>
            <div id="blockage" data-form-id="${data.id}">
                <i class="fas fa-eye" style="color: black;"></i>
            </div>
        </td>
        <td class="ddk">
            <div class="valid-btn">${data.valid}</div>
        </td>
        <td class="action">
            <div class="update" data-form-id="${data.id}"> <i class="fas fa-pencil-alt" style="color: blue;"></i></div>
            <div class="delete" data-form-id="${data.id}"><i class="fas fa-trash" style="color: red;"></i></div>
        </td>
    `;
    return row;
}

// Display data of the current user when the page loads
displayUserData();


  // Function to handle update button click
  function handleUpdateClick(event) {
    var updateModal = document.getElementById("updateModal");
    var closeUpdateBtn = updateModal.querySelector(".close");
    closeUpdateBtn.addEventListener("click", function () {
      updateModal.style.display = "none";
      body.classList.remove("body-overlay");
    });
    var updateBtn = event.target.closest(".update");
    if (!updateBtn) return; // If the click is not on an update button, exit

    var formDataId = parseInt(updateBtn.dataset.formId); // Get the ID from the dataset
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    var savedUserData = JSON.parse(localStorage.getItem("savedUserData")) || [];

    if (currentUser && savedUserData.length > 0) {
      var userData = savedUserData.find(function (user) {
        return user.username === currentUser.username;
      });

      if (userData && userData.formData) {
        var formData = userData.formData.find(function (data) {
          return data.id === formDataId;
        });

        if (formData) {
          // Populate the update modal with existing data
          document.getElementById("update-title").value = formData.title;
          document.getElementById("update-brief").value = formData.brief;
          document.getElementById("update-notes").value = formData.difficulty;

          // Display the update modal
          var updateModal = document.getElementById("updateModal");
          updateModal.style.display = "block";
          body.classList.add("body-overlay");

          // Handle update form submission
          var updateForm = document.getElementById("updateForm");
          updateForm.addEventListener("submit", function (event) {
            event.preventDefault();

            // Update form data
            formData.title = document.getElementById("update-title").value;
            formData.brief = document.getElementById("update-brief").value;
            formData.difficulty = document.getElementById("update-notes").value;
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

            // Update local storage with modified data
            localStorage.setItem(
              "savedUserData",
              JSON.stringify(savedUserData)
            );

            // Close the update modal
            updateModal.style.display = "none";
            body.classList.remove("body-overlay");
          });
          return; // Exit the function if the form data is found and update modal displayed
        }
      }
    }
    console.error("User data or form data not found for the current user.");
  }

  // Attach update button click event listener to each update button
  table.addEventListener("click", handleUpdateClick);

  // Function to handle blockage button click
  function handleBlockageClick(event) {
    var blockageBtn = event.target.closest("#blockage");
    if (!blockageBtn) return; // If the click is not on a blockage button, exit

    var formDataId = parseInt(blockageBtn.dataset.formId); // Get the ID from the dataset
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    var savedUserData = JSON.parse(localStorage.getItem("savedUserData")) || [];
    var blockageModal = document.querySelector(".blockageModal");
    var body = document.querySelector("body");
    var closeBlBtn = document.querySelector(".blockageModal .close");
    var blockageModal = document.querySelector(".blockageModal");
    closeBlBtn.addEventListener("click", function () {
      blockageModal.style.display = "none";
      body.classList.remove("body-overlay");
    });
    if (currentUser && savedUserData.length > 0) {
      var userData = savedUserData.find(function (user) {
        return user.username === currentUser.username;
      });

      if (userData && userData.formData) {
        var formData = userData.formData.find(function (data) {
          return data.id === formDataId;
        });
        if (formData) {
          blockageModal.style.display = "block";
          body.classList.add("body-overlay");
          blockageModal.querySelector(" p").textContent = formData.difficulty;
          return; // Exit the function if the form data is found and blockage modal displayed
        }
      }
    }
    console.error("User data or form data not found for the current user.");
  }

  // Attach blockage button click event listener to each blockage element
  table.addEventListener("click", handleBlockageClick);
});
