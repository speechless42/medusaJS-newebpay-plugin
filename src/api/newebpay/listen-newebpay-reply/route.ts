import { logger } from "@medusajs/framework"
import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import { z } from "zod"
import { Z_Catch_Newebpay_Reply } from "./validators"

type Listen_Newebpay_Reply_config = z.infer<typeof Z_Catch_Newebpay_Reply>

import { SendReplyDataWorkflow } from "../../../workflows/catch-newebpay-reply"

export const POST = async (
  req: MedusaRequest<Listen_Newebpay_Reply_config>,
  res: MedusaResponse
) => {
  await SendReplyDataWorkflow(req.scope)
      .run({
        input: req.validatedBody,
      })
  res.status(200).send("OK")
}