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
};

const currencyFlags: Record<string, string> = {
  EUR: '🇪🇺',
  ANG: '🌐',
  XAF: '🌍',
  XAG: '🥈',
  XAU: '🥇',
  XCD: '🌴',
  XCG: '🇨🇼',
  XDR: '🌐',
  XOF: '🌍',
  XPD: '⚪',
  XPF: '🌊',
  XPT: '⚪',
  XRP: '🌐',
  BCH: '🌐',
};

export const getCountryFlag = (currencyCode: string): string => {
  const code = currencyCode.trim().toUpperCase();

  if (currencyFlags[code]) {
    return currencyFlags[code];
  }

  const countryCode = code.slice(0, 2);

  if (!/^[A-Z]{2}$/.test(countryCode)) {
    return '🌐';
  }

  const firstChar = countryCode.charCodeAt(0) + 127397;
  const secondChar = countryCode.charCodeAt(1) + 127397;

  return String.fromCodePoint(firstChar, secondChar);
};
