import { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

import type { ExchangeRate } from '../types';
import { formatRate } from '../../../shared/utils';

import styles from './CurrencyChart.module.css';

interface ICurrencyChartProps {
  currencyCode: string;
  flag: string;
  rates: ExchangeRate[];
}

export function CurrencyChart({
  currencyCode,
  flag,
  rates,
}: ICurrencyChartProps) {
  const chartData = useMemo(() => {
    return rates
      .filter(rate => rate.quote === currencyCode)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(rate => ({
        date: rate.date,
        rate: rate.rate,
      }));
  }, [currencyCode, rates]);

  const latestRate = chartData.at(-1);

  return (
    <section className={styles.chartCard}>
      <div className={styles.cardTitle}>
        <h2>
          {flag} {currencyCode} / USD
        </h2>
        <p className={styles.subtitle}>Monthly dynamics</p>
      </div>

      {latestRate && (
        <p className={styles.currentRate}>{formatRate(latestRate.rate)}</p>
      )}

      {chartData.length === 0 ? (
        <p>No rate history available</p>
      ) : (
        <div className={styles.chart}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="date"
                tickFormatter={(date: string) => date.slice(5)}
              />
              <YAxis domain={['auto', 'auto']} />

              <Tooltip
                labelFormatter={date => String(date)}
                formatter={value => [formatRate(Number(value)), 'Rate']}
              />

              <Line
                type="monotone"
                dataKey="rate"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
