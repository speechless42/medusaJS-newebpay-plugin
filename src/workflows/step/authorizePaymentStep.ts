import { Modules } from "@medusajs/framework/utils"

import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"

type _AuthorizePaymentStepType = {
     payment_session_id:string,
     provider_id?:string,
}

export const authorize_payment_step = createStep(
    'authorize_payment',
    async (input: _AuthorizePaymentStepType , { container })=>{
       const paymentModuleService = container.resolve(Modules.PAYMENT);
       console.log(input)

       //授權！
       const payment = await paymentModuleService.authorizePaymentSession(
        input.payment_session_id,{}
       )
        return new StepResponse({status:'authorized',id:payment.id},{payment:payment})
    }
)