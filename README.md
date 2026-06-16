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

当前版本使用整份计划 JSON 同步，冲突策略是“最后一次保存覆盖前一次保存”。适合原型和轻量协作。

## 6. 交通与外部平台

页面现在支持按出发日期和返程日期生成计划，并在每天显示机票、动车/高铁的示例均价。你也可以按交通类型、出发地、到达地和时间段筛选班次。

携程入口现在提供接入配置面板：点击“携程 / Trip.com 接入”，填写你自己的 HTTPS 后端代理接口，再点击“测试连接”或“同步当天交通”。

不要把携程 AppSecret、签名密钥或个人账号密码写进这个公开网页。正确做法是：

1. 在携程 / Trip.com 开放平台或商旅开放平台创建应用并取得 API 权限。
2. 新建一个后端代理接口，例如 Supabase Edge Function、Vercel Function、Cloudflare Worker 或自己的服务器。
3. 把携程 AppKey、AppSecret、签名逻辑放到后端环境变量和后端代码里。
4. 前端只填写你的后端代理地址，例如 `https://your-domain.com/api/ctrip/transport`。
5. 后端返回 `{ items: [...] }`，前端会把返回的机票/动车报价显示到当天交通列表。

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
