export const toHttpQueryParams = (
  input?: string | { [param: string]: unknown }
) => {
  if (!input) {
    return '';
  } else if (typeof input === 'string') {
    return `?${input}`.replace(/\?+/, '?');
  } else {
    return (
      '?' +
      Object.entries(input)
        .reduce((params, [key, value]) => {
          if (value instanceof Array) {
            return [...params, ...value.map((x) => `${key}[]=${x}`)];
          } else if (value instanceof Date) {
            return [...params, `${key}=${value.toISOString()}`];
          } else if (typeof value === 'object' && value !== null) {
            return [
              ...params,
              `${key}=${encodeURIComponent(JSON.stringify(value))}`,
            ];
          } else {
            return [...params, `${key}=${value}`];
          }
        }, [] as string[])
        .join('&')
    );
  }
};
