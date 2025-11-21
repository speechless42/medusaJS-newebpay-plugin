import { z } from "zod"

export const Z_Authorize_Payment = z.object({
    payment_session_id:z.string(),
    provider_id: z.string().optional(),
})