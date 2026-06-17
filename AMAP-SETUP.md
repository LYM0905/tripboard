# 高德地图接入记录

Tripboard 已新增两个 Supabase Edge Function，用于通过高德 Web 服务 API 搜索地点、回填经纬度，并按当天地点顺序做路线规划。

## 当前状态

- 已新增函数：`supabase/functions/amap-place-search/index.ts`
- 已新增函数：`supabase/functions/amap-route-plan/index.ts`
- 已部署公网函数：
  `https://juicyxqblnrmbhtuujez.supabase.co/functions/v1/amap-place-search`
- 已部署公网函数：
  `https://juicyxqblnrmbhtuujez.supabase.co/functions/v1/amap-route-plan`
- 前端默认会自动填入高德地点代理和高德路线代理地址
- 已在 Supabase Secrets 配置 `AMAP_WEB_SERVICE_KEY`
- 配置高德 Key 后，页面可以：
  - 根据关键词搜索地点并回填地址、经纬度
  - 按当天地点顺序请求步行、驾车、公交/地铁路线
  - 保存高德返回的总距离、总耗时和每段路线说明到协作计划
- 已测通：
  - 地点搜索：甘肃省博物馆、兰州中山桥
  - 驾车路线：甘肃省博物馆到黄河铁桥，约 6.5 km、约 16 分钟

## 需要申请的 Key

在高德开放平台申请 **Web 服务 API Key**。

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

不要把高德 Key 填到网页前端、GitHub、聊天记录或 `config.js`。

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

## 当前限制

- 已接入地点搜索和路线规划 Web 服务代理，不含高德地图 JS SDK。
- 公交/地铁路线依赖城市名，跨城市或缺少城市时可能无结果。
- 搜索结果取第一条作为默认地点，后续可以升级为候选列表让用户选择。
- 地图画布仍是 Tripboard 自带示意图，不是高德 JS SDK 真地图。
