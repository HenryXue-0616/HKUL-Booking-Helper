// ==UserScript==
// @name         HKUL 定时预约助手
// @namespace    hkul-local-helper
// @version      2.1.0
// @description  网站内配置、香港时间定时、单次提交；无服务器、无账号上传。
// @match        https://booking.lib.hku.hk/Secure/*
// @grant        none
// @run-at       document-idle
// @noframes
// ==/UserScript==
(() => {
  'use strict';
  const LANG_KEY='hkul-helper-language';
  let language=localStorage.getItem(LANG_KEY)||'en';
  if(!['en','zh-CN','zh-TW'].includes(language))language='en';
  const translations={
  "HKUL 预约助手 · 2.1.0": {
    "en": "HKUL Booking Helper · 2.1.0",
    "zh-TW": "HKUL 預約助手 · 2.1.0"
  },
  "原站选项 · 实时同步": {
    "en": "Live options from HKUL",
    "zh-TW": "原站選項 · 即時同步"
  },
  "打开 New Booking 配置页": {
    "en": "Open New Booking page",
    "zh-TW": "開啟 New Booking 設定頁"
  },
  "Date · 原站可预约日期": {
    "en": "Date · Available booking dates",
    "zh-TW": "Date · 原站可預約日期"
  },
  "预设尚未开放的预约日期（定时用）": {
    "en": "Preset an unreleased date (scheduled booking)",
    "zh-TW": "預設尚未開放的預約日期（定時用）"
  },
  "预设日期（香港）": {
    "en": "Preset date (Hong Kong)",
    "zh-TW": "預設日期（香港）"
  },
  "正在读取原站选项…": {
    "en": "Loading options from HKUL…",
    "zh-TW": "正在讀取原站選項…"
  },
  "Description · 预约描述": {
    "en": "Description",
    "zh-TW": "Description · 預約描述"
  },
  "执行时间（香港 UTC+8）": {
    "en": "Run at (Hong Kong, UTC+8)",
    "zh-TW": "執行時間（香港 UTC+8）"
  },
  "自动提交并点击网站 Yes 确认": {
    "en": "Submit automatically and confirm Yes",
    "zh-TW": "自動提交並點擊網站 Yes 確認"
  },
  "请先阅读网站预约政策。立即提交也会先核对设施、日期和时段；不会自动换座位。": {
    "en": "Read the booking policies first. Details are checked before submission; the helper never switches facilities.",
    "zh-TW": "請先閱讀網站預約政策。立即提交前會核對設施、日期和時段；不會自動換座位。"
  },
  "立即自动提交": {
    "en": "Submit now",
    "zh-TW": "立即自動提交"
  },
  "启动定时任务": {
    "en": "Schedule booking",
    "zh-TW": "啟動定時任務"
  },
  "演练（不提交）": {
    "en": "Dry run (no submission)",
    "zh-TW": "演練（不提交）"
  },
  "取消任务": {
    "en": "Cancel task",
    "zh-TW": "取消任務"
  },
  "未启动任务": {
    "en": "No task scheduled",
    "zh-TW": "未啟動任務"
  },
  "尚未启动": {
    "en": "Not started",
    "zh-TW": "尚未啟動"
  },
  "保持标签页打开、电脑唤醒且登录有效。": {
    "en": "Keep this tab open, your computer awake, and your session signed in.",
    "zh-TW": "請保持分頁開啟、電腦喚醒且登入有效。"
  },
  "Location · 地点": {
    "en": "Location",
    "zh-TW": "Location · 地點"
  },
  "Floor · 楼层": {
    "en": "Floor",
    "zh-TW": "Floor · 樓層"
  },
  "Facility Type · 类型": {
    "en": "Facility Type",
    "zh-TW": "Facility Type · 類型"
  },
  "Facility · 设施 / 座位": {
    "en": "Facility / Seat",
    "zh-TW": "Facility · 設施 / 座位"
  },
  "（不可选）": {
    "en": " (unavailable)",
    "zh-TW": "（不可選）"
  },
  "请点击上方按钮进入 New Booking。": {
    "en": "Click the button above to open New Booking.",
    "zh-TW": "請點擊上方按鈕進入 New Booking。"
  },
  "时段来自当前设施；目标日期开放后才核验余位。": {
    "en": "Sessions belong to this facility. Availability is checked when the target date opens.",
    "zh-TW": "時段來自目前設施；目標日期開放後才核驗餘位。"
  },
  "时段名称及不可选状态与原站一致。": {
    "en": "Session names and availability match the HKUL form.",
    "zh-TW": "時段名稱及不可選狀態與原站一致。"
  },
  "网站正在更新选项，请稍后再操作。": {
    "en": "Options are updating. Please wait.",
    "zh-TW": "網站正在更新選項，請稍後再操作。"
  },
  "请在面板选好地点、楼层、类型和设施。": {
    "en": "Select a location, floor, type and facility in the panel.",
    "zh-TW": "請在面板選好地點、樓層、類型和設施。"
  },
  "已有任务，请先取消。": {
    "en": "A task already exists. Cancel it first.",
    "zh-TW": "已有任務，請先取消。"
  },
  "此浏览器不支持防重复锁，请使用新版 Chrome / Edge。": {
    "en": "Duplicate-submission protection is unavailable. Use a recent Chrome or Edge version.",
    "zh-TW": "此瀏覽器不支援防重複鎖，請使用新版 Chrome / Edge。"
  },
  "请先勾选自动提交确认。": {
    "en": "Enable automatic submission first.",
    "zh-TW": "請先勾選自動提交確認。"
  },
  "至少选择一个时段。": {
    "en": "Select at least one session.",
    "zh-TW": "至少選擇一個時段。"
  },
  "执行时间必须在将来。": {
    "en": "The run time must be in the future.",
    "zh-TW": "執行時間必須在將來。"
  },
  "预约日期不能早于执行日期。": {
    "en": "Choose a valid booking date on or after the run date.",
    "zh-TW": "請選擇不早於執行日期的有效預約日期。"
  },
  "演练已启动": {
    "en": "Dry run started",
    "zh-TW": "演練已啟動"
  },
  "等待香港时间 ": {
    "en": "Waiting until Hong Kong time: ",
    "zh-TW": "等待香港時間 "
  },
  "已取消。已发送的预约请求无法通过此按钮撤回，请检查 My Booking Record。": {
    "en": "Task cancelled. Requests already sent cannot be withdrawn here. Check My Booking Record.",
    "zh-TW": "已取消。已發送的預約請求無法透過此按鈕撤回，請檢查 My Booking Record。"
  },
  "错过执行时间超过 60 秒，已停止，避免意外补提交。": {
    "en": "Stopped: more than 60 seconds late. No late submission will be attempted.",
    "zh-TW": "錯過執行時間超過 60 秒，已停止，避免意外補提交。"
  },
  "重新载入预约表单": {
    "en": "Reloading the booking form",
    "zh-TW": "重新載入預約表單"
  },
  "执行超时。请检查网站结果及 My Booking Record；不会自动重试提交。": {
    "en": "Timed out. Check the website result and My Booking Record. Submission will not be retried.",
    "zh-TW": "執行逾時。請檢查網站結果及 My Booking Record；不會自動重試提交。"
  },
  "页面已离开 New Booking，停止操作。": {
    "en": "Stopped: no longer on the New Booking page.",
    "zh-TW": "頁面已離開 New Booking，停止操作。"
  },
  "未找到预约表单，请检查登录状态。": {
    "en": "Booking form not found. Check your login status.",
    "zh-TW": "未找到預約表單，請檢查登入狀態。"
  },
  "设施选项已改变或尚未加载：": {
    "en": "Facility option changed or not loaded: ",
    "zh-TW": "設施選項已改變或尚未載入："
  },
  "演练日期尚未开放：": {
    "en": "Dry-run date is not available yet: ",
    "zh-TW": "演練日期尚未開放："
  },
  "目标日期仍未开放：": {
    "en": "Target date is still unavailable: ",
    "zh-TW": "目標日期仍未開放："
  },
  "。已停止，未提交。": {
    "en": ". Stopped without submitting.",
    "zh-TW": "。已停止，未提交。"
  },
  "目标日期未开放，5 秒后重新读取（最多 3 次）": {
    "en": "Target date unavailable. Rechecking after 5 seconds (up to 3 times).",
    "zh-TW": "目標日期未開放，5 秒後重新讀取（最多 3 次）"
  },
  "目标时段不可选：": {
    "en": "Requested session unavailable: ",
    "zh-TW": "目標時段不可選："
  },
  "。未提交。": {
    "en": ". Nothing submitted.",
    "zh-TW": "。未提交。"
  },
  "提交前校验失败。": {
    "en": "Pre-submission check failed.",
    "zh-TW": "提交前核驗失敗。"
  },
  "演练完成：已填写设施、日期和时段；未提交。": {
    "en": "Dry run complete: facility, date and sessions filled. Nothing submitted.",
    "zh-TW": "演練完成：已填寫設施、日期和時段；未提交。"
  },
  "已按时选好，自动提交未开启，请自行提交。": {
    "en": "Form filled on schedule. Automatic submission is off; submit manually.",
    "zh-TW": "已按時選好，自動提交未開啟，請自行提交。"
  },
  "Submit 按钮不可用。": {
    "en": "The Submit button is unavailable.",
    "zh-TW": "Submit 按鈕不可用。"
  },
  "已点击 Submit，等待网站确认面板": {
    "en": "Submit clicked. Waiting for the confirmation panel.",
    "zh-TW": "已點擊 Submit，等待網站確認面板"
  },
  "网站确认内容与配置不一致，已停止，请手动检查。": {
    "en": "Confirmation details do not match your settings. Stopped; review manually.",
    "zh-TW": "網站確認內容與設定不一致，已停止，請手動檢查。"
  },
  "已发送最终确认；等待网站结果，不会重复提交": {
    "en": "Final confirmation sent. Waiting for the result; no duplicate submission.",
    "zh-TW": "已發送最終確認；等待網站結果，不會重複提交"
  },
  "网站返回：": {
    "en": "Website response: ",
    "zh-TW": "網站回覆："
  },
  "请以 My Booking Record 为准。": {
    "en": "Verify the outcome in My Booking Record.",
    "zh-TW": "請以 My Booking Record 為準。"
  },
  "倒计时 ": {
    "en": "Countdown: ",
    "zh-TW": "倒數 "
  },
  " 秒": {
    "en": " seconds",
    "zh-TW": " 秒"
  },
  "任务由另一个标签页执行。": {
    "en": "This task is running in another tab.",
    "zh-TW": "任務由另一個分頁執行。"
  },
  "已停止：": {
    "en": "Stopped: ",
    "zh-TW": "已停止："
  }
};
  const translationKeys=Object.keys(translations).sort((a,b)=>b.length-a.length);
  function t(text){
    if(language==='zh-CN')return text;
    let out=String(text||'');
    for(const key of translationKeys)out=out.split(key).join(translations[key][language]);
    return out;
  }
  const KEY = 'hkul-helper-v1', OWNER = 'hkul-helper-tab-v1';
  const ids = ['main_ddlLibrary', 'main_ddlFloor', 'main_ddlType', 'main_ddlFacility'];
  const $ = id => document.getElementById(id);
  const norm = s => String(s || '').replace(/\s+/g, ' ').trim();
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } };
  const save = j => localStorage.setItem(KEY, JSON.stringify(j));
  let owner = sessionStorage.getItem(OWNER);
  if (!owner) { owner = crypto.randomUUID(); sessionStorage.setItem(OWNER, owner); }
  const active = j => j && ['armed','prepare','confirm','sent'].includes(j.state);
  const visible = e => !!e && e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
  const hk = ms => new Date(ms + 8*3600000).toISOString().slice(0,19);
  const nextMidnight = () => hk(Date.now() + 86400000).slice(0,10) + 'T00:00:00';
  const sessionStart = text => { const m = text.match(/(\d{1,2}):(\d{2})/); return m ? Number(m[1]) * 60 + Number(m[2]) : Infinity; };
  const slots = () => Array.from(document.querySelectorAll('input[id^="main_listSession_"]')).map(e => ({e, text:norm(e.labels?.[0]?.textContent)})).sort((a,b) => sessionStart(a.text) - sessionStart(b.text));
  let busyUntil = 0, working = false;
  const host = document.createElement('div');
  host.id = 'hkul-helper-host'; document.body.append(host);
  const ui = host.attachShadow({mode:'open'});
  ui.innerHTML = `<style>
  :host{position:fixed;right:16px;bottom:16px;z-index:2147483647;font:14px/1.5 system-ui;color:#17243a}
  section{width:360px;max-height:88vh;overflow:auto;background:white;border:1px solid #bdcddd;border-radius:14px;box-shadow:0 8px 35px #0003;padding:18px}
  h3{margin:0 0 8px} label{display:block;margin:8px 0} select,input,textarea,button{font:inherit;box-sizing:border-box} select,input:not([type=checkbox]),textarea{width:100%;padding:7px;border:1px solid #bcc9d7;border-radius:6px} button{padding:8px;margin:4px 4px 4px 0;border:0;border-radius:6px;background:#e7edf4;cursor:pointer} button.primary{background:#1269ba;color:white} button:disabled,select:disabled{opacity:.55;cursor:default} #slots{display:grid;grid-template-columns:1fr 1fr;max-height:150px;overflow:auto} #slots label{margin:3px;font-size:12px} pre{white-space:pre-wrap;font:12px/1.5 system-ui;background:#f1f5f9;padding:9px} small{color:#526174} summary{cursor:pointer}
  </style><section><label>Language / 語言<select id="language"><option value="en">English</option><option value="zh-CN">简体中文</option><option value="zh-TW">繁體中文</option></select></label><h3><span data-i18n="HKUL 预约助手 · 2.1.0">HKUL 预约助手 · 2.1.0</span></h3><details open><summary><span data-i18n="原站选项 · 实时同步">原站选项 · 实时同步</span></summary>
  <button id="open" type="button"><span data-i18n="打开 New Booking 配置页">打开 New Booking 配置页</span></button>
  <div id="fields"></div>
  <label><span data-i18n="Date · 原站可预约日期">Date · 原站可预约日期</span><select id="siteDate"></select></label>
  <label><input id="future" type="checkbox"><span data-i18n="预设尚未开放的预约日期（定时用）"> 预设尚未开放的预约日期（定时用）</span></label>
  <label id="futureRow" hidden><span data-i18n="预设日期（香港）">预设日期（香港）</span><input id="date" type="date"></label>
  <small id="hint"><span data-i18n="正在读取原站选项…">正在读取原站选项…</span></small><div id="slots"></div>
  <label><span data-i18n="Description · 预约描述">Description · 预约描述</span><textarea id="description" rows="2"></textarea></label>
  <label><span data-i18n="执行时间（香港 UTC+8）">执行时间（香港 UTC+8）</span><input id="when" type="datetime-local" step="1"></label>
  <label><input id="auto" type="checkbox"><span data-i18n="自动提交并点击网站 Yes 确认"> 自动提交并点击网站 Yes 确认</span></label>
  <small><span data-i18n="请先阅读网站预约政策。立即提交也会先核对设施、日期和时段；不会自动换座位。">请先阅读网站预约政策。立即提交也会先核对设施、日期和时段；不会自动换座位。</span></small>
  <div><button class="primary" id="now" type="button"><span data-i18n="立即自动提交">立即自动提交</span></button><button class="primary" id="arm" type="button"><span data-i18n="启动定时任务">启动定时任务</span></button><button id="test" type="button"><span data-i18n="演练（不提交）">演练（不提交）</span></button><button id="stop" type="button"><span data-i18n="取消任务">取消任务</span></button></div>
  </details><pre id="summary"><span data-i18n="未启动任务">未启动任务</span></pre><pre id="status" role="status"><span data-i18n="尚未启动">尚未启动</span></pre><small><span data-i18n="保持标签页打开、电脑唤醒且登录有效。">保持标签页打开、电脑唤醒且登录有效。</span></small></section>`;
  const q = id => ui.getElementById(id);
  q('language').value=language;
  function localizeStatic(){ui.querySelectorAll('[data-i18n]').forEach(e=>{e.textContent=t(e.dataset.i18n);});}
  localizeStatic();
  q('when').value=nextMidnight(); q('date').value=nextMidnight().slice(0,10);
  let config=null, slotSignature='', selectedContext='', lastDraft='';
  const mirrors=new Map(), labels=['Location · 地点','Floor · 楼层','Facility Type · 类型','Facility · 设施 / 座位'];
  ids.forEach((id,i)=>{
    const label=document.createElement('label'), select=document.createElement('select');
    const caption=document.createElement('span');caption.dataset.i18n=labels[i];caption.textContent=t(labels[i]);label.append(caption,select);q('fields').append(label);mirrors.set(id,select);
    select.onchange=()=>{
      if(active(read())||loading())return;
      const original=$(id);if(!original)return;
      slotSignature='';q('slots').replaceChildren();
      change(original,select.value);
    };
  });
  function loading(){return Date.now()<busyUntil || !!window.Sys?.WebForms?.PageRequestManager?.getInstance()?.get_isInAsyncPostBack();}
  function mirrorOptions(source,target,locked){
    const data=source?Array.from(source.options).map(o=>[o.value,o.text,o.disabled]):[];
    const signature=JSON.stringify(data);
    if(target.dataset.signature!==signature){
      target.replaceChildren();for(const [value,text,disabled] of data){const o=document.createElement('option');o.value=value;o.textContent=text;o.disabled=disabled;target.append(o);}target.dataset.signature=signature;
    }
    target.value=source?.value||'';target.disabled=locked||!source||source.disabled||!data.length;
  }
  function syncOptions(){
    const locked=active(read()), pending=loading(), onForm=location.pathname.endsWith('/NewBooking.aspx');
    q('open').hidden=onForm;
    for(const [id,select] of mirrors)mirrorOptions($(id),select,locked||pending||!onForm);
    mirrorOptions($('main_ddlDate'),q('siteDate'),locked||pending||q('future').checked||!onForm);
    q('futureRow').hidden=!q('future').checked;
    for(const id of ['future','date','when','description','auto'])q(id).disabled=locked;
    for(const id of ['arm','now','test'])q(id).disabled=locked||pending||!onForm;
    for(const box of q('slots').querySelectorAll('input'))if(locked||pending)box.disabled=true;
    if(locked||pending){slotSignature='';return;}
    const ss=slots(), future=q('future').checked;
    const context=ids.map(id=>$(id)?.value||'').join('|')+'|'+(future?'future:'+q('date').value:$('main_ddlDate')?.value);
    const signature=language+context+JSON.stringify(ss.map(s=>[s.text,s.e.disabled]));
    if(signature!==slotSignature){
      const selected=context===selectedContext?Array.from(q('slots').querySelectorAll('input:checked')).map(e=>e.value):[];
      q('slots').replaceChildren();
      for(const s of ss){const label=document.createElement('label'),box=document.createElement('input');box.type='checkbox';box.value=s.text;box.disabled=!future&&s.e.disabled;box.checked=!box.disabled&&selected.includes(s.text);label.append(box,document.createTextNode(s.text+(!future&&s.e.disabled?t('（不可选）'):'')));q('slots').append(label);}
      slotSignature=signature;selectedContext=context;
    }
    q('hint').textContent=t(!onForm?'请点击上方按钮进入 New Booking。':future?'时段来自当前设施；目标日期开放后才核验余位。':'时段名称及不可选状态与原站一致。');
  }
  function capture(){
    if(loading())throw Error('网站正在更新选项，请稍后再操作。');
    const fields=ids.map(id=>{const e=$(id);if(!e?.value)throw Error('请在面板选好地点、楼层、类型和设施。');return{id,value:e.value,text:norm(e.selectedOptions[0].text)};});
    config={fields,availableSlots:slots().map(s=>s.text)};
  }
  const draftKey='hkul-helper-draft-v2';
  let draft;try{draft=JSON.parse(sessionStorage.getItem(draftKey)||'null');}catch{}
  if(draft){for(const id of ['date','when','description'])if(draft[id])q(id).value=draft[id];q('future').checked=!!draft.future;q('auto').checked=!!draft.auto;}
  function persistDraft(){const d={};for(const id of ['date','when','description'])d[id]=q(id).value;d.future=q('future').checked;d.auto=q('auto').checked;const json=JSON.stringify(d);if(json!==lastDraft){sessionStorage.setItem(draftKey,json);lastDraft=json;}}
  q('open').onclick=()=>{location.href='https://booking.lib.hku.hk/Secure/NewBooking.aspx';};
  q('siteDate').onchange=()=>{if(!active(read())&&!loading()&&$('main_ddlDate'))change($('main_ddlDate'),q('siteDate').value);};
  q('future').onchange=()=>{slotSignature='';syncOptions();};
  q('language').onchange=()=>{
    language=q('language').value;localStorage.setItem(LANG_KEY,language);
    localizeStatic();slotSignature='';syncOptions();
    const j=read();if(j)q('status').textContent=t(j.message);else q('status').textContent=t('尚未启动');
    if(!j?.config)q('summary').textContent=t('未启动任务');
  };
  function fail(j, message) { j.state='stopped'; j.message=message; save(j); }
  function start(dry, immediate=false) {
    if (active(read())) throw Error('已有任务，请先取消。');
    if (!navigator.locks) throw Error('此浏览器不支持防重复锁，请使用新版 Chrome / Edge。');
    capture();
    if(immediate && !dry && !q('auto').checked)throw Error('请先勾选自动提交确认。');
    const sessions=Array.from(q('slots').querySelectorAll('input:checked')).map(e=>e.value);
    if (!sessions.length) throw Error('至少选择一个时段。');
    const at=(dry||immediate)?Date.now():Date.parse(q('when').value+'+08:00');
    if (!Number.isFinite(at) || (!dry && !immediate && at<=Date.now())) throw Error('执行时间必须在将来。');
    const date=q('future').checked?q('date').value:$('main_ddlDate')?.value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date<hk(at).slice(0,10)) throw Error('预约日期不能早于执行日期。');
    const c={...config,date,sessions,auto:!dry&&q('auto').checked,description:q('description').value};
    save({id:crypto.randomUUID(),owner,state:'armed',at,config:c,dry,message:dry?'演练已启动':'等待香港时间 '+hk(at).replace('T',' ')});
  }
  const handle = fn => () => { try {fn();} catch(e) {q('status').textContent=t(e.message);} };
  q('now').onclick=handle(()=>start(false,true)); q('arm').onclick=handle(()=>start(false)); q('test').onclick=handle(()=>start(true));
  q('stop').onclick=()=>{const j=read();if(j)fail(j,'已取消。已发送的预约请求无法通过此按钮撤回，请检查 My Booking Record。');};
  function change(e,value) { e.value=value; busyUntil=Date.now()+1800; e.dispatchEvent(new Event('change',{bubbles:true})); }
  function sameFields(c) { return c.fields.every(f=>$(f.id)?.value===f.value && norm($(f.id)?.selectedOptions[0]?.text)===f.text); }
  function clickOnce(j,state,e,message) { j.state=state;j.stepAt=Date.now();j.message=message;save(j);busyUntil=Date.now()+1800;e.click(); }
  async function step() {
    const j=read(); if(!active(j)||j.owner!==owner) return;
    const now=Date.now(), c=j.config;
    if(j.state==='armed') {
      if(now<j.at) return;
      if(now-j.at>60000) return fail(j,'错过执行时间超过 60 秒，已停止，避免意外补提交。');
      j.state='prepare';j.started=now;j.message='重新载入预约表单';save(j);
      location.href='https://booking.lib.hku.hk/Secure/NewBooking.aspx';return;
    }
    if(now-(j.started||j.at)>120000) return fail(j,'执行超时。请检查网站结果及 My Booking Record；不会自动重试提交。');
    if(!location.pathname.endsWith('/NewBooking.aspx')) return fail(j,'页面已离开 New Booking，停止操作。');
    if(now<busyUntil) return;
    // ASP.NET UpdatePanel postbacks must finish before reading dependent options.
    if(window.Sys?.WebForms?.PageRequestManager?.getInstance()?.get_isInAsyncPostBack()) return;
    if(j.state==='prepare') {
      for(const f of c.fields) {
        const e=$(f.id); if(!e) return fail(j,'未找到预约表单，请检查登录状态。');
        const option=Array.from(e.options).find(o=>o.value===f.value&&norm(o.text)===f.text);
        if(!option) return fail(j,'设施选项已改变或尚未加载：'+f.text);
        if(e.value!==f.value) {change(e,f.value);return;}
      }
      const date=$('main_ddlDate');
      if(!date || !Array.from(date.options).some(o=>o.value===c.date)) {
        if(j.dry)return fail(j,'演练日期尚未开放：'+c.date);
        if((j.dateRetries||0)>=3)return fail(j,'目标日期仍未开放：'+c.date+'。已停止，未提交。');
        if(!j.retryAt){j.retryAt=now+5000;j.message='目标日期未开放，5 秒后重新读取（最多 3 次）';save(j);return;}
        if(now<j.retryAt)return;
        j.dateRetries=(j.dateRetries||0)+1;j.retryAt=0;save(j);location.reload();return;
      }
      if(date.value!==c.date) {change(date,c.date);return;}
      const ss=slots();
      for(const text of c.sessions) { const matches=ss.filter(s=>s.text===text);if(matches.length!==1||matches[0].e.disabled) return fail(j,'目标时段不可选：'+text+'。未提交。'); }
      for(const s of ss) s.e.checked=c.sessions.includes(s.text);
      const desc=$('main_txtUserDescription');if(desc){desc.value=c.description;desc.dispatchEvent(new Event('input',{bubbles:true}));}
      if(!sameFields(c)||$('main_ddlDate').value!==c.date) return fail(j,'提交前校验失败。');
      if(!c.auto) return fail(j,j.dry?'演练完成：已填写设施、日期和时段；未提交。':'已按时选好，自动提交未开启，请自行提交。');
      const submit=$('main_btnSubmit');if(!visible(submit)||submit.disabled)return fail(j,'Submit 按钮不可用。');
      clickOnce(j,'confirm',submit,'已点击 Submit，等待网站确认面板');return;
    }
    if(j.state==='confirm') {
      const yes=$('main_btnSubmitYes');
      if(!visible(yes)||yes.disabled) return;
      const txt=id=>norm($(id)?.textContent);
      const times=(txt('main_lblSubmitSession').match(/\d{2}:\d{2}\s*-\s*\d{2}:\d{2}/g)||[]).map(norm).sort();
      if(txt('main_lblSubmitFacility')!==c.fields[3].text || txt('main_lblSubmitType')!==c.fields[2].text || !txt('main_lblSubmitDate').includes(c.date) || JSON.stringify(times)!==JSON.stringify([...c.sessions].sort()) || !sameFields(c)) return fail(j,'网站确认内容与配置不一致，已停止，请手动检查。');
      clickOnce(j,'sent',yes,'已发送最终确认；等待网站结果，不会重复提交');return;
    }
    if(j.state==='sent') {
      const result=$('main_lblResult');
      if(visible(result)&&norm(result.textContent)) {j.state='finished';j.message='网站返回：'+norm(result.textContent)+'\n请以 My Booking Record 为准。';save(j);}
    }
  }
  setInterval(async()=>{
    syncOptions();persistDraft();
    const j=read();
    if(j?.config)q('summary').textContent=j.config.fields.map(f=>f.text).join(' / ')+'\n'+j.config.date+'\n'+j.config.sessions.join(', ');
    if(j) q('status').textContent=t(j.message+(j.state==='armed'?'\n倒计时 '+Math.max(0,Math.ceil((j.at-Date.now())/1000))+' 秒':'')+(active(j)&&j.owner!==owner?'\n任务由另一个标签页执行。':''));
    if(working||!navigator.locks)return;working=true;
    try {await navigator.locks.request(KEY,{ifAvailable:true},async lock=>{if(lock)await step();});}
    catch(e){const current=read();if(active(current)&&current.owner===owner)fail(current,'已停止：'+e.message);}
    finally{working=false;}
  },250);
})();
