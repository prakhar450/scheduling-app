
var express = require("express"),
    router = express.Router({ mergeParams: true }),
    middleware = require("../middleware"),
    Slot = require("../models/slot"),
    Schedule = require("../models/schedule"),
    constants = require("../constants");


router.get("/new", middleware.isLoggedIn, function (req, res) {
    var hours = [];
    for (var i = 0; i < 24; i++) {
        i < 10 ? hours.push("0" + i + "00") : hours.push(i + "00");
    }
    res.render("slots/new", { hours: hours, schedule_id: req.params.schedule_id });
});

router.post("/", middleware.isLoggedIn, function (req, res) {
    var date = req.body.date.split("/");
    var time = req.body.hour
    time = time.substring(0, 2);

    var slot_timestamp = new Date(date[2] + "-" + date[0] + "-" + date[1] + "T" + time + ":00:00");

    Schedule.findById(req.params.schedule_id)
        .populate('slots').exec((err, schedule) => {
            {
                if (err) {
                    console.log(err);
                    res.redirect("/");
                } else if (schedule.user.id.equals(req.user._id)) {
                    var existing_slot = schedule.slots.filter(slot => {
                        return (slot.slot_timestamp - slot_timestamp) == 0;
                    });
                    if (existing_slot.length > 0) {
                        req.flash("error", "Slot Already Exists");
                        console.log("Slot Already Exists");
                        res.redirect("/");
                    } else {
                        var slot = {
                            slot_timestamp: slot_timestamp,
                            slot_status: constants.FREE_SLOT
                        }
                        Slot.create(slot, function (err, slot) {
                            if (err) {
                                console.log(err);
                            } else {
                                schedule.slots.push(slot);
                                schedule.save();
                                req.flash("success", "Slot Created");

                                res.redirect("/schedules/" + req.params.schedule_id + "?slot_status=" + constants.FREE_SLOT);
                            }
                        });
                    }
                } else {
                    console.log("Please Edit Your Own Slots");
                    req.flash("error", "Please Edit Your Own Slots ");
                    redirect("/");
                }
            }
        });
});


router.get("/:slot_id/edit", middleware.isLoggedIn, function (req, res) {
    Slot.findById(req.params.slot_id, function (err, slot) {
        if (err) {
            console.log(err);
        } else {
            res.render("slots/edit", { slot: slot, slot_status: constants.BOOKED_SLOT, schedule_id: req.params.schedule_id });
        }
    });

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
                        if (slot_self.length == 0) {
                            console.log("Make yourself available at this time");
                            req.flash("error", "Make yourself available at this time");
                            res.redirect("/");
                        }
                        else {
                            Slot.findById(slot_self[0]._id, function (err, slot_self) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    if (slot_other.slot_status == constants.BOOKED_SLOT || slot_self.slot_status == constants.BOOKED_SLOT) {
                                        console.log("Error");
                                        res.redirect("/login");
                                    } else {
                                        slot_other.slot_status = req.query.slot_status;
                                        slot_other.description = req.body.slot.description;
                                        slot_other.invitee.id = req.user._id;
                                        slot_other.invitee.username = req.user.username;

                                        slot_self.slot_status = req.query.slot_status;
                                        slot_self.description = req.body.slot.description;
                                        slot_self.invitee = user_other;

                                        slot_self.save();
                                        slot_other.save();
                                        req.flash("success", "Slot Booked!");

                                        res.redirect("/");
                                    }
                                }
                            })
                        }
                    }
                });
        }

    });
});

router.delete("/:slot_id", middleware.isLoggedIn, function (req, res) {
    Schedule.findById(req.params.schedule_id, function (err, schedule) {
        if (req.user._id.equals(schedule.user.id)) {
            Slot.findByIdAndRemove(req.params.slot_id, function (err) {
                if (err) {
                    console.log("PROBLEM!");
                } else {
                    req.flash("success", "DELETED");
                    res.redirect("/");
                }
            })
        } else {
            req.flash("CAN NOT DELETE SOMEONE ELSE'S SLOTS");
            console.log("CAN NOT DELETE SOMEONE ELSE'S SLOTS");
            res.redirect("/");
        }

    });
});

module.exports = router;