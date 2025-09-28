export function replaceAsteriskWithFields(
  query: string,
  fields?: string[],
): string {
  if (fields && fields.length > 0) return query.replace('*', fields.join(', '));
  return query;
}
