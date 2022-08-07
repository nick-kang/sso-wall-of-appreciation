import { z } from 'zod'

export const CreateVendorResponse = z.object({
  url: z.string(),
})

export type CreateVendorResponse = z.TypeOf<typeof CreateVendorResponse>
