const MODEL = {
  intercept: -7.934628361921337,
  num: {
    age: { mean: 15.928333, scale: 2.021105, coef: -0.208194, label: 'Usia' },
    daily_social_media_hours: { mean: 4.536667, scale: 2.028753, coef: 2.234711, label: 'Durasi Media Sosial' },
    sleep_hours: { mean: 6.449417, scale: 1.442076, coef: -3.448389, label: 'Durasi Tidur' },
    screen_time_before_sleep: { mean: 1.740333, scale: 0.716361, coef: -0.075589, label: 'Layar Sebelum Tidur' },
    academic_performance: { mean: 2.990383, scale: 0.576517, coef: 0.637618, label: 'Performa Akademik' },
    physical_activity: { mean: 1.014500, scale: 0.581942, coef: -0.339126, label: 'Aktivitas Fisik' },
    stress_level: { mean: 5.445833, scale: 2.902080, coef: 2.567159, label: 'Tingkat Stres' },
    anxiety_level: { mean: 5.636667, scale: 2.858261, coef: 3.263100, label: 'Tingkat Kecemasan' },
    addiction_level: { mean: 5.565000, scale: 2.829448, coef: 0.330641, label: 'Adiksi Medsos' }
  },
  cat: {
    gender_male: -1.573849,
    platform_usage_Instagram: -0.995547,
    platform_usage_TikTok: 0.110934,
    social_interaction_level_low: 0.302676,
    social_interaction_level_medium: 1.222722
  }
};

let state = {
  gender: 'female',
  platform_usage: 'Both',
  social_interaction_level: 'medium'
};

function setGender(val) {
  state.gender = val;
  ['female', 'male'].forEach(g => {
    const el = document.getElementById('btn-' + g);
    el.className = g === val
      ? 'py-1.5 rounded-md bg-white text-slate-900 shadow-sm'
      : 'py-1.5 rounded-md text-slate-600';
  });
  update();
}

function setPlatform(val) {
  state.platform_usage = val;
  ['Instagram', 'TikTok', 'Both'].forEach(p => {
    const el = document.getElementById('plat-' + p);
    el.className = p === val
      ? 'py-1.5 rounded-md bg-white text-slate-900 shadow-sm'
      : 'py-1.5 rounded-md text-slate-600';
  });
  update();
}

function setSocial(val) {
  state.social_interaction_level = val;
  ['low', 'medium', 'high'].forEach(s => {
    const el = document.getElementById('soc-' + s);
    el.className = s === val
      ? 'py-1.5 rounded-md bg-white text-slate-900 shadow-sm'
      : 'py-1.5 rounded-md text-slate-600';
  });
  update();
}

function applyPreset(type) {
  const presets = {
    sehat: {
      age: 16, gender: 'male', daily_social_media_hours: 2.0, platform_usage: 'Instagram',
      sleep_hours: 8.2, screen_time_before_sleep: 0.6, academic_performance: 3.6,
      physical_activity: 1.6, social_interaction_level: 'high',
      stress_level: 2, anxiety_level: 2, addiction_level: 2
    },
    rata: {
      age: 16, gender: 'female', daily_social_media_hours: 4.5, platform_usage: 'Both',
      sleep_hours: 6.5, screen_time_before_sleep: 1.7, academic_performance: 3.0,
      physical_activity: 1.0, social_interaction_level: 'medium',
      stress_level: 5, anxiety_level: 6, addiction_level: 6
    },
    tinggi: {
      age: 15, gender: 'female', daily_social_media_hours: 7.6, platform_usage: 'TikTok',
      sleep_hours: 4.3, screen_time_before_sleep: 2.8, academic_performance: 2.2,
      physical_activity: 0.2, social_interaction_level: 'medium',
      stress_level: 9, anxiety_level: 9, addiction_level: 9
    }
  };
  const p = presets[type];
  Object.keys(MODEL.num).forEach(k => {
    document.getElementById(k).value = p[k];
  });
  setGender(p.gender);
  setPlatform(p.platform_usage);
  setSocial(p.social_interaction_level);
}

function update() {
  let logit = MODEL.intercept;
  const contributions = [];

  for (const [key, cfg] of Object.entries(MODEL.num)) {
    const raw = parseFloat(document.getElementById(key).value);
    const valEl = document.getElementById('val-' + key);
    if (key === 'age') valEl.textContent = raw + ' thn';
    else if (key === 'academic_performance') valEl.textContent = raw.toFixed(2);
    else if (['stress_level', 'anxiety_level', 'addiction_level'].includes(key)) valEl.textContent = raw;
    else valEl.textContent = raw.toFixed(1) + ' jam';

    const z = (raw - cfg.mean) / cfg.scale;
    const contrib = z * cfg.coef;
    logit += contrib;
    contributions.push({ label: cfg.label, contrib });
  }

  if (state.gender === 'male') {
    logit += MODEL.cat.gender_male;
    contributions.push({ label: 'Jenis Kelamin (Laki-laki)', contrib: MODEL.cat.gender_male });
  }
  if (state.platform_usage === 'Instagram') {
    logit += MODEL.cat.platform_usage_Instagram;
    contributions.push({ label: 'Platform Instagram', contrib: MODEL.cat.platform_usage_Instagram });
  } else if (state.platform_usage === 'TikTok') {
    logit += MODEL.cat.platform_usage_TikTok;
    contributions.push({ label: 'Platform TikTok', contrib: MODEL.cat.platform_usage_TikTok });
  }
  if (state.social_interaction_level === 'low') {
    logit += MODEL.cat.social_interaction_level_low;
    contributions.push({ label: 'Interaksi Sosial Rendah', contrib: MODEL.cat.social_interaction_level_low });
  } else if (state.social_interaction_level === 'medium') {
    logit += MODEL.cat.social_interaction_level_medium;
    contributions.push({ label: 'Interaksi Sosial Sedang', contrib: MODEL.cat.social_interaction_level_medium });
  }

  const prob = 1 / (1 + Math.exp(-logit));
  const pct = (prob * 100).toFixed(1) + '%';
  document.getElementById('prob-text').textContent = pct;

  const badge = document.getElementById('risk-badge');
  if (prob < 0.25) {
    badge.textContent = 'Risiko Rendah';
    badge.className = 'px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700';
  } else if (prob < 0.60) {
    badge.textContent = 'Perlu Perhatian';
    badge.className = 'px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700';
  } else {
    badge.textContent = 'Risiko Tinggi';
    badge.className = 'px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700';
  }

  contributions.sort((a, b) => Math.abs(b.contrib) - Math.abs(a.contrib));
  const top3 = contributions.slice(0, 3);
  const listEl = document.getElementById('top-factors');
  listEl.innerHTML = top3.map(item => {
    const isRisk = item.contrib > 0;
    const tag = isRisk
      ? '<span class="text-rose-600 font-medium">Menaikkan risiko</span>'
      : '<span class="text-emerald-600 font-medium">Melindungi</span>';
    return `<li class="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
      <span class="font-medium text-slate-700">${item.label}</span>
      ${tag}
    </li>`;
  }).join('');
}

update();
