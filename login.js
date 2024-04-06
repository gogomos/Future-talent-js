var loginForm = document.getElementById("loginForm");
    if (loginForm) {

        document.getElementById("loginForm").addEventListener("submit", function(event) {
            event.preventDefault(); 
            var loginEmail = document.getElementById("loginEmail").value;
            var loginPassword = document.getElementById("loginPassword").value;
    
            var usersArray = JSON.parse(localStorage.getItem("users")) || [];
    
            var user = usersArray.find(function(user) {
                return user.email === loginEmail;
            });
    
            if (user && user.password === loginPassword) {
                alert("Login successful!");
                if (user.role === "admin") {
                    window.location.href = "adminDh.html";
                } else {
                    window.location.href = "studentDh.html";
                }
            } else {
                alert("Invalid email or password!");
            }
        });
    } else {
        console.error("Login form element not found.");
    }