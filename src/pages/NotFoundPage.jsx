import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="py-5 text-center">
      <p className="text-uppercase small text-secondary mb-2">Pagina nao encontrada</p>
      <h1 className="h3 mb-3">Essa rota nao existe por aqui.</h1>
      <p className="text-secondary mb-4">Volte para a busca e tente consultar um usuario ou repositório valido.</p>
      <Link className="btn btn-primary" to="/">
        Voltar para a busca
      </Link>
    </section>
  );
}
