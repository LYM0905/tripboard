# Tripboard 多人协作设置

这个原型默认使用本地浏览器保存。要让别人通过链接打开同一份计划并共同编辑，需要接入 Supabase。

## 1. 创建 Supabase 项目

1. 打开 https://supabase.com/ 并创建项目。
2. 进入项目的 SQL Editor。
3. 复制 `supabase-schema.sql` 的内容并执行。
4. 进入 Database > Replication / Realtime，把 `trip_plans` 表加入 Realtime。

## 2. 填写前端配置

打开 `config.js`，填入项目配置：

```js
window.TRIPBOARD_CONFIG = {
  supabaseUrl: "https://你的项目.supabase.co",
  supabaseAnonKey: "你的 anon public key",
};
```

`anon public key` 可以在 Supabase 项目的 Project Settings > API 中找到。

## 3. 本地测试

启动静态服务器：

```bash
python -m http.server 4173 --bind 127.0.0.1
```

打开：

```text
http://127.0.0.1:4173/
```

点击“创建共享计划”，页面 URL 会变成：

```text
http://127.0.0.1:4173/?trip=某个id
```

把这个链接复制给其他人。如果别人不在你的电脑上，本地地址不能直接访问，需要部署到公网。

## 4. 部署到公网

可以部署到 Vercel、Netlify、GitHub Pages 或自己的服务器。部署后，分享链接会类似：

```text
https://你的域名/?trip=某个id
```

其他成员打开同一个链接，就能看到同一份计划。任何人修改后，其他在线成员会通过 Supabase Realtime 收到更新。

## 5. 当前协作策略

当前版本使用 Supabase Realtime + 计划级 Yjs 快照协作。行程日、地点列表、地点文本字段、当天文本字段、协作块、批注、交通报价、备选池、活动流、预算设置和编辑口令元信息都会写入协作快照，并随计划 JSON 一起保存。

前端会优先合并 `planYjs` 快照；只有旧链接、旧广播或快照缺失/失败时才回退到整份 JSON 冲突面板。为避免误覆盖，页面仍保留最近 12 个本地历史版本，可以在“历史版本”里预览并恢复。

这已经支持字段级/列表级合并、编辑锁、在线成员、只读链接和轻量编辑口令，但还不是完整账号权限系统，也不是飞书/Notion 那种富文本块编辑器。真正强权限仍需要 Supabase Auth + RLS、管理员/成员角色和邀请审批。

## 6. 交通与外部平台

页面现在支持按出发日期和返程日期生成计划，并在每天显示机票、动车/高铁的示例均价。你也可以按交通类型、出发地、到达地和时间段筛选班次。

当前优先接入 Amadeus 个人开发者航班 API：点击“Amadeus 航班报价接入”，填写 Supabase Edge Function 代理地址，再点击“测试连接”或“同步当天航班”。

不要把 Amadeus API Secret、携程 AppSecret、签名密钥或个人账号密码写进这个公开网页。正确做法是：

1. 在 Amadeus for Developers 创建 Self-Service 应用并取得 API Key / API Secret。
2. 新建一个后端代理接口，例如 Supabase Edge Function、Vercel Function、Cloudflare Worker 或自己的服务器。
3. 把 Amadeus API Key / API Secret 放到后端环境变量和后端代码里。
4. 前端只填写你的后端代理地址，例如 `https://your-project.supabase.co/functions/v1/amadeus-flight-offers`。
5. 后端返回 `{ items: [...] }`，前端会把返回的机票报价显示到当天交通列表。

本项目已经生成了 Supabase Edge Function：

```text
supabase/functions/amadeus-flight-offers/index.ts
```

默认前端代理地址已经写在 `config.js`：

```text
https://juicyxqblnrmbhtuujez.supabase.co/functions/v1/amadeus-flight-offers
```

部署方式：

```bash
supabase login
supabase link --project-ref juicyxqblnrmbhtuujez
supabase functions deploy amadeus-flight-offers
```

如果已经拿到 Amadeus API Key / API Secret，把密钥放到 Supabase 环境变量里：

```bash
supabase secrets set AMADEUS_CLIENT_ID=你的APIKey
supabase secrets set AMADEUS_CLIENT_SECRET=你的APISecret
supabase secrets set AMADEUS_BASE_URL=https://test.api.amadeus.com
```

Amadeus 只解决机票报价，不提供 12306 动车/高铁报价。动车/高铁当前继续使用 12306 查询入口或手动保存报价。

页面会明确区分：

- `本地示例`：前端根据日期和城市生成的示例报价。
- `待配置密钥`：Amadeus 函数已部署，但 Supabase 还没有配置 API Key / API Secret。
- `真实接口`：你的后端代理返回了真实票价数据。

前端发送给后端的请求格式：

```json
{
  "date": "2026-06-30",
  "from": "上海 SHA",
  "to": "兰州 LHW",
  "type": "flight",
  "startTime": "08:00",
  "endTime": "18:30"
}
```

后端返回格式：

```json
{
  "items": [
    {
      "type": "flight",
      "code": "MU1234",
      "from": "上海",
      "to": "兰州",
      "depart": "09:30",
      "arrive": "12:20",
      "duration": 170,
      "price": 860,
      "source": "携程"
    }
  ]
}
```

后续正式产品建议升级为：

- 每个行程地点单独一行数据
- 评论单独表
- 成员权限表
- 登录和只读分享链接
- 更细粒度的实时协作冲突处理

## 7. AI、高德、天气、外部订单

页面新增“智能与实时数据”配置区：

- AI 路径代理：填写你自己的后端模型接口。未配置时，按钮会使用本地距离排序。
- 高德地点代理：填写你自己的高德 Web 服务地点搜索代理。未配置时，只生成高德搜索链接。
- 高德路线代理：填写你自己的高德 Web 服务路线规划代理。配置后可按当天地点顺序生成步行、驾车、公交/地铁路线。
- 天气代理：可选。不填写时，页面使用 Open-Meteo 免费接口按目的地同步天气。

Open-Meteo 官方说明：Forecast API 和 Geocoding API 可直接通过 HTTPS 调用，免费非商业使用、无需 API key，并支持 CORS。商业使用请按 Open-Meteo 条款选择合适方案。

外部 App 同步仍不能直接读取美团、点评、携程、民宿 App 账号订单。现在支持“AI 辅助导入”：点击美团/点评、民宿/酒店或分享/截图，粘贴订单短信、邮件、分享文本或截图识别出的文字，再点击“解析文本”。页面会先显示结构化预览，确认后导入到计划里，并同步给协作者。

外部订单解析代理：

```text
supabase/functions/external-order-parse/index.ts
```

默认前端代理地址已经写在 `config.js`：

```text
https://juicyxqblnrmbhtuujez.supabase.co/functions/v1/external-order-parse
```

这个功能会把以下字段尽量解析出来：

- 来源平台和类别
- 日期、时间、名称、地址
- 金额、已付、付款人
- 订单号、来源链接、备注/原文

如果 AI 解析超时或失败，页面会自动使用本地规则兜底。自动读取外部 App 账号仍需要平台授权或官方 API，不能通过网页直接读取用户手机 App 数据。

高德地图部分现在走后端代理，公开网页不保存高德 Key：

```text
supabase/functions/amap-place-search/index.ts
supabase/functions/amap-route-plan/index.ts
```

需要在 Supabase Secrets 中配置：

```text
AMAP_WEB_SERVICE_KEY=你的高德 Web 服务 Key
```

配置并部署后，页面可以搜索地点、回填经纬度，并按当天地点顺序展示高德返回的距离、耗时和分段路线。高德 JS 地图 SDK 还没有嵌入，当前右侧地图仍是 Tripboard 自带的行程示意图。

预算现在支持：

- 项目预算
- 已付款金额
- 付款人
- 同行人数
- 总价、已付、待付、人均和按付款人汇总
