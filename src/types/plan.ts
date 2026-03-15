export interface Plan {
  id: string
  name: 'free' | 'pro' | 'enterprise'
  max_nucleos?: number
  price: number
  created_at: string
}