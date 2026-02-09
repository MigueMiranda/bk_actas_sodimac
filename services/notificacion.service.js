const { config } = require("../config/config");
const nodemailer = require("nodemailer");

class NotifcacionService {
  constructor() {
    // Creamos el transportador una sola vez al iniciar la clase
    console.log("EMAIL_USER:", config.emailUser);
    console.log("EMAIL_PASS:", config.emailPass ? "OK" : "NO");
    // Usar configuración SMTP explícita y segura
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: config.emailUser.trim(),
        pass: config.emailPass.trim(),
      },
    });

    // Verificar la conexión y credenciales al iniciar
    this.transporter.verify().then(() => {
      console.log('Transportador SMTP verificado correctamente');
    }).catch((err) => {
      console.error('Error verificando transportador SMTP:', err && err.response && err.response.toString ? err.response.toString() : err);
    });
  }

  async mailOptions(dataMail, tipoNotificacion) {
    let mailOptions = {};
    console.log("Preparando notificación de tipo:", tipoNotificacion, "con datos:", dataMail);
    if (tipoNotificacion === "aprobacion") {
      mailOptions = {
        from: `"Activos TI" <${config.emailUser}>`,
        to: dataMail.to,
        subject: "Solicitud de aprobación de asignación de activos",
        html: `
            <h3>Hola ${dataMail.nameUser},</h3>
            <p>Se te han asignado los siguientes activos:</p>
            <ul>${dataMail.activos}</ul>
            <p>Ubicación: ${dataMail?.ubicacion}</p>
            <p>Por favor confirma la recepción de los activos:</p>
            <p>
                ✅ <a href="http://localhost:4200/aprobar?token=${dataMail.token}&respuesta=aprobado">Aprobar asignación</a><br>
                ❌ <a href="http://localhost:4200/aprobar?token=${dataMail.token}&respuesta=rechazado">Rechazar asignación</a>
            </p>
        `,
      };

      await this.sendMail(mailOptions);
      // CORRECCIÓN AQUÍ: dataMail.token
      return { message: "Asignación enviada al usuario", token: dataMail.token };
    }

    if (tipoNotificacion === "confirmacion") {
      const mailBody = `
        <h3>Hola,</h3>
        <p>${dataMail.nameUser} ha procesado la asignación de ${dataMail.elementos || ''} activos:</p>
        <ul>${dataMail.activos}</ul>
        <p>Adjunto encontrarás el acta de asignación.</p>
      `;

      const attachments = [{
        filename: `acta_asignacion_${dataMail.nameUser}.pdf`,
        path: dataMail.path,
      }];

      // Enviar a usuario y analista
      await this.sendMail({
        from: `"Activos TI" <${config.emailUser}>`,
        to: dataMail.to, // El correo del usuario
        subject: `Confirmación de asignación`,
        html: mailBody,
        attachments
      });

      return { estado: "exito", message: "Asignación confirmada correctamente", actaPath: dataMail.path };
    }
  }

  async sendMail(options) {
    try {
      console.log('Enviando correo desde:', config.emailUser, '->', options.to, 'Asunto:', options.subject);
      const info = await this.transporter.sendMail(options);
      console.log("✅ Correo enviado:", info.messageId, 'respuesta:', info.response || 'n/a');
      return info;
    } catch (error) {
      console.error("❌ Error enviando correo:", error && error.response ? error.response : error);
      throw error;
    }
  }
}

module.exports = NotifcacionService;