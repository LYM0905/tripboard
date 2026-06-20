# 高德地图接入记录

Tripboard 已新增两个 Supabase Edge Function，用于通过高德 Web 服务 API 搜索地点、回填经纬度，并按当天地点顺序做路线规划；前端也已接入高德 Web JS SDK，用于在页面内渲染真实高德地图、地点标记和路线折线。

## 当前状态

- 已新增函数：`supabase/functions/amap-place-search/index.ts`
- 已新增函数：`supabase/functions/amap-route-plan/index.ts`
- 已新增函数：`supabase/functions/amap-weather/index.ts`
- 已部署公网函数：
  `https://juicyxqblnrmbhtuujez.supabase.co/functions/v1/amap-place-search`
- 已部署公网函数：
  `https://juicyxqblnrmbhtuujez.supabase.co/functions/v1/amap-route-plan`
- 已部署公网函数：
  `https://juicyxqblnrmbhtuujez.supabase.co/functions/v1/amap-weather`
- 前端默认会自动填入高德地点代理和高德路线代理地址
- 前端已新增高德 JS Key 和 `securityJsCode` 配置入口
- 已在 Supabase Secrets 配置 `AMAP_WEB_SERVICE_KEY`
- 配置高德 Key 后，页面可以：
  - 根据关键词搜索地点并回填地址、经纬度
  - 高德地点返回 `photos` 时，透传图片 URL 给前端候选地点
  - 按当天地点顺序请求步行、驾车、公交/地铁路线
  - 按目的地城市同步高德近期天气预报
  - 保存高德返回的总距离、总耗时和每段路线说明到协作计划
  - 填写 Web 端 JS API Key 后，在右侧地图画布显示真实高德底图、Marker 和路线折线
- 已测通：
  - 地点搜索：甘肃省博物馆、兰州中山桥
  - 驾车路线：甘肃省博物馆到黄河铁桥，约 6.5 km、约 16 分钟
  - 天气：兰州返回 4 天高德天气预报

## 需要申请的 Key

在高德开放平台至少申请两个不同类型的 Key：

- **Web 服务 API Key**：放在 Supabase Secret 中，供地点搜索、路线规划、天气代理使用。
- **Web 端 JS API Key**：在页面“智能与实时数据”中填写，用于加载高德地图 JS SDK。

需要的 Supabase Secret：

```text
AMAP_WEB_SERVICE_KEY=你的高德 Web 服务 Key
```

可选：

```text
AMAP_PLACE_SEARCH_URL=https://restapi.amap.com/v3/place/text
AMAP_WALKING_ROUTE_URL=https://restapi.amap.com/v3/direction/walking
AMAP_DRIVING_ROUTE_URL=https://restapi.amap.com/v3/direction/driving
AMAP_TRANSIT_ROUTE_URL=https://restapi.amap.com/v3/direction/transit/integrated
```

不设置这些 URL 时，函数默认使用上面的官方高德 Web 服务接口。

不要把高德 Web 服务 Key 填到网页前端、GitHub、聊天记录或 `config.js`。Web 端 JS API Key 会在浏览器中使用，建议在高德控制台限制可用域名。

## 前端测试方式

1. 打开 Tripboard 页面
2. 确认“智能与实时数据”里的高德地点代理是：
   `https://juicyxqblnrmbhtuujez.supabase.co/functions/v1/amap-place-search`
3. 确认高德路线代理是：
   `https://juicyxqblnrmbhtuujez.supabase.co/functions/v1/amap-route-plan`
4. 在“快速加入景点”填写高德关键词，例如 `兰州 甘肃省博物馆`
5. 点击“生成高德链接”
6. 配置 Key 后，页面会自动回填地址，并暂存经纬度；点击“加入当天”后坐标会保存到地点
7. 当天至少有 2 个地点后，选择“步行 / 驾车 / 公交/地铁”，点击“高德规划路线”
8. 页面会展示总距离、总耗时和分段路线，并保存到当前计划
9. 在“高德 JS Key”和“安全密钥”中填写 Web 端 JS API Key 与 `securityJsCode`
10. 切回右侧地图区域，状态应显示“高德地图 · 标记”或“高德地图 · 路线”，并出现真实高德底图

## 当前限制

- 高德 Web 服务 Key 不能直接复用为 Web 端 JS API Key，需要分别申请。
- 未填写 Web 端 JS API Key 时，右侧地图会保留 Tripboard 自带坐标预览，不加载真实高德底图。
- 公交/地铁路线依赖城市名，跨城市或缺少城市时可能无结果。
- 地点搜索和路线规划仍受高德账号配额、应用类型、域名白名单和 Web 服务可用性限制。
