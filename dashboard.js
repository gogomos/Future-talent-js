var modal;
var body;
document.addEventListener("DOMContentLoaded", function () {
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

// document.addEventListener("DOMContentLoaded", function () {
//   var table = document.getElementById("customers");

//   // Retrieve data from local storage
//   var savedUserData = JSON.parse(localStorage.getItem("savedUserData")) || [];

//   if (table && savedUserData.length > 0) {
//     // Function to create a table row
//     function createRow(data, userDataIndex, formDataIndex) {
//       var row = document.createElement("tr");
//       row.innerHTML = `
//         <td>${data.formateur}</td>
//         <td>${data.date}</td>
//         <td>
//           <div>
//             <i class="fas fa-eye" style="color: black;"></i> <!-- Eye icon -->
//           </div>
//         </td>
//         <td class="ddk">
//           <div class="valid-btn">Valid</div>
//         </td>
//         <td class="action">
//           <div class="update" id="updateBtn"> <i class="fas fa-pencil-alt" style="color: blue;"></i></div>
//           <div class="delete"><i class="fas fa-trash" style="color: red;"></i></div>
//         </td>
//       `;
//       // Add event listener to the delete icon in this row
//       var deleteBtn = row.querySelector(".delete");
//       deleteBtn.addEventListener("click", function (event) {
//         var userData = savedUserData[userDataIndex];
//         // Remove data from current user's formData array
//         userData.formData.splice(formDataIndex, 1);
//         // Update local storage with modified data
//         localStorage.setItem("savedUserData", JSON.stringify(savedUserData));
//         // Remove row from table
//         row.remove();
//       });
//       return row;
//     }

//     // Populate table with data from savedUserData
//     savedUserData.forEach(function (userData, userDataIndex) {
//       userData.formData.forEach(function (formData, formDataIndex) {
//         var row = createRow(formData, userDataIndex, formDataIndex);
//         table.appendChild(row);
//       });
//     });
//   } else {
//     console.error("Table or user data not found.");
//   }
// });

//update
document.addEventListener("DOMContentLoaded", function () {
  var table = document.getElementById("customers");

  // Retrieve data from local storage for the current user
  var currentUser = JSON.parse(localStorage.getItem("currentUser"));
  var savedUserData = JSON.parse(localStorage.getItem("savedUserData")) || [];

  if (table && currentUser) {
    // Find the data of the current user
    var userData = savedUserData.find(function (user) {
      return user.username === currentUser.username; // Adjust this condition based on your user data structure
    });

    if (userData && userData.formData) {
      // Function to create a table row
      function createRow(data, index) {
        var row = document.createElement("tr");
        row.innerHTML = `
          <td>${data.formateur}</td>
          <td>${data.date}</td>
          <td>
            <div id="blockage">
              <i class="fas fa-eye" style="color: black;"></i> <!-- Eye icon -->
            </div>
          </td>
          <td class="ddk">
            <div class="valid-btn">Valid</div>
          </td>
          <td class="action">
            <div class="update" id="updateBtn"> <i class="fas fa-pencil-alt" style="color: blue;"></i></div>
            <div class="delete"><i class="fas fa-trash" style="color: red;"></i></div>
          </td>
        `;
        // Add event listener to the delete icon in this row
        var deleteBtn = row.querySelector(".delete");
        deleteBtn.addEventListener("click", function (event) {
          // Remove data from current user's formData array
          userData.formData.splice(index, 1);
          // Update local storage with modified data
          localStorage.setItem("savedUserData", JSON.stringify(savedUserData));
          // Remove row from table
          row.remove();
        });
        return row;
      }

      // Populate table with data from current user's formData
      userData.formData.forEach(function (formData, index) {
        var row = createRow(formData, index);
        table.appendChild(row);
      });
    } else {
      console.error("User data or formData not found for the current user.");
    }
  } else {
    console.error("Table or current user data not found.");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Define body and table variables
  var body = document.querySelector("body");
  var table = document.getElementById("customers");
  var updateModal = document.getElementById("updateModal");
  var updateModalBtn = document.getElementById("updateBtn");
  if (updateModalBtn) {
    updateModalBtn.addEventListener("click", function () {
      updateModal.style.display = "block";
      body.classList.add("body-overlay");
    });
  } else {
    console.error("Update modal button not found.");
  }

  // Update button event listener
  var updateBtns = document.querySelectorAll(".update");
  updateBtns.forEach(function (updateBtn) {
    updateBtn.addEventListener("click", function () {
      var rowIndex = this.closest("tr").rowIndex;
      var currentUser = JSON.parse(localStorage.getItem("currentUser"));
      var savedUserData =
        JSON.parse(localStorage.getItem("savedUserData")) || [];

      if (currentUser && savedUserData.length > 0) {
        var userData = savedUserData.find(function (user) {
          return user.username === currentUser.username;
        });

        if (
          userData &&
          userData.formData &&
          userData.formData.length > rowIndex - 1
        ) {
          // console.log(rowIndex);
          var updateModal = document.getElementById("updateModal");
          var closeUpdateBtn = updateModal.querySelector(".close");

          // Ensure close button is found
          if (!closeUpdateBtn) {
            console.error("Close button not found within update modal.");
            return;
          }

          // Populate update modal with existing data
          var formData = userData.formData[rowIndex - 1];
          document.getElementById("update-title").value = formData.title;
          document.getElementById("update-brief").value = formData.brief;
          document.getElementById("update-notes").value = formData.difficulty;

          updateModal.style.display = "block";
          body.classList.add("body-overlay");

          closeUpdateBtn.addEventListener("click", function () {
            updateModal.style.display = "none";
            body.classList.remove("body-overlay");
          });

          window.addEventListener("click", function (event) {
            if (event.target == updateModal) {
              updateModal.style.display = "none";
              body.classList.remove("body-overlay");
            }
          });

          // Update button logic
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
            console.log(formattedDate);
            formData.date = formattedDate;

            // Update local storage with modified data
            localStorage.setItem(
              "savedUserData",
              JSON.stringify(savedUserData)
            );
            updateModal.style.display = "none";
            body.classList.remove("body-overlay");
            location.reload();
          });
        } else {
          console.error(
            "User data or form data not found for the current user."
          );
        }
      } else {
        console.error("Current user or saved user data not found.");
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  // Function to handle blockage button click
  function handleBlockageClick(event) {
    var rowIndex = event.target.closest("tr").rowIndex;
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    var savedUserData = JSON.parse(localStorage.getItem("savedUserData")) || [];
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

      if (
        userData &&
        userData.formData &&
        userData.formData.length > rowIndex - 1
      ) {
        var blockageModal = document.querySelector(".blockageModal");
        blockageModal.style.display = "block";
        body.classList.add("body-overlay");

        var formData = userData.formData[rowIndex - 1];
        // Display difficulty in the blockage modal
        blockageModal.querySelector(" p").textContent = formData.difficulty;
      } else {
        console.error("User data or form data not found for the current user.");
      }
    } else {
      console.error("Current user or saved user data not found.");
    }
  }

  // Attach blockage button click event listener to each blockage element
  var blockageButtons = document.querySelectorAll("#blockage");
  blockageButtons.forEach(function (blockageBtn) {
    blockageBtn.addEventListener("click", handleBlockageClick);
  });
});
