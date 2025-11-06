import PDFDocument from 'pdfkit';
import * as modeloReportes from '../databases/modelo_reportes.js';

function sanitizarDatos(datos) {
    if (!datos || datos.length === 0) return [];
    
    return datos.map(fila => {
        const filaLimpia = {};
        for (const key in fila) {
            // Reemplazamos cualquier NULL o undefined con una string vacía
            filaLimpia[key] = fila[key] === null || fila[key] === undefined ? '' : fila[key];
        }
        return filaLimpia;
    });
}

export async function obtenerDatosReporte() {
    const datos = await modeloReportes.obtenerReporteReservasDetallado();
    return sanitizarDatos(datos); // Aplicamos la sanitización
}

export async function generarReportePDF(datos, res) {
    const doc = new PDFDocument({
        size: 'A4', 
        layout: 'landscape', 
        margin: 50,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_reservas.pdf"');
    doc.pipe(res);

    
    doc.fontSize(18).text('Reporte Detallado de Reservas', { align: 'center' });
    doc.moveDown();

    // Lógica de Dibujo PDF (ajustada para que use los mismos campos)
    const dibujarFila = (fila, y, fontSize = 8) => {
        doc.fontSize(fontSize)
            .text(fila.reserva_id, 50, y, { width: 30 })
            .text(new Date(fila.fecha_reserva).toLocaleDateString('es-AR'), 80, y, { width: 60 })
            .text(fila.salon_titulo, 140, y, { width: 100 })
            .text(`${fila.turno_desde} - ${fila.turno_hasta}`, 240, y, { width: 60 })
            .text(`${fila.cliente_nombre} ${fila.cliente_apellido}`, 300, y, { width: 100 })
            .text(`$${fila.importe_total}`, 400, y, { width: 60 })
            .text(fila.servicios_contratados.substring(0, 50), 460, y, { width: 300 });
    };

    const cabeceras = {
        reserva_id: 'ID',
        fecha_reserva: 'Fecha',
        salon_titulo: 'Salón',
        turno_desde: 'Turno',
        cliente_nombre: 'Cliente',
        importe_total: 'Importe',
        servicios_contratados: 'Servicios Contratados',
    };
    dibujarFila(cabeceras, doc.y, 10);
    doc.moveDown();

    datos.forEach(reserva => {
        dibujarFila(reserva, doc.y);
        doc.moveDown();
    });

    doc.end();
}


/* --- INICIO SECCIÓN REPORTES DASHBOARD --- */


/**
 * Genera un PDF del reporte de Facturación Mensual.
 */
export async function generarPDFFacturacion(datos, res) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_facturacion.pdf"');
    doc.pipe(res);

    // Título
    doc.fontSize(18).text('Reporte de Facturación Mensual', { align: 'center' });
    doc.moveDown();

    // Cabeceras
    const yInicial = doc.y;
    doc.fontSize(10).text('Año', 50, yInicial, { width: 150, bold: true });
    doc.text('Mes', 200, yInicial, { width: 150, bold: true });
    doc.text('Total Facturado', 350, yInicial, { align: 'right', width: 150, bold: true });
    doc.moveDown();

    // Datos
    datos.forEach(fila => {
        const y = doc.y;
        doc.fontSize(9).text(fila.Anio, 50, y, { width: 150 });
        doc.text(fila.Mes, 200, y, { width: 150 });
        doc.text(`$${fila.Total_Facturado}`, 350, y, { align: 'right', width: 150 });
        doc.moveDown();
    });

    doc.end();
}


/**
 * Genera un PDF del reporte de Salones Populares.
 */
export async function generarPDFSalones(datos, res) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_salones_populares.pdf"');
    doc.pipe(res);

    // Título
    doc.fontSize(18).text('Reporte de Salones Más Populares', { align: 'center' });
    doc.moveDown();

    // Cabeceras
    const yInicial = doc.y;
    doc.fontSize(10).text('Nombre del Salón', 50, yInicial, { width: 300, bold: true });
    doc.text('Total de Reservas', 400, yInicial, { align: 'right', width: 100, bold: true });
    doc.moveDown();

    // Datos
    datos.forEach(fila => {
        const y = doc.y;
        doc.fontSize(9).text(fila.Salon, 50, y, { width: 300 });
        doc.text(fila.Total_Reservas, 400, y, { align: 'right', width: 100 });
        doc.moveDown();
    });

    doc.end();
}


/**
 * Genera un PDF del reporte de Servicios Populares.
 */
export async function generarPDFServicios(datos, res) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_servicios_populares.pdf"');
    doc.pipe(res);

    // Título
    doc.fontSize(18).text('Reporte de Servicios Más Populares', { align: 'center' });
    doc.moveDown();

    // Cabeceras
    const yInicial = doc.y;
    doc.fontSize(10).text('Descripción del Servicio', 50, yInicial, { width: 300, bold: true });
    doc.text('Total de Contrataciones', 400, yInicial, { align: 'right', width: 100, bold: true });
    doc.moveDown();

    // Datos
    datos.forEach(fila => {
        const y = doc.y;
        doc.fontSize(9).text(fila.Servicio, 50, y, { width: 300 });
        doc.text(fila.Total_Contrataciones, 400, y, { align: 'right', width: 100 });
        doc.moveDown();
    });

    doc.end();
}


/**
 * Genera un PDF del reporte de Turnos Populares.
 */
export async function generarPDFTurnos(datos, res) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_turnos_populares.pdf"');
    doc.pipe(res);

    // Título
    doc.fontSize(18).text('Reporte de Turnos Más Populares', { align: 'center' });
    doc.moveDown();

    // Cabeceras
    const yInicial = doc.y;
    doc.fontSize(10).text('Orden', 50, yInicial, { width: 50, bold: true });
    doc.text('Horario del Turno', 150, yInicial, { width: 200, bold: true });
    doc.text('Total de Reservas', 400, yInicial, { align: 'right', width: 100, bold: true });
    doc.moveDown();

    // Datos
    datos.forEach(fila => {
        const y = doc.y;
        doc.fontSize(9).text(fila.Orden, 50, y, { width: 50 });
        doc.text(fila.Turno, 150, y, { width: 200 });
        doc.text(fila.Total_Reservas, 400, y, { align: 'right', width: 100 });
        doc.moveDown();
    });

    doc.end();
}