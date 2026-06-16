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

当前版本使用整份计划 JSON 同步。为了避免误覆盖，前端会在每次修改、载入云端、收到协作者更新前保存最近 12 个本地历史版本，可以在页面左侧“历史版本”恢复。

这仍然不是飞书/Notion 那种字段级协同：同一字段同时编辑时，云端最新保存仍会覆盖较早保存。正式产品建议把地点、评论、预算、成员权限拆成独立表。

当前权限是“链接级”：普通链接可编辑，带 `mode=readonly` 的链接只能查看和加入在线成员展示。还没有账号登录、管理员、邀请审批或成员角色分级。

## 6. 交通与外部平台

页面现在支持按出发日期和返程日期生成计划，并在每天显示机票、动车/高铁的示例均价。你也可以按交通类型、出发地、到达地和时间段筛选班次。

携程入口现在提供接入配置面板：点击“携程 / Trip.com 接入”，填写你自己的 HTTPS 后端代理接口，再点击“测试连接”或“同步当天交通”。

不要把携程 AppSecret、签名密钥或个人账号密码写进这个公开网页。正确做法是：

1. 在携程 / Trip.com 开放平台或商旅开放平台创建应用并取得 API 权限。
2. 新建一个后端代理接口，例如 Supabase Edge Function、Vercel Function、Cloudflare Worker 或自己的服务器。
3. 把携程 AppKey、AppSecret、签名逻辑放到后端环境变量和后端代码里。
4. 前端只填写你的后端代理地址，例如 `https://your-domain.com/api/ctrip/transport`。
5. 后端返回 `{ items: [...] }`，前端会把返回的机票/动车报价显示到当天交通列表。

本项目已经生成了 Supabase Edge Function 模板：

```text
supabase/functions/ctrip-transport/index.ts
```

默认前端代理地址已经写在 `config.js`：

```text
https://juicyxqblnrmbhtuujez.supabase.co/functions/v1/ctrip-transport
```

部署方式：

```bash
supabase login
supabase link --project-ref juicyxqblnrmbhtuujez
supabase functions deploy ctrip-transport
```

如果已经拿到 Trip.com/Ctrip 的真实接口权限，把密钥放到 Supabase 环境变量里：

```bash
supabase secrets set TRIPCOM_APP_KEY=你的AppKey
supabase secrets set TRIPCOM_APP_SECRET=你的AppSecret
supabase secrets set TRIPCOM_TRANSPORT_API_URL=官方给你的交通查询接口地址
```

当前函数在未配置真实 Trip.com 接口时会返回“代理示例”交通数据，用来验证前端和后端链路已经打通。

页面会明确区分：

- `本地示例`：前端根据日期和城市生成的示例报价。
- `代理示例`：Supabase 后端代理已经连通，但还没有配置 Trip.com/Ctrip 正式 API。
- `真实接口`：你的后端代理返回了真实票价数据。

前端发送给后端的请求格式：

```json
{
  "date": "2026-06-30",
  "from": "上海",
  "to": "兰州",
  "type": "all",
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
- 高德地点代理：填写你自己的高德 Web 服务代理。未配置时，只生成高德搜索链接。
- 天气代理：可选。不填写时，页面使用 Open-Meteo 免费接口按目的地同步天气。

Open-Meteo 官方说明：Forecast API 和 Geocoding API 可直接通过 HTTPS 调用，免费非商业使用、无需 API key，并支持 CORS。商业使用请按 Open-Meteo 条款选择合适方案。

外部 App 同步仍不能直接读取美团、点评、携程、民宿 App 账号订单。现在支持手动粘贴订单短信/分享文本并点击“解析文本”，页面会尝试提取名称、时间、金额和地址，再导入当天行程。

预算现在支持：

- 项目预算
- 已付款金额
- 付款人
- 同行人数
- 总价、已付、待付、人均和按付款人汇总
