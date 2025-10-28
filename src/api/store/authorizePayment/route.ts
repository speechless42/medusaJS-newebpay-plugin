// src/api/my-custom-endpoint/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"


import { z } from "zod"
import { Z_Authorize_Payment } from "./validators"

import { AuthorizePaymentWorkflow } from "../../../workflows/authorizePaymentWorkflow"

type Authorize_Payment_Session_config = z.infer<typeof Z_Authorize_Payment>

export const POST = async (req: MedusaRequest<Authorize_Payment_Session_config>, res: MedusaResponse) => {
  // 這裡可以執行你自訂的邏輯

  const result = await AuthorizePaymentWorkflow(req.scope)
        .run({
          input: req.validatedBody,
        })
  res.json(result)
}