
var express = require("express"),
    router = express.Router({ mergeParams: true }),
    middleware = require("../middleware"),
    Slot = require("../models/slot"),
    Schedule = require("../models/schedule"),
    constants = require("../constants");


router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.send("New slot");
});

router.post("/", middleware.isLoggedIn, function (req, res) {
    Schedule.findById(req.params.schedule_id, function (err, schedule) {
        if (err) {
            console.log(err);
            res.redirect("/schedules");
        } else {
            var slot = {
                slot_timestamp: req.body.slot_timestamp,
                slot_status: constants.FREE_SLOT
            }
            Slot.create(slot, function (err, slot) {
                if (err) {
                    console.log(err);
                } else {
                    schedule.slots.push(slot);
                    schedule.save();
                    console.log(slot);
                    res.send(schedule);
                }
            });
        }
    });
});


router.get("/:slot_id/edit", middleware.isLoggedIn, function (req, res) {
    Slot.findById(req.params.slot_id, function (err, slot) {
        if (err) {
            console.log(err);
        } else {
            console.log(slot);
        }
    });
    res.send("edit slot")
});

router.put("/:slot_id", middleware.isLoggedIn, function (req, res) {
    var slot_timestamp, user_other;

    Schedule.findById(req.params.schedule_id, function (err, schedule) {
        if (err) {
            console.log(err);
        } else {
            user_other = schedule.user;
        }
    })

    Slot.findById(req.params.slot_id, function (err, slot_other) {
        if (err) {
            console.log(err);
        } else {
            slot_timestamp = slot_other.slot_timestamp;

            Schedule.find({ "user.id": req.user._id })
                .populate('slots').exec((err, schedule) => {
                    if (err) {
                        console.log(err);
                    } else {
                        var slot_self = schedule[0].slots.filter(slot => {
                            return (slot.slot_timestamp - slot_timestamp) == 0;
                        });
                        Slot.findById(slot_self[0]._id, function (err, slot_self) {
                            if (err) {
                                console.log(err);
                            } else {
                                if (slot_other.slot_status == constants.BOOKED_SLOT || slot_self.slot_status == constants.BOOKED_SLOT) {
                                    console.log("Error");
                                    res.redirect("/login");
                                } else {
                                    slot_other.slot_status = req.query.slot_status;
                                    slot_other.description = req.body.description;
                                    slot_other.invitee.id = req.user._id;
                                    slot_other.invitee.username = req.user.username;

                                    slot_self.slot_status = req.query.slot_status;
                                    slot_self.description = req.body.description;
                                    slot_self.invitee = user_other;

                                    slot_self.save();
                                    slot_other.save();
                                    res.send("Success");
                                }
                            }
                        })
                    }
                });
        }

    });
});

router.delete("/:slot_id", middleware.isLoggedIn, function (req, res) {
    Comment.findByIdAndRemove(req.params.slot_id, function (err) {
        if (err) {
            console.log("PROBLEM!");
        } else {
            res.redirect("/schedules");
        }
    })
    res.send("delete slot");
});

module.exports = router;