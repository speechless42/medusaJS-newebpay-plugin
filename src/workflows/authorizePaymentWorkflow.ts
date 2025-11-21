import {
  createWorkflow,
  WorkflowResponse,
  when
} from "@medusajs/framework/workflows-sdk"

import { authorize_payment_step } from "./step/authorizePaymentStep"


type _AuthorizePaymentWorkflowType = {
     payment_session_id:string,
     provider_id?:string,
}


export const AuthorizePaymentWorkflow = createWorkflow(
  "authorize-newebpay-payment_workflow",
  (input: _AuthorizePaymentWorkflowType) => {
    
    //手動授權
    const ans = authorize_payment_step(input)
    return new WorkflowResponse(ans)
})
