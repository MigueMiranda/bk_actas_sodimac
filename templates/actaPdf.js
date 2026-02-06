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

        // ===== CONFIGURACIÓN BASE =====
        const margin = doc.page.margins.left;
        const pageWidth = doc.page.width;
        const firmaWidth = 220;

        // ===== ENCABEZADO =====
        doc
            .fontSize(16)
            .text('ACTA DE ASIGNACIÓN DE ACTIVOS TI', { align: 'center' })
            .moveDown(1.5);

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
            .text(`Usuario: ${responsable.usuario}`)
            .moveDown();

        // ===== TABLA ACTIVOS =====
        doc
            .fontSize(12)
            .text('Activos asignados', { underline: true, align: 'center' })
            .moveDown(0.8);

        const tableTop = doc.y;
        const colWidths = [180, 120, 120];
        const tableWidth = colWidths.reduce((a, b) => a + b, 0);
        const startX = (doc.page.width - tableWidth) / 2;
        const rowHeight = 20;

        // ===== ENCABEZADOS =====
        const headers = ['Serial', 'Tipo', 'Placa'];

        headers.forEach((header, i) => {
            const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);

            doc
                .rect(x, tableTop, colWidths[i], rowHeight)
                .stroke();

            doc.text(header, x, tableTop + 5, {
                width: colWidths[i],
                align: 'center'
            });
        });

        // ===== FILAS =====
        let y = tableTop + rowHeight;

        activos.forEach((a) => {
            const row = [a.serial, a.tipo, a.placa];

            row.forEach((cell, i) => {
                const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);

                doc
                    .rect(x, y, colWidths[i], rowHeight)
                    .stroke();

                doc.text(String(cell || ''), x, y + 5, {
                    width: colWidths[i],
                    align: 'center'
                });
            });

            y += rowHeight;
        });

        doc.moveDown(2);

        // ===== DECLARACIÓN =====
        doc
            .fontSize(7)
            .text(
                '1. Los equipos y software entregados, así como los documentos que se produzcan con ellos son propiedad exclusiva de Sodimac y constituyen herramienta de trabajo. 2. Los  equipos y/o software arriba relacionados deben ser utilizados únicamente para tareas relacionadas con el negocio de la compañía, y abstenerse de almacenar o enviar cualquier tipo  de información que no esté relacionada con el giro ordinario de las funciones, así como abstenerse de utilizar el sistema para acceder a sitios de dudosa calidad o de índole  racista, pornográfica o violenta. 3. Reportar al help- desk toda clase de problemas presentados en el hardware, software e infraestructura. 4. Solicitar oportunamente al área de  tecnología correspondiente, los cambios requeridos en los sistemas o la infraestructura. Esto incluye los movimientos de equipos y reasignaciones de cuentas en caso de reorganizaciones  y cambios de puestos. 5. Cumplir con los procedimientos de seguridad que indique el área de tecnología de la empresa. 6. Cuidar la seguridad de las contraseñas (passwords)  asignadas y no compartirlas. 7. No instalar hardware o software, incluyendo actualizaciones vía internet, sin la aprobación del área de tecnología. 8. No conectar equipos ajenos a los de  la empresa, incluyendo equipos o accesorios de propiedad del empleado, así como el de sus proveedores, sin la autorización del área de tecnología. 9. Respaldar la información que tenga almacenada en el equipo. 10. Almacenar los respaldos de información dentro de la empresa, en los medios y equipos propiedad de la empresa, nunca vía internet, ni en los medios  o equipos de propiedad del empleado o terceros. 11. Depurar periódicamente la información contenida en el equipo y cuenta de correo electrónico. 12. Cuando el equipo  sea reemplazado, permitir únicamente la transferencia de los datos contenidos en el equipo por personal autorizado del área de tecnología. 13. Desinfectar sistemáticamente los  archivos que provengan del exterior con software antivirus (provisto por informática) y en todo caso antes de usarlos en la empresa. 14. No incurrir en prácticas de piratería de software  o violación de derechos de autor. De hacerlo, las consecuencias serán responsabilidad del empleado. 15. Encriptar los archivos que contengan información confidencial de la empresa. 16. Abstenerse de compartir información de la compañía, ya sea de carácter confidencial o de cualquier otro tipo, a terceras personas no autorizadas por ésta. 17. Seguir las  instrucciones de uso y operación del equipo que el fabricante o la Jefatura de tecnología indiquen. 18. Cualquier instalación de software que no sea contemplada por el área de tecnología,  es responsabilidad del usuario responder por la respectiva licencia. 19. Reportar inmediatamente a la empresa el siniestro sobre el equipo (pérdida, robo o grave deterioro) y producir  las actas que se requieran. En caso de negligencia, el área de recursos humanos determinará la responsabilidad del usuario sobre el costo del reemplazo. 20. El manejo de la información  y el backup serán responsabilidad del usuario y a partir de la entrega del equipo se tendrán tres días hábiles para la revisión de la integridad de la información y pasados estos tres  días se procederá al borrado seguro de la información 21. El usuario se compromete a realizar la lectura de la Política de Seguridad de la Información de la Organización, ubicada en  la intranet, bajo la siguiente URL http://portalsodimac/Nuestras%20Politicas/Corporativas.aspx. 22. Los elementos referenciados en este documento se encuentra en perfecto estado,  al igual que sus accesorios. 23. El colaborador declara y acepta que los elementos referenciados en este documento que le entrega temporalmente SODIMAC COLOMBIA S.A es  una herramienta de trabajo y que se encuentra bajo su responsabilidad directa y personal, en el momento en que por descuido o negligencia del colaborador, la totalidad del equipo  o alguno de los elementos que lo integran sea extraviado, dañado por uso inadecuado o hurtado, el valor de la reposición del mismo será de cargo exclusivo de él. Por tanto,  El colaborador pagará a nombre de SODIMAC COLOMBIA S.A., el valor del equipo consignado en la presente acta por medio de consignación bancaria o transferencia a la  cuenta recaudadora de la Compañía. 24. De la misma forma, en caso de daño imputable a la responsabilidad del Colaborador por descuido, uso indebido o malos tratamientos,  se compromete a asumir el costo de la reparación del mismo en su totalidad, autorizando a SODIMAC COLOMBIA S.A. a elegir el proveedor técnicamente apto para dicho arreglo. 25.  En cualquier caso, el colaborador AUTORIZA expresamente a SODIMAC COLOMBIA S.A., para que en el evento que termine su contrato de trabajo con la compañía, se descuente  de cualquier derecho laboral que le pueda corresponder de carácter salarial, prestacional o indemnizatorio, el valor de la totalidad del 100% del equipo firmado en la presente  acta. Únicamente en el caso en que el equipo no sea restituido a la compañía inmediatamente. Señor usuario, tenga en cuenta que, al firmar la presente acta, confirma que entiende  y acepta las políticas que aquí se describen, así mismo la recepción y aceptación del equipo con sus características, configuraciones, aplicaciones e información  almacenada. Tenga en cuenta que a partir de este momento cuenta con siete (7) días calendario para presentar novedades o solicitudes referentes a los aspectos descritos  anteriormente mencionados, luego de transcurrido este tiempo, el equipo de tecnología, no se hace responsable por la recuperación de información alojada en el equipo que se  le reemplazo.',
                margin, doc.y, {
                width: pageWidth - margin * 2,
                align: 'justify'
            }
            )

        doc.moveDown(3);

        // ===== SALTO DE PÁGINA SI NO CABE FIRMA =====
        if (doc.y > doc.page.height - 150) {
            doc.addPage();
        }

        const yFirma = doc.y;
        const leftX = margin;
        const rightX = pageWidth - margin - firmaWidth;

        // ===== NOMBRES =====
        doc.text(responsable.nombre, leftX, yFirma, {
            width: firmaWidth,
            align: 'center'
        });

        doc.text('Miguel Angel Miranda Manjarres', rightX, yFirma, {
            width: firmaWidth,
            align: 'center'
        });

        // ===== LÍNEAS DE FIRMA =====
        const lineaY = doc.y + 5;

        doc.moveTo(leftX, lineaY)
            .lineTo(leftX + firmaWidth, lineaY)
            .stroke();

        doc.moveTo(rightX, lineaY)
            .lineTo(rightX + firmaWidth, lineaY)
            .stroke();

        // ===== LABELS =====
        doc.text('Firma responsable', leftX, lineaY + 8, {
            width: firmaWidth,
            align: 'center'
        });

        doc.text('Firma analista TI', rightX, lineaY + 8, {
            width: firmaWidth,
            align: 'center'
        });

        // ===== FINALIZAR PDF =====
        doc.end();

        stream.on('finish', () => resolve(outputPath));
        stream.on('error', reject);
    });
}

module.exports = { generarActaPDF };
