const express = require("express");
const router = express.Router();

const AsignacionService = require("../services/asignacion.service");
const service = new AsignacionService();

router.post("/notificar-asignacion", async (req, res) => {
  try {
    const { activo, contacto, ubicacion } = req.body;
    console.log("REQ.BODY COMPLETO:", req.body);
    const activosData = Array.isArray(activo) ? activo: activo;
    const contactoData = Array.isArray(contacto) ? contacto[0]: contacto;
    const ubicacionData = Array.isArray(ubicacion) ? ubicacion[0]: ubicacion;

    const rta = await service.aprobarAsignment(
      activosData,
      contactoData,
      ubicacionData
    );

    res.json(rta);
  } catch (error) {
    console.error("Error en notificación:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/confirmar-asignacion", async (req, res) => {
  try {
    const { token, respuesta } = req.body;
    const notificacion = 'true';
    const rta = await service.confirmAsignment(token, respuesta, notificacion);
    res.json(rta);
  } catch (error) {
    console.error("Error en confirmación:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/datos-tecnicos", async (req, res) => {
  try {
    const datosTecnicos = req.body;
    console.log('REQ.BODY Completo: ', req.body)
    const rta = await service.unpdateDatosTecnicos(datosTecnicos);
    res.json(rta.message);
  } catch(error) {
    console.error("Error en asignacion de datos tecnicos:", error);
    res.status(500).json({ message: error.message });
  }
})

module.exports = router;
