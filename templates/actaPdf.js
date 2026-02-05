const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generarActaPDF({ responsable, activos, ubicacion, asignacionId }) {
    return new Promise((resolve, reject) => {
        const outputPath = path.join(
            __dirname,
            `../public/actas/acta_${asignacionId}.pdf`
        );

        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(outputPath);

        doc.pipe(stream);

        // ===== ENCABEZADO =====
        doc
            .fontSize(16)
            .text('ACTA DE ASIGNACIÓN DE ACTIVOS TI', { align: 'center' })
            .moveDown(1);

        doc
            .fontSize(10)
            .text(`Fecha: ${new Date().toLocaleDateString()}`)
            .text(`Ubicación: ${ubicacion}`)
            .moveDown();

        // ===== DATOS RESPONSABLE =====
        doc
            .fontSize(12)
            .text('Datos del responsable', { underline: true })
            .moveDown(0.5);

        doc
            .fontSize(10)
            .text(`Nombre: ${responsable.nombre}`)
            .text(`Cédula: ${responsable.cedula}`)
            .text(`Cargo: ${responsable.cargo}`)
            .moveDown();

        // ===== LISTA DE ACTIVOS =====
        doc
            .fontSize(12)
            .text('Activos asignados', { underline: true })
            .moveDown(0.5);

        activos.forEach((a, index) => {
            doc
                .fontSize(10)
                .text(
                    `${index + 1}. Serial: ${a.serial} | Tipo: ${a.tipo} | Placa: ${a.placa}`
                );
        });

        doc.moveDown(2);

        // ===== FIRMA =====
        doc.text('______________________________');
        doc.text('Firma del responsable');

        doc.end();

        stream.on('finish', () => resolve(outputPath));
        stream.on('error', reject);
    });
}

module.exports = { generarActaPDF };
