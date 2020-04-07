const express = require("express"),
    app = express(),
    port = process.env.PORT || "8000",
    bodyParser = require("body-parser"),
    passport = require("passport"),
    authRoutes = require("./routes/auth"),
    scheduleRoutes = require("./routes/schedules"),
    slotRoutes = require("./routes/slots"),
    flash = require("connect-flash"),
    path = require("path"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user");

    var url = process.env.DATABASEURL || "mongodb://localhost/schedule_db"
mongoose.connect(url, {
        useNewUrlParser: true,
        useCreateIndex: true
    }).then(() => {
        console.log('Connected to DB!');
    }).catch(err => {
        console.log('ERROR:', err.message);
    });
//mongoose.connect("mongodb://localhost/schedule_db", { useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride("_method"));
app.use(flash());
app.use(require("express-session")({
    secret: "Welcome to the future",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use(authRoutes);
app.use("/schedules", scheduleRoutes);
app.use("/schedules/:schedule_id/slots", slotRoutes);

app.listen(port, () => {
    console.log("Server started");
});
