import { 
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http"

import { z } from "zod"
import { PostAdminCreateNewebpayConfig } from "./admin/create-newebpay-config/validators"
import { Z_Search_Payment_Session } from "./store/search-payment-session/validators"
import { Z_Catch_Newebpay_Reply } from "./newebpay/listen-newebpay-reply/validators"
//授權Payment
import { Z_Authorize_Payment } from "./store/authorizePayment/validators"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/create-newebpay-config",
      method: "POST",
      middlewares: [
        validateAndTransformBody(PostAdminCreateNewebpayConfig)
      ],
    },
    {
      matcher: "/admin/listen-newebpay-reply",
      method: "POST",
      middlewares: [
      ],
    },
    {
      matcher: "/store/search-payment-session",
      method: "POST",
      middlewares: [
        validateAndTransformBody(Z_Search_Payment_Session)
      ],
    },
    {
      matcher: "/newebpay/listen-newebpay-reply",
      method: "POST",
      middlewares: [
        validateAndTransformBody(Z_Catch_Newebpay_Reply)
      ]
    },
    {
      matcher: "/store/authorizePayment",
      method: "POST",
      middlewares: [
        validateAndTransformBody(Z_Authorize_Payment)
      ]
    }
    // {
    //   matcher:"/webhooks/*",
    //   bodyParser:{ preserveRawBody:true },
    //   method:["POST"]
    // }
  ],
})