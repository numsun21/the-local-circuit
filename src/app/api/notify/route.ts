import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { name, email, school, city, title } = await req.json()
  
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: ['numsoni2009@gmail.com', 'esshank99@gmail.com'],
    subject: `New submission: ${title}`,
    html: `
      <h2>New Story Submission</h2>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>School:</strong> ${school}</p>
      <p><strong>City:</strong> ${city}</p>
      <br/>
      <p><a href="https://the-local-circuit.vercel.app/admin">Review in Admin →</a></p>
    `
  })

  return NextResponse.json({ success: true })
}
