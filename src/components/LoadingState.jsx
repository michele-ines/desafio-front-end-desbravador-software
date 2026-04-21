export function LoadingState({ title = 'Carregando', message = 'Buscando dados no GitHub...' }) {
  return (
    <section className="loading-state text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status" aria-hidden="true" />
      <h2 className="h5 mb-2">{title}</h2>
      <p className="text-secondary mb-0">{message}</p>
    </section>
  );
}
