import { createClient } from '@/lib/supabase/server'
import { contactSchema } from '@/lib/validations/contact'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body   = await req.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', success: false },
        { status: 400 }
      )
    }

    const { nombre, canal, contacto } = parsed.data
    const supabase = await createClient()

    const { error: dbError } = await supabase
      .from('leads')
      .insert({ nombre, canal, contacto, estado: 'nuevo' })

    if (dbError) throw new Error(dbError.message)

    await resend.emails.send({
      from:    'FRACTAE <noreply@amoxtli.tech>',
      to:      ['sales@fractae.mx'],
      subject: `Nueva solicitud de demo — ${nombre}`,
      html: `
        <h2>Nueva solicitud de demo</h2>
        <table>
          <tr><td><b>Nombre:</b></td><td>${nombre}</td></tr>
          <tr><td><b>Canal:</b></td><td>${canal}</td></tr>
          <tr><td><b>Contacto:</b></td><td>${contacto}</td></tr>
          <tr><td><b>Fecha:</b></td><td>${new Date().toLocaleString('es-MX')}</td></tr>
        </table>
        <p>Ver en el panel admin: https://fractae.com/es/admin/leads</p>
      `,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Error interno', success: false },
      { status: 500 }
    )
  }
}
