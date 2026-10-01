<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type ChartOptions,
} from 'chart.js'
import { chartInk, planRamp } from '@/lib/chart-theme'
import { formatNumber } from '@/lib/format'
import type { PlanId } from '@/types/domain'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const { items } = defineProps<{
  items: readonly { planId: PlanId; name: string; count: number }[]
}>()

const ink = chartInk()

const colors = computed(() => {
  const ramp = planRamp()
  return items.map((_, index) => ramp[Math.min(index, ramp.length - 1)]!)
})

const data = computed(() => ({
  labels: items.map((item) => item.name),
  datasets: [
    {
      data: items.map((item) => item.count),
      backgroundColor: colors.value,
      borderRadius: 4,
      borderSkipped: 'start' as const,
      maxBarThickness: 24,
    },
  ],
}))

const options = computed<ChartOptions<'bar'>>(() => ({
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      displayColors: false,
      callbacks: { label: (item) => `${formatNumber(Number(item.raw))} users` },
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: { color: ink.grid },
      border: { display: false },
      ticks: { color: ink.axis, precision: 0, maxTicksLimit: 5 },
    },
    y: {
      grid: { display: false },
      border: { color: ink.grid },
      ticks: { color: ink.axis },
    },
  },
}))
</script>

<template>
  <div>
    <div class="h-56">
      <Bar :data="data" :options="options" aria-label="Users per plan" role="img" />
    </div>

    <details class="mt-3">
      <summary
        class="cursor-pointer text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
      >
        View as table
      </summary>
      <table class="mt-2 w-full text-left text-sm">
        <thead class="text-xs text-[var(--color-ink-muted)]">
          <tr>
            <th scope="col" class="py-1 font-medium">Plan</th>
            <th scope="col" class="py-1 text-right font-medium">Users</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--color-line)]">
          <tr v-for="item in items" :key="item.planId">
            <td class="py-1.5">{{ item.name }}</td>
            <td class="py-1.5 text-right tabular-nums">{{ formatNumber(item.count) }}</td>
          </tr>
        </tbody>
      </table>
    </details>
  </div>
</template>
