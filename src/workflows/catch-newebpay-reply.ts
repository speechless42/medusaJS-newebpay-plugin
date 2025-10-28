import {
  createWorkflow,
  WorkflowResponse,
  when
} from "@medusajs/framework/workflows-sdk"

import { Modules } from "@medusajs/framework/utils"
import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"


//事件
import {
  emitEventStep,
} from "@medusajs/medusa/core-flows"

//聽訓輸入設定
type ListenNewebpayType = {
      Status:string
      MerchantID:string,
      Version:string,
      TradeInfo:string,
      TradeSha:string
}

export const catch_newebpay_reply = createStep(
    'catch-reply-from-newebpay',
    async (input: ListenNewebpayType , { container })=>{
       const paymentModuleService = container.resolve(Modules.PAYMENT);
       //發送 hooks 確認是否可以授權
       const result = await paymentModuleService.getWebhookActionAndData({
        provider:"newebpay_newebpay",
        payload:{
          data:{tradesha:input.TradeSha},
          rawData:input.TradeInfo,
          headers:{status:input.Status,merchantId:input.MerchantID,version:input.Version}
        }
       })
      return new StepResponse(result)
    }
)


type CreatePaymentWorkflowInput = {
      Status:string
      MerchantID:string,
      Version:string,
      TradeInfo:string,
      TradeSha:string
}


export const SendReplyDataWorkflow = createWorkflow(
  "create-newebpay-payment_workflow",
  (input: CreatePaymentWorkflowInput) => {
    //傳到金流解密
    const emitresult = catch_newebpay_reply(input)
    //當是測試授權成功狀態進行自動授權與捕獲
    when(
          emitresult,
          (result) => {
            return result.action == 'authorized'
          }
        ).then(()=>{
            emitEventStep({
              eventName: "payment.authorized",
              data: {
                id:emitresult.data?.session_id
              },
            })

        })

    return new WorkflowResponse(input.Status)
})
