var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware"),
    Schedule = require("../models/schedule"),
    constants = require("../constants");

router.get("/", middleware.isLoggedIn, function (req, res) {
    Schedule.find({}, function (err, allSchedules) {
        if (err) {
            console.log(err);
        } else {
            console.log("all schedule: ", allSchedules);
            res.render("schedules/index", {allSchedules:allSchedules, slot_status:req.query.slot_status});
        }
    })
});

router.get("/new", middleware.isLoggedIn, function (req, res) {
    var user_id = req.user._id;
    res.render("schedules/new", {user_id:user_id});
});

router.post("/", middleware.isLoggedIn, function (req, res) {
    var schedule = {
        user: {
            id: req.user._id,
            username: req.user.username
        }
    }
    Schedule.create(schedule, function (err, schedule) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Schedule Created!");
            res.redirect(schedule._id + "/slots/new")
        }
    })

});

router.get("/:schedule_id", middleware.isLoggedIn, function (req, res) {
    console.log(req.params);
    Schedule.findById(req.params.schedule_id)
        .populate('slots').exec((err, schedule) => {
            if (err) {
                console.log(err);
            } else {
                var book_option = "true";
                var slots = schedule.slots.filter(slot => {
                    return slot.slot_status === req.query.slot_status;
                });
                if(req.user._id.equals( schedule.user.id)){
                    book_option = "false";
                }
                res.render("schedules/show", {slot_status:req.query.slot_status, slots: slots, book_option:book_option, schedule_id:schedule._id})               
               
            }
        });
});

module.exports = router;