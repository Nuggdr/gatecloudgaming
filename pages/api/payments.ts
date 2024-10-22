// pages/api/payment.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import mercadopago from 'mercadopago';
import dbConnect from '../../lib/dbConnect';

// Configuração do Mercado Pago
mercadopago.configure({
  access_token: 'APP_USR-7757243395799799-101720-7dace157bdd88e3ed4eff645a686a947-820552196',
});

// Função para lidar com o pagamento
const handlePayment = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { planId, userId } = req.body;

    // Conectar ao banco de dados
    await dbConnect();

    // Defina o preço real do plano com base no planId
    const planDetails = getPlanDetails(planId); // Função fictícia para obter detalhes do plano
    if (!planDetails) {
      return res.status(400).json({ error: 'Plano não encontrado' });
    }

    const preference = {
      items: [
        {
          title: planDetails.title, // Título do plano
          quantity: 1,
          currency_id: 'BRL',
          unit_price: planDetails.price, // Use o valor real do plano
        },
      ],
      back_urls: {
        success: `/dashboard`,
        failure: `/dashboard`,
        pending: `/dashboard`,
      },
      auto_return: 'approved',
    };

    try {
      const response = await mercadopago.preferences.create(preference);
      res.status(200).json({ link: response.body.init_point });
    } catch (error) {
      console.error('Erro ao criar preferência:', error);
      res.status(500).json({ error: 'Erro ao processar o pagamento' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} Não Permitido`);
  }
};


const getPlanDetails = (planId: number) => {
  const plans = [
    { id: 1, title: 'Plano 1', price: 7.90 },
    { id: 2, title: 'Plano 2', price: 19.90 },
    
  ];

  return plans.find(plan => plan.id === planId);
};

export default handlePayment;
