export const ROLES = ['viewer', 'support', 'admin'] as const
export type Role = (typeof ROLES)[number]

export interface User {
  id: string
  name: string
  email: string
  role: Role
  status: UserStatus
  createdAt: string
  lastSeenAt: string | null
  planId: PlanId | null
}

export const USER_STATUSES = ['active', 'invited', 'suspended'] as const
export type UserStatus = (typeof USER_STATUSES)[number]

export const PLAN_IDS = ['free', 'starter', 'pro', 'enterprise'] as const
export type PlanId = (typeof PLAN_IDS)[number]

export interface Plan {
  id: PlanId
  name: string
  priceMonthly: number
  currency: string
}

export interface Subscription {
  id: string
  userId: string
  planId: PlanId
  status: SubscriptionStatus
  startedAt: string
  renewsAt: string | null
  cancelledAt: string | null
}

export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'cancelled'

export interface Payment {
  id: string
  userId: string
  subscriptionId: string | null
  amount: number
  currency: string
  status: PaymentStatus
  createdAt: string
  description: string
}

export type PaymentStatus = 'succeeded' | 'pending' | 'failed' | 'refunded'

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  perPage: number
}

export interface AuthSession {
  token: string
  user: User
}

export interface MonthlyPoint {
  month: string
  total: number
}

export interface StatsOverview {
  activeUsers: number
  activeSubscriptions: number
  pastDueSubscriptions: number
  mrr: number
  currency: string
  revenue: MonthlyPoint[]
  signups: MonthlyPoint[]
  planBreakdown: { planId: PlanId; name: string; count: number }[]
}
