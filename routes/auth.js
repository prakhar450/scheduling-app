var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    middleware = require("../middleware");

router.get("/", function (req, res) {
    res.redirect("/login");
});

router.get("/register", function (req, res) {
    res.render("register");
})

router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.send(req.user)
        });
    });
});

router.get("/login", function (req, res) {
    res.render("login");
});

router.get("/show", function (req, res) {
    res.send(req.user);
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/show", failureRedirect: "/login"
}), function (req, res) {

});

router.get("/logout", middleware.isLoggedIn, function (req, res) {
    req.logout();
    res.redirect("/login");
});

module.exports = router;