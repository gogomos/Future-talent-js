document.addEventListener("DOMContentLoaded", function() {
    var adminUser = {
        username: "admin",
        email: "admin@gmail.com",
        password: "12345",
        role: "admin"
    };
    var adminExists = JSON.parse(localStorage.getItem("users")) || [];
    var adminAlreadyExists = adminExists.some(function(user) {
        return user.username === adminUser.username || user.email === adminUser.email;
    });
    if (!adminAlreadyExists) {
        adminExists.push(adminUser);
        localStorage.setItem("users", JSON.stringify(adminExists));
    }

    var registrationForm = document.getElementById("registrationForm");
    if (registrationForm) {
        document.getElementById("registrationForm").addEventListener("submit", function(event) {
            event.preventDefault(); 
            var username = document.getElementById("username").value;
            var email = document.getElementById("email").value;
            var password = document.getElementById("password").value;
    
            var usersArray = JSON.parse(localStorage.getItem("users")) || [];
    
            var userExists = usersArray.some(function(user) {
                return user.username === username || user.email === email;
            });
    
            if (userExists) {
                alert("Username or email already exists!");
            } else {
                var newUser = {
                    username: username,
                    email: email,
                    password: password,
                    role: "student"
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