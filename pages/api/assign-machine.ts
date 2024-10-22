import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import Machine from '../../models/Machine';

const assignMachine = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect(); // Certifique-se de que a conexão com o banco de dados está estabelecida

  if (req.method === 'POST') {
    const { userId, planId } = req.body;

    try {
      // Encontre uma máquina disponível
      const machine = await Machine.findOne({ assignedTo: null });
      if (!machine) {
        return res.status(400).json({ error: 'Nenhuma máquina disponível' });
      }

      // Atribua a máquina ao usuário
      machine.assignedTo = userId;
      await machine.save();

      // Atualize o usuário com o plano atribuído
      const user = await User.findById(userId);
      if (user) {
        user.plan = planId; // Atualiza o plano do usuário
        await user.save();
      } else {
        return res.status(404).json({ error: 'Usuário não encontrado' }); // Garantindo o tratamento de erro caso o usuário não seja encontrado
      }

      // Retorno de sucesso
      res.status(200).json({ message: 'Máquina atribuída com sucesso', machine });
    } catch (error) {
      console.error('Erro ao atribuir máquina:', error);
      res.status(500).json({ error: 'Erro ao atribuir máquina' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default assignMachine;
