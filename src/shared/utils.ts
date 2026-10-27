export const formattedDate = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
}).format(new Date());

export const formatRate = (value: number | null) => {
  if (value === null) return '—';

  return value.toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

export const getCountryFlag = (countryCode: string): string => {
  const code = countryCode.toUpperCase();

  if (!/^[A-Z]{2}$/.test(code)) {
    return '🌐';
  }

  const firstChar = code.charCodeAt(0) + 127397;
  const secondChar = code.charCodeAt(1) + 127397;

  return String.fromCodePoint(firstChar, secondChar);
};