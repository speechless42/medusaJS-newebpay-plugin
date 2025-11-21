import { z } from "zod"

export const Z_Search_Payment_Session = z.object({
    payment_provider_id:z.string(),
    payment_collection_id:z.string(),
    tradesha:z.string()
})