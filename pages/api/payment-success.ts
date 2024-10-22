// pages/api/payment-success.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User'; // Certifique-se de importar o modelo User

const handlePaymentSuccess = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { userId, planId } = req.query;

    await dbConnect();

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      await User.updateOne({ _id: userId }, { $set: { planId: planId } });

      return res.redirect('/dashboard'); // Redireciona para a dashboard
    } catch (error) {
      console.error('Erro ao processar o pagamento:', error);
      res.status(500).json({ error: 'Erro ao processar o sucesso do pagamento' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} Não Permitido`);
  }
};

export default handlePaymentSuccess;
