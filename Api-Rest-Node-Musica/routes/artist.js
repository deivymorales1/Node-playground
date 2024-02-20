// Importar dependencias
const express = require("express");
const check = require("../middlewares/auth");

// Cargar router
const router = express.Router();

// Importar controlador
const ArtistController = require("../controllers/artist");

// Definir rutas

router.get("/save", check.auth, ArtistController.save);
router.get("/one/:id", check.auth, ArtistController.one);
router.get("/list/:page?", check.auth, ArtistController.list);

// Exportar router
module.exports = router;
