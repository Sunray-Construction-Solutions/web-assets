function initSunRayMap(){
      const root=document.getElementById('sunray-state-explorer');
      if(!root || root.dataset.sunrayMapReady==='true')return;
      const payload=window.SunRayMapData;
      if(!payload){console.warn('SunRay map: load sunray-map-data.js before sunray-map.js.');return;}
      const required=['.se-map','.se-shapes','.se-labels','.se-select','.se-map-status','.se-state-name','.se-abbr','.se-notice','.se-guide'];
      if(required.some(selector=>!root.querySelector(selector))){console.warn('SunRay map: check the native element classes in SETUP.md.');return;}
      root.dataset.sunrayMapReady='true';
      const states=payload.states;
      const map=root.querySelector('.se-map');
      const shapes=root.querySelector('.se-shapes');
      shapes.innerHTML=payload.paths;
      const labels=root.querySelector('.se-labels');
      const selector=root.querySelector('.se-select');
      const status=root.querySelector('.se-map-status');
      const pickerForm=selector.closest('form');
      if(pickerForm)pickerForm.addEventListener('submit',event=>event.preventDefault());
      let selected=selector.value || 'FL';
      function draw(){
        const width=map.parentElement.clientWidth;
        if(!width)return;
        const scale=width/1000,height=640*scale;
        map.setAttribute('viewBox','0 0 '+width+' '+height);
        map.style.height=height+'px';
        shapes.setAttribute('transform','scale('+scale+')');
        labels.replaceChildren();
        states.forEach(state=>{
          if((!state.label||width<350&&!state.mobile)&&state.code!==selected)return;
          const label=document.createElementNS('http://www.w3.org/2000/svg','text');
          label.setAttribute('x',state.x*scale);label.setAttribute('y',state.y*scale);
          label.setAttribute('class','se-map-label');label.textContent=state.code;
          labels.appendChild(label);
        });
      }
      function choose(code){
        const state=states.find(s=>s.code===code);
        if(!state)return;
        selected=code;selector.value=code;
        root.querySelectorAll('.se-state').forEach(anchor=>{
          const active=anchor.dataset.code===code;
          anchor.classList.toggle('is-selected',active);
          anchor.setAttribute('aria-current',active?'true':'false');
        });
        const heading=root.querySelector('.se-state-name');
        heading.textContent=state.name;heading.classList.toggle('is-long',state.name.length>12);
        root.querySelector('.se-abbr').textContent=code;
        root.querySelector('.se-notice').textContent=code==='FL'?'Notice to Owner':'Preliminary notices';
        const guide=root.querySelector('.se-guide');guide.href=state.url;
        guide.querySelector('span').textContent='View '+state.name+' resources';
        status.textContent=state.name+' selected';
        draw();
      }
      selector.addEventListener('change',()=>choose(selector.value));
      root.querySelectorAll('.se-state').forEach(anchor=>{
        anchor.addEventListener('click',event=>{event.preventDefault();choose(anchor.dataset.code)});
      });
      new ResizeObserver(draw).observe(map.parentElement);
      choose(selected);
    }
window.SunRayMap={init:initSunRayMap};
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initSunRayMap,{once:true});}else{initSunRayMap();}
