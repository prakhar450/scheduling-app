var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    res.redirect("/login");
});

router.get("/register", function (req, res) {
    res.send("register");
})

router.post("/register", function (req, res) {
    res.send("register");
});

router.get("/login", function (req, res) {
    res.send("login");
});

router.post("/login", function (req, res) {
    res.send("login");
});

router.get("/logout", function (req, res) {
    res.send("logout");
})

module.exports = router;