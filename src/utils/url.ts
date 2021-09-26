let urlPathAsArray: string[] | undefined;

export function getUrlPathAsArray(): string[] {
  if (!window || !window.location) return [];
  if (!urlPathAsArray) urlPathAsArray = window.location.pathname.split("/").slice(1);
  return urlPathAsArray;
}

export function redirectTo(url: string): void {
  const l: Location = window.location;
  window.location.href = `${l.protocol}//${l.host}${url}`;
}
