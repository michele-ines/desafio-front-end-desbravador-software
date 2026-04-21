import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { getRepository, getRequestErrorMessage } from '../services/githubApi';
import { formatDate, formatNumber, safeUrl } from '../utils/github';

export function RepoPage() {
  const { owner, repoName } = useParams();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadRepository() {
      setLoading(true);
      setError('');
      setRepo(null);

      try {
        const data = await getRepository(owner, repoName, controller.signal);
        setRepo(data);
      } catch (requestError) {
        if (controller.signal.aborted) {
          return;
        }

        setError(getRequestErrorMessage(requestError, 'Nao foi possivel carregar os detalhes do repositorio.'));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadRepository();

    return () => controller.abort();
  }, [owner, repoName]);

  if (loading) {
    return <LoadingState title="Carregando repositorio" message="Buscando os detalhes no GitHub..." />;
  }

  if (error) {
    return (
      <ErrorState
        actionLabel="Voltar ao usuario"
        actionTo={`/users/${owner}`}
        message={error}
        title="Problema ao abrir o repositorio"
      />
    );
  }

  if (!repo) {
    return null;
  }

  const website = safeUrl(repo.homepage);

  return (
    <section className="repo-page">
      <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-4">
        <div>
          <p className="text-uppercase small text-secondary mb-2">Detalhe do repositorio</p>
          <h1 className="h3 mb-2">{repo.name}</h1>
          <p className="text-secondary mb-0">{repo.full_name}</p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <Link
            className="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
            to={`/users/${repo.owner.login}`}
          >
            <ArrowLeft size={16} />
            Voltar ao usuario
          </Link>

          <a
            className="btn btn-primary d-inline-flex align-items-center gap-2"
            href={repo.html_url}
            rel="noreferrer"
            target="_blank"
          >
            Abrir no GitHub
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="border rounded-4 bg-white shadow-sm p-3 p-md-4 h-100">
            <h2 className="h5 mb-3">Descricao</h2>
            <p className="text-secondary mb-0">{repo.description || 'Sem descricao publica.'}</p>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="border rounded-4 bg-white shadow-sm p-3 p-md-4 h-100">
            <h2 className="h5 mb-3">Informacoes</h2>

            <dl className="repo-detail-list mb-0">
              <div>
                <dt>Estrelas</dt>
                <dd>{formatNumber(repo.stargazers_count)}</dd>
              </div>
              <div>
                <dt>Linguagem</dt>
                <dd>{repo.language || 'Nao informada'}</dd>
              </div>
              <div>
                <dt>Forks</dt>
                <dd>{formatNumber(repo.forks_count)}</dd>
              </div>
              <div>
                <dt>Issues abertas</dt>
                <dd>{formatNumber(repo.open_issues_count)}</dd>
              </div>
              <div>
                <dt>Branch padrao</dt>
                <dd>{repo.default_branch}</dd>
              </div>
              <div>
                <dt>Criado em</dt>
                <dd>{formatDate(repo.created_at)}</dd>
              </div>
              <div>
                <dt>Atualizado em</dt>
                <dd>{formatDate(repo.updated_at)}</dd>
              </div>
              <div>
                <dt>Site</dt>
                <dd>
                  {website ? (
                    <a href={website} rel="noreferrer" target="_blank">
                      {website}
                    </a>
                  ) : (
                    'Nao informado'
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
