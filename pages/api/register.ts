import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import Machine from '../../models/Machine';
import Plan from '../../models/Plan';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method === 'POST') {
        const { username, email, password } = req.body;

        // Verifica se existe uma máquina disponível
        const availableMachine = await Machine.findOne({ assigned: false });
        console.log('Máquina disponível:', availableMachine); // Log da máquina disponível
        if (!availableMachine) {
            return res.status(400).json({ error: 'Nenhuma máquina disponível' });
        }

        // Aqui você pode definir qual plano usar. Por exemplo, pegando o primeiro plano da lista
        const plan = await Plan.findOne(); // Altere isso para escolher o plano que deseja
        console.log('Plano encontrado:', plan); // Log do plano encontrado
        if (!plan) {
            return res.status(400).json({ error: 'Nenhum plano disponível' });
        }

        // Hash da senha antes de salvar
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            machineId: availableMachine._id, // Associa a máquina
            planId: plan._id, // Associa o plano
        });

        console.log('Novo usuário:', newUser); // Log do novo usuário antes de salvar

        // Salva o usuário
        await newUser.save();

        // Atualiza a máquina para marcada como atribuída
        await Machine.updateOne({ _id: availableMachine._id }, { assigned: true });

        res.status(201).json(newUser);
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Método ${req.method} não permitido`);
    }
}
