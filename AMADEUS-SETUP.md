# Amadeus 航班报价接入记录

本文件记录 Tripboard 接入 Amadeus 个人开发者航班 API 的方式，避免后续忘记步骤。

## 当前状态

- 已新增 Supabase Edge Function：`supabase/functions/amadeus-flight-offers/index.ts`
- 已新增前端默认代理配置：`config.js` 的 `amadeusFlightProxyUrl`
- 已将外部同步面板改为“Amadeus 航班报价接入”
- 真实报价还未完成，因为需要先在 Amadeus 创建应用并拿到 API Key / API Secret

## 注册与创建应用

1. 打开 `https://developers.amadeus.com/register`
2. 注册或登录 Amadeus for Developers
3. 进入 My Self-Service Workspace
4. 创建一个应用，例如 `Tripboard Flight Test`
5. 在应用里查看 API Key 和 API Secret

不要把 API Secret 填到网页前端、GitHub、聊天记录或 `config.js`。

## Supabase Secrets

在 Supabase Dashboard 的 Edge Functions / Secrets 页面添加：

```text
AMADEUS_CLIENT_ID=你的 API Key
AMADEUS_CLIENT_SECRET=你的 API Secret
AMADEUS_BASE_URL=https://test.api.amadeus.com
```

测试环境先用 `https://test.api.amadeus.com`。以后如果要切正式环境，再改成 Amadeus 生产环境地址并确认账户权限。

## 部署函数

如果本机已有 Supabase CLI：

```bash
supabase link --project-ref juicyxqblnrmbhtuujez
supabase functions deploy amadeus-flight-offers
```

如果本机没有 Supabase CLI，可以在 Supabase Dashboard 的 Edge Functions 页面创建/更新同名函数，粘贴 `supabase/functions/amadeus-flight-offers/index.ts` 的内容。

公网函数地址：

```text
https://juicyxqblnrmbhtuujez.supabase.co/functions/v1/amadeus-flight-offers
```

## 前端测试方式

1. 打开 Tripboard 页面
2. 在“当日交通价格”里选择“机票”或“全部”
3. 出发地可填 `上海 SHA`
4. 到达地可填 `兰州 LHW`
5. 日期使用计划当天日期
6. 打开“Amadeus 航班报价接入”
7. 点击“测试连接”
8. 点击“同步当天航班”

## 机场三字码示例

- 上海：`SHA`，也可用具体机场 `PVG`
- 北京：`BJS`，也可用具体机场 `PEK` / `PKX`
- 兰州：`LHW`
- 青岛：`TAO`
- 西安：`XIY`
- 成都：`CTU` / `TFU`
- 广州：`CAN`
- 深圳：`SZX`

## 限制

- Amadeus 个人开发者 API 主要解决机票报价，不解决 12306 动车/高铁。
- 测试环境可能不是完整实时库存，适合验证 API 链路和可视化。
- 真实出票、支付、退改签不在当前功能范围内。
