import {
  createWorkflow,
  WorkflowResponse,
  when
} from "@medusajs/framework/workflows-sdk"


import { authorize_payment_step } from "./step/authorizePaymentStep"
import { capture_payment_step } from "./step/capturePaymentStep"



type _autoAuthorizeAndCaptureWorkflowType = {
     payment_session_id:string,
     provider_id?:string,
}


export const autoAuthorizeAndCaptureWorkflow = createWorkflow(
  "authorize-capture-newebpay-payment_workflow",
  (input: _autoAuthorizeAndCaptureWorkflowType) => {
    const authorizeResult = authorize_payment_step(input)

    //當授權是正常發動情況時，就自動捕獲
    const captureResult = when(
      authorizeResult,
      (result) => {
        return result.status == 'authorized'
      }
    ).then(()=>{
      return capture_payment_step({
        payment_id:authorizeResult.id
      })
    })

    return new WorkflowResponse({
      result: captureResult
    })
    
})
