var express = require("express");
var router = express.Router();

router.post("/", function (req, res) {
   res.send("Post schedule")
});

router.get("/new", function (req, res) {
    res.send("New Schedule");
});

router.get("/:schedule_id", function (req, res) {
    res.send("Get schedule"); 
});

module.exports = router;