// Importar dependencias
const express = require("express");

// Cargar router
const router = express.Router();
const check = require("../middlewares/auth");

// Importar controlador
const AlbumController = require("../controllers/album");

// Definir rutas
router.get("/prueba", AlbumController.album);
router.get("/save", check.auth, AlbumController.save);
router.get("/one/:id", check.auth, AlbumController.one);
router.get("/list/:artistId", check.auth, AlbumController.list);


// Exportar router
module.exports = router;
