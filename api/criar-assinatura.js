import { MercadoPagoConfig, PreApproval } from "mercadopago";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ erro: "Email é obrigatório" });
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
      return_url: "https://vetagro.ai/obrigado"
    });

    return res.status(200).json({
      mensagem: "Assinatura criada com sucesso",
      link_pagamento: response.init_point
    });

  } catch (erro) {
    console.error("Erro Mercado Pago:", erro);
    return res.status(500).json({
      erro: "Erro ao criar assinatura",
      detalhes: erro.message
    });
  }
}
