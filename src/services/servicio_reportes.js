import PDFDocument from 'pdfkit';
import { createObjectCsvWriter } from 'csv-writer';
import * as modeloReportes from '../databases/modelo_reportes.js';

export async function obtenerDatosReporte() {
    const datos = await modeloReportes.obtenerReporteReservasDetallado();
    return datos;
}

export async function generarReporteCSV(datos, res) {
    const header = [
        { id: 'reserva_id', title: 'ID_RESERVA' },
        { id: 'fecha_reserva', title: 'FECHA' },
        { id: 'salon_titulo', title: 'SALON' },
        { id: 'turno_desde', title: 'DESDE' },
        { id: 'turno_hasta', title: 'HASTA' },
        { id: 'cliente_nombre', title: 'CLIENTE_NOMBRE' },
        { id: 'cliente_apellido', title: 'CLIENTE_APELLIDO' },
        { id: 'importe_total', title: 'IMPORTE' },
        { id: 'servicios_contratados', title: 'SERVICIOS' },
    ];


    const csvWriter = createObjectCsvWriter({
        path: null, 
        header: header,
        alwaysQuote: true,
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_reservas.csv"');

    await csvWriter.writeRecords(res, datos);
    res.end();
}

export async function generarReportePDF(datos, res) {
    // 1. Creamos un nuevo documento PDF
    const doc = new PDFDocument({
        size: 'A4', // Tamaño de hoja
        layout: 'landscape', // Horizontal
        margin: 50,
    });

    // 2. Seteamos los headers de la respuesta para el PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_reservas.pdf"');

    doc.pipe(res);

    
    doc.fontSize(18).text('Reporte Detallado de Reservas', { align: 'center' });
    doc.moveDown();

    const dibujarFila = (fila, y, fontSize = 8) => {
        doc.fontSize(fontSize)
            .text(fila.id, 50, y)
            .text(fila.fecha, 80, y)
            .text(fila.salon, 140, y)
            .text(fila.turno, 240, y)
            .text(fila.cliente, 300, y)
            .text(fila.importe, 400, y)
            .text(fila.servicios.substring(0, 50), 450, y, { width: 320 });
    };

    const cabeceras = {
        id: 'ID',
        fecha: 'Fecha',
        salon: 'Salón',
        turno: 'Turno',
        cliente: 'Cliente',
        importe: 'Importe',
        servicios: 'Servicios Contratados',
    };
    dibujarFila(cabeceras, doc.y, 10);
    doc.moveDown();

    datos.forEach(reserva => {
        const fila = {
            id: reserva.reserva_id,
            fecha: new Date(reserva.fecha_reserva).toLocaleDateString('es-AR'),
            salon: reserva.salon_titulo,
            turno: `${reserva.turno_desde} - ${reserva.turno_hasta}`,
            cliente: `${reserva.cliente_nombre} ${reserva.cliente_apellido}`,
            importe: `$${reserva.importe_total}`,
            servicios: reserva.servicios_contratados || 'N/A',
        };
        dibujarFila(fila, doc.y);
        doc.moveDown();
    });

    doc.end();
}