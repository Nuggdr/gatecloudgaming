import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import Machine from '../../models/Machine';

const associateMachine = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { userId, planId } = req.body;

    await dbConnect();

    try {
      // Busque a máquina disponível
      const availableMachine = await Machine.findOne({ /* critério para encontrar a máquina disponível */ });

      if (!availableMachine) {
        return res.status(404).json({ error: 'Máquina não encontrada.' });
      }

      // Associar a máquina ao usuário
      await User.findByIdAndUpdate(userId, { $set: { machineId: availableMachine._id } });

      res.status(200).json({ message: 'Máquina associada com sucesso.' });
    } catch (error) {
      console.error('Erro ao associar máquina:', error);
      res.status(500).json({ error: 'Erro ao associar máquina.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default associateMachine;
