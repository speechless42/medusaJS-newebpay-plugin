import { z } from "zod"

export const Z_Catch_Newebpay_Reply = z.object({
    Status:z.string(),
    MerchantID:z.string(),
    Version:z.string(),
    TradeInfo:z.string(),
    TradeSha:z.string()
})
