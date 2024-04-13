document.addEventListener("DOMContentLoaded", function () {
    var modal;
    var body;
    var savedUserData = JSON.parse(localStorage.getItem("savedUserData") || "[]");

    var currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || !currentUser.username) {
        alert("Invalid User Please Login!");
        window.location.href = "login.html";
        return;
    }

    var username = document.getElementById("name");
    username.innerHTML = `<p>${currentUser.username}</p>`;

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
        savedUserData.forEach(function(user) {
            user.formData.forEach(function(formData, index) {
                // formData.id = index; // Assign a unique ID to each form data entry
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
                <div class="update" style="cursor: pointer;"><i class="fas fa-pencil-alt" style="color: blue;"></i></div>
                <div class="delete" style="cursor: pointer;"><i class="fas fa-trash" style="color: red;"></i></div>
            </td>
        `;
        return row;
    }

    // Function to handle blockage button click
    function handleBlockageClick(event) {
        var blockageBtn = event.target.closest(".blockageBtn");
        if (!blockageBtn) return; // If the click is not on a blockage button, exit
    
        var formDataId = parseInt(blockageBtn.dataset.formId); // Get the ID from the dataset
        var userData = savedUserData.find(user => user.formData.some(data => data.id === formDataId)); // Find the user data containing the form data with the clicked ID
        var blockageModal = document.querySelector(".blockageModal");
        var body = document.querySelector("body");
    
        if (userData) {
            var formData = userData.formData.find(data => data.id === formDataId); // Find the form data with the clicked ID
            if (formData) {
                blockageModal.querySelector("p").textContent = formData.difficulty;
                blockageModal.style.display = "block";
                body.classList.add("body-overlay");
                return; // Exit the function if the form data is found and displayed
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
    closeBlBtn.addEventListener("click", function () {
        var blockageModal = document.querySelector(".blockageModal");
        blockageModal.style.display = "none";
        body.classList.remove("body-overlay");
    });

});
