import NewWebPayConfigModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const NewWebPayConfig = "NewWebPayConfig"

export default Module(NewWebPayConfig, {
  service: NewWebPayConfigModuleService,
})