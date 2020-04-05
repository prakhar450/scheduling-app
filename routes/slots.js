
var express = require("express");
var router = express.Router();

router.post("/", function (req, res) {
    res.send("Post slot")
 });
 
 router.get("/new", function (req, res) {
     res.send("New slot");
 });

router.get("/:slot_id/edit", function (req, res) {
    res.send("edit slot")
});

router.put("/:slot_id", function(req, res){
    res.send("edit slot")
});

router.delete("/:slot_id", function(req, res){
    res.send("delete slot");
});

module.exports = router;