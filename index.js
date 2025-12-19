const express = require("express");
const mercadopago = require("mercadopago");

const app = express();
app.use(express.json());

// Configura Mercado Pago com variável de ambiente
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

// Rota de teste
app.get("/", (req, res) => {
  res.send("Backend VetAgro AI ativo 🚀");
});

// Criar assinatura
app.post("/criar-assinatura", async (req, res) => {
  try {
    const { email } = req.body;

    const subscription = await mercadopago.preapproval.create({
      payer_email: email,
      reason: "VetAgro AI - Plano Pro",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: 49.9,
        currency_id: "BRL",
      },
      back_url: "https://app.vetagroai.com.br",
    });

    res.json({
      init_point: subscription.body.init_point,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar assinatura" });
  }
});

// 🔴 IMPORTANTE PARA A VERCEL
module.exports = app;
