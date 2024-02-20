// Importar dependencias
const express = require("express");
const check = require("../middlewares/auth");

// Cargar router
const router = express.Router();

// Importar controlador
const ArtistController = require("../controllers/artist");

// Definir rutas

router.get("/save", check.auth, ArtistController.save);

// Exportar router
module.exports = router;
