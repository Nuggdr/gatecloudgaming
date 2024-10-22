import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import Machine from '../../models/Machine';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    const username = req.headers.username; // Aqui você pega o username do cabeçalho

    if (!username) {
        return res.status(400).json({ message: 'Usuário não fornecido' });
    }

    try {
        // Buscando o usuário e populando os dados da máquina associada
        const user = await User.findOne({ username }).populate({
            path: 'machineId', // Certifique-se de que o campo machineId está definido corretamente no modelo User
            model: Machine, // Especificando o modelo Machine
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const userData = {
            username: user.username,
            email: user.email,
            ip: user.machineId ? user.machineId.ip : 'sem assinatura', // Se não houver máquina, retorna 'sem assinatura'
            machine: user.machineId ? {
                ip: user.machineId.ip,
                username: user.machineId.username,
                password: user.machineId.password,
            } : null, // Inclui os dados da máquina associada se existir
            plan: user.plan || null, // Inclui o plano do usuário
        };

        return res.status(200).json(userData);
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        return res.status(500).json({ message: 'Erro ao buscar dados do usuário' });
    }
}
