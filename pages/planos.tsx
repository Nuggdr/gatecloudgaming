import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaMemory, FaMicrochip, FaHdd, FaDesktop, FaExclamationCircle, FaSpinner } from 'react-icons/fa';

const plans = [
  {
    id: 1,
    title: 'Plano Horas',
    price: '7,90',
    duration: '12 horas',
    processor: 'AMD EPYC',
    gpu: 'NVIDIA Tesla T4',
    ram: '28 GB',
    storage: '256 GB SSD',
  },
  {
    id: 2,
    title: 'Plano Semanal',
    price: '27,99',
    duration: 'semanal',
    processor: 'AMD EPYC',
    gpu: 'NVIDIA Tesla T4',
    ram: '28 GB',
    storage: '256 GB SSD',
  },
  {
    id: 3,
    title: 'Plano Mensal',
    price: '69,99',
    duration: 'mensal',
    processor: 'AMD EPYC',
    gpu: 'NVIDIA Tesla T4',
    ram: '28 GB',
    storage: '256 GB SSD',
  },
];

const Planos = () => {
  const [user, setUser] = useState<string | null>(null);
  const [notification, setNotification] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      router.push('/login');
    } else {
      setUser(username);
    }
  }, [router]);

  const handleBuy = async (planId: number) => {
    try {
      setLoading(true);

      const plan = plans.find((p) => p.id === planId);
      let expirationDate = new Date();

      // Definir a data de expiração com base no tipo de plano
      if (plan?.duration === '12 horas') {
        expirationDate.setHours(expirationDate.getHours() + 12);
      } else if (plan?.duration === 'semanal') {
        expirationDate.setDate(expirationDate.getDate() + 7);
      } else if (plan?.duration === 'mensal') {
        expirationDate.setMonth(expirationDate.getMonth() + 1);
      }

      const expirationFormatted = expirationDate.toLocaleString('pt-BR', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      });

      // Primeiro, busque o IP da máquina do usuário
      const userMachineResponse = await fetch(`/api/user-machine?username=${user}`);
      let userIp = '';

      if (userMachineResponse.ok) {
        const userMachineInfo = await userMachineResponse.json();
        userIp = userMachineInfo.ip; // Pegue o IP da máquina
      } else {
        setNotification('Erro ao buscar informações da máquina do usuário.');
        return;
      }

      // Enviar notificação para o Discord via webhook
      const discordWebhookUrl = 'https://discord.com/api/webhooks/1298723056952545402/aMo1VRPyO5JySKqvbQNM5XQNO4zuYYAIAqwvxu1bj0U_Z68jqsNtCxbI7wKCkHTCBTgO'; 
      const message = {
        content: `O Usuário ${user} comprou o plano ${plan?.title}.\nExpira em: ${expirationFormatted}.\nIP da máquina: ${userIp}`,
      };

      await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });

      const mercadoPagoResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, username: user }),
      });

      if (mercadoPagoResponse.ok) {
        const { link } = await mercadoPagoResponse.json();
        window.location.href = link;
      } else {
        const errorData = await mercadoPagoResponse.json();
        setNotification(`Erro ao processar o pagamento: ${errorData.error || 'Erro desconhecido.'}`);
      }
    } catch (error) {
      console.error('Erro ao processar a compra:', error);
      setNotification('Erro ao processar a compra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <h1 className="text-4xl text-center text-blue-400 font-bold my-10">Planos Disponíveis</h1>
      <h2 className="text-4xl text-center text-blue-400 font-bold my-10">POR FAVOR, ASSIM QUE FIZER O PAGAMENTO CLIQUE EM &quot;VOLTAR PARA O SITE&quot;</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-5">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-gray-800 p-6 rounded-lg shadow-lg border-4 border-blue-500 transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">{plan.title}</h2>
            <p className="text-xl font-semibold mb-2">R${plan.price} / {plan.duration}</p>
            <ul className="mb-4 space-y-2">
              <li className="flex items-center">
                <FaMicrochip className="mr-2 text-blue-400" /> {plan.processor}
              </li>
              <li className="flex items-center">
                <FaDesktop className="mr-2 text-blue-400" /> {plan.gpu}
              </li>
              <li className="flex items-center">
                <FaMemory className="mr-2 text-blue-400" /> {plan.ram}
              </li>
              <li className="flex items-center">
                <FaHdd className="mr-2 text-blue-400" /> {plan.storage}
              </li>
            </ul>
            <button
              onClick={() => handleBuy(plan.id)} 
              className={`w-full ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500'} text-white py-2 rounded-lg hover:bg-blue-600 transition`}
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin" /> : 'Comprar'}
            </button>
          </div>
        ))}
      </div>

      {notification && (
        <div aria-live="polite" className="mt-10 p-4 bg-blue-500 text-white text-center rounded-lg">
          {notification.includes('Erro') ? (
            <FaExclamationCircle className="inline-block mr-2" />
          ) : null}
          {notification}
        </div>
      )}
    </div>
  );
};

export default Planos;
