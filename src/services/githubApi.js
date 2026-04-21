import axios from 'axios';

const githubClient = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 15000,
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  }
});

const PER_PAGE = 100;

export async function getUser(username, signal) {
  const { data } = await githubClient.get(`/users/${encodeURIComponent(username)}`, {
    signal
  });

  return data;
}

export async function getUserRepositories(username, totalRepositories, signal) {
  if (!totalRepositories) {
    return [];
  }

  const totalPages = Math.max(1, Math.ceil(Math.max(totalRepositories || 0, 0) / PER_PAGE));
  const requests = [];

  for (let page = 1; page <= totalPages; page += 1) {
    requests.push(
      githubClient
        .get(`/users/${encodeURIComponent(username)}/repos`, {
          params: {
            per_page: PER_PAGE,
            page
          },
          signal
        })
        .then((response) => response.data)
    );
  }

  const pages = await Promise.all(requests);
  return pages.flat();
}

export async function getRepository(owner, repoName, signal) {
  const { data } = await githubClient.get(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}`,
    {
      signal
    }
  );

  return data;
}

export function getRequestErrorMessage(error, fallbackMessage) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const apiMessage = error.response?.data?.message;

    if (status === 404) {
      return 'Nao encontramos esse recurso no GitHub.';
    }

    if (status === 403 && /rate limit/i.test(apiMessage || '')) {
      return 'O limite da API do GitHub foi atingido. Tente novamente em alguns minutos.';
    }

    if (status === 403) {
      return 'A API do GitHub recusou a requisicao. Tente novamente daqui a pouco.';
    }

    if (!error.response) {
      return 'Nao foi possivel conectar ao GitHub no momento.';
    }

    if (apiMessage) {
      return apiMessage;
    }
  }

  return fallbackMessage;
}
