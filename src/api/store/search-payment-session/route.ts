// src/api/my-custom-endpoint/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"


import { z } from "zod"
import { Z_Search_Payment_Session } from "./validators"

import { SearchSessionWorkflow } from "../../../workflows/search-payment-session"

type Search_Payment_Session_config = z.infer<typeof Z_Search_Payment_Session>

export const POST = async (req: MedusaRequest<Search_Payment_Session_config>, res: MedusaResponse) => {
  // 這裡可以執行你自訂的邏輯

  const result = await SearchSessionWorkflow(req.scope)
        .run({
          input: req.validatedBody,
        })
  res.json(result)
}