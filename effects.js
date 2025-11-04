// effects.js
(function(global){
  function glitchText(el, intensity = 3, duration = 1200) {
    if (!el) return;
    const orig = el.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const start = Date.now();
    const id = setInterval(()=>{
      const t = Date.now() - start;
      if (t > duration) {
        el.textContent = orig;
        clearInterval(id);
        return;
      }
      // random noisy text
      el.textContent = orig.split('').map(ch => {
        if (Math.random() < 0.08) return chars[Math.floor(Math.random()*chars.length)];
        return ch;
      }).join('');
    }, 45);
  }

  function pulseNode(nodeEl, times = 1) {
    if (!nodeEl) return;
    nodeEl.style.transition = 'transform 220ms ease, r 220ms ease, opacity 220ms';
    nodeEl.style.transform = 'scale(1.9)';
    setTimeout(()=>{ nodeEl.style.transform = 'scale(1)'; }, 220);
  }

  function rippleOnLink(x,y,svg) {
    // create a small circle at x,y that expands and fades
    if (!svg) svg = document.querySelector('svg.network');
    if (!svg) return;
    const ns = 'http://www.w3.org/2000/svg';
    const c = document.createElementNS(ns,'circle');
    c.setAttribute('cx', x);
    c.setAttribute('cy', y);
    c.setAttribute('r', 2);
    c.setAttribute('fill', '#00ff88');
    c.setAttribute('opacity', '0.9');
    svg.appendChild(c);
    // animate r and opacity
    let start = null;
    function animate(ts) {
      if (!start) start = ts;
      const t = ts - start;
      const progress = Math.min(1, t/500);
      c.setAttribute('r', 2 + progress * 60);
      c.setAttribute('opacity', String(0.9 - progress));
      if (progress < 1) requestAnimationFrame(animate);
      else setTimeout(()=>svg.removeChild(c), 200);
    }
    requestAnimationFrame(animate);
  }

  // auto-hook clickable nodes: when simPing is called, we also pulse the node
  function hookAutoPulse() {
    const groups = document.querySelectorAll('.nodeGroup');
    groups.forEach(g=>{
      g.addEventListener('click', ()=> {
        const node = g.querySelector('.node');
        if (node) pulseNode(node);
        const bbox = g.getBBox ? g.getBBox() : {x:0,y:0,width:0,height:0};
      });
    });
  }

  // expose
  global.BeltahEffects = {
    glitchText,
    pulseNode,
    rippleOnLink,
    hookAutoPulse
  };

  // auto-run on page load
  document.addEventListener('DOMContentLoaded', ()=> {
    setTimeout(()=> hookAutoPulse(), 120);
  });

})(typeof window !== 'undefined' ? window : this);