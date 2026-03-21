export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Contacto INGAP <onboarding@resend.dev>',
        to: ['pazgustavoadrian@gmail.com'],
        reply_to: email,
        subject: `Contacto desde ingap — ${nombre}`,
        text: `Nombre: ${nombre}\nEmail: ${email}\n\n${mensaje}`
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Error de Resend');
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
