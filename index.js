const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ---- 版本設定（上線時直接改這裡或接 CMS）----
// latest: 目前商店最新版；min: 低於此版本強制更新
const VERSION = {
  android: { latest: '1.0.0', latestCode: 1, min: '1.0.0', minCode: 1, forceUpdate: false, url: '' },
  ios:     { latest: '1.0.0', latestCode: 1, min: '1.0.0', minCode: 1, forceUpdate: false, url: '' },
};

// 簡單語義比對
function gte(a, b) {
  const pa = a.split('.').map(Number), pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) > (pb[i] || 0)) return true;
    if ((pa[i] || 0) < (pb[i] || 0)) return false;
  }
  return true;
}

// GET /api/version?platform=android&version=1.0.0&buildCode=1
app.get('/api/version', (req, res) => {
  const platform = (req.query.platform || 'android').toString();
  const v = (req.query.version || '0.0.0').toString();
  const cfg = VERSION[platform] || VERSION.android;
  const needUpdate = !gte(cfg.latest, v); // latest > current → 要更新
  const forceUpdate = cfg.forceUpdate || !gte(cfg.min, v);
  res.json({
    platform,
    current: v,
    latest: cfg.latest,
    needUpdate,
    forceUpdate,
    url: cfg.url,
    notes: forceUpdate ? '請更新到最新版以繼續使用' : '有新版本可用',
  });
});

// GET /api/health
app.get('/api/health', (_req, res) => res.json({ ok: true, app: 'miicycle-backend', ts: Date.now() }));

// 範例：衛教 Tip（之後可接 CMS）
app.get('/api/tips', (_req, res) => {
  res.json({
    tips: [
      { id: 1, phase: 'menstrual', title: '經期多休息', body: '避免高強度運動，補充鐵質與蛋白質。' },
      { id: 2, phase: 'follicular', title: '濾泡期燃脂黃金期', body: '體能最佳，適合間歇訓練與有氧。' },
      { id: 3, phase: 'luteal', title: '黃體期抗水腫', body: '減少鹽分，補充鉀（香蕉、菠菜）。' },
    ],
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`miicycle-backend on :${port}`));
