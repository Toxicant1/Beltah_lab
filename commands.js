// commands.js
// Extras commands module for Beltah CyberLab
// Usage:
//   registerCommands(api)
// or if not passing api, module will try to auto-detect window functions.

(function (global) {
  function detectAPI() {
    const win = global || window;
    return {
      term: win.term || (m => { const t = document.getElementById('terminalOut'); if(t){ const d=document.createElement('div'); d.textContent=m; t.appendChild(d); t.scrollTop=t.scrollHeight } }),
      pushFeed: win.pushFeed || (m => { const f = document.getElementById('feedBox'); if(f){ const row=document.createElement('div'); row.className='feedLine'; const time=document.createElement('div'); time.className='feedTime'; time.textContent = new Date().toLocaleTimeString(); const body=document.createElement('div'); body.textContent = m; row.appendChild(time); row.appendChild(body); f.appendChild(row); f.scrollTop=f.scrollHeight } }),
      simPing: win.simPing || (id => { console.warn('simPing not found, fallback noop for', id); }),
      pushSpark: win.pushSpark || (v=>{}),
      process: win.process || (cmd => { console.warn('process not found', cmd); }),
    };
  }

  function traceRoute(api, target) {
    const hops = Math.min(8, 4 + Math.floor(Math.random() * 6));
    api.term(`traceroute to ${target} (${target})`);
    api.pushFeed(`Trace started -> ${target}`);
    let t = 0;
    for (let i = 1; i <= hops; i++) {
      t += 200 + Math.floor(Math.random() * 420);
      setTimeout(() => {
        const ip = `${Math.floor(Math.random()*223)+1}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
        const ms = 10 + Math.floor(Math.abs(Math.sin(i + Date.now()/1000))*180) + Math.floor(Math.random()*40);
        api.term(`${i}\t${ip}\t${ms} ms`);
        api.pushFeed(`Trace hop ${i}: ${ip} (${ms}ms)`);
        api.pushSpark(ms);
      }, t);
    }
    setTimeout(()=> api.term('trace complete'), t+120);
  }

  function whois(api, target) {
    // try to read from database.json loaded in window._BeltahDB (see database.json below)
    const db = global._BeltahDB || {};
    const node = (db.nodes && db.nodes[target]) || null;
    if (node) {
      api.term(`WHOIS ${target}`);
      api.term(`IP: ${node.ip}`);
      api.term(`ASN: ${node.asn || 'AS???'}`);
      api.term(`ISP: ${node.isp || 'Unknown ISP'}`);
      api.term(`Location: ${node.city || node.country || 'Unknown'}`);
      api.pushFeed(`Whois lookup -> ${target}`);
    } else {
      api.term(`No whois info for: ${target}`);
      api.pushFeed(`Whois failed -> ${target}`);
    }
  }

  function uptime(api) {
    // simulated uptime based on page load time
    if (!global._beltahStart) global._beltahStart = Date.now();
    const s = Math.floor((Date.now() - global._beltahStart) / 1000);
    const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
    api.term(`Uptime: ${h}h ${m}m ${sec}s`);
  }

  function matrix(api, seconds = 6) {
    const t = api.term;
    t('Entering MATRIX mode — press any key to exit.');
    const out = document.getElementById('terminalOut');
    const chars = "01абвгдеёжзиклмнопрстuvwxyz<>/|\\";
    const interval = setInterval(()=> {
      const line = Array.from({length: 64}).map(()=> chars[Math.floor(Math.random()*chars.length)]).join('');
      t(line);
      // trim
      while (out.children.length > 400) out.removeChild(out.firstChild);
    }, 60);
    function stopMatrix() {
      clearInterval(interval);
      window.removeEventListener('keydown', stopMatrix);
      t('Exited MATRIX mode');
    }
    setTimeout(()=>{ window.addEventListener('keydown', stopMatrix); }, 120);
    setTimeout(stopMatrix, seconds * 1000);
  }

  function attack(api, target) {
    api.term(`Simulated attack initiated -> ${target}`);
    api.pushFeed(`Attack: flood -> ${target}`);
    let cycles = 0;
    const id = setInterval(()=> {
      cycles++;
      api.pushFeed(`SYN flood -> ${target} [packets: ${cycles * 120}]`);
      api.term(`attack -> ${target} ... ${cycles*120} pkts`);
      api.pushSpark(100 + Math.floor(Math.random()*300));
      if (cycles > 8) {
        clearInterval(id);
        api.term('attack ended (simulation)');
        api.pushFeed('Attack simulation completed');
      }
    }, 500);
  }

  // expose registration
  function registerCommands(apiArg) {
    const api = apiArg || detectAPI();
    // attach to window for console use
    global.BeltahCommands = global.BeltahCommands || {};
    global.BeltahCommands.registered = true;
    global.BeltahCommands.trace = target => traceRoute(api, target);
    global.BeltahCommands.whois = target => whois(api, target);
    global.BeltahCommands.uptime = () => uptime(api);
    global.BeltahCommands.matrix = (s)=> matrix(api, s || 6);
    global.BeltahCommands.attack = target => attack(api, target);

    // also extend the process function if available
    if (api.process && typeof api.process === 'function') {
      const orig = api.process;
      api.process = (cmd) => {
        const parts = cmd.trim().split(/\s+/);
        const c = parts[0].toLowerCase();
        const arg = parts.slice(1).join(' ');
        switch (c) {
          case 'trace':
          case 'traceroute': traceRoute(api, arg); return;
          case 'whois': whois(api, arg); return;
          case 'uptime': uptime(api); return;
          case 'matrix': matrix(api, Number(arg)||6); return;
          case 'attack': attack(api, arg); return;
          default: return orig(cmd);
        }
      };
    }
    api.term('Extra commands registered: trace, whois, uptime, matrix, attack');
  }

  // expose as global
  global.registerCommands = registerCommands;
  // auto-register if possible
  if (global && global.window && global.window._autoRegisterBeltah) {
    try { registerCommands(); } catch(e) { console.warn('auto register error', e); }
  }

})(typeof window !== 'undefined' ? window : this);