import {
  createWorkflow,
  WorkflowResponse,
  when
} from "@medusajs/framework/workflows-sdk"

import { capture_payment_step } from "./step/capturePaymentStep"


type _CapturePaymentWorkflowType = {
     payment_id:string,
     provider_id?:string,
}


export const CapturePaymentWorkflow = createWorkflow(
  "capture-newebpay-payment_workflow",
  (input: _CapturePaymentWorkflowType) => {
    
    //手動授權
    const ans = capture_payment_step(input)
    return new WorkflowResponse(ans)
})