const GITHUB_USERNAME_REGEX = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

const numberFormatter = new Intl.NumberFormat('pt-BR');
const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
});
const collator = new Intl.Collator('pt-BR', {
  numeric: true,
  sensitivity: 'base'
});

export function formatNumber(value) {
  return numberFormatter.format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) {
    return 'Nao informado';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Nao informado';
  }

  return dateFormatter.format(date);
}

export function isValidGithubUsername(value) {
  return GITHUB_USERNAME_REGEX.test(String(value || '').trim());
}

export function safeUrl(value) {
  if (!value) {
    return '';
  }

  const trimmed = String(value).trim();

  if (!trimmed) {
    return '';
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function sortRepositories(repositories, order) {
  const repos = [...(repositories || [])];

  const sortByName = (left, right) => collator.compare(left.name, right.name);
  const sortByStarsDesc = (left, right) =>
    right.stargazers_count - left.stargazers_count || sortByName(left, right);
  const sortByStarsAsc = (left, right) =>
    left.stargazers_count - right.stargazers_count || sortByName(left, right);
  const sortByUpdatedDesc = (left, right) =>
    new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime() ||
    sortByStarsDesc(left, right);

  switch (order) {
    case 'stars-asc':
      return repos.sort(sortByStarsAsc);
    case 'name-asc':
      return repos.sort(sortByName);
    case 'updated-desc':
      return repos.sort(sortByUpdatedDesc);
    case 'stars-desc':
    default:
      return repos.sort(sortByStarsDesc);
  }
}
