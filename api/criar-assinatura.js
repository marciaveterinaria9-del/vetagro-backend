import { MercadoPagoConfig, PreApproval } from "mercadopago";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email é obrigatório" });
    }

    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN
    });

    const preapproval = new PreApproval(client);

    const response = await preapproval.create({
      reason: "Assinatura VetAgro AI",
      payer_email: email,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: 29.9,
        currency_id: "BRL"
      },
      back_url: "https://vetagro.ai/obrigado",
      status: "pending"
    });

    return res.status(200).json({
      message: "Assinatura criada com sucesso",
      init_point: response.init_point
    });
  } catch (error) {
  console.error("Erro Mercado Pago:", error);

  return res.status(500).json({
    error: "Erro ao criar assinatura",
    detalhes: error.message || error
  });
}
