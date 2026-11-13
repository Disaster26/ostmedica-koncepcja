(function(){
  // rok w stopce
  document.querySelectorAll('[data-rok]').forEach(function(el){el.textContent=new Date().getFullYear();});

  // menu mobilne
  var hb=document.querySelector('.hamburger'), panel=document.getElementById('panel');
  function zamknij(){hb.setAttribute('aria-expanded','false');panel.hidden=true;hb.setAttribute('aria-label','Otwórz menu');}
  hb.addEventListener('click',function(){
    var otw=hb.getAttribute('aria-expanded')==='true';
    if(otw){zamknij();}else{hb.setAttribute('aria-expanded','true');panel.hidden=false;hb.setAttribute('aria-label','Zamknij menu');}
  });
  panel.querySelectorAll('a').forEach(function(a){a.addEventListener('click',zamknij);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')zamknij();});
  window.addEventListener('resize',function(){if(window.innerWidth>1180)zamknij();});

  // aktywna pozycja menu (dokladnie biezacy dzial)
  var linki=[].slice.call(document.querySelectorAll('.menu a'));
  var linkiPanel=[].slice.call(panel.querySelectorAll('nav a'));
  var sekcje=linki.map(function(a){return document.querySelector(a.getAttribute('href'));});
  function aktywny(){
    var y=window.scrollY+window.innerHeight*0.35, akt=-1;
    sekcje.forEach(function(s,i){if(s&&s.getBoundingClientRect().top+window.scrollY<=y)akt=i;});
    if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-4)akt=sekcje.length-1;
    [linki,linkiPanel].forEach(function(lista){
      lista.forEach(function(a,i){a.classList.toggle('aktywny',i===akt);if(i===akt)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
    });
  }
  window.addEventListener('scroll',aktywny,{passive:true});aktywny();

  // pasek dolny na telefonie po przewinieciu za przycisk hero
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
  function przeciagnij(tor,krokFn){
    var start=0,sl=0,dol=false,ruch=false;
    tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0)return;dol=true;ruch=false;start=e.clientX;sl=tor.scrollLeft;});
    window.addEventListener('pointermove',function(e){if(!dol)return;var dx=e.clientX-start;if(Math.abs(dx)>4){ruch=true;tor.classList.add('ciagnie');}tor.scrollLeft=sl-dx;});
    window.addEventListener('pointerup',function(){if(!dol)return;dol=false;tor.classList.remove('ciagnie');
      var krok=krokFn();if(!krok)return;
      tor.scrollTo({left:Math.round(tor.scrollLeft/krok)*krok,behavior:'smooth'});});
    tor.addEventListener('click',function(e){if(ruch){e.preventDefault();e.stopPropagation();ruch=false;}},true);
    tor.addEventListener('dragstart',function(e){e.preventDefault();});
  }

  // karuzele zdjec (USG, fizjoterapia, zdjecia w kartach zabiegow)
  document.querySelectorAll('[data-karuzela]').forEach(function(k){
    var tor=k.querySelector('.karuzela-tor'), n=tor.children.length, lic=k.querySelector('.k-licznik');
    function idx(){return Math.round(tor.scrollLeft/Math.max(1,tor.clientWidth));}
    function idz(i){i=(i+n)%n;tor.scrollTo({left:i*tor.clientWidth,behavior:'smooth'});}
    var p=k.querySelector('.k-prev'), nx=k.querySelector('.k-next');
    if(p)p.addEventListener('click',function(){idz(idx()-1);});
    if(nx)nx.addEventListener('click',function(){idz(idx()+1);});
    if(lic)tor.addEventListener('scroll',function(){lic.textContent=(idx()+1)+' / '+n;},{passive:true});
    tor.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();idz(idx()+1);}if(e.key==='ArrowLeft'){e.preventDefault();idz(idx()-1);}});
    przeciagnij(tor,function(){return tor.clientWidth;});
  });

  // tor kart fizykoterapii (na telefonie przewijany w bok)
  document.querySelectorAll('[data-przewin]').forEach(function(tor){
    przeciagnij(tor,function(){
      if(tor.scrollWidth<=tor.clientWidth+2)return 0;
      var c=tor.firstElementChild;return c?c.getBoundingClientRect().width+12:0;
    });
  });

  // formularz pokazowy
  var f=document.querySelector('form[data-demo]');
  if(f)f.addEventListener('submit',function(e){e.preventDefault();f.querySelector('.form-info').hidden=false;});

  // zgody cookies: mapa Google laduje sie od razu; po wyborze "tylko niezbedne" zastepujemy ja adresem
  var KLUCZ='ostmedica_zgody', baner=document.getElementById('cookies'), mapa=document.getElementById('mapa');
  var mapaHTML=mapa?mapa.innerHTML:'';
  function czytaj(){try{var z=JSON.parse(localStorage.getItem(KLUCZ)||'null');if(z&&z.do>Date.now())return z;}catch(e){}return null;}
  function zapisz(zewn){var z={zewn:!!zewn,do:Date.now()+365*24*3600*1000};try{localStorage.setItem(KLUCZ,JSON.stringify(z));}catch(e){}return z;}
  function zastosuj(z){
    if(!mapa)return;
    if(z&&!z.zewn){
      mapa.innerHTML='<div class="mapa-zastepcza"><h3>OSTMEDICA</h3><p>ul. Dr. L. Rutkowskiego 6, 09-100 Płońsk</p><p>Mapa Google jest wyłączona zgodnie z wyborem w ustawieniach cookies.</p><button class="btn btn-obrys" type="button" data-cookies-ustawienia>Zmień ustawienia</button></div>';
      mapa.querySelector('[data-cookies-ustawienia]').addEventListener('click',pokaz);
    }else if(!mapa.querySelector('iframe')){mapa.innerHTML=mapaHTML;}
  }
  var opcje=document.getElementById('cookies-opcje'), chk=document.getElementById('zgoda-zewn');
  function pokaz(e){if(e)e.preventDefault();var z=czytaj();chk.checked=z?z.zewn:true;baner.hidden=false;}
  function ukryj(){baner.hidden=true;opcje.hidden=true;
    document.querySelector('[data-zgoda="niezbedne"]').textContent='Tylko niezbędne';
    document.querySelector('[data-zgoda="ustawienia"]').setAttribute('aria-expanded','false');}
  if(baner){
    var z=czytaj();zastosuj(z);if(!z)baner.hidden=false;
    baner.addEventListener('click',function(e){
      var b=e.target.closest('[data-zgoda]');if(!b)return;
      var co=b.getAttribute('data-zgoda');
      if(co==='wszystkie'){zastosuj(zapisz(true));ukryj();}
      else if(co==='niezbedne'){
        if(!opcje.hidden){zastosuj(zapisz(chk.checked));ukryj();}
        else{zastosuj(zapisz(false));ukryj();}
      }
      else if(co==='ustawienia'){var otw=opcje.hidden;opcje.hidden=!otw;b.setAttribute('aria-expanded',otw?'true':'false');
        document.querySelector('[data-zgoda="niezbedne"]').textContent=otw?'Zapisz wybór':'Tylko niezbędne';}
    });
    document.querySelectorAll('[data-cookies-ustawienia]').forEach(function(a){a.addEventListener('click',pokaz);});
  }
})();
