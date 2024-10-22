// pages/register.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    // Adicionando o tipo ao parâmetro 'e'
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        if (res.ok) {
            router.push('/login');
        } else {
            const errorData = await res.json();
            console.error(errorData.message);
            alert('Erro ao registrar. Tente novamente.'); // Adicionando um alerta ao usuário
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-gray-800 border-4 border-blue-500 p-10 rounded-lg shadow-lg max-w-md w-full transition duration-300 transform hover:scale-105">
                <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">Registrar</h1>
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full p-3 mb-4 border-2 border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 mb-4 border-2 border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 mb-4 border-2 border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded transition duration-200"
                    >
                        Registrar
                    </button>
                </form>
                <p className="mt-4 text-center text-blue-300">
                    Já tem conta? <Link href="/login" className="text-blue-400 hover:underline">Faça login</Link>
                </p>
            </div>
        </div>
    );
}
