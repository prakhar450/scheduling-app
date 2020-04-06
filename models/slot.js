var mongoose = require("mongoose");

var slotSchema = new mongoose.Schema({
    slot_timestamp: Date,
    invitee: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    description: String,
    slot_status: String
});

module.exports = mongoose.model("Slot", slotSchema);