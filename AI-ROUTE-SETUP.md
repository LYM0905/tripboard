# AI 路径优化接入记录

Tripboard 已新增 Supabase Edge Function `ai-route-optimize`，用于把当天地点列表发送给 OpenAI 兼容模型，让模型返回推荐顺序。

## 当前状态

- 已新增函数：`supabase/functions/ai-route-optimize/index.ts`
- 已部署公网函数：
  `https://juicyxqblnrmbhtuujez.supabase.co/functions/v1/ai-route-optimize`
- 前端默认会自动填入这个 AI 路径代理地址
- 已通过 TokenFlux 的 OpenAI 兼容接口接入真实模型，当前模型为 `gpt-5.5`
- 已在 Supabase Secrets 配置 `OPENAI_API_KEY`、`OPENAI_BASE_URL`、`OPENAI_MODEL`
- 已实测返回推荐顺序、优化原因、分段交通建议和风险提示
- 模型调用失败时，函数会返回 `fallbackOrder`，前端继续用本地距离排序兜底

## Supabase Secrets

在 Supabase Dashboard 的 Edge Functions / Secrets 页面添加：

```text
OPENAI_API_KEY=你的模型 API Key
```

可选：

```text
OPENAI_BASE_URL=https://tokenflux.dev/v1
OPENAI_MODEL=gpt-5.5
```

如果使用其他 OpenAI 兼容网关，可把 `OPENAI_BASE_URL` 改成对应地址，把 `OPENAI_MODEL` 改成对应模型名。

不要把模型 API Key 填到网页前端、GitHub、聊天记录或 `config.js`。

## 测试方式

前端：

1. 打开 Tripboard 页面
2. 确认“智能与实时数据”里的 AI 路径代理是：
   `https://juicyxqblnrmbhtuujez.supabase.co/functions/v1/ai-route-optimize`
3. 当天至少有 3 个地点
4. 点击“AI 优化路径”

配置密钥后，页面会显示 AI 返回的优化说明、分段交通建议和风险提示。模型调用失败时，页面会显示兜底优化。

后端接口已用兰州测试行程验证通过，返回来源为：

```text
OpenAI compatible · gpt-5.5
```

## 当前限制

- 模型只根据传入的地点、时间、地址、经纬度和标签做顺序建议。
- 实时交通、排队、天气、营业时间还没有自动接入，需要后续把高德/天气/景点营业时间一起传给模型。
