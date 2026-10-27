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

import type { ExchangeRate, Period } from '../types';
import { formatRate } from '../../../shared/utils';

import styles from './CurrencyChart.module.css';

interface ICurrencyChartProps {
  currencyCode: string;
  flag: string;
  rates: ExchangeRate[];
  period: Period;
  onPeriodChange: (period: Period) => void;
}

const periods: Period[] = ['1W', '1M', '3M', '6M', '1Y'];

const periodLabels: Record<Period, string> = {
  '1W': '1 week',
  '1M': '1 month',
  '3M': '3 months',
  '6M': '6 months',
  '1Y': '1 year',
};

export function CurrencyChart({
  currencyCode,
  flag,
  rates,
  period,
  onPeriodChange
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
        <p className={styles.subtitle}>
          {periodLabels[period]}
        </p>
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
              <YAxis 
                domain={['auto', 'auto']}
                tickFormatter={(value: number) => {
                  return Number(value.toFixed(4)).toString();
                }}
              />

              <Tooltip
                labelFormatter={date => String(date)}
                formatter={value => [formatRate(Number(value)), 'Rate']}
              />

              <Line
                type="monotone"
                dataKey="rate"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className={styles.periods}>
        {periods.map((item) => (
          <button
            key={item}
            type="button"
            className={
              period === item
                ? styles.activePeriod
                : styles.periodButton
            }
            onClick={() => onPeriodChange(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}
