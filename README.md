<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  Medusa Plugin Starter
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>


## Compatibility

This starter is compatible with versions >= 2.4.0 of `@medusajs/medusa`. 

## Getting Started

Visit the [Quickstart Guide](https://docs.medusajs.com/learn/installation) to set up a server.

Visit the [Plugins documentation](https://docs.medusajs.com/learn/fundamentals/plugins) to learn more about plugins and how to create them.

Visit the [Docs](https://docs.medusajs.com/learn/installation#get-started) to learn more about our system requirements.

## What is Medusa

Medusa is a set of commerce modules and tools that allow you to build rich, reliable, and performant commerce applications without reinventing core commerce logic. The modules can be customized and used to build advanced ecommerce stores, marketplaces, or any product that needs foundational commerce primitives. All modules are open-source and freely available on npm.

Learn more about [Medusa’s architecture](https://docs.medusajs.com/learn/introduction/architecture) and [commerce modules](https://docs.medusajs.com/learn/fundamentals/modules/commerce-modules) in the Docs.

# medusaJS-newebpay-plugin

這是一個台灣人製作 eCommerce 的金流插件 Newebpay 的開始。  
This is the beginning of Newebpay, an eCommerce payment plugin created by a Taiwanese developer.  

不唬爛，光是製作正常付費流程就花我很多時間。  
To be honest, it took me a lot of time just to create the normal payment process.  

因為流程真的大相徑庭!!!!  
Because the Payment processes are so different!  

目前此插件還差很多東西，但我腦袋卡住，先發佈正常流程的雨慢慢寫文件來整理。  
Currently, this plugin is still missing a lot, but I'm stuck, so I'll release the normal process version first and then slowly write the documentation to organize it.  

不唬爛，沒用 vibe Coding 不是不喜歡，是因為他沒辦法整合兩個文檔和切換語言下去寫.....  
No cap, I didn't use Vibe Coding not because I dislike it, but because it can't integrate two documents or switch languages ​​to write...  

但有可以靠 AI 粗稿 我自己下去修改的我一定下去做.....(雖然大部分程式我都是這樣，粗略方向他幫我寫可
以省掉很多時間)。  
If there's function or event I can draft using AI and then modify myself, I'll definitely do it... (it rough direction saves me a lot of time).  

## 事前準備

在正式MedusaJS 後端上面 `Medusa-config.ts` 加入以下.   
Input to `Medusa-config.ts`

加入你在 newebpay 建立商店時拿到的三組參數.   
This three `_hash_key`,`_hash_iv`,`_mid` is come from newebpay.
when you create shop in there.It will provide to you
```
  modules:[
    {
      resolve:"@medusajs/medusa/payment",
      options:{
        providers:[
          {
            resolve:"newbay-plugins/providers/newebpay",
            id:"newebpay",
            options:{
              _hash_key:"秘密",
              _hash_iv:"秘密",
              _mid:"秘密",
            }
          }
        ]
      }
    }
  ],
```

## 開始

如果你非得要用這個測試，ＯＫ～只有正常流程喔!!!!!!  
If you absolutely must use this test, OK~ just follow the normal process!!!!!!

MedusaJS 在結帳時會建立 Payment Session，此插件在建立 Session 時候會直接把 購物車 進行結匯並且加密。  
MedusaJS creates a Payment Session at checkout. This plugin directly converts and encrypts the shopping cart data during session creation.

```
//{{baseUrl}}/store/payment-collections/pay_col_id/payment-sessions
```
```
{
  "provider_id": "pp_newebpay_newebpay",
  "data": {
        "Version":"2.3", //版本
        "ItemDesc":"clothes_sell", //購物總體名稱
        "ReturnURL":"https://258352766113.ngrok-free.app/returnUrl", //成功後導向頁面
        "NotifyURL":"https://258352766113.ngrok-free.app/newebpay/listen-newebpay-reply" //成功後將資料送進這...
  } 
}
```

上面這一組 API 是官方教你的製作 session ， 資料是插件需要的。然後插件直接幫你加密回傳會往下看....。  
The API above is the medusa official tutorial for creating sessions; the data is required by the plugin. The plugin then automatically encrypts and sends the data back to you—see below...

```
"payment_sessions": [
            {
                "id": "payses_01KABRPYMRVKHTYR56Y7ZVTK1N",
                "currency_code": "twd",
                "provider_id": "pp_newebpay_newebpay",
                "data": {
                    "amount": 160,
                    "status": 200,
                    "Version": "2.3",
                    "context": {
                        "idempotency_key": "payses_01KABRPYMRVKHTYR56Y7ZVTK1N"
                    },
                    "ItemDesc": "clothes_sell",
                    "tradeSha": "很長一串",
                    "NotifyURL": "https://258352766113.ngrok-free.app/newebpay/listen-newebpay-reply",
                    "ReturnURL": "https://258352766113.ngrok-free.app/returnUrl",
                    "TradeInfo": "超級長一串",
                    "checkValue": "F796E1A4EB576A04F4A10CF24122A64C9467EFD7D115AAF545D88304B9AE9BE8",
                    "currency_code": "twd"
                },
```

裡面的 `TradeSha` 以及 `TradeInfo` 就是加密後的資料。  
The `TradeSha` and `TradeInfo` is encryed data

根據 Newebpay 官網題給的網頁將加密資料等等輸入進去，就可以進入合格法規的交易頁面。  
By entering the encrypted information and other details on the webpage provided by Newebpay official website, you can access the legal transaction page.


## 目標

- 查詢金流
- 退貨金流

## 如果你是熟知 MedusaJS 的

我有實作了 CapturePayment 以及 AuthorizePayment

因為台灣的金流實在是不太一樣，接受參數沒有 other 選項讓我把本系統的 pay_id 輸入。

所以我將這兩個東西另外實作了一遍.....

所以手動 capture 是可以的！！！！！！

