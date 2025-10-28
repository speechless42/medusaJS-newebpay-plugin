import { SubscriberArgs } from "@medusajs/framework"
import { autoAuthorizeAndCaptureWorkflow } from "../workflows/autoAuthorizeCaptureWorkflow"


export default async function handlePaymentCaptured({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  console.log("Payment authorized:", data.id)
  // 執行你的自定義邏輯
  await autoAuthorizeAndCaptureWorkflow(container).run({input:{payment_session_id:data.id}})
}

export const config = {
  event: "payment.authorized",
}