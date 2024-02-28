// Importar dependencias
const express = require("express");

// Cargar router
const router = express.Router();

// Importar middleware auth
const check = require("../middlewares/auth");

// Importar controlador
const SongController = require("../controllers/song");

// Definir rutas
router.get("/prueba", SongController.song);
router.post("/save", check.auth, SongController.save);

// Exportar router
module.exports = router;
