# SearchApi / Google Flights 接入记录

由于 Amadeus Self-Service 新注册入口已不可用，Tripboard 当前改用 SearchApi 的 Google Flights API 作为个人账号可测试的航班报价来源。

## 当前状态

- 已新增 Supabase Edge Function：`supabase/functions/searchapi-flight-offers/index.ts`
- 已新增前端默认代理配置：`config.js` 的 `searchApiFlightProxyUrl`
- 已将外部同步面板改为“Google Flights 报价接入”
- 已在 Supabase Secrets 配置 `SEARCHAPI_API_KEY`
- 已验证国内航线 `SHA -> LHW`、`2026-07-10`，成功返回 10 条航班报价

## 注册与 API Key

1. 打开 `https://www.searchapi.io/users/sign_up`
2. 注册 SearchApi 账号
3. 进入 Dashboard / API Key 页面
4. 复制 API Key

不要把 API Key 填到网页前端、GitHub、聊天记录或 `config.js`。

## Supabase Secrets

在 Supabase Dashboard 的 Edge Functions / Secrets 页面添加：

```text
SEARCHAPI_API_KEY=你的 SearchApi API Key
```

可选：

```text
SEARCHAPI_BASE_URL=https://www.searchapi.io/api/v1/search
```

不设置 `SEARCHAPI_BASE_URL` 时，函数默认使用上面的地址。

## 已验证结果

测试请求：

```text
from: SHA
to: LHW
date: 2026-07-10
type: flight
```

测试结果：

- 返回 10 条 Google Flights 航班报价
- 示例最低价：`MU 6813`，`21:35 - 00:40`，约 `¥1180`
- 数据来源：`Google Flights / SearchApi`

## 部署函数

如果用 Supabase 网页编辑器：

1. 打开 `https://supabase.com/dashboard/project/juicyxqblnrmbhtuujez/functions`
2. 选择 `Deploy a new function` -> `Via Editor`
3. Function name 填 `searchapi-flight-offers`
4. 粘贴 `supabase/functions/searchapi-flight-offers/index.ts`
5. 点击 `Deploy function`

如果本机有 Supabase CLI：

```bash
supabase functions deploy searchapi-flight-offers --project-ref juicyxqblnrmbhtuujez
```

公网函数地址：

```text
https://juicyxqblnrmbhtuujez.supabase.co/functions/v1/searchapi-flight-offers
```

## 前端测试方式

1. 打开 Tripboard 页面
2. 在“当日交通价格”里选择“机票”或“全部”
3. 出发地可填 `上海 SHA`
4. 到达地可填 `兰州 LHW`
5. 日期使用计划当天日期
6. 打开“Google Flights 报价接入”
7. 点击“测试连接”
8. 点击“同步当天航班”

## 限制

- SearchApi 是 Google Flights 聚合搜索接口，不是航空公司、携程或 12306 官方接口。
- 它适合先验证航班价格和班次可视化。
- 动车/高铁仍需要 12306 查询入口 + 手动保存，或后续接入有授权的火车票 API。
