export type Period = "1W" | "1M" | "3M" | "6M" | "1Y";

export type Currency = {
  iso_code: string;
  iso_numeric: string;
  name: string;
  symbol: string;
  start_date: string;
  end_date: string;
};

export type ExchangeRate = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

export type CurrencyRateRow = {
  code: string;
  name: string;
  flag: string;
  surrender: number | null;
  buy: number | null;
  rate: number;
  change: number | null;
  time: string;
};
