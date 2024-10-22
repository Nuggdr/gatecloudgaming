import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FaLock, FaUserAlt, FaDesktop, FaSun } from 'react-icons/fa'; // Ícone adicional
import Image from 'next/image'; // Para exibir a logo

// Definindo a interface para o modelo de dados do usuário
interface Machine {
  ip: string;
  username: string;
  password: string;
}

interface UserData {
  machine: Machine | null; // máquina pode ser nula
  plan: string | null; // plano do usuário
}

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [notification, setNotification] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const username = localStorage.getItem('username');

      if (!username) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('/api/user-data', {
          headers: { 'username': username },
        });

        if (res.ok) {
          const data: UserData = await res.json();
          setUserData(data);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        setNotification('Erro ao carregar dados do usuário.');
      }
    };

    fetchData();
  }, [router]);

  const handlePowerOn = async () => {
    if (isDisabled) return;

    try {
      const webhookUrl = "https://discord.com/api/webhooks/1294026549506347139/h-hQbQm7UuskqOwyG4P1c_0mpTXGWmYEXsmd4DPz-FkVd3x6VBOts0xdiU4lETHvFov1";
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `<@909932088562708490>\nO usuário da máquina ${userData?.machine?.ip || 'sem IP'} solicitou ligamento.`,
        }),
      });

      setNotification('Sua máquina será ligada em até 1 hora, fique atento pois pode ser antes.');
      setIsDisabled(true);
      setTimeout(() => setNotification(''), 10000);
      setTimeout(() => setIsDisabled(false), 5 * 60 * 60 * 1000); // 5 horas
    } catch (error) {
      console.error('Erro ao enviar a mensagem:', error);
      setNotification('Erro ao enviar a solicitação de ligação.');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900">
      {/* Navbar */}
      <nav className="w-full bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col items-center">
          {/* Logo */}
          <div className="flex items-center mb-2">
            <Image src="/images/gatelogo2.0.png" alt="Suporte" width={45} height={45} className="ml-2" />
            <h1 className="text-blue-400 text-2xl">Gate Gaming</h1>
          </div>
          {/* Links da Navbar */}
          <div className="space-x-8 flex justify-center items-center">
            <a href="https://grupogate.com/" className="text-white hover:text-blue-400">Home</a>
            <a href="https://grupogate.com/planos" className="text-white hover:text-blue-400">Planos</a>
            <div className="flex items-center">
              <a href="https://discord.gg/BE9VB5v9Mn" className="text-white hover:text-blue-400">Suporte</a>
              <div>
                <Image src="/images/jogo_1.png" alt="Suporte" width={35} height={35} className="ml-2" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo do Dashboard */}
      {userData ? (
        <div className="bg-gray-800 p-14 rounded-lg shadow-lg text-center mt-4 relative border-4 border-blue-400 neon-border">
          <h1 className="text-3xl font-bold text-blue-400 mb-5">Dashboard</h1>
          <div className="space-y-4">
            <div className="p-4 border-2 border-blue-500 rounded-lg bg-gray-900 neon-border">
              <p className="flex items-center justify-center text-white">
                <FaDesktop className="mr-2 text-blue-400" />
                IP: {userData.machine ? userData.machine.ip : 'sem assinatura'}
              </p>
            </div>
            <div className="p-4 border-2 border-blue-500 rounded-lg bg-gray-900 neon-border">
              <p className="flex items-center justify-center text-white">
                <FaUserAlt className="mr-2 text-blue-400" />
                Usuário: {userData.machine ? userData.machine.username : 'sem assinatura'}
              </p>
            </div>
            <div className="p-4 border-2 border-blue-500 rounded-lg bg-gray-900 neon-border">
              <p className="flex items-center justify-center text-white">
                <FaLock className="mr-2 text-blue-400" />
                Senha: {userData.machine ? userData.machine.password : 'sem assinatura'}
              </p>
            </div>


            {/* Novos campos para Sunshine */}
            <div className="p-4 border-2 border-yellow-500 rounded-lg bg-gray-900 neon-border">
              <p className="flex items-center justify-center text-white">
                <FaSun className="mr-2 text-yellow-400" />
                User Sunshine: gategaming
              </p>
            </div>
            <div className="p-4 border-2 border-yellow-500 rounded-lg bg-gray-900 neon-border">
              <p className="flex items-center justify-center text-white">
                <FaLock className="mr-2 text-yellow-400" />
                Senha Sunshine: gate1234567@
              </p>
            </div>

            {/* Botão que leva para a URL com o IP da máquina */}
            <a
              href={`https://${userData.machine ? userData.machine.ip : 'localhost'}:47990/pin`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-5 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
            >
              Acessar PIN
            </a>

            {/* Botão de ligar a máquina */}
            <button
              onClick={handlePowerOn}
              className={`mt-5 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md ${
                isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-600'
              }`}
              disabled={isDisabled}
            >
              Ligar
            </button>
          </div>

          {notification && (
            <div className="mt-5 p-4 text-blue-400 border border-blue-400 rounded-lg">
              {notification}
            </div>
          )}
        </div>
      ) : (
        <p className="text-white">Carregando...</p>
      )}
    </div>
  );
};

export default Dashboard;
