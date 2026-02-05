const express = require("express");
const router = express.Router();

const AsignacionService = require("../services/asignacion.service");
const service = new AsignacionService();

router.post('/notificar-asignacion', async (req, res) => {
  try {
    const { activos, responsable, ubicacion } = req.body;

    if (!activos || !responsable || !ubicacion) {
      return res.status(400).json({ message: 'Payload incompleto' });
    }

    const rta = await service.aprobarAsignment(
      activos,
      responsable,
      ubicacion
    );

    res.status(200).json({
      ok: true,
      message: 'Acta enviada para aprobación',
      data: rta
    });

  } catch (error) {
    console.error('❌ Error en notificación:', error);
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
