import { Resend } from 'resend';
import { contactSchema } from '@/lib/validations/contact';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, canal, contacto } =
      contactSchema.parse(body);

    await resend.emails.send({
      from: 'FRACTAE <noreply@amoxtli.tech>',
      to: ['hello@amoxtli.tech'],
      subject: `Nueva solicitud de demo — ${nombre}`,
      html: `
        <h2>Nueva solicitud de demo</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Canal:</strong> ${canal}</p>
        <p><strong>Contacto:</strong> ${contacto}</p>
        <p><strong>Fecha:</strong>
          ${new Date().toLocaleString('es-MX')}</p>
      `,
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Error al enviar el mensaje' },
      { status: 500 }
    );
  }
}
