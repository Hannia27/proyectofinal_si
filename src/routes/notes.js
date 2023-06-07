//Se usará para crear una nueva ruta, eliminarla...
const express = require("express");
const router = express.Router();
const { estaAutenticado } = require("../config/validateSession");

//Note es la variable con la que voy a realizar el CRUD.
const Note = require("../models/Note");
router.get("/notes/add", (req, res) => {
    res.render("notes/newnote");
});
router.post("/notes/newnote", async (req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: "Por favor inserte un titulo" });
    }
    if (!description) {
        errors.push({ text: "Por favor inserte una descripción" });
    }
    if (errors.length > 0) {
        res.render("notes/newnote", {
            errors,
            title,
            description,
        });
    } else {
        const newNote = new Note({ title, description });
        await newNote.save();
        req.flash("success_msg", "Newsletter agregado correctamente.");
        res.redirect("/notes");
    }
});
router.get("/notes", async (req, res) => {
    const notes = await Note.find().lean().sort({ date: "desc" }); //.sort({}) -> Organiza las notas de manera descendente
    res.render("notes/all-notes", { notes });
});

router.get("/notes/edit/:id", async (req, res) => {
    const note = await Note.findById(req.params.id).lean();
    res.render("notes/edit-notes", { note });
});

router.put("/notes/edit-notes/:id", async (req, res) => {
    const { title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, description }).lean();
    req.flash("success_msg", "Newsletter actualizado correctamente.");
    res.redirect("/notes");
});

    router.delete("/notes/delete/:id", async (req, res) => {
        await Note.findByIdAndDelete(req.params.id).lean();
        req.flash("success_msg", "Newsletter eliminado correctamente.");
        res.redirect("/notes");
    });

router.get("/notes/usernote", async (req, res) => {
    const notes = await Note.find().lean().sort({ date: "desc" }); //.sort({}) -> Organiza las notas de manera descendente
    res.render("notes/usernote", { notes });
});
    
    
module.exports = router;
