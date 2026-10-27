import { useMemo, useState } from "react";

import { Header } from "../../../shared/components/Header/Header";
import { useCurrencies } from "../useCurrencies";
import { CurrencyRateRow, ExchangeRate, Period } from "../types";
import { formatRate, formattedDate, getCountryFlag } from "../../../shared/utils";

import styles from './CurrencyTable.module.css'

export function CurrencyTable () {
  const [period, setPeriod] = useState<Period>('1M');
  
  const {
    currencies,
    rates,
  } = useCurrencies(period);

  const rows = useMemo(() => {
    const ratesByCurrency = new Map<string, ExchangeRate[]>();
  
    for (const rate of rates) {
      const currencyRates = ratesByCurrency.get(rate.quote) ?? [];
      currencyRates.push(rate);
      ratesByCurrency.set(rate.quote, currencyRates);
    }
  
    return currencies.flatMap((currency): CurrencyRateRow[] => {
      const history = [...(ratesByCurrency.get(currency.iso_code) ?? [])].sort(
        (a, b) => a.date.localeCompare(b.date),
      );
  
      const current = history.at(-1);
  
      if (!current) return [];
  
      const previous = history.at(-2);
  
      return [
        {
          code: currency.iso_code,
          name: currency.name,
          flag: getCountryFlag(currency.iso_code),
          surrender: null,
          buy: null,
          rate: current.rate,
          change: previous ? current.rate - previous.rate : null,
          time: current.date,
        },
      ];
    });
  }, [currencies, rates]);
  console.log(currencies)

  return (
    <div>
      <div className={styles.header}>
        <Header title="Exchange ratesd" />
        <time className={styles.date}>
          {formattedDate}
        </time>
      </div>
      
      <div className={styles.tableCard}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Currency</th>
                <th scope="col">Surrender</th>
                <th scope="col">Buy</th>
                <th scope="col">Course</th>
                <th scope="col">Change</th>
                <th scope="col">Time</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.code}>
                  <td>
                    <span className={styles.currency}>
                      <span>{row.flag}</span>
                      <span>{row.code}</span>
                    </span>
                  </td>

                  <td>{formatRate(row.surrender)}</td>
                  <td>{formatRate(row.buy)}</td>
                  <td>{formatRate(row.rate)}</td>

                  <td>
                    {row.change === null
                      ? '—'
                      : `${row.change > 0 ? '+' : ''}${formatRate(row.change)}`}
                  </td>

                  <td>{row.time}</td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className={styles.empty}>
                    No currency data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}