import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM = process.env.RESEND_FROM ?? 'Dunany Concert Series <noreply@dunany.ca>'

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
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — skipping capacity alert')
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
    await resend.emails.send({
      from: FROM,
      to: toEmail,
      subject,
      html,
    })
  } catch (err) {
    console.error('[email] Failed to send capacity alert:', err)
  }
}
