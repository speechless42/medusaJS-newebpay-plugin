import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { transform } from "@medusajs/framework/workflows-sdk"

//注入 module
import { NewWebPayConfig } from "../modules/newebpay"
import NewWebPayConfigModuleService from "../modules/newebpay/service"
//注入 workflow
import {
  createWorkflow,
  WorkflowResponse,
  when
} from "@medusajs/framework/workflows-sdk"

export type CreateNewebpayStepInput = {
    Version:string,
    LangType?: string,
    TradeLimit?: number,
    ExpireDate?:string,
    ExpireTime?:string,
    ReturnURL:string,
    NotifyURL:string,
    CustomerURL?:string,
    ClientBackURL?:string,
    EmailModify?:number,
    OrderComment?:string,
    CREDIT?:number,
    APPLEPAY?:number,
    ANDROIDPAY?:number,
    SAMGSUNGPAY?:number,
    LINEPAY?:number,
    ImageUrl?:string,
    InstFlag?:number,
    CreditRed?:number,
    UNIONPAY?:number,
    CREDITAE?:number,
    WEBATM?:number,
    VACC?:number,
    BankType?:number,
    SourceType?:number,
    SourceBankId?:number,
    SourceAccountNo?:number,
    CVS?:number,
    BARCODE?:number,
    ESUNWALLET?:number,
    TAIWANPAY?:number,
    BITOPAY?:number,
    CVSCOM?:number,
    TWQR?:number,
    TWQR_LifeTime?:number,
    EZPWECHAT?:number,
    EZPALIPAY?:number,
    LGSTYPE?:string,
    WalletDisplayMode?:number
}

export const createNewebpayStep = createStep(
  "create-Newebpay-step",
  async (input: CreateNewebpayStepInput, { container }) => {
    const NewebpayModuleService: NewWebPayConfigModuleService = container.resolve(
      NewWebPayConfig
    )
   
    const config = await NewebpayModuleService.createNewWebPayConfigs(input)

    return new StepResponse(config, config.id)
  },
  async (id: string, { container }) => {
    const brandModuleService: NewWebPayConfigModuleService = container.resolve(
      NewWebPayConfig
    )
    await brandModuleService.deleteNewWebPayConfigs(id)
  }

)

export const createSearchCountStep = createStep(
  "count-Newebpay-step",
  async (Input:any,{container}) =>{
    const NewebpayModuleService: NewWebPayConfigModuleService = container.resolve(
      NewWebPayConfig
    )
    const [data , count] = await NewebpayModuleService.listAndCountNewWebPayConfigs();
    return new StepResponse(count)
  }
)



type CreateNewebpayWorkflowInput = {
    Version:string,
    LangType?: string,
    TradeLimit?: number,
    ExpireDate?:string,
    ExpireTime?:string,
    ReturnURL:string,
    NotifyURL:string,
    CustomerURL?:string,
    ClientBackURL?:string,
    EmailModify?:number,
    OrderComment?:string,
    CREDIT?:number,
    APPLEPAY?:number,
    ANDROIDPAY?:number,
    SAMGSUNGPAY?:number,
    LINEPAY?:number,
    ImageUrl?:string,
    InstFlag?:number,
    CreditRed?:number,
    UNIONPAY?:number,
    CREDITAE?:number,
    WEBATM?:number,
    VACC?:number,
    BankType?:number,
    SourceType?:number,
    SourceBankId?:number,
    SourceAccountNo?:number,
    CVS?:number,
    BARCODE?:number,
    ESUNWALLET?:number,
    TAIWANPAY?:number,
    BITOPAY?:number,
    CVSCOM?:number,
    TWQR?:number,
    TWQR_LifeTime?:number,
    EZPWECHAT?:number,
    EZPALIPAY?:number,
    LGSTYPE?:string,
    WalletDisplayMode?:number
}


export const createNewebpayWorkflow = createWorkflow(
  "create-newebpay-config-workflow",
  (input: CreateNewebpayWorkflowInput) => {
    const count = createSearchCountStep(input)
    const config = createNewebpayStep(input)

    // 當 count > 1 時，回傳只能新增一筆
    const overLimitResult = when({ count }, ({ count }) => count > 1)
      .then(() =>
        transform({ count }, (input) => ({
          message: {
            config: "只能新增一筆",
            count: input.count,
          },
        }))
      )

    // 當 count <= 1 時，正常回傳 config 和 count
    const normalResult = when({ count }, ({ count }) => count <= 1)
      .then(() =>
        transform({ count, config }, (input) => ({
          message: {
            config: input.config,
            count: input.count,
          },
        }))
      )

    // 用 transform 合併結果，回傳有值的那個
    const result = transform(
      { overLimitResult, normalResult },
      (data) => data.overLimitResult || data.normalResult
    )

    

    return new WorkflowResponse(result)
})
