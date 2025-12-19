const { MercadoPagoConfig, PreApproval } = require('mercadopago');

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

const preApproval = new PreApproval(client);

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).send('Backend VetAgro AI ativo 🚀');
  }

  if (req.method === 'POST' && req.url === '/criar-assinatura') {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório' });
      }

      const subscription = await preApproval.create({
        body: {
          reason: 'Assinatura VetAgro AI Pro',
          auto_recurring: {
            frequency: 1,
            frequency_type: 'months',
            transaction_amount: 49.90,
            currency_id: 'BRL'
          },
          payer_email: email,
          back_url: 'https://app.vetagroai.com.br/assinatura-confirmada',
          status: 'pending'
        }
      });

      return res.status(200).json({
        init_point: subscription.init_point,
        id: subscription.id
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao criar assinatura',
        details: error.message
      });
    }
  }

  return res.status(404).json({ error: 'Rota não encontrada' });
};
