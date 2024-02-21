// Importar dependencias
const express = require("express");

// Cargar router
const router = express.Router();
const check = require('../middlewares/auth')

// Importar controlador
const AlbumController = require("../controllers/album");

// Definir rutas
router.get("/prueba", AlbumController.album);
router.get("/save", check.auth, AlbumController.save);


// Exportar router
module.exports = router;
