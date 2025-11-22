import { AbstractPaymentProvider } from "@medusajs/framework/utils"
import { CreatePaymentSessionDTO,
         CreatePaymentProviderSession, Logger, PaymentProviderError, 
         PaymentProviderSessionResponse, PaymentSessionStatus, ProviderWebhookPayload, 
         UpdatePaymentProviderSession, WebhookActionResult } from "@medusajs/framework/types"
import { NewebPayUtils } from "./utils"
import qs from 'qs';


type Options = {
  _hash_key: string,
  _hash_iv:string,
  _mid:string,
  api_key:string
}

export interface InitiatePaymentInput extends CreatePaymentProviderSession {
  data: Record<string, any>
}

export interface WebhookActionAndData extends ProviderWebhookPayload {
    provider: string;
    payload: {
        data: Record<string, any>;
        rawData: string | Buffer<ArrayBufferLike>;
        headers: Record<string, any>;
    };
}

type InjectedDependencies = {
  logger: Logger
}

export default class newebpayPaymentProviderService extends AbstractPaymentProvider<
  Options
> {
  //設定識別
  static identifier = "newebpay"
  //基本payment 資料
  protected logger_: Logger
  protected options_: Options
  protected utils : NewebPayUtils

  constructor(
    container: InjectedDependencies,
    options: Options
  ) {
    super(container, options)
    //錯誤紀錄
    this.logger_ = container.logger
    //匯入變數
    this.options_ = options
    //加解密包匯入
    this.utils = new NewebPayUtils(options._hash_key, options._hash_iv)

  }
  //初始化Payment session
  async initiatePayment(input: InitiatePaymentInput): Promise<PaymentProviderError | PaymentProviderSessionResponse> {

    const {
      amount,
      currency_code,
      context: customerDetails,
      data
    } = input

    //先產生基本的query
    const requiredFields = ["Version", "ItemDesc", "ReturnURL", "NotifyURL","session_id"]
    for (const field of requiredFields) {
      if (!data[field]) {
           const error = new Error(`缺少${field}欄位`);
           (error as any).type = "invalid_data";
           (error as any).code = "invalid_request_error";
           throw error;
      }
    }
    //生成ID
    const MerchantOrderNo = data.session_id.replace(/^[^_]+_/, "");

    //刪掉session_id
    if(data.session_id){
        delete data.session_id
    }
    
    const buildquery = {
      MerchantID: this.options_._mid,
      RespondType: "JSON",
      MerchantOrderNo:MerchantOrderNo,
      TimeStamp: Math.floor(Date.now() / 1000).toString(),
      Amt: input.amount,
      ...data
    }
    const query = qs.stringify(buildquery, { encode:false })

     //產生 TradeInfo
    const encrypted = this.utils.encryptAES256(query)
    //產生 TradeSha
    const tradeSha = this.utils.generateTradeSha(encrypted)
    //產生 CheckValue
    const checkValue = this.utils.generateCheckValue({Amt:buildquery.Amt.toString(),MerchantID:this.options_._mid,MerchantOrderNo:MerchantOrderNo})

    return{
      data:{
        status:200,
        amount:amount,
        currency_code:currency_code,
        context:input.context,
        TradeInfo:encrypted,
        tradeSha:tradeSha,
        checkValue:checkValue
      }
    }

  }
  //授權Payment session 並產生 Payment
  async authorizePayment(paymentSessionData: Record<string, any>, context: Record<string, any>): Promise<PaymentProviderError | { status: PaymentSessionStatus; data: PaymentProviderSessionResponse["data"] }> {
    
    return {
      status: "authorized",
      data:{
      }
    }

  }
  //捕獲Payment
  async capturePayment(paymentData: Record<string, unknown>): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    
    return {
      data:{
        ...paymentData
      }
    }
  }
  
  cancelPayment(paymentData: Record<string, unknown>): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    throw new Error("Method not implemented.")
  }
  deletePayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    throw new Error("Method not implemented.")
  }
  getPaymentStatus(paymentSessionData: Record<string, unknown>): Promise<PaymentSessionStatus> {
    throw new Error("Method not implemented.")
  }
  async refundPayment(RefundPaymentInput: Record<string, any>, refundAmount: number): Promise<PaymentProviderError | { data:any }> {
    console.log(RefundPaymentInput);
    return {
      data:""
    }
  }
  retrievePayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    throw new Error("Method not implemented.")
  }
  updatePayment(context: UpdatePaymentProviderSession): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    throw new Error("Method not implemented.")
  }
  async getWebhookActionAndData(input: WebhookActionAndData["payload"]): Promise<WebhookActionResult> {
    const {
      data,
      rawData,
      headers
    } = input
    try{
      switch(headers.status){
        case "SUCCESS":
          //解密
          const detail = this.utils.decryptAES256(rawData.toString())
          const result = JSON.parse(detail)
          const session_id = `payses_${result.Result?.MerchantOrderNo}`

          return {
            action:"authorized",
            data:{
              session_id:session_id,
              amount:result.Result.Amt
            }
          }
        default:
          return {
            action:"not_supported"
          }
      }
    }catch(e){
      console.log(e)
      return {
        action:"failed"
      }
    }

  }
  
  

}

