import { Github } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Pular para o conteudo
      </a>

      <header className="app-header border-bottom bg-white">
        <div className="container py-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <Link
            className="brand-link d-inline-flex align-items-center gap-2 text-decoration-none text-body fw-semibold"
            to="/"
          >
            <span className="brand-mark">
              <Github size={18} />
            </span>
            <span>Desafio GitHub</span>
          </Link>

          <nav className="d-flex align-items-center gap-2">
            <NavLink
              className={({ isActive }) =>
                `btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-primary'}`
              }
              to="/"
              end
            >
              Nova busca
            </NavLink>
          </nav>
        </div>
      </header>

      <main id="main-content" className="py-4 py-lg-5">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="border-top bg-white">
        <div className="container py-3 small text-secondary d-flex flex-wrap justify-content-between gap-2">
          <span>Consumo da API pública do GitHub.</span>
          <span>Desafio Front-End - Desbravador Software.</span>
        </div>
      </footer>
    </>
  );
}
