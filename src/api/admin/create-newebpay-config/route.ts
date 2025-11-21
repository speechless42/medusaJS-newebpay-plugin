import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { 
  createNewebpayWorkflow,
} from "../../../workflows/create-newwebpay-config"

import { z } from "zod"
import { PostAdminCreateNewebpayConfig } from "./validators"

type PostAdminCreateNewebpayConfigType = z.infer<typeof PostAdminCreateNewebpayConfig>

export const POST = async (
  req: MedusaRequest<PostAdminCreateNewebpayConfigType>,
  res: MedusaResponse
) => {
  

  const { result } = await createNewebpayWorkflow(req.scope)
    .run({
      input: req.validatedBody,
    })

  res.json({ config : result })
}
