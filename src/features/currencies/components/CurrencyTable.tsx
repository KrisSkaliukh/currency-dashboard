import { useMemo, useState } from 'react';

import { Header } from '../../../shared/components/Header/Header';
import { useCurrencies } from '../useCurrencies';
import type { CurrencyRateRow, ExchangeRate, Period } from '../types';
import {
  formatRate,
  formattedDate,
  getCountryFlag,
} from '../../../shared/utils';
import { CurrencyChart } from './CurrencyChart';

import styles from './CurrencyTable.module.css';

const SPREAD = 0.01;
const apiDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

function formatApiDate(date: string) {
  const parsedDate = new Date(`${date}T12:00:00Z`);
  return Number.isNaN(parsedDate.valueOf()) ? date : apiDateFormatter.format(parsedDate);
}

export function CurrencyTable() {
  const [period, setPeriod] = useState<Period>('1M');
  const [selectedCurrency, setSelectedCurrency] = useState('');

  const { currencies, rates, isLoading, error, refetch } = useCurrencies(period);

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
          surrender: current.rate * (1 - SPREAD),
          buy: current.rate * (1 + SPREAD),
          rate: current.rate,
          change: previous ? current.rate - previous.rate : null,
          time: current.date,
        },
      ];
    });
  }, [currencies, rates]);

  const errorMessage =
    error instanceof Error ? error.message : 'Exchange rates could not be loaded.';

  return (
    <section className={styles.page} aria-label="Exchange rates">
      <div className={styles.header}>
        <Header title="Exchange rates" />
        <time className={styles.date}>{formattedDate}</time>
      </div>

      <div className={styles.content}>
        <div className={styles.tableCard}>
          <div className={styles.tableHeading}>
            <div>
              <h2 className={styles.tableTitle}>Exchange rates</h2>
              <p className={styles.tableDescription}>Base currency: USD</p>
            </div>
            <span className={styles.rateCount}>
              {rows.length} {rows.length === 1 ? 'currency' : 'currencies'}
            </span>
          </div>

          <div className={styles.tableScroll}>
            <table className={styles.table} aria-label="Exchange rates against USD">
              <thead>
                <tr>
                  <th scope="col">Currency</th>
                  <th scope="col">Surrender</th>
                  <th scope="col">Buy</th>
                  <th scope="col">Course</th>
                  <th scope="col">Change</th>
                  <th scope="col">Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr
                    key={row.code}
                    className={
                      selectedCurrency === row.code ? styles.selectedRow : undefined
                    }
                  >
                    <td>
                      <button
                        type="button"
                        className={styles.currencyButton}
                        aria-label={`Show ${row.name} (${row.code}) chart against USD`}
                        aria-pressed={selectedCurrency === row.code}
                        onClick={() =>
                          setSelectedCurrency(current =>
                            current === row.code ? '' : row.code,
                          )
                        }
                      >
                        <span className={styles.flag} aria-hidden="true">
                          {row.flag}
                        </span>
                        <span className={styles.currencyCode}>{row.code}</span>
                      </button>
                    </td>
                    <td>{formatRate(row.surrender)}</td>
                    <td>{formatRate(row.buy)}</td>
                    <td className={styles.rateValue}>{formatRate(row.rate)}</td>
                    <td>
                      {row.change === null ? (
                        <span className={styles.noChange}>—</span>
                      ) : (
                        <span
                          className={
                            row.change > 0
                              ? styles.positiveChange
                              : row.change < 0
                                ? styles.negativeChange
                                : styles.noChange
                          }
                        >
                          {row.change > 0 ? '+' : ''}{formatRate(row.change)}
                        </span>
                      )}
                    </td>
                    <td>
                      <time dateTime={row.time}>{formatApiDate(row.time)}</time>
                    </td>
                  </tr>
                ))}

                {rows.length === 0 && isLoading && (
                  <tr>
                    <td colSpan={6} className={styles.statusCell}>
                      <span className={styles.loadingIndicator} aria-hidden="true" />
                      <span role="status">Loading exchange rates...</span>
                    </td>
                  </tr>
                )}

                {rows.length === 0 && !isLoading && error && (
                  <tr>
                    <td colSpan={6} className={styles.statusCell}>
                      <div className={styles.errorState} role="alert">
                        <strong>Could not load exchange rates</strong>
                        <span>{errorMessage}</span>
                        <button
                          type="button"
                          className={styles.retryButton}
                          onClick={() => refetch()}
                        >
                          Try again
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {rows.length === 0 && !isLoading && !error && (
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

        {selectedCurrency && (
          <div className={styles.chartWrap}>
            <CurrencyChart
              currencyCode={selectedCurrency}
              flag={getCountryFlag(selectedCurrency)}
              rates={rates}
              period={period}
              onPeriodChange={setPeriod}
            />
          </div>
        )}
      </div>
    </section>
  );
}
