import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import Machine from '../../models/Machine';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { planId } = req.body;

    await dbConnect(); // Conectar ao banco de dados

    try {
      // Verifica se há máquinas disponíveis que não estão atribuídas
      const availableMachines = await Machine.find({ assigned: false });

      // Se houver máquinas disponíveis, retorna true, caso contrário, retorna false
      if (availableMachines.length > 0) {
        res.status(200).json({ available: true });
      } else {
        res.status(200).json({ available: false });
      }
    } catch (error) {
      console.error('Erro ao verificar estoque:', error);
      res.status(500).json({ error: 'Erro ao verificar estoque' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
