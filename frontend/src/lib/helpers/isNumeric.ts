export const isNumeric = (str: string) =>
  !isNaN(Number(str)) && str.trim() !== "";
