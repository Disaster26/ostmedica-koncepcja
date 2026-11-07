(function(){
  // menu mobilne
  var hb=document.querySelector('.hamburger'), panel=document.getElementById('panel');
  function zamknij(){hb.setAttribute('aria-expanded','false');panel.hidden=true;hb.setAttribute('aria-label','Otwórz menu');}
  hb.addEventListener('click',function(){
    var otw=hb.getAttribute('aria-expanded')==='true';
    if(otw){zamknij();}else{hb.setAttribute('aria-expanded','true');panel.hidden=false;hb.setAttribute('aria-label','Zamknij menu');}
  });
  panel.querySelectorAll('a').forEach(function(a){a.addEventListener('click',zamknij);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')zamknij();});

  // aktywna pozycja menu
  var linki=[].slice.call(document.querySelectorAll('.menu a'));
  var sekcje=linki.map(function(a){return document.querySelector(a.getAttribute('href'));});
  function aktywny(){
    var y=window.scrollY+window.innerHeight*0.35, akt=-1;
    sekcje.forEach(function(s,i){if(s&&s.offsetTop<=y)akt=i;});
    linki.forEach(function(a,i){a.classList.toggle('aktywny',i===akt);if(i===akt)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
  }
  window.addEventListener('scroll',aktywny,{passive:true});aktywny();

  // pasek dolny na telefonie po przewinieciu za przyciski hero
  var pasek=document.querySelector('.pasek-mob'), akcje=document.getElementById('hero-akcje');
  if('IntersectionObserver' in window&&pasek&&akcje){
    new IntersectionObserver(function(w){
      var widac=!w[0].isIntersecting&&w[0].boundingClientRect.top<0;
      pasek.classList.toggle('widac',widac);
      pasek.setAttribute('aria-hidden',widac?'false':'true');
      pasek.querySelectorAll('a').forEach(function(a){a.tabIndex=widac?0:-1;});
    }).observe(akcje);
  }

  // przeciaganie mysza (palec dziala natywnie)
  function przeciagnij(tor){
    var start=0,sl=0,dol=false,ruch=false;
    tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;dol=true;ruch=false;start=e.clientX;sl=tor.scrollLeft;});
    window.addEventListener('pointermove',function(e){if(!dol)return;var dx=e.clientX-start;if(Math.abs(dx)>4){ruch=true;tor.classList.add('ciagnie');}tor.scrollLeft=sl-dx;});
    window.addEventListener('pointerup',function(){if(!dol)return;dol=false;tor.classList.remove('ciagnie');
      var el=tor.firstElementChild; if(!el)return; var krok=el.getBoundingClientRect().width+parseFloat(getComputedStyle(tor).columnGap||0);
      tor.scrollTo({left:Math.round(tor.scrollLeft/krok)*krok,behavior:'smooth'});});
    tor.addEventListener('click',function(e){if(ruch){e.preventDefault();e.stopPropagation();ruch=false;}},true);
    tor.addEventListener('dragstart',function(e){e.preventDefault();});
  }

  // karuzela USG
  document.querySelectorAll('[data-karuzela]').forEach(function(k){
    var tor=k.querySelector('.karuzela-tor'), n=tor.children.length, lic=k.querySelector('.k-licznik');
    function idx(){return Math.round(tor.scrollLeft/tor.clientWidth);}
    function idz(i){i=(i+n)%n;tor.scrollTo({left:i*tor.clientWidth,behavior:'smooth'});}
    k.querySelector('.k-prev').addEventListener('click',function(){idz(idx()-1);});
    k.querySelector('.k-next').addEventListener('click',function(){idz(idx()+1);});
    tor.addEventListener('scroll',function(){lic.textContent=(idx()+1)+' / '+n;},{passive:true});
    tor.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();idz(idx()+1);}if(e.key==='ArrowLeft'){e.preventDefault();idz(idx()-1);}});
    przeciagnij(tor);
  });

  // tor kart zabiegow
  document.querySelectorAll('[data-tor]').forEach(function(tor){
    var wrap=tor.parentElement;
    function krok(){var c=tor.querySelector('.karta');return c?c.getBoundingClientRect().width+22:300;}
    wrap.querySelector('.t-prev').addEventListener('click',function(){tor.scrollBy({left:-krok(),behavior:'smooth'});});
    wrap.querySelector('.t-next').addEventListener('click',function(){tor.scrollBy({left:krok(),behavior:'smooth'});});
    przeciagnij(tor);
  });

  // formularz pokazowy
  var f=document.querySelector('form[data-demo]');
  if(f)f.addEventListener('submit',function(e){e.preventDefault();f.querySelector('.form-info').hidden=false;});
})();
