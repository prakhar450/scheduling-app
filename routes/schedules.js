var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware"),
    Schedule = require("../models/schedule");

router.get("/", middleware.isLoggedIn, function (req, res) {
    Schedule.find({}, function (err, allSchedules) {
        if (err) {
            console.log(err);
        } else {
            console.log(allSchedules);
        }
    })
    res.send(allSchedules);
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
            res.send(schedule)
        }
    })

});

router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.send("New Schedule");
});

router.get("/:schedule_id", middleware.isLoggedIn, function (req, res) {
    Schedule.findById(req.params.schedule_id)
        .populate('slots').exec((err, schedule) => {
            if (err) {
                console.log(err);
            } else {
                var slots = schedule.slots.filter(slot => {
                    return slot.slot_status === req.query.slot_status;
                });
                res.send(slots);
            }
        });
});

module.exports = router;