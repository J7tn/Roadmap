import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || ''
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  SKILLS: 'skills',
  INDUSTRIES: 'industries', 
  ROLES: 'roles',
  JOBS: 'jobs',
  MARKET_TRENDS: 'market_trends'
} as const

// Types for our database tables
export interface Skill {
  id: string
  name: string
  demand_percentage: number
  growth_rate: number
  avg_salary: number
  last_updated: string
  created_at: string
}

export interface Industry {
  id: string
  name: string
  growth_percentage: number
  job_count: number
  avg_salary: number
  last_updated: string
  created_at: string
}

export interface Role {
  id: string
  title: string
  description: string
  growth_rate: number
  required_skills: string[]
  avg_salary: number
  last_updated: string
  created_at: string
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  salary_min: number
  salary_max: number
  skills: string[]
  industry: string
  experience_level: string
  job_type: string
  posted_date: string
  last_updated: string
  created_at: string
}

export interface MarketTrend {
  id: string
  trend_type: 'skills' | 'industries' | 'roles' | 'jobs'
  data: any
  last_updated: string
  created_at: string
}
