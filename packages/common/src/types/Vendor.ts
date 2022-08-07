import { z } from 'zod'

export const Vendor = z.object({
  name: z.string().min(1).max(128),
  ssoSourceUrl: z.string().url().min(1).max(512),
  planSourceUrl: z.string().url().min(1).max(512),
  ssoPrice: z.number().min(0),
  planPrice: z.number().min(0).or(z.string()),
  homepageUrl: z.string().url().min(1).max(256),
  categories: z.array(z.string().min(1).max(32)),
  updatedAt: z.string(),
})

export type Vendor = z.TypeOf<typeof Vendor>
