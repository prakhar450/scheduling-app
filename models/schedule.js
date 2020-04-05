var mongoose = require("mongoose");

var scheduleSchema = new mongoose.Schema({
    user: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String
     },
    slots: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Slot"
        }
     ]
});

module.exports = mongoose.model("Schedule", scheduleSchema);