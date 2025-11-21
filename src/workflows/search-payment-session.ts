import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import { Modules } from "@medusajs/framework/utils"
import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { logger } from "@medusajs/framework"

type Search_Payment_Session_Type = {
      payment_provider_id:string
      payment_collection_id:string
      tradesha:string
    }

export const search_payment_session_step = createStep(
    'search_payment_session',
    async (input: Search_Payment_Session_Type , { container })=>{
       const paymentModuleService = container.resolve(Modules.PAYMENT);
       

       const paymentSessions = await paymentModuleService.listPaymentSessions(
        {
            payment_collection_id:  input.payment_collection_id,
            provider_id: input.payment_provider_id,
        }
      )
      console.log(paymentSessions)
      // 從 paymentSessions 中取出 sessions
      // const sessions = paymentSessions.transaction.context.invoke.search_payment_session.output.compensateInput

      // 迴圈比對
      const matched = paymentSessions.find(session => session.data?.TradeSha === input.tradesha)
    
      return new StepResponse(matched?.id,matched)
    }
)

type W_Search_Payment_Session_Type = {
    payment_provider_id:string
    payment_collection_id:string
    tradesha:string
}


export const SearchSessionWorkflow = createWorkflow(
  "search-payment_session_workflow",
  (input: W_Search_Payment_Session_Type) => {
  //回傳id
  const data = search_payment_session_step(input)
  return new WorkflowResponse(data)
})

