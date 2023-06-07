const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

//Initiliazations
const app = express();
require("./database");
require("./config/passport");

//Settings
app.set("PORT", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
//app.engine('.hbs', exphbs({ --> Este era el cóigo real, pero se cambio por la siguiente linea.
app.engine(
    ".hbs",
    exphbs.engine({
        defaultLayouts: "main",
        layoutsDir: path.join(app.get("views"), "layouts"),
        partialsDir: path.join(app.get("views"), "partials"),
        extname: ".hbs",
    })
);
app.set("view engine", ".hbs");

//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
    session({
        secret: "proyectofinal",
        resave: true,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    console.log(res.locals);
    next();
});
//Routes
app.use(require("./routes/index"));
app.use(require("./routes/notes"));
app.use(require("./routes/users"));
app.use(require("./routes/products"));
app.use(require("./routes/transactions"))

//Static Files
app.use(express.static(path.join(__dirname, "public")));
//Server is listenning
app.listen(app.get("PORT"), () => {
    console.log("Servidor en puerto", app.get("PORT"));
});
