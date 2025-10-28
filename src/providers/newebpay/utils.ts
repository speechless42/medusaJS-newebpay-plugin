import crypto from "crypto"

export class NewebPayUtils {
  private hashKey: string
  private hashIv: string

  constructor(hashKey: string, hashIv: string) {
    this.hashKey = hashKey
    this.hashIv = hashIv
  }

  /** AES256-CBC 加密 */
  encryptAES256(data: string): string {
    const cipher = crypto.createCipheriv('aes-256-cbc', this.hashKey, this.hashIv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  /** AES256-CBC 解密 */
  decryptAES256(encrypted: string): string {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      this.hashKey,
      this.hashIv
    )
    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")
    return decrypted
  }

  /** 產生 TradeSha (SHA256 驗證碼) */
  generateTradeSha(encrypted: string): string {
    const shaStr = `HashKey=${this.hashKey}&${encrypted}&HashIV=${this.hashIv}`
    return crypto
      .createHash("sha256")
      .update(shaStr)
      .digest("hex")
      .toUpperCase()
  }

  /** 產生 CheckCode (回傳驗證用) */
  generateCheckCode(params: {
    Amt: string
    MerchantID: string
    MerchantOrderNo: string
    TradeNo: string
  }): string {
    const { Amt, MerchantID, MerchantOrderNo, TradeNo } = params
    const checkStr = `HashIV=${this.hashIv}&Amt=${Amt}&MerchantID=${MerchantID}&MerchantOrderNo=${MerchantOrderNo}&TradeNo=${TradeNo}&HashKey=${this.hashKey}`
    return crypto.createHash("sha256").update(checkStr).digest("hex").toUpperCase()
  }
  /** CheckValue **/
  generateCheckValue(params: {
  Amt: string
  MerchantID: string
  MerchantOrderNo: string
  }): string {
  const { Amt, MerchantID, MerchantOrderNo } = params
  const amount = parseInt(Amt)
  const raw = `HashKey=${this.hashKey}&Amt=${amount}&MerchantID=${MerchantID}&MerchantOrderNo=${MerchantOrderNo}&HashIV=${this.hashIv}`
  return crypto.createHash("sha256").update(raw).digest("hex").toUpperCase()
  }
}
