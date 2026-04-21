import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidGithubUsername } from '../utils/github';

const SUGGESTIONS = ['octocat', 'torvalds', 'facebook'];
const LAST_SEARCH_KEY = 'desafio-github:last-search';

export function HomePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = window.localStorage.getItem(LAST_SEARCH_KEY);

    if (saved) {
      setUsername(saved);
    }
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    const trimmed = username.trim();

    if (!trimmed) {
      setError('Digite um usuario do GitHub para continuar.');
      return;
    }

    if (!isValidGithubUsername(trimmed)) {
      setError('Esse usuario nao parece valido. Tente um login publico do GitHub.');
      return;
    }

    window.localStorage.setItem(LAST_SEARCH_KEY, trimmed);
    navigate(`/users/${encodeURIComponent(trimmed)}`);
  }

  function handleSuggestion(value) {
    window.localStorage.setItem(LAST_SEARCH_KEY, value);
    navigate(`/users/${encodeURIComponent(value)}`);
  }

  return (
    <section className="row justify-content-center">
      <div className="col-12 col-xl-10">
        <div className="mb-4">
          <p className="section-kicker text-uppercase small text-secondary mb-2">Busca GitHub</p>
          <h1 className="display-6 fw-semibold mb-3">Consultar um usuario e abrir os repositorios mais populares</h1>
          <p className="lead text-secondary mb-0">
            Digite o login publico de alguem no GitHub e veja os repositorios ordenados por estrelas.
          </p>
        </div>

        <form className="search-panel border rounded-4 bg-white shadow-sm p-3 p-md-4" onSubmit={handleSubmit}>
          <label className="form-label fw-medium" htmlFor="github-username">
            Usuario do GitHub
          </label>

          <div className="input-group input-group-lg">
            <span className="input-group-text bg-body-tertiary">
              <Search size={18} />
            </span>
            <input
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              autoFocus
              className={`form-control ${error ? 'is-invalid' : ''}`}
              id="github-username"
              placeholder="Ex.: octocat"
              spellCheck="false"
              type="text"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                if (error) {
                  setError('');
                }
              }}
            />
            <button className="btn btn-primary d-inline-flex align-items-center gap-2" type="submit">
              Buscar
              <Search size={18} />
            </button>
          </div>
          {error ? <div className="invalid-feedback d-block">{error}</div> : null}
        </form>

        {SUGGESTIONS.length > 0 ? (
          <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
            <span className="text-secondary small">Sugestoes rapidas:</span>
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                className="btn btn-sm btn-outline-secondary"
                type="button"
                onClick={() => handleSuggestion(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
