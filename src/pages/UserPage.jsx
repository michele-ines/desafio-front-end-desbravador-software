import {
  ArrowUpDown,
  BookOpen,
  CalendarDays,
  Code2,
  Globe,
  Mail,
  MapPin,
  UserRound,
  Users
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { RepoCard } from '../components/RepoCard';
import { getRequestErrorMessage, getUser, getUserRepositories } from '../services/githubApi';
import {
  formatDate,
  formatNumber,
  isValidGithubUsername,
  safeUrl,
  sortRepositories
} from '../utils/github';

const ORDER_OPTIONS = [
  { value: 'stars-desc', label: 'Mais estrelas' },
  { value: 'stars-asc', label: 'Menos estrelas' },
  { value: 'name-asc', label: 'Nome (A-Z)' },
  { value: 'updated-desc', label: 'Atualizados recentemente' }
];

export function UserPage() {
  const { username } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  const [reposLoading, setReposLoading] = useState(true);
  const [userError, setUserError] = useState('');
  const [reposError, setReposError] = useState('');

  const order = searchParams.get('order') || 'stars-desc';

  useEffect(() => {
    const controller = new AbortController();

    async function loadUserAndRepositories() {
      setUser(null);
      setRepos([]);
      setUserError('');
      setReposError('');
      setUserLoading(true);
      setReposLoading(true);

      if (!isValidGithubUsername(username || '')) {
        setUserError('Esse usuario nao parece valido.');
        setUserLoading(false);
        setReposLoading(false);
        return;
      }

      try {
        const profile = await getUser(username, controller.signal);
        if (controller.signal.aborted) {
          return;
        }

        setUser(profile);
        setUserLoading(false);

        try {
          const repositories = await getUserRepositories(
            profile.login,
            profile.public_repos,
            controller.signal
          );

          if (controller.signal.aborted) {
            return;
          }

          setRepos(repositories);
        } catch (repositoriesError) {
          if (controller.signal.aborted) {
            return;
          }

          setReposError(
            getRequestErrorMessage(
              repositoriesError,
              'Nao foi possivel carregar os repositorios desse usuario.'
            )
          );
        } finally {
          if (!controller.signal.aborted) {
            setReposLoading(false);
          }
        }
      } catch (requestError) {
        if (controller.signal.aborted) {
          return;
        }

        setUserError(getRequestErrorMessage(requestError, 'Nao foi possivel carregar esse usuario.'));
        setUserLoading(false);
        setReposLoading(false);
      }
    }

    loadUserAndRepositories();

    return () => controller.abort();
  }, [username]);

  const orderedRepos = useMemo(() => sortRepositories(repos, order), [repos, order]);

  function handleOrderChange(event) {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('order', event.target.value);
    setSearchParams(nextParams, { replace: true });
  }

  if (userLoading && !user) {
    return <LoadingState title="Carregando usuario" message={`Consultando ${username} no GitHub...`} />;
  }

  if (userError && !user) {
    return (
      <ErrorState
        actionLabel="Voltar para a busca"
        message={userError}
        title="Nao conseguimos abrir esse usuario"
      />
    );
  }

  if (!user) {
    return null;
  }

  const website = safeUrl(user.blog);
  const stats = [
    { icon: Users, label: 'Seguidores', value: formatNumber(user.followers) },
    { icon: UserRound, label: 'Seguindo', value: formatNumber(user.following) },
    { icon: Code2, label: 'Repos publicos', value: formatNumber(user.public_repos) },
    { icon: BookOpen, label: 'Gists publicos', value: formatNumber(user.public_gists) }
  ];

  const details = [
    { icon: Mail, label: 'Email', value: user.email || 'Nao informado' },
    { icon: MapPin, label: 'Localizacao', value: user.location || 'Nao informada' },
    { icon: CalendarDays, label: 'Entrou em', value: formatDate(user.created_at) },
    {
      icon: Globe,
      label: 'Site',
      value: website ? (
        <a href={website} rel="noreferrer" target="_blank">
          {website}
        </a>
      ) : (
        'Nao informado'
      )
    }
  ];

  return (
    <section>
      <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-4">
        <div>
          <p className="text-uppercase small text-secondary mb-2">Perfil GitHub</p>
          <h1 className="h3 mb-2">{user.name || user.login}</h1>
          <p className="text-secondary mb-0">{user.bio || 'Esse usuario ainda nao deixou uma bio publica.'}</p>
        </div>

        <Link className="btn btn-outline-secondary" to="/">
          Nova busca
        </Link>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <aside className="border rounded-4 bg-white shadow-sm p-3 p-md-4 h-100">
            <div className="d-flex align-items-center gap-3 mb-3">
              <img
                alt={`Avatar de ${user.login}`}
                className="user-avatar rounded-circle border"
                src={user.avatar_url}
              />

              <div className="min-w-0">
                <p className="text-uppercase small text-secondary mb-1">@{user.login}</p>
                <h2 className="h5 mb-0 text-truncate">{user.name || user.login}</h2>
              </div>
            </div>

            <div className="row row-cols-2 g-2 mb-3">
              {stats.map((stat) => (
                <div className="col" key={stat.label}>
                  <div className="stat-tile border rounded-3 bg-body-tertiary p-3 h-100">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                      <span className="text-secondary small">{stat.label}</span>
                      <stat.icon size={16} className="text-primary flex-shrink-0" />
                    </div>
                    <strong className="d-block fs-5">{stat.value}</strong>
                  </div>
                </div>
              ))}
            </div>

            <dl className="profile-details mb-0">
              {details.map((detail) => (
                <div key={detail.label} className="profile-details__item">
                  <dt>
                    <detail.icon size={16} />
                    <span>{detail.label}</span>
                  </dt>
                  <dd>{detail.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <div className="col-lg-8">
          <div className="border rounded-4 bg-white shadow-sm p-3 p-md-4 mb-3">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <h2 className="h5 mb-1">Repositorios publicos</h2>
                <p className="text-secondary mb-0">
                  {reposLoading ? 'Carregando' : `${orderedRepos.length} repositorios encontrados`}
                </p>
              </div>

              <div className="d-flex align-items-center gap-2">
                <ArrowUpDown size={16} className="text-secondary" />
                <label className="form-label mb-0 small text-secondary" htmlFor="repo-order">
                  Ordenar
                </label>
                <select
                  className="form-select form-select-sm repo-order-select"
                  id="repo-order"
                  value={order}
                  onChange={handleOrderChange}
                >
                  {ORDER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {reposLoading ? (
            <LoadingState title="Carregando repositorios" message="Organizando os repositorios por estrelas..." />
          ) : reposError ? (
            <ErrorState
              actionLabel="Voltar para a busca"
              message={reposError}
              title="Nao foi possivel listar os repositorios"
            />
          ) : orderedRepos.length === 0 ? (
            <div className="border rounded-4 bg-white shadow-sm p-4">
              <p className="mb-1 fw-medium">Nenhum repositorio publico encontrado.</p>
              <p className="text-secondary mb-0">Esse usuario pode nao ter repositorios visiveis ou a conta pode estar vazia.</p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-xl-2 g-3">
              {orderedRepos.map((repo) => (
                <div className="col" key={repo.id}>
                  <RepoCard repo={repo} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
