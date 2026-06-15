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

后续正式产品建议升级为：

- 每个行程地点单独一行数据
- 评论单独表
- 成员权限表
- 登录和只读分享链接
- 更细粒度的实时协作冲突处理
