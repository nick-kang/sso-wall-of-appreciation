import { z } from 'zod'

import { Vendor } from './Vendor'

export const Vendors = z.array(Vendor)

export type Vendors = z.TypeOf<typeof Vendors>
