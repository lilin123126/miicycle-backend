// 謐月 MiiCycle 後端 - Cloudflare Worker 版本
// 部署：wrangler deploy

const VERSION = {
  android: { latest: '1.0.0', min: '1.0.0', forceUpdate: false, url: '' },
  ios:     { latest: '1.0.0', min: '1.0.0', forceUpdate: false, url: '' },
};

const TIPS = [
  { id: 1, phase: 'menstrual', title: '經期多休息', body: '避免高強度運動，補充鐵質與蛋白質。' },
  { id: 2, phase: 'follicular', title: '濾泡期燃脂黃金期', body: '體能最佳，適合間歇訓練與有氧。' },
  { id: 3, phase: 'luteal', title: '黃體期抗水腫', body: '減少鹽分，補充鉀（香蕉、菠菜）。' },
];

function gte(a, b) {
  const pa = a.split('.').map(Number), pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) > (pb[i] || 0)) return true;
    if ((pa[i] || 0) < (pb[i] || 0)) return false;
  }
  return true;
}

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, OPTIONS',
      'access-control-allow-headers': 'content-type',
      ...(init.headers || {}),
    },
    ...init,
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, {
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, OPTIONS',
        'access-control-allow-headers': 'content-type',
      },
    });

    const path = url.pathname;

    if (path === '/api/health') {
      return json({ ok: true, app: 'miicycle-backend', ts: Date.now() });
    }

    if (path === '/api/tips') {
      return json({ tips: TIPS });
    }

    if (path === '/api/version') {
      const platform = url.searchParams.get('platform') || 'android';
      const v = url.searchParams.get('version') || '0.0.0';
      const cfg = VERSION[platform] || VERSION.android;
      const needUpdate = !gte(cfg.latest, v);
      const forceUpdate = cfg.forceUpdate || !gte(cfg.min, v);
      return json({
        platform,
        current: v,
        latest: cfg.latest,
        needUpdate,
        forceUpdate,
        url: cfg.url,
        notes: forceUpdate ? '請更新到最新版以繼續使用' : '有新版本可用',
      });
    }

    return json({ error: 'not_found', path }, { status: 404 });
  },
};
