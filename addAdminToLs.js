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