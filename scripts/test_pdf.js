const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

(async () => {
  try {
    const dir = path.resolve(__dirname, '../public/actas');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const outputPath = path.join(dir, `acta_test.pdf`);
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    doc.fontSize(18).text('Acta de Entrega (Prueba)', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Usuario: Prueba Usuario`);
    doc.text(`Cédula: 00000000`);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    doc.fontSize(14).text('Elementos:', { underline: true });
    doc.moveDown(0.5);

    const activos = [
      { serial: 'S12345', tipo: 'Laptop', placa: 'P-001' },
      { serial: 'S67890', tipo: 'Monitor', placa: 'P-002' }
    ];

    activos.forEach((item, idx) => {
      doc.fontSize(12).text(`${idx + 1}. Serial: ${item.serial}`);
      doc.text(`   Tipo: ${item.tipo}`);
      doc.text(`   Placa: ${item.placa}`);
      doc.moveDown(0.5);
    });

    doc.end();

    stream.on('finish', () => {
      console.log('PDF generado en:', outputPath);
      process.exit(0);
    });

    stream.on('error', (err) => {
      console.error('Error escribiendo PDF:', err);
      process.exit(1);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
