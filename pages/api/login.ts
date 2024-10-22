// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User'; // O modelo de usuário que você criou
import bcrypt from 'bcryptjs'; // Importa bcrypt para comparar hashes

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  if (req.method === 'POST') {
    const { username, password } = req.body;

    // Verifique o usuário no banco de dados
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
    }

    // Verifique a senha usando bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
    }

    // Retorne o userId e o username
    return res.status(200).json({ userId: user._id, username: user.username });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default login;
