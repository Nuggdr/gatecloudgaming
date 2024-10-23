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
    // Adicionando tipos para os dados recebidos
    const { planId } = req.body; // Removido userId, pois não é utilizado

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
        success: 'https://gatecloudgaming-9und8yfct-nuggdrs-projects.vercel.app/dashboard',
        failure: 'https://gatecloudgaming-9und8yfct-nuggdrs-projects.vercel.app/dashboard',
        pending: 'https://gatecloudgaming-9und8yfct-nuggdrs-projects.vercel.app/dashboard',
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
    { id: 1, title: 'Plano Horas', price: 7.90 },
    { id: 2, title: 'Plano Semanal', price: 27.99 },
    { id: 3, title: 'Plano Mensal', price: 69.99 },
     { id: 4, title: 'Plano 24 Horas 8 Nucleos', price: 11.99 },
     { id: 5, title: 'Plano Semanal 8 Nucleos', price: 36.99 },
   { id: 6, title: 'Plano Mensal 8 Nucleos', price: 91.99 },
  ];

  return plans.find(plan => plan.id === planId);
};

export default handlePayment;
