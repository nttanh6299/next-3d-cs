export const getParams = (params) => {
  const searchParams = Object.keys(params)
    .filter((key) => {
      const value = params[key];
      return value !== '' && value !== null && value !== undefined;
    })
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return searchParams;
};

export function delay(t) {
  return new Promise((resolve) => setTimeout(() => resolve(''), t));
}
