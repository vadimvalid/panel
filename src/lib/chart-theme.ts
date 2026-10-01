const PLAN_RAMP_LIGHT = ['#86b6ef', '#3987e5', '#1c5cab', '#0d366b'] as const

const PLAN_RAMP_DARK = ['#cde2fb', '#9ec5f4', '#5598e7', '#2a78d6'] as const

const TREND_LIGHT = '#2a78d6'
const TREND_DARK = '#3987e5'

function isDarkMode(): boolean {
  if (typeof document === 'undefined') return false
  const explicit = document.documentElement.dataset.theme
  if (explicit === 'dark') return true
  if (explicit === 'light') return false
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

export function planRamp(dark = isDarkMode()): readonly string[] {
  return dark ? PLAN_RAMP_DARK : PLAN_RAMP_LIGHT
}

export function trendColor(dark = isDarkMode()): string {
  return dark ? TREND_DARK : TREND_LIGHT
}

export function chartInk(dark = isDarkMode()) {
  return {
    grid: dark ? '#2e2e2c' : '#eceae5',
    axis: dark ? '#9b9a95' : '#6f6e69',
    surface: dark ? '#1a1a19' : '#fcfcfb',
  }
}
