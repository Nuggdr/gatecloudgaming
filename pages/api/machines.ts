// pages/api/machines.ts
import type { NextApiRequest, NextApiResponse } from 'next'; // Importa os tipos
import dbConnect from '../../lib/dbConnect';
import Machine from '../../models/Machine'; // Verifique se o caminho está correto

export default async function handler(req: NextApiRequest, res: NextApiResponse) { // Adiciona os tipos
  await dbConnect();

  if (req.method === 'POST') {
    const { ip, username, password } = req.body;

    if (!ip || !username || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
      const newMachine = new Machine({
        ip,
        username,
        password,
        assigned: false, // Defina como false
      });

      await newMachine.save();
      return res.status(201).json(newMachine);
    } catch (error) {
      console.error('Erro ao salvar a máquina:', error);
      return res.status(500).json({ message: (error as Error).message }); // Acessa a mensagem de erro
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
