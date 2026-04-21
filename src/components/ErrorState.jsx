import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ErrorState({
  title = 'Nao foi possivel concluir essa etapa.',
  message,
  actionLabel = 'Voltar',
  actionTo = '/'
}) {
  return (
    <section className="alert alert-danger border-0 shadow-sm d-flex flex-column gap-3" role="alert">
      <div className="d-flex align-items-start gap-3">
        <AlertCircle size={24} className="flex-shrink-0 mt-1" />
        <div>
          <h2 className="h5 mb-2">{title}</h2>
          <p className="mb-0">{message}</p>
        </div>
      </div>

      <div>
        <Link className="btn btn-outline-danger btn-sm" to={actionTo}>
          {actionLabel}
        </Link>
      </div>
    </section>
  );
}
