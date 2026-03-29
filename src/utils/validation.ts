import { z } from 'zod'

// 1. Customer Schemas
export const CustomerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().min(8, 'Invalid phone number').max(20).optional().or(z.literal('')),
  staff_id: z.string().uuid('Invalid staff ID'),
})

// 2. Sale Schemas
export const SaleItemSchema = z.object({
  item_id: z.string().uuid(),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  unit_price: z.number().positive('Price must be greater than 0'),
})

export const SaleSchema = z.object({
  customer_id: z.string().uuid(),
  sale_type: z.enum(['cash', 'credit']),
  items: z.array(SaleItemSchema).min(1, 'At least one item is required'),
  total_amount: z.number().min(0),
})

// 3. Payment Schemas
export const PaymentSchema = z.object({
  sale_id: z.string().uuid(),
  amount: z.number().positive('Amount must be greater than 0'),
  payment_method: z.string().default('cash'),
})

// 4. Submission Schemas
export const SubmissionSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
})

export const ReviewSubmissionSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['verified', 'disputed']),
})

// 5. Distribution Schemas
export const DistributionSchema = z.object({
  staff_id: z.string().uuid(),
  item_id: z.string().uuid(),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  zone: z.string().max(100).optional(),
})
