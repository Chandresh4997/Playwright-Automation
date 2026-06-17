'use strict';

const fs   = require('fs');
const path = require('path');

const JSON_PATH   = path.resolve(__dirname, '..', 'reports', 'cucumber.json');
const OUTPUT_PATH = path.resolve(__dirname, '..', 'reports', 'cucumber-report.html');

// ─── helpers ────────────────────────────────────────────────────────────────

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtDur(ns) {
  // cucumber JSON durations are in nanoseconds
  const ms = Math.round(ns / 1_000_000);
  if (ms < 1000)  return ms + 'ms';
  if (ms < 60000) return (ms / 1000).toFixed(1) + 's';
  return Math.floor(ms / 60000) + 'm ' + Math.round((ms % 60000) / 1000) + 's';
}

function scenarioStatus(steps) {
  if (steps.some(s => s.result?.status === 'failed'))  return 'failed';
  if (steps.some(s => s.result?.status === 'skipped')) return 'skipped';
  if (steps.every(s => s.result?.status === 'passed')) return 'passed';
  return 'pending';
}

function featureStatus(scenarios) {
  if (scenarios.some(s => s._status === 'failed'))  return 'failed';
  if (scenarios.every(s => s._status === 'passed')) return 'passed';
  return 'partial';
}

// ─── parse ──────────────────────────────────────────────────────────────────

let raw;
try {
  raw = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
} catch (e) {
  console.error('Could not read', JSON_PATH, ':', e.message);
  process.exit(1);
}

const features = raw.map(feature => {
  const scenarios = (feature.elements || []).map(el => {
    const steps = el.steps || [];
    const dur   = steps.reduce((a, s) => a + (s.result?.duration ?? 0), 0);
    const status = scenarioStatus(steps);
    return { name: el.name, tags: (el.tags || []).map(t => t.name), steps, dur, _status: status };
  });
  const pass = scenarios.filter(s => s._status === 'passed').length;
  const fail = scenarios.filter(s => s._status === 'failed').length;
  const skip = scenarios.filter(s => s._status === 'skipped').length;
  const dur  = scenarios.reduce((a, s) => a + s.dur, 0);
  return {
    name: feature.name,
    uri:  feature.uri,
    tags: (feature.tags || []).map(t => t.name),
    scenarios, pass, fail, skip, dur,
    _status: featureStatus(scenarios),
  };
});

// ─── summary numbers ────────────────────────────────────────────────────────

const allScenarios = features.flatMap(f => f.scenarios);
const totalPass    = allScenarios.filter(s => s._status === 'passed').length;
const totalFail    = allScenarios.filter(s => s._status === 'failed').length;
const totalSkip    = allScenarios.filter(s => s._status === 'skipped').length;
const totalCount   = allScenarios.length;
const totalDur     = allScenarios.reduce((a, s) => a + s.dur, 0);
const env          = process.env.NODE_ENV || 'local';
const generatedAt  = new Date().toLocaleString();

const passWidth  = totalCount ? (totalPass / totalCount * 100).toFixed(1) : 0;
const failWidth  = totalCount ? (totalFail / totalCount * 100).toFixed(1) : 0;
const skipWidth  = totalCount ? (totalSkip / totalCount * 100).toFixed(1) : 0;

// ─── HTML builders ──────────────────────────────────────────────────────────

function stepDotClass(status) {
  if (status === 'passed')  return 'sd-pass';
  if (status === 'failed')  return 'sd-fail';
  return 'sd-skip';
}

function stepIcon(status) {
  if (status === 'passed')  return '✓';
  if (status === 'failed')  return '✕';
  return '–';
}

function renderStep(step) {
  const status  = step.result?.status ?? 'skipped';
  const errMsg  = step.result?.error_message ?? '';
  const errHtml = errMsg
    ? `<div class="error-box">${esc(errMsg)}</div>`
    : '';
  return `
      <div class="step">
        <div class="step-dot ${stepDotClass(status)}">${stepIcon(status)}</div>
        <div class="step-text">
          <span class="step-kw">${esc(step.keyword?.trim())}</span> ${esc(step.name)}
          ${errHtml}
        </div>
      </div>`;
}

function renderScenario(s) {
  const stepsHtml  = s.steps.map(renderStep).join('');
  const autoOpen   = s._status === 'failed' ? ' open' : '';
  const statusText = s._status === 'passed' ? '✓ passed'
                   : s._status === 'failed' ? '✕ failed'
                   : '– ' + s._status;
  return `
    <div class="scenario">
      <div class="scenario-header" onclick="toggleSteps(this)">
        <span class="scenario-name">${esc(s.name)}</span>
        <span class="scenario-status status-${s._status}">${statusText}</span>
        <span class="scenario-duration">${fmtDur(s.dur)}</span>
      </div>
      <div class="steps${autoOpen}">${stepsHtml}</div>
    </div>`;
}

function renderFeature(f, idx) {
  const isOpen     = f._status === 'failed' || idx === 0;
  const tagsHtml   = f.tags.map(t => `<span class="tag">${esc(t)}</span>`).join(' ');
  const scenHtml   = f.scenarios.map(renderScenario).join('');
  return `
  <div class="feature" data-status="${f._status}">
    <div class="feature-header" onclick="toggleFeature(this)">
      <div class="feature-icon ${f._status === 'failed' ? 'fi-fail' : 'fi-pass'}">
        ${f._status === 'failed' ? '✕' : '✓'}
      </div>
      <div style="flex:1;min-width:0;">
        <div class="feature-name">${esc(f.name)}</div>
        ${tagsHtml ? `<div style="margin-top:3px;display:flex;gap:4px;flex-wrap:wrap;">${tagsHtml}</div>` : ''}
      </div>
      <div class="feature-counts">
        ${f.pass ? `<span class="pill pill-pass">✓ ${f.pass}</span>` : ''}
        ${f.fail ? `<span class="pill pill-fail">✕ ${f.fail}</span>` : ''}
        ${f.skip ? `<span class="pill pill-skip">– ${f.skip}</span>` : ''}
        <span class="dur">${fmtDur(f.dur)}</span>
      </div>
      <span class="chevron">▾</span>
    </div>
    <div class="scenarios" style="${isOpen ? '' : 'display:none'}">${scenHtml}</div>
  </div>`;
}

// ─── full HTML ───────────────────────────────────────────────────────────────

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Test Report</title>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:         #f5f7fa;
  --surface:    #ffffff;
  --surface-2:  #f0f2f6;
  --border:     rgba(0,0,0,0.08);
  --border-mid: rgba(0,0,0,0.14);
  --text:       #111827;
  --text-2:     #6b7280;
  --text-3:     #9ca3af;
  --pass:       #1d9e75;
  --pass-bg:    #eaf3de;
  --pass-text:  #3b6d11;
  --fail:       #e24b4a;
  --fail-bg:    #fcebeb;
  --fail-text:  #a32d2d;
  --skip:       #ba7517;
  --skip-bg:    #faeeda;
  --skip-text:  #633806;
  --info-bg:    #e6f1fb;
  --info-text:  #185fa5;
  --radius:     8px;
  --radius-lg:  12px;
  --mono:       'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg:         #0e1117;
    --surface:    #161b27;
    --surface-2:  #1e2433;
    --border:     rgba(255,255,255,0.08);
    --border-mid: rgba(255,255,255,0.14);
    --text:       #f1f5f9;
    --text-2:     #94a3b8;
    --text-3:     #64748b;
    --pass-bg:    #17312a;
    --pass-text:  #6ee7b7;
    --fail-bg:    #2f1515;
    --fail-text:  #fca5a5;
    --skip-bg:    #2b1f0a;
    --skip-text:  #fcd34d;
    --info-bg:    #0c2142;
    --info-text:  #93c5fd;
  }
}

body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); font-size: 14px; line-height: 1.5; }
a { color: var(--info-text); }

.wrap { max-width: 860px; margin: 0 auto; padding: 32px 20px 60px; }

/* ── top bar ── */
.top-bar { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
.top-bar h1 { font-size: 20px; font-weight: 600; color: var(--text); display: flex; align-items: center; gap: 8px; }
.top-bar h1 svg { color: var(--text-2); }
.meta { font-size: 12px; color: var(--text-2); margin-top: 4px; }
.env-badge { display: inline-block; background: var(--info-bg); color: var(--info-text); font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 99px; }

/* ── stats ── */
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 10px; margin-bottom: 16px; }
.stat { background: var(--surface); border: 0.5px solid var(--border); border-radius: var(--radius); padding: 14px 16px; }
.stat-label { font-size: 11px; color: var(--text-2); margin-bottom: 6px; text-transform: uppercase; letter-spacing: .04em; }
.stat-value { font-size: 24px; font-weight: 600; }
.sv-pass { color: var(--pass); }
.sv-fail { color: var(--fail); }
.sv-skip { color: var(--skip); }

/* ── progress bar ── */
.prog { height: 5px; background: var(--surface-2); border-radius: 99px; margin-bottom: 20px; overflow: hidden; display: flex; }
.p { height: 100%; }
.p-pass { background: var(--pass); }
.p-fail { background: var(--fail); }
.p-skip { background: var(--skip); }

/* ── filter bar ── */
.filter-bar { display: flex; gap: 6px; margin-bottom: 16px; flex-wrap: wrap; }
.fbtn { font-size: 12px; font-weight: 500; padding: 5px 12px; border-radius: var(--radius); border: 0.5px solid var(--border-mid); background: var(--surface); color: var(--text-2); cursor: pointer; transition: all .15s; }
.fbtn:hover { background: var(--surface-2); }
.fbtn.active { background: var(--text); color: var(--surface); border-color: transparent; }

/* ── features ── */
.features { display: flex; flex-direction: column; gap: 8px; }
.feature { background: var(--surface); border: 0.5px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
.feature-header { padding: 12px 14px; display: flex; align-items: center; gap: 10px; cursor: pointer; }
.feature-header:hover { background: var(--surface-2); }

.feature-icon { width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
.fi-pass { background: var(--pass-bg); color: var(--pass-text); }
.fi-fail { background: var(--fail-bg); color: var(--fail-text); }

.feature-name { font-size: 14px; font-weight: 500; color: var(--text); }
.feature-counts { display: flex; gap: 6px; align-items: center; flex-shrink: 0; }
.pill { font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 99px; }
.pill-pass { background: var(--pass-bg); color: var(--pass-text); }
.pill-fail { background: var(--fail-bg); color: var(--fail-text); }
.pill-skip { background: var(--skip-bg); color: var(--skip-text); }
.dur { font-size: 11px; color: var(--text-3); }
.tag { font-size: 11px; color: var(--info-text); background: var(--info-bg); padding: 2px 6px; border-radius: 4px; }

.chevron { font-size: 16px; color: var(--text-3); line-height: 1; transition: transform .2s; flex-shrink: 0; }
.chevron.open { transform: rotate(180deg); }

/* ── scenarios ── */
.scenarios { border-top: 0.5px solid var(--border); }
.scenario { padding: 10px 14px 10px 52px; border-bottom: 0.5px solid var(--border); }
.scenario:last-child { border-bottom: none; }
.scenario-header { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.scenario-name { font-size: 13px; color: var(--text); flex: 1; min-width: 0; }
.scenario-status { font-size: 11px; font-weight: 600; flex-shrink: 0; }
.scenario-duration { font-size: 11px; color: var(--text-3); flex-shrink: 0; }
.status-passed  { color: var(--pass); }
.status-failed  { color: var(--fail); }
.status-skipped { color: var(--skip); }
.status-pending { color: var(--skip); }

.steps { margin-top: 8px; display: none; }
.steps.open { display: block; }
.step { display: flex; align-items: flex-start; gap: 7px; padding: 3px 0; }
.step-dot { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; margin-top: 1px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; }
.sd-pass { background: var(--pass-bg); color: var(--pass-text); }
.sd-fail { background: var(--fail-bg); color: var(--fail-text); }
.sd-skip { background: var(--skip-bg); color: var(--skip-text); }
.step-text { font-size: 12px; color: var(--text-2); line-height: 1.5; }
.step-kw { color: var(--text); font-weight: 600; }
.error-box { background: var(--surface-2); border-left: 2px solid var(--fail); padding: 8px 10px; border-radius: 0 4px 4px 0; margin-top: 6px; font-size: 11px; font-family: var(--mono); white-space: pre-wrap; word-break: break-all; color: var(--text-2); }

.empty { text-align: center; padding: 40px; color: var(--text-2); }
</style>
</head>
<body>
<div class="wrap">

  <div class="top-bar">
    <div>
      <h1>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>
        Test Report
      </h1>
      <div class="meta">Generated ${esc(generatedAt)} &nbsp;·&nbsp; <span class="env-badge">${esc(env)}</span></div>
    </div>
  </div>

  <div class="stats">
    <div class="stat"><div class="stat-label">Total</div><div class="stat-value">${totalCount}</div></div>
    <div class="stat"><div class="stat-label">Passed</div><div class="stat-value sv-pass">${totalPass}</div></div>
    <div class="stat"><div class="stat-label">Failed</div><div class="stat-value sv-fail">${totalFail}</div></div>
    <div class="stat"><div class="stat-label">Skipped</div><div class="stat-value sv-skip">${totalSkip}</div></div>
    <div class="stat"><div class="stat-label">Duration</div><div class="stat-value">${fmtDur(totalDur)}</div></div>
  </div>

  <div class="prog">
    <div class="p p-pass" style="width:${passWidth}%"></div>
    <div class="p p-fail" style="width:${failWidth}%"></div>
    <div class="p p-skip" style="width:${skipWidth}%"></div>
  </div>

  <div class="filter-bar">
    <button class="fbtn active" onclick="setFilter('all',this)">All</button>
    <button class="fbtn" onclick="setFilter('failed',this)">Failed</button>
    <button class="fbtn" onclick="setFilter('passed',this)">Passed</button>
    <button class="fbtn" onclick="setFilter('skipped',this)">Skipped</button>
  </div>

  <div class="features" id="features-list">
    ${features.map(renderFeature).join('\n')}
  </div>

</div>

<script>
function toggleFeature(header) {
  const body = header.nextElementSibling;
  const chev = header.querySelector('.chevron');
  const open = body.style.display !== 'none';
  body.style.display = open ? 'none' : '';
  chev.classList.toggle('open', !open);
}

function toggleSteps(header) {
  header.nextElementSibling.classList.toggle('open');
}

function setFilter(f, btn) {
  document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.feature').forEach(el => {
    const status = el.dataset.status;
    const show =
      f === 'all'     ? true :
      f === 'failed'  ? status === 'failed' :
      f === 'passed'  ? status === 'passed' :
      f === 'skipped' ? status === 'partial' || el.querySelectorAll('.status-skipped').length > 0 :
      true;
    el.style.display = show ? '' : 'none';
  });
}
</script>
</body>
</html>`;

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, html, 'utf8');
console.log('Report written to:', OUTPUT_PATH);