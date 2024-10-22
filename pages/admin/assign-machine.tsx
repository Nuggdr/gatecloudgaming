import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

// Definindo interfaces para User e Machine
interface User {
    _id: string;
    username: string;
}

interface Machine {
    _id: string;
    ip: string;
}

const AssignMachine = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [machines, setMachines] = useState<Machine[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [selectedMachineId, setSelectedMachineId] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('/api/users');
                console.log('Usuários:', res.data);
                setUsers(res.data);
            } catch (error: any) {
                console.error('Erro ao buscar usuários:', error);
            }
        };

        const fetchMachines = async () => {
            try {
                const res = await axios.get('/api/machines');
                console.log('Máquinas:', res.data);
                if (res.data && Array.isArray(res.data)) {
                    setMachines(res.data);
                } else {
                    console.warn('A resposta de máquinas não está no formato esperado.');
                    setMachines([]); // Garante que machines é um array
                }
            } catch (error: any) {
                console.error('Erro ao buscar máquinas:', error);
            }
        };

        fetchUsers();
        fetchMachines();
    }, []);

    const handleAssignMachine = async () => {
        try {
            const res = await axios.post('/api/assign-machine', {
                username: selectedUser,
                machineId: selectedMachineId,
            });

            if (res.status === 200) {
                alert('Máquina atribuída com sucesso!');
                router.push('/admin'); // Redireciona para a página admin após atribuir a máquina
            } else {
                alert('Erro ao atribuir a máquina: ' + res.data.message);
            }
        } catch (error: any) {
            alert('Erro ao atribuir a máquina: ' + error.response?.data.message || error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 border-4 border-blue-500 p-10 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">Atribuir Máquinas</h1>
                <div className="mb-4">
                    <label htmlFor="user" className="block text-blue-300">Selecionar Usuário:</label>
                    <select
                        id="user"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="w-full p-2 rounded"
                    >
                        <option value="">Selecione um usuário</option>
                        {users.length > 0 ? (
                            users.map(user => (
                                <option key={user._id} value={user.username}>{user.username}</option>
                            ))
                        ) : (
                            <option value="" disabled>Sem usuários disponíveis</option>
                        )}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="machine" className="block text-blue-300">Selecionar Máquina:</label>
                    <select
                        id="machine"
                        value={selectedMachineId}
                        onChange={(e) => setSelectedMachineId(e.target.value)}
                        className="w-full p-2 rounded"
                    >
                        <option value="">Selecione uma máquina</option>
                        {machines.length > 0 ? (
                            machines.map(machine => (
                                <option key={machine._id} value={machine._id}>{machine.ip}</option>
                            ))
                        ) : (
                            <option value="" disabled>Sem máquinas disponíveis</option>
                        )}
                    </select>
                </div>
                <button
                    onClick={handleAssignMachine}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Atribuir Máquina
                </button>
            </div>
        </div>
    );
};

export default AssignMachine;
