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
router.get("/one/:id", check.auth, SongController.one);
router.get("/list/:albumId", check.auth, SongController.list);

// Exportar router
module.exports = router;
