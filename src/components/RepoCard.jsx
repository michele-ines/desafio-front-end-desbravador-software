import { ArrowRight, Code2, ExternalLink, GitFork, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, formatNumber } from '../utils/github';

export function RepoCard({ repo }) {
  const detailTo = `/repos/${encodeURIComponent(repo.owner.login)}/${encodeURIComponent(repo.name)}`;

  return (
    <article className="repo-card card h-100 border shadow-sm">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between gap-3 mb-2">
          <div className="min-w-0">
            <h2 className="h6 mb-1 text-truncate">
              <Link className="text-decoration-none" to={detailTo}>
                {repo.name}
              </Link>
            </h2>
            <p className="text-secondary small mb-0 text-truncate">{repo.full_name}</p>
          </div>

          <span className="repo-star badge text-bg-primary d-inline-flex align-items-center gap-1 align-self-start">
            <Star size={12} />
            {formatNumber(repo.stargazers_count)}
          </span>
        </div>

        <p className="repo-description text-secondary small mb-3">
          {repo.description || 'Sem descricao publica.'}
        </p>

        <div className="repo-meta d-flex flex-wrap gap-3 small text-secondary mb-3">
          <span className="d-inline-flex align-items-center gap-1">
            <Code2 size={14} />
            {repo.language || 'Sem linguagem'}
          </span>
          <span className="d-inline-flex align-items-center gap-1">
            <GitFork size={14} />
            {formatNumber(repo.forks_count)}
          </span>
          <span>Atualizado em {formatDate(repo.updated_at)}</span>
        </div>

        <div className="mt-auto d-flex align-items-center justify-content-between gap-3">
          <span className={`badge ${repo.fork ? 'text-bg-light border' : 'text-bg-light border invisible'}`}>
            Fork
          </span>

          <div className="d-flex gap-2">
            <Link className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1" to={detailTo}>
              Ver detalhes
              <ArrowRight size={16} />
            </Link>

            <a
              className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
              href={repo.html_url}
              rel="noreferrer"
              target="_blank"
            >
              GitHub
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
