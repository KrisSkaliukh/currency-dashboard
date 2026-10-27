import { useQuery } from '@tanstack/react-query';

import { currenciesApi } from './api/currenciesApi';
import { Period } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;

const periodDays: Record<Period, number> = {
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '6M': 180,
  '1Y': 365,
};

export function getDateRange(period: Period) {
  const to = new Date();
  const from = new Date(to.getTime() - periodDays[period] * DAY_MS);

  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

export function useCurrencies(period: Period) {
  const { from, to } = getDateRange(period);

  const currenciesQuery = useQuery({
    queryKey: ['currencies'],
    queryFn: currenciesApi.getCurrencies,
    staleTime: 1000 * 60 * 60,
  });

  const ratesQuery = useQuery({
    queryKey: ['currency-rates', from, to],
    queryFn: () => currenciesApi.getRates(from, to),
    staleTime: 1000 * 60 * 5,
  });

  return {
    currencies: currenciesQuery.data ?? [],
    rates: ratesQuery.data ?? [],
    isLoading: currenciesQuery.isPending || ratesQuery.isPending,
    error: currenciesQuery.error ?? ratesQuery.error,
    refetch: () => {
      void currenciesQuery.refetch();
      void ratesQuery.refetch();
    },
  };
}
