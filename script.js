document.addEventListener("DOMContentLoaded", function () {
  var passwordInput = document.getElementById("password");
  var showPasswordCheckbox = document.getElementById("showPassword");

  showPasswordCheckbox.addEventListener("change", function () {
    passwordInput.type = showPasswordCheckbox.checked ? "text" : "password";
  });
  var registrationForm = document.getElementById("registrationForm");
  if (registrationForm) {
    document
      .getElementById("registrationForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        var username = document.getElementById("username").value;
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;

        //password check
        var passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{8,}$/;

        if (!passwordRegex.test(password)) {
          alert(
            "Password must contain at least 8 characters including numbers, alphabets, and special characters."
          );
          return;
        }

        var usersArray = JSON.parse(localStorage.getItem("users")) || [];

        var userExists = usersArray.some(function (user) {
          return user.username === username || user.email === email;
        });

        if (userExists) {
          alert("Username or email already exists!");
        } else {
          var newUser = {
            username: username,
            email: email,
            password: password,
            role: "student",
          };

          usersArray.push(newUser);
          localStorage.setItem("users", JSON.stringify(usersArray));

          alert("Registration successful!");
          window.location.href = "login.html";
        }
      });
  } else {
    console.error("Registration form element not found.");
  }
});
