# 謐月 MiiCycle 後端（版本檢查 + CMS Tip）

輕量 Node.js/Express 服務，負責：
- `GET /api/version?platform=android&version=1.0.0&buildCode=1` → 回傳最新版本、是否需強制更新
- `GET /api/tips` → 衛教 Tip（之後可接 CMS）
- `GET /api/health` → 健康檢查

## 本地跑
```
npm install
npm start
# http://localhost:3000/api/health
```

## 部署到 Railway（推薦）
1. 把這個資料夾 push 到 GitHub
2. Railway → New Project → Deploy from GitHub repo
3. Railway 自動偵測 Node.js，環境變數 `PORT` 由平台提供
4. 部署完拿到網址，例如 `https://miicycle-backend.up.railway.app`

## 部署到 Vercel
1. `vercel deploy`
2. 把目錄設為 root

## App 端接點
- 開啟 App 時打一次 `GET {BASE}/api/version?platform=android&version=<AppVersion>&buildCode=<versionCode>`
- `forceUpdate=true` → 阻斷式彈窗
- `needUpdate=true` → 建議更新小卡
