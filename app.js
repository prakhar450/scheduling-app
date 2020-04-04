const express = require("express"),
    app = express(),
    port = process.env.PORT || "8000",
    bodyParser = require("body-parser"),
    passport = require("passport"), 
    authRoutes = require("./routes/auth"),
    path = require("path");
  
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(require("express-session")({
    secret: "Welcome to the future",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(authRoutes);

app.listen(port, () => {
    console.log("Server started");
});
