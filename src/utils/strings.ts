export const toKebabCase = (str?: string) =>
  str ? str.toLowerCase().replace(/_/g, "-").replace(/\s+/g, "-") : "";
