import { z } from 'zod'

import { Vendor } from './Vendor'

export const CreateVendor = Vendor.merge(
  z.object({
    captchaToken: z.string(),
  }),
)

export type CreateVendor = z.TypeOf<typeof CreateVendor>
