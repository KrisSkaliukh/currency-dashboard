import type { Currency, ExchangeRate } from '../types';

const API_URL = 'https://api.frankfurter.dev/v2';

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const currenciesApi = {
  getCurrencies(): Promise<Currency[]> {
    return fetchJson<Currency[]>(`${API_URL}/currencies`);
  },

  getRates(from: string, to: string): Promise<ExchangeRate[]> {
    const params = new URLSearchParams({
      base: 'USD',
      from,
      to,
    });

    return fetchJson<ExchangeRate[]>(
      `${API_URL}/rates?${params.toString()}`,
    );
  },
};