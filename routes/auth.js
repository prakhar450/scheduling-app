var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    middleware = require("../middleware"),
    Schedule = require("../models/schedule");

router.get("/", middleware.isLoggedIn, function (req, res) {
    Schedule.find({"user.id":req.user._id}, function (err, mySchedule) {
        if (err) {
            console.log(err);
            res.redirect("/login")
        } else {
            res.render("landing", {mySchedule:mySchedule})
        }
    })
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
            res.redirect("/login")
        });
    });
});

router.get("/login", function (req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/", failureRedirect: "/login"
}), function (req, res) {

});

router.get("/logout", middleware.isLoggedIn, function (req, res) {
    req.logout();
    res.redirect("/login");
});

module.exports = router;