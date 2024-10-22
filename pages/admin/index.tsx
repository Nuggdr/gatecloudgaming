import Link from 'next/link';

const AdminPanel = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Painel de Administração</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link href="/admin/add-machine" className="bg-blue-500 text-white p-4 rounded">
          Adicionar Máquina
        </Link>
        <Link href="/admin/assign-machine" className="bg-green-500 text-white p-4 rounded">
          Associar Máquina
        </Link>
      </div>
    </div>
  );
};

export default AdminPanel;
