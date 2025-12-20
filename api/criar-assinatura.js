import { MercadoPagoConfig, PreApproval } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const preApproval = new PreApproval(client);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email é obrigatório" });
  }

  try {
    const subscription = await preApproval.create({
      body: {
        reason: "Assinatura VetAgro AI Pro",
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 49.9,
          currency_id: "BRL",
        },
        payer_email: email,
        back_url: "https://app.vetagroai.com.br/assinatura-confirmada",
        status: "pending",
      },
    });

    return res.status(200).json({
      init_point: subscription.init_point,
      id: subscription.id,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
