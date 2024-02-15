// Importar dependencias
const express = require("express");
const check = require("../middlewares/auth");

// Cargar router
const router = express.Router();

// Importar controlador
const UserController = require("../controllers/user");

// Definir rutas
router.get("/prueba", check.auth, UserController.prueba);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id", check.auth, UserController.profile);

// Exportar router
module.exports = router;
