import { Modules } from "@medusajs/framework/utils"

import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"

type _CapturePaymentStepType = {
     payment_id:string,
     provider_id?:string,
}

export const capture_payment_step = createStep(
    'capture_payment',
    async (input: _CapturePaymentStepType , { container })=>{
       const paymentModuleService = container.resolve(Modules.PAYMENT);

       //捕獲！
       const payment = await paymentModuleService.capturePayment({
            payment_id: input.payment_id,
       })

       return new StepResponse({status:'capture',id:payment.id},{payment:payment})

    }
)