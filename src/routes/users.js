//Autenticación de los usuarios.
//Podemo registrar y autenticarlos.
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const validate = require("../config/validateSession");

//Para Ingresar
router.get("/users/signin", (req, res) => {
    res.render("users/signin");
});


router.post(
    "/users/signin",
    passport.authenticate("local", {
        successRedirect: "/notes",
        failureRedirect: "/users/signin",
        failureFlash: true,
    })
);

//Para entrar
router.get("/users/signup", (req, res) => {
    res.render("users/signup");
});

router.post("/users/signup", async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    if (name.length <= 0) {
        errors.push({ text: "Por favor inserte un nombre." });
    }
    if (password != confirm_password) {
        errors.push({ text: "Las contraseñas no coinciden" });
    }
    if (password.length > 4) {
        errors.push({
            text: "La contraseña debe ser al menos de 4 caracteres",
        });
    }
    if (errors.length > 0) {
        res.render("users/signup", {
            errors,
            name,
            email,
            password,
            confirm_password,
        });
    } else {
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.flash(
                "error_msg",
                "El correco electronico ya está  registrado."
            );
            res.redirect("/users/signup");
        }
        const newUser = new User({ name, email, password, isAdmin: false});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash("success_msg", "Usuario registrado");
        res.redirect("/users/signin");
    }
});

//Ruta para salir de mi session
router.get("/users/signup", (req, res) => {
    req.session.destroy(); //logout; //método para terminar con la session
    //req.logout(); //logout; //método para terminar con la session
    res.redirect("/"); //Redirecciono a mi página principal
});


module.exports = router;
