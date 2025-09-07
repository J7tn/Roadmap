import { createClient } from '@supabase/supabase-js'

// Fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase environment variables. Using placeholder values for development.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names - Updated to match new schema
export const TABLES = {
  CAREERS: 'careers',
  CAREER_UPDATE_LOG: 'career_update_log',
  TRENDING_SKILLS: 'trending_skills',
  TRENDING_INDUSTRIES: 'trending_industries',
  EMERGING_ROLES: 'emerging_roles',
  TRENDING_UPDATE_LOG: 'trending_update_log'
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
