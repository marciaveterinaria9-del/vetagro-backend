// Backend mínimo VetAgro AI
// Este servidor existe apenas para:
// - Criar assinaturas no Mercado Pago
// - Receber webhooks
// - Proteger as chaves (Access Token)

const express = require("express");
const mercadopago = require("mercadopago");

const app = express();
app.use(express.json());

// ⚠️ O Access Token será configurado depois no ambiente (Vercel)
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

// Rota de teste (para saber se o backend está vivo)
app.get("/", (req, res) => {
  res.send("Backend VetAgro AI ativo 🚀");
});

// Criar assinatura Mercado Pago
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

// Porta exigida pela Vercel
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
