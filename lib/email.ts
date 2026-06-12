import nodemailer from 'nodemailer'

const FROM_NAME = 'Dunany Concert Series'

function getTransporter() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) return null
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}

export async function sendTestEmail(toEmail: string): Promise<{ ok: boolean; error?: string }> {
  const transporter = getTransporter()
  if (!transporter) {
    return { ok: false, error: 'GMAIL_USER or GMAIL_APP_PASSWORD is not set in environment variables.' }
  }

  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: 'Dunany Concert Series — Email Test',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#333">
          <h2 style="color:#92400e">Email configuration working ✓</h2>
          <p>This is a test message from the Dunany Concert Series admin panel.</p>
          <p>Capacity alert emails will be sent to this address when events reach 80%, 90%, and 100% capacity.</p>
        </div>
      `,
    })
    return { ok: true }
  } catch (err) {
    return { ok: false, error: String(err) }
  }
}

export async function sendCapacityAlert({
  toEmail,
  eventName,
  ticketCount,
  maxCapacity,
  threshold,
}: {
  toEmail: string
  eventName: string
  ticketCount: number
  maxCapacity: number
  threshold: number
}) {
  const transporter = getTransporter()
  if (!transporter) {
    console.warn('[email] GMAIL_USER or GMAIL_APP_PASSWORD not set — skipping capacity alert')
    return
  }

  const pct = Math.round((ticketCount / maxCapacity) * 100)
  const subject =
    threshold === 100
      ? `SOLD OUT: ${eventName} is now full`
      : `${threshold}% Capacity Alert — ${eventName}`

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#333">
      <h2 style="color:#92400e">${subject}</h2>
      <p><strong>${eventName}</strong> has reached <strong>${pct}% capacity</strong>.</p>
      <table style="border-collapse:collapse;width:100%;margin:16px 0">
        <tr>
          <td style="padding:8px 12px;background:#fef3c7;font-weight:600">Tickets sold</td>
          <td style="padding:8px 12px;background:#fef3c7">${ticketCount} / ${maxCapacity}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px">Remaining</td>
          <td style="padding:8px 12px">${maxCapacity - ticketCount}</td>
        </tr>
      </table>
      ${
        threshold === 100
          ? '<p style="color:#b91c1c;font-weight:600">Registration has been automatically closed.</p>'
          : `<p>There are <strong>${maxCapacity - ticketCount} spots</strong> remaining.</p>`
      }
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
      <p style="color:#9ca3af;font-size:12px">Dunany Country Club Performance Series — automated capacity notification</p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject,
      html,
    })
    console.log(`[email] Capacity alert sent: ${subject} → ${toEmail}`)
  } catch (err) {
    console.error('[email] Failed to send capacity alert:', err)
  }
}
