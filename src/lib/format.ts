import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function formatMoney(minorUnits: number, currency = 'EUR', locale = 'en-GB'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: minorUnits % 100 === 0 ? 0 : 2,
  }).format(minorUnits / 100)
}

export function formatNumber(value: number, locale = 'en-GB'): string {
  return new Intl.NumberFormat(locale).format(value)
}

export function formatDate(iso: string): string {
  return format(parseISO(iso), 'd MMM yyyy')
}

export function formatRelative(iso: string | null): string {
  if (!iso) return '—'
  return formatDistanceToNow(parseISO(iso), { addSuffix: true })
}

export function formatMonth(yearMonth: string): string {
  return format(parseISO(`${yearMonth}-01`), 'MMM yyyy')
}
