import { Migration } from '@mikro-orm/migrations';

export class Migration20251006155341 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "new_web_pay_config" ("id" text not null, "Version" text not null, "LangType" text not null default 'zh-tw', "TradeLimit" integer not null default 0, "ExpireDate" text null, "ExpireTime" text null, "ReturnURL" text not null, "NotifyURL" text not null, "CustomerURL" text null, "ClientBackURL" text null, "EmailModify" integer not null default 1, "OrderComment" text null, "CREDIT" integer not null default 1, "APPLEPAY" integer not null default 0, "ANDROIDPAY" integer not null default 0, "SAMGSUNGPAY" integer not null default 0, "LINEPAY" integer not null default 0, "ImageUrl" text null, "InstFlag" integer not null default 0, "CreditRed" integer not null default 0, "UNIONPAY" integer not null default 0, "CREDITAE" integer not null default 0, "WEBATM" integer not null default 0, "VACC" integer not null default 0, "BankType" integer null, "SourceType" integer not null default 0, "SourceBankId" integer null, "SourceAccountNo" integer null, "CVS" integer not null default 0, "BARCODE" integer not null default 0, "ESUNWALLET" integer not null default 0, "TAIWANPAY" integer not null default 0, "BITOPAY" integer not null default 0, "CVSCOM" integer not null default 0, "TWQR" integer not null default 0, "TWQR_LifeTime" integer not null default 300, "EZPWECHAT" integer not null default 0, "EZPALIPAY" integer not null default 0, "LGSTYPE" text null, "WalletDisplayMode" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "new_web_pay_config_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_new_web_pay_config_deleted_at" ON "new_web_pay_config" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "new_web_pay_config" cascade;`);
  }

}
