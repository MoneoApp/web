export function getStaticAsset(id: string, type: string) {
  return `/api/${id}/${type}`;
}
