import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      <h1>Página Principal</h1>
      <nav>
        <ul>
          <li>
            <Link href="/admin/add-machine">
              <span>Adicionar Máquina</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/assign-machine">
              <span>Atribuir Máquina</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;
