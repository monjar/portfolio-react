/* Resolve a public/ path (e.g. "media/mochiro/cover.webp") against the base. */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
