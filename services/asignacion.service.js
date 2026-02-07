const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const { config } = require("../config/config");
const crypto = require("crypto");
const { models } = require("../libs/sequelize");
const boom = require('@hapi/boom');


const NotificacionService = require("./notificacion.service");
const service = new NotificacionService();
const { generarActaPDF } = require('./../templates/actaPdf');

class AsignacionService {
  async aprobarAsignment(activos, contacto, ubicacion) {
    console.log("Enviando notificación de asignación...");
    console.log("Activo:", activos);
    console.log("Contacto:", contacto);
    console.log("Ubicación:", ubicacion);

    const token = crypto.randomUUID();
    const contactoData = Array.isArray(contacto) ? contacto[0] : contacto;
    const ubicacionData = Array.isArray(ubicacion) ? ubicacion[0] : ubicacion;

    // 1. Crear la asignación
    const asignacion = await models.Asignaciones.create({
      contacto_id: contactoData.cedula,
      estado_asignacion: "pendiente",
      token,
      tokenExpire: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    const oldElemento = [];

    // 2. Registrar los activos asociados (movimientos)
    for (const a of activos) {
      await models.Movimiento.create({
        serial: a.serial,
        contactoId: contactoData.cedula,
        caso: "pendiente",
        acta: "pendiente",
        estadoElemento: ubicacion.estado,
        tiendaId: ubicacion.tiendaId,
        ubicacionElemento: ubicacion.ubicacion,
        estadoAsignacion: "pendiente",
        asignacionId: asignacion.id,
      });

      const elemento = await models.Elemento.findOne({
        where: { serial: a.serial },
      });
      if (elemento) {
        oldElemento.push(elemento);
      }
    }

    // 3. Validar si debe enviarse el correo
    const huboCambioUsuario = oldElemento.some(
      (e) => e.user_id !== contactoData.cedula
    );

    const estadoEsAsignado = ubicacionData?.estado === "Asignado";

    if (huboCambioUsuario && estadoEsAsignado) {
      // 4. Armar HTML del correo
      const listaHtml = activos
        .map(
          (a) => `
        <li>
          <strong>Serial:</strong> ${a.serial}<br/>
          <strong>Tipo:</strong> ${a.tipo}<br/>
          <strong>Placa:</strong> ${a.placa}
        </li>
      `
        )
        .join("");

      const mailOptions = {
        to: 'mmiranda@homecenter.co',
        nameUser: contactoData.nombre,
        activos: listaHtml,
        Ubicación: ubicacionData?.ubicacion,
        token: token,
      };
      console.log('Mail: ', mailOptions)
      return await service.mailOptions(mailOptions, "aprobacion");
    } else {
      const notificacion = false;
      this.confirmAsignment(token, 'aprobado', notificacion)
      console.log("No se envía correo porque no hay cambios de usuario o estado ≠ 'Asignado'.");
      return { message: "No se requiere notificación por correo." };
    }
  }

  async confirmAsignment(token, respuesta, notificacion) {
    // ✅ Validar parámetros de entrada
    if (!token || !respuesta) {
      throw boom.badRequest("Token y respuesta son requeridos");
    }

    // ✅ Buscar asignación
    const asignacion = await models.Asignaciones.findOne({
      where: { token },
      include: [
        {
          model: models.Movimiento,
          as: "elementos",
          include: [
            {
              model: models.Elemento,
              as: "elemento",
            },
          ],
        },
        {
          model: models.User,
          as: "users",
        },
      ],
    });

    // ✅ VALIDACIÓN CRÍTICA UNIFICADA - exactamente como la tenías originalmente
    // Solo puede procesar si: existe, está pendiente Y el token NO ha expirado
    if (
      !asignacion ||
      asignacion.estado_asignacion !== "pendiente" ||
      (asignacion.tokenExpire && new Date(asignacion.tokenExpire) < new Date())
    ) {
      throw boom.badRequest("Token expirado o asignación ya confirmada");
    }

    // === CASO APROBADO ===
    if (respuesta === "aprobado") {
      const elementos = asignacion.elementos.map((e) => ({
        serial: e.serial,
        placa: e.elemento?.placa,
        descripcion: e.elemento?.tipo || "Sin descripción",
        ubicacion: e.elemento?.ubicacion,
        marca: e.elemento?.fabricante,
        modelo: e.elemento?.modelo,
      }));

      const ubicacion = elementos[0]?.ubicacion || "Sin ubicación";
      let actaPath = "N/A";

      if (notificacion) {
        actaPath = await this.generarActaPDF(
          asignacion.users,
          elementos,
          ubicacion,
          asignacion.id
        );
      }

      // ✅ Esperar todas las actualizaciones de forma secuencial
      await this.updateMovimiento(
        asignacion.id,
        "aprobado",
        "generado",
        actaPath
      );

      const datosMovimiento = await models.Movimiento.findAll({
        where: { asignacionId: asignacion.id },
      });

      await this.updateElemento(datosMovimiento);

      // ✅ CRÍTICO: Esta actualización cambia el estado de "pendiente" a "aprobado"
      await this.updateAsignacion(asignacion.id, "aprobado", actaPath);

      if (notificacion) {
        await this.notificacion(elementos, asignacion, actaPath);
      }

      return { message: "Asignación confirmada exitosamente." };
    }

    // === CASO RECHAZADO ===
    else if (respuesta === "rechazado") {
      await this.updateMovimiento(
        asignacion.id,
        "rechazado",
        "Rechazado por el usuario",
        "N/A"
      );

      // ✅ CRÍTICO: Esta actualización cambia el estado de "pendiente" a "rechazado"
      await this.updateAsignacion(asignacion.id, "rechazado", "N/A");

      if (notificacion) {
        await this.notificacion(null, asignacion, "N/A");
      }

      return { message: "Asignación rechazada." };
    }

    // === RESPUESTA INVÁLIDA ===
    else {
      throw boom.badRequest("Respuesta inválida. Use 'aprobado' o 'rechazado'");
    }
  }

  async generarActaPDF(contacto, activos, ubicacion, asignacionId) {
    console.log("Responsable: ", contacto)
    console.log("Activos para el acta: ", activos)
    return await generarActaPDF({
      responsable: {
        nombre: contacto.name,
        cedula: contacto.id,
        cargo: contacto.cargo,
        username: contacto.username
      },
      activos,
      ubicacion,
      asignacionId,
    });
  }

  async updateMovimiento(asignacionId, estadoAsignacion, caso, acta) {
    return await models.Movimiento.update(
      {
        estadoAsignacion: estadoAsignacion,
        caso: caso,
        acta: acta,
      },
      {
        where: { asignacionId: asignacionId },
      }
    );
  }

  async updateElemento(datosElemento) {
    for (const a of datosElemento) {
      await models.Elemento.update(
        {
          ubicacion: a.ubicacionElemento,
          estado: a.estadoElemento,
          userId: a.contactoId,
          tiendaId: a.tiendaId,
        },
        {
          where: { serial: a.serial },
        }
      );
    }
  }

  async updateAsignacion(id, estado, acta) {
    return await models.Asignaciones.update(
      {
        estado_asignacion: estado,
        acta: acta,
      },
      {
        where: { id: id },
      }
    );
  }

  async notificacion(elementos, asignacion, actaPath) {
    if (elementos) {
      const elementosHtml = elementos
        .map(
          (e) => `
            <li>
              <strong>Serial:</strong> ${e.serial}<br/>
              <strong>Tipo:</strong> ${e.descripcion}<br/>
              <strong>Placa:</strong> ${e.placa}<br/>
            </li>
            <p>Ubicación: ${e.ubicacion || "Sin ubicación"}.</p>
          `
        )
        .join("");

      const mailOptions = {
        to: "mmiranda@homecenter.co",
        nameUser: asignacion.users.nombre,
        elementos: elementos.length,
        activos: elementosHtml,
        path: actaPath,
      };

      await service.mailOptions(mailOptions, "confirmacion");
      return { estado: "exito", message: "Asignación confirmada correctamente", actaPath };
    }
    const mailOptions = {
      to: "mmiranda@homecenter.co",
      nameUser: asignacion.users.nombre,
    };
    await service.mailOptions(mailOptions, "rechazado");
    return { estado: "error", message: "Asignación rechazada por el usuario" };


  }

  async unpdateDatosTecnicos(datosTecnicos) {
    console.log("Datos tecnicos: ", datosTecnicos);
    return await models.Elemento.update(
      {
        hostname: datosTecnicos.hostname,
        memoria: datosTecnicos.memoria,
        disco: datosTecnicos.disco,
        teclado: datosTecnicos.teclado,
        mause: datosTecnicos.mause,
        ipCableada: datosTecnicos.ipCableada,
        macCableada: datosTecnicos.macCableada,
        ipInalambrica: datosTecnicos.ipInalambrica,
        macInalambrica: datosTecnicos.macInalambrica,
      },
      {
        where: { serial: datosTecnicos.serial },
      }
    );
  }
}

module.exports = AsignacionService;
