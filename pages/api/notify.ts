import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import Machine from '../../models/Machine';

const handleNotification = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { userId, planId } = req.body;

    // Conectar ao banco de dados
    await dbConnect();

    try {
      // Verificar se o usuário existe
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Buscar uma máquina disponível
      const machine = await Machine.findOne({ isAvailable: true });
      if (!machine) {
        return res.status(404).json({ error: 'Nenhuma máquina disponível' });
      }

      // Associar a máquina ao usuário
      user.machineId = machine._id;
      machine.isAvailable = false; // Marcar a máquina como não disponível

      // Salvar as alterações no banco de dados
      await user.save();
      await machine.save();

      return res.status(200).json({ success: true, message: 'Máquina associada com sucesso.' });
    } catch (error) {
      console.error('Erro ao associar máquina:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handleNotification;
