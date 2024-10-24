// pages/api/user-machine.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User'; // Ajuste o caminho para o seu modelo de usuário


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  // Verifica se o método da requisição é GET
  if (req.method === 'GET') {
    const { username } = req.query;

    // Verifica se o username foi fornecido
    if (!username || Array.isArray(username)) {
      return res.status(400).json({ error: 'Usuário não fornecido ou inválido' });
    }

    try {
      // Busca o usuário pelo username
      const user = await User.findOne({ username }).populate('machineId'); // Use o campo correto que relaciona o usuário à máquina

      // Verifica se o usuário ou a máquina existe
      if (!user || !user.machineId) {
        return res.status(404).json({ error: 'Máquina não encontrada para este usuário.' });
      }

      // Aqui você pode usar o modelo Machine, se necessário
      // Exemplo de uso: const machine = await Machine.findById(user.machineId);

      // Retorna o IP da máquina
      return res.status(200).json({ ip: user.machineId.ip });
    } catch (error) {
      console.error('Erro ao buscar a máquina do usuário:', error);
      return res.status(500).json({ error: 'Erro ao buscar a máquina do usuário.' });
    }
  } else {
    // Retorna erro se o método não for GET
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Método ${req.method} não permitido`);
  }
}
