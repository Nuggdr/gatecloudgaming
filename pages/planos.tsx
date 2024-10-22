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
  // Adicione mais planos aqui, se necessário
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
      const stockRes = await fetch('/api/check-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      if (!stockRes.ok) {
        setNotification('Erro ao verificar estoque.');
        return;
      }

      const { available } = await stockRes.json();

      if (available) {
        const mercadoPagoResponse = await fetch('/api/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId, username: user }), // Passando o username
        });

        if (mercadoPagoResponse.ok) {
          const { link } = await mercadoPagoResponse.json();
          window.location.href = link; // Redirecionar para o link de pagamento
        } else {
          const errorData = await mercadoPagoResponse.json();
          setNotification(`Erro ao processar o pagamento: ${errorData.error || 'Erro desconhecido.'}`);
        }
      } else {
        setNotification('Erro: Sem estoque disponível.');
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
              onClick={() => handleBuy(plan.id)} // Aqui é onde o planId é passado
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
