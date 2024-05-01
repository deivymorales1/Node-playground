// Importar dependencias
const express = require("express");

// Cargar router
const router = express.Router();

// Importar middleware auth
const check = require("../middlewares/auth");

// Importar controlador
const SongController = require("../controllers/song");

// Configuracion de subida
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/songs/");
  },
  filename: (req, file, cb) => {
    cb(null, "song-" + Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage });

// Definir rutas
router.post("/save", check.auth, SongController.save);
router.get("/one/:id", check.auth, SongController.one);
router.get("/list/:albumId", check.auth, SongController.list);
router.put("/update/:id", check.auth, SongController.update);
router.delete("/remove/:id", check.auth, SongController.remove);
router.post(
  "/upload/:id",
  [check.auth, uploads.single("file0")],
  SongController.upload
);
router.get("/audio/:file", SongController.audio);

// Exportar router
module.exports = router;
