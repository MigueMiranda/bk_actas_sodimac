const nodemailer = require("nodemailer");

class NotifcacionService {
  async mailOptions(dataMail, tipoNotificacion) {
    const mailOptions = {};
    console.log('dataMail: ', data)
    if (tipoNotificacion === "aprobacion") {
      mailOptions = {
        from: `"Activos TI" <${process.env.EMAIL_USER}>`,
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

      return { message: "Asignación enviada al usuario", token };
    }

    if (tipoNotificacion === "confirmacion") {
      const mailOptionsUser = {
        from: `"Activos TI" <${process.env.EMAIL_USER}>`,
        to: "mmiranda@homecenter.co",
        subject: `Asignacion confirmada correctamente`,
        html: `
        <h3>Hola ${dataMail.nameUser},</h3>
        <p>Has aprobado la asignación de ${dataMail.elementos} activos:</p>
        <ul>${dataMail.activos}</ul>
        <p>Adjunto encontrarás el acta de asignación.</p>
      `,
        attachments: [
          {
            filename: `acta_asignacion_${dataMail.nameUser}.pdf`,
            path: dataMail.path,
          },
        ],
      };

      const mailOptionsAnalista = {
        from: `"Activos TI" <${process.env.EMAIL_USER}>`,
        to: "mmiranda@homecenter.co",
        subject: `Confirmacion de asignación de activos.`,
        html: `
        <h3>Hola,</h3>
        <p>${dataMail.nameUser} Ha aprobado la asignación de ${dataMail.elementos} activos:</p>
        <ul>${dataMail.activos}</ul>
        <p>Adjunto encontrarás el acta de asignación.</p>
      `,
        attachments: [
          {
            filename: `acta_asignacion_${dataMail.nameUser}.pdf`,
            path: dataMail.path,
          },
        ],
      };

      await this.sendMail(mailOptionsUser);
      await this.sendMail(mailOptionsAnalista);

      const actaPath = dataMail.path;

      return { message: "Asignación confirmada correctamente", actaPath };
    }

    if (tipoNotificacion === "confirmacion") {
        const mailOptionsAnalista = {
        from: `"Activos TI" <${process.env.EMAIL_USER}>`,
        to: dataMail.to,
        subject: `Confirmacion de asignación de activos.`,
        html: `
        <h3>Hola,</h3>
        <p>${dataMail.nameUser} Ha rechazado la asignación de activos:</p>
        <p>Valida nuevamente la informacion y genera una nueva asignacion</p>
      `,
      };

      await this.sendMail(mailOptionsAnalista);

      return { message: "Asignación rechazada por el usuario" };
    }
  }

  sendMail(mailOptions) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    return transporter
      .sendMail(mailOptions)
      .then((info) => {
        console.log("Correo enviado:", info.messageId);
        return info;
      })
      .catch((error) => {
        console.error("Error enviando correo:", error);
        throw error;
      });
  }
}

module.exports = NotifcacionService;
