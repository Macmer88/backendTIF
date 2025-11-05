import nodemailer from 'nodemailer';
import createError from 'http-errors';

let transporter;

export async function configurarNodemailer() {
    try {
        // 1. Crear una cuenta de prueba en Ethereal
        const testAccount = await nodemailer.createTestAccount();

        // 2. Imprimir las credenciales en la consola
        console.log('--- CREDENCIALES DE EMAIL (ETHEREAL) ---');
        console.log('Servidor de prueba listo.');
        console.log('Usuario:', testAccount.user);
        console.log('Contraseña:', testAccount.pass);
        console.log('-----------------------------------------');

        // 3. Configurar el "transporter" (cómo nos conectamos)
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // Usuario de Ethereal
                pass: testAccount.pass, // Contraseña de Ethereal
            },
        });

    } catch (error) {
        console.error("Error al configurar Ethereal:", error);
    }
}


//Envía un email de confirmación de reserva.

export async function enviarNotificacionReserva(datosReserva, datosCliente, datosAdminEmail) {
    if (!transporter) {
        console.error("Error: El servicio de notificaciones no está inicializado.");
        return; 
    }

    // --- 1. Email para el Cliente ---
    const mailCliente = {
        from: '"Gestión de Salones" <no-reply@salones.com>',
        
        // --- ESTA ES LA CORRECCIÓN ---
        to: datosCliente.nombre_usuario, // Usamos nombre_usuario en lugar de email
        // --- FIN DE LA CORRECCIÓN ---
        
        subject: `¡Reserva Confirmada! (ID: ${datosReserva.reserva_id})`,
        text: `Hola ${datosCliente.nombre}, tu reserva para el ${datosReserva.fecha_reserva} ha sido confirmada.`,
        html: `
            <h1>¡Reserva Confirmada!</h1>
            <p>Hola <b>${datosCliente.nombre}</b>,</p>
            <p>Tu reserva para el salón <b>${datosReserva.salon_titulo}</b> el día <b>${datosReserva.fecha_reserva}</b> ha sido creada con éxito.</p>
            <p>Temática: ${datosReserva.tematica}</p>
            <p>Importe Total: $${datosReserva.importe_total}</p>
            <p>¡Gracias por elegirnos!</p>
        `,
    };

    // --- 2. Email para el Admin ---
    const mailAdmin = {
        from: '"Sistema (Gestión de Salones)" <sistema@salones.com>',
        to: datosAdminEmail,
        subject: `NUEVA RESERVA CREADA (ID: ${datosReserva.reserva_id})`,
        text: `Se ha creado una nueva reserva. Cliente: ${datosCliente.nombre} ${datosCliente.apellido}. Fecha: ${datosReserva.fecha_reserva}.`,
        html: `
            <h1>Notificación de Nueva Reserva</h1>
            <p>Se ha creado una nueva reserva en el sistema:</p>
            <ul>
                <li><b>ID Reserva:</b> ${datosReserva.reserva_id}</li>
                
                <li><b>Cliente:</b> ${datosCliente.nombre} ${datosCliente.apellido} (Email: ${datosCliente.nombre_usuario})</li>
                
                <li><b>Fecha:</b> ${datosReserva.fecha_reserva}</li>
                <li><b>Salón:</b> ${datosReserva.salon_titulo}</li>
                <li><b>Importe:</b> $${datosReserva.importe_total}</li>
            </ul>
        `,
    };

    try {
        // 3. Enviamos ambos emails
        const infoCliente = await transporter.sendMail(mailCliente);
        const infoAdmin = await transporter.sendMail(mailAdmin);

        // 4. Imprimimos los enlaces de Ethereal para ver los emails de prueba
        console.log('Email de Cliente enviado. URL de Ethereal:', nodemailer.getTestMessageUrl(infoCliente));
        console.log('Email de Admin enviado. URL de Ethereal:', nodemailer.getTestMessageUrl(infoAdmin));

    } catch (error) {
        console.error("Error al enviar emails:", error);
        // No lanzamos un error (throw)
    }
}