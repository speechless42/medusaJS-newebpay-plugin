import { MedusaService } from "@medusajs/framework/utils"
import NewWebPayConfig from "./models/newwebpay-config"

class NewWebPayConfigModuleService extends MedusaService({
  NewWebPayConfig,
}){
}

export default NewWebPayConfigModuleService