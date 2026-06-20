export const camelToSnake = (str: string) => {
  return str.replace(
    /[A-Z]/g,
    (match, offset) => (offset > 0 ? "_" : "") + match.toLowerCase(),
  );
};
