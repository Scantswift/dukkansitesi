/* Haritalar simülasyonu (logosuz, genel harita uygulaması görünümü).
   Zaman güdümlü: HaritaSim.ciz(kok, {mod:'once'|'sonra', t, ad, kategori, foto, rakipler}) → t saniyesindeki kare.
   Sitede döngüyle oynatılır, videoda kare kare çekilir. Sıralama vaadi YOK: dükkân iki modda da 3. sırada. */
(function(){
const CSS=`
.hs{position:absolute;left:0;top:0;width:300px;height:620px;transform-origin:0 0;overflow:hidden;background:#E9ECEF;font-family:Manrope,system-ui,sans-serif;color:#1F2430;font-size:12px;line-height:1.35}
.hs svg.hs-harita{position:absolute;left:0;top:0;width:300px;height:620px}
.hs-ara{position:absolute;left:12px;right:12px;top:44px;height:42px;border-radius:21px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.16);display:flex;align-items:center;gap:8px;padding:0 14px;font-weight:700;font-size:13px;z-index:5}
.hs-ara i{width:14px;height:14px;border:2.5px solid #5F6672;border-radius:50%;position:relative;flex:none}
.hs-ara i::after{content:"";position:absolute;width:6px;height:2.5px;background:#5F6672;right:-5px;bottom:-3px;transform:rotate(45deg)}
.hs-imlec{display:inline-block;width:2px;height:15px;background:#2F7BFF;margin-left:1px;vertical-align:-2px}
.hs-sayfa{position:absolute;left:0;right:0;bottom:0;background:#fff;border-radius:20px 20px 0 0;box-shadow:0 -4px 18px rgba(0,0,0,.16);z-index:6;transition:none}
.hs-tutac{width:36px;height:4px;border-radius:2px;background:#D5D9E0;margin:8px auto 6px}
.hs-sonuc{display:flex;gap:10px;padding:9px 14px;border-bottom:1px solid #EEF0F3;position:relative}
.hs-sonuc .ft{width:62px;height:62px;border-radius:10px;background-size:cover;background-position:center;flex:none}
.hs-sonuc .ft.bos{background:repeating-linear-gradient(135deg,#E6E8EC 0 6px,#DDE0E5 6px 12px);display:grid;place-items:center;color:#9AA0AB;font-size:9px;font-weight:800;text-align:center}
.hs-sonuc b{font-size:13px;display:block}
.hs-y{color:#B7791F;font-weight:700}
.hs-acik{color:#1E8E3E;font-weight:800}.hs-kapali{color:#C5221F;font-weight:800}.hs-gri{color:#80868B;font-weight:700}
.hs-cip{display:inline-block;margin-top:4px;padding:2px 8px;border-radius:999px;border:1px solid #DADCE0;font-weight:700;font-size:10px;color:#1A73E8}
.hs-dokun{position:absolute;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(47,123,255,.28);border:2px solid rgba(47,123,255,.7);z-index:20;pointer-events:none}
.hs-profil{position:absolute;left:0;right:0;bottom:0;top:120px;background:#fff;border-radius:20px 20px 0 0;box-shadow:0 -4px 18px rgba(0,0,0,.18);z-index:8;overflow:hidden}
.hs-galeri{height:150px;display:flex;gap:4px;overflow:hidden}
.hs-galeri div{flex:none;width:160px;height:150px;background-size:cover;background-position:center}
.hs-galeri.bos{display:grid;place-items:center;background:repeating-linear-gradient(135deg,#ECEEF1 0 8px,#E2E5E9 8px 16px);color:#9AA0AB;font-weight:800}
.hs-pi{padding:10px 14px}
.hs-pi h4{font-size:17px;margin:0}
.hs-btnlar{display:flex;gap:6px;padding:0 14px 8px}
.hs-btn{flex:1;text-align:center;padding:8px 2px;border-radius:999px;font-weight:800;font-size:10.5px;border:1px solid #DADCE0;color:#1A73E8;background:#fff}
.hs-btn.ana{background:#1A73E8;color:#fff;border-color:#1A73E8}
.hs-btn.pasif{color:#B0B5BD;border-style:dashed}
.hs-satir{padding:7px 14px;border-top:1px solid #EEF0F3;display:flex;gap:8px;align-items:flex-start;font-size:11.5px}
.hs-yorum{margin:6px 14px;padding:8px 10px;border-radius:10px;background:#F6F7F9;font-size:11px}
.hs-cevap{margin:4px 0 0 10px;padding:6px 8px;border-left:3px solid #1A73E8;background:#EEF4FE;border-radius:0 8px 8px 0;font-size:10.5px}
.hs-uyari{position:absolute;right:10px;z-index:12;background:#C5221F;color:#fff;font-weight:800;font-size:11px;padding:5px 9px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.25)}
.hs-iyi{background:#1E8E3E}
.hs-rozet{position:absolute;left:50%;top:104px;z-index:11;translate:-50% 0;padding:10px 20px;border-radius:999px;font-weight:800;font-size:17px;color:#fff;box-shadow:0 8px 22px rgba(0,0,0,.28);white-space:nowrap}
.hs-rozet.az{background:#C5221F}.hs-rozet.cok{background:#1E8E3E}
.hs-arti{position:absolute;z-index:12;background:#fff;color:#1E8E3E;font-weight:800;font-size:11px;padding:4px 8px;border-radius:999px;box-shadow:0 4px 10px rgba(0,0,0,.2);white-space:nowrap}
.hs-say{position:absolute;z-index:10;min-width:30px;height:30px;padding:0 8px;border-radius:15px;display:grid;place-items:center;font-weight:800;font-size:15px;color:#fff;border:2.5px solid #fff;box-shadow:0 4px 10px rgba(0,0,0,.25);transition:transform .15s}
.hs-canli{position:absolute;left:0;right:0;bottom:8px;text-align:center;font-size:9px;font-weight:700;color:#80868B;z-index:11}
`;
let cssEklendi=false;
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),seg=(t,a,b)=>cl((t-a)/(b-a));
const out=x=>1-Math.pow(1-x,3),io=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
// sabit harita (deterministik)
const HARITA=`<svg class="hs-harita" viewBox="0 0 300 620"><rect width="300" height="620" fill="#E9ECEF"/>
<path d="M-10,470 Q90,430 160,450 T320,420 L320,640 L-10,640Z" fill="#AADAFF"/>
<rect x="190" y="150" width="90" height="110" rx="10" fill="#C8E6C9"/><rect x="20" y="300" width="70" height="60" rx="8" fill="#C8E6C9"/>
${[110,210,330,400].map(y=>`<rect x="-10" y="${y}" width="320" height="14" fill="#fff"/>`).join("")}
${[60,150,240].map(x=>`<rect x="${x}" y="80" width="12" height="400" fill="#fff"/>`).join("")}
<path d="M-10,560 L310,260" stroke="#FFE08A" stroke-width="16"/><path d="M-10,560 L310,260" stroke="#FFF3C4" stroke-width="10"/>
${[[30,150],[100,170],[200,300],[260,360],[120,250],[40,380],[180,370],[250,120]].map(([x,y])=>`<rect x="${x}" y="${y}" width="${22+(x%3)*6}" height="${18+(y%4)*5}" rx="3" fill="#DDE1E6"/>`).join("")}
<text x="70" y="106" font-size="8" fill="#80868B" font-weight="700">Örnek Cd.</text><text x="200" y="326" font-size="8" fill="#80868B" font-weight="700">Çarşı Sk.</text>
<g id="hsAkis"></g>
<circle cx="66" cy="520" r="9" fill="#1A73E8" stroke="#fff" stroke-width="3"/><circle cx="66" cy="520" r="18" fill="#1A73E8" opacity=".15"/>
<g id="hsPin0"><path d="M118,232 c-9,0 -15,7 -15,15 c0,11 15,24 15,24 s15,-13 15,-24 c0,-8 -6,-15 -15,-15z" fill="#EA4335" stroke="#B3261E" stroke-width="1.5"/><circle cx="118" cy="247" r="5" fill="#fff"/></g>
<g id="hsPin1"><path d="M196,384 c-9,0 -15,7 -15,15 c0,11 15,24 15,24 s15,-13 15,-24 c0,-8 -6,-15 -15,-15z" fill="#EA4335" stroke="#B3261E" stroke-width="1.5"/><circle cx="196" cy="399" r="5" fill="#fff"/></g>
<g id="hsBiz"><path d="M246,248 c-11,0 -18,8 -18,18 c0,13 18,29 18,29 s18,-16 18,-29 c0,-10 -7,-18 -18,-18z" fill="#80868B" stroke="#5F6368" stroke-width="1.5"/><circle cx="246" cy="266" r="6" fill="#fff"/></g>
</svg>`;
function ciz(kok,o){
  if(!cssEklendi){const st=document.createElement("style");st.textContent=CSS;document.head.appendChild(st);cssEklendi=true}
  const t=o.t,sonra=o.mod==="sonra",ad=esc(o.ad),kat=o.kategori;
  const sorgu=`${kat} yakınımda`,n=Math.floor(cl((t-.2)/1)*sorgu.length);
  if(!kok._hs){kok.innerHTML=`<div class="hs">${HARITA}<div class="hs-ara"><i></i><span class="hs-q"></span><span class="hs-imlec"></span></div><div class="hs-sayfa"></div><div class="hs-profil"></div><div class="hs-rozet"></div><div class="hs-artilar"></div><div class="hs-say" data-p="0"></div><div class="hs-say" data-p="1"></div><div class="hs-say" data-p="2"></div><div class="hs-canli">örnek canlandırma</div><div class="hs-dokun"></div><div class="hs-uyarilar"></div></div>`;kok._hs={}}
  const hs=kok.querySelector(".hs");hs.style.transform=`scale(${kok.clientWidth/300})`;
  hs.querySelector(".hs-q").textContent=sorgu.slice(0,n);hs.querySelector(".hs-imlec").style.opacity=t<1.3&&Math.floor(t*3)%2===0?1:0;
  // sonuç listesi
  const anahtar=o.mod+ad+kat;
  if(kok._hs.k!==anahtar){kok._hs.k=anahtar;
    const r=o.rakipler||["Usta Kemal","Fade Atölyesi"];
    const satir=(isim,puan,yorum,durum,foto,cip,biz)=>`<div class="hs-sonuc"${biz?' data-biz="1"':""}>${foto?`<div class="ft" style="background-image:url(${foto});${biz?"":"filter:saturate(.8)"}"></div>`:'<div class="ft bos">fotoğraf<br>yok</div>'}<div><b>${isim}</b><span class="hs-y">★ ${puan}</span> <span class="hs-gri">(${yorum})</span> · ${kat}<br>${durum}${cip?`<br><span class="hs-cip">${cip}</span>`:""}</div></div>`;
    hs.querySelector(".hs-sayfa").innerHTML=`<div class="hs-tutac"></div>`+
      satir(esc(r[0]),"4,7",86,'<span class="hs-acik">Açık</span> · 22:00\'ye kadar',o.foto,"Web sitesi",0)+
      satir(esc(r[1]),"4,5",41,'<span class="hs-acik">Açık</span> · 21:00\'e kadar',o.foto,"",0)+
      (sonra?satir(ad,"4,4",21,'<span class="hs-acik">Açık</span> · 23:00\'e kadar',o.foto,"Web sitesi · WhatsApp",1):satir(ad,"4,4",21,'<span class="hs-gri">Saat bilgisi yok</span>',"","",1));
    hs.querySelector(".hs-profil").innerHTML=sonra?
      `<div class="hs-galeri"><div style="background-image:url(${o.foto})"></div><div style="background-image:url(${o.foto});background-position:80% 30%"></div><div style="background-image:url(${o.foto});background-position:20% 70%"></div></div>
       <div class="hs-pi"><h4>${ad}</h4><span class="hs-y">★ 4,4</span> <span class="hs-gri">(21)</span> · ${kat}<br><span class="hs-acik">Açık</span> · 23:00'e kadar</div>
       <div class="hs-btnlar"><div class="hs-btn ana" data-yol="1">Yol tarifi</div><div class="hs-btn">Ara</div><div class="hs-btn">Web sitesi</div><div class="hs-btn">WhatsApp</div></div>
       <div class="hs-satir">🕘 Pzt-Cmt 09:00-23:00 · Pazar 11:00-20:00</div><div class="hs-satir">🌐 ${ad.toLowerCase().replace(/[^a-zçğıöşü]/g,"")}.com</div>
       <div class="hs-yorum">"Fiyatlar yazmıyor, aradım açmadılar." <span class="hs-y">★★★</span><div class="hs-cevap"><b>İşletme sahibi:</b> Haklısınız, fiyatlarımız artık sitemizde. WhatsApp'tan randevu alabilirsiniz.</div></div>`:
      `<div class="hs-galeri bos">Bu işletmeye ait fotoğraf yok</div>
       <div class="hs-pi"><h4>${ad}</h4><span class="hs-y">★ 4,4</span> <span class="hs-gri">(21)</span> · ${kat}<br><span class="hs-gri">Saat bilgisi yok</span></div>
       <div class="hs-btnlar"><div class="hs-btn ana" data-yol="1">Yol tarifi</div><div class="hs-btn">Ara</div><div class="hs-btn pasif">Web sitesi yok</div><div class="hs-btn pasif">WhatsApp yok</div></div>
       <div class="hs-satir hs-gri">🕘 Çalışma saati eklenmemiş</div>
       <div class="hs-yorum">"Fiyatlar yazmıyor, aradım açmadılar." <span class="hs-y">★★★</span><div class="hs-gri" style="margin-top:4px;font-size:10px">İşletme cevap vermedi</div></div>`;
    const rz=hs.querySelector(".hs-rozet");rz.className="hs-rozet "+(sonra?"cok":"az");rz.textContent=sonra?"Çok müşteri":"Az müşteri";
    hs.querySelector(".hs-artilar").innerHTML=sonra?["+1 WhatsApp","+1 Arama","+1 Randevu","+1 Sipariş"].map(x=>`<div class="hs-arti">${x}</div>`).join(""):"";
    // müşteri noktaları: önce rakiplere, sonra çoğu bize
    const hedefler=sonra?[2,2,0,2,2,1,2,2,2,2]:[0,1,0,0,1,0,1,0,1,0];
    hs.querySelector("#hsAkis").innerHTML=hedefler.map((h,i)=>`<g class="hs-m" data-h="${h}" data-i="${i}"><circle r="7" fill="#1A73E8" stroke="#fff" stroke-width="2.5"/><circle r="2.4" cy="-1.5" fill="#fff"/></g>`).join("");
    hs.querySelector(".hs-uyarilar").innerHTML=sonra?
      ["✓ 24 fotoğraf","✓ Saatler doğru","✓ Site ve WhatsApp","✓ Yorumlara cevap"].map(x=>`<div class="hs-uyari hs-iyi">${x}</div>`).join(""):
      ["✕ Fotoğraf yok","✕ Saat yok","✕ Site yok","✕ Cevapsız yorum"].map(x=>`<div class="hs-uyari">${x}</div>`).join("");
  }
  // sahneler: 0-1.2 yaz · 1.3-2 liste · 2.3 dokun · 2.6-3.2 profil · (önce) 3.5-5 kırmızı uyarılar, 5.2 kapan, 5.6-7.6 müşteriler rakiplere, "Az müşteri" · (sonra) 3.4-4.4 galeri, 4.5-5.8 yeşil, 5.9 kapan, 6.3-8.3 müşteriler bize, "Çok müşteri"
  const liste=out(seg(t,1.3,2)),sayfa=hs.querySelector(".hs-sayfa"),gizle=io(seg(t,sonra?5.9:5.2,sonra?6.4:5.7));sayfa.style.transform=`translateY(${(1-liste+gizle)*100}%)`;
  const biz=sayfa.querySelector("[data-biz]");biz.style.background=t>2.3&&t<2.8?"#EEF4FE":"";
  const kapan=io(seg(t,sonra?5.9:5.2,sonra?6.4:5.7)),prof=out(seg(t,2.6,3.2)),yolT=kapan,p=hs.querySelector(".hs-profil");
  p.style.transform=`translateY(${(1-prof)*100+yolT*100}%)`;
  const gal=p.querySelector(".hs-galeri");if(sonra&&gal)gal.style.transform=`translateX(${-io(seg(t,3.5,4.6))*164}px)`;
  const dk=hs.querySelector(".hs-dokun");let dx=-99,dy=-99,da=0;
  if(t>2.2&&t<2.7){const r=biz.getBoundingClientRect(),h=hs.getBoundingClientRect(),s=h.width/300;dx=(r.left-h.left)/s+120;dy=(r.top-h.top)/s+34;da=1-seg(t,2.45,2.7)}
  dk.style.left=dx+"px";dk.style.top=dy+"px";dk.style.opacity=da;dk.style.transform=`scale(${.6+da*.6})`;
  const uy=[...hs.querySelectorAll(".hs-uyari")];uy.forEach((u,i)=>{const a=(sonra?4.5:3.5)+i*.32,g=out(seg(t,a,a+.25))*(1-seg(t,sonra?5.9:5.2,sonra?6.1:5.4));u.style.top=(136+i*34)+"px";u.style.opacity=g;u.style.transform=`translateX(${(1-g)*30}px)`});
  // müşteri akışı: başlangıç noktalarından iğnelere
  const PIN=[[118,262],[196,414],[246,290]],BAS=[[20,560],[300,520],[40,200],[290,180],[150,600],[10,380],[300,420],[120,140],[280,600],[60,450]];
  const a0=sonra?6.3:5.6;
  const say=[0,0,0];
  hs.querySelectorAll(".hs-m").forEach(m=>{const i=+m.dataset.i,h=+m.dataset.h,st=a0+i*.17,g=io(seg(t,st,st+1.1)),b=BAS[i],e=PIN[h];if(g>=1)say[h]++;
    const x=b[0]+(e[0]-b[0])*g,y=b[1]+(e[1]-b[1])*g-Math.sin(g*Math.PI)*18;m.setAttribute("transform",`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${g>=1?.0001:1})`);m.style.opacity=t>st?1:0});
  hs.querySelectorAll(".hs-say").forEach(el=>{const k=+el.dataset.p,v=say[k];el.textContent=v;el.style.left=(PIN[k][0]+12)+"px";el.style.top=(PIN[k][1]-62)+"px";
    el.style.background=k===2?(sonra?"#1E8E3E":"#80868B"):"#5F6368";el.style.opacity=t>a0-.2?1:0;el.style.transform=`scale(${k===2&&sonra&&v>0?1.15:1})`});
  const rz=hs.querySelector(".hs-rozet"),rg=out(seg(t,a0+.3,a0+.7));rz.style.opacity=rg;rz.style.transform=`scale(${.7+.3*rg})`;
  hs.querySelectorAll(".hs-arti").forEach((x,i)=>{const st=a0+.9+i*.45,g=out(seg(t,st,st+.3))*(1-seg(t,st+1.2,st+1.5));x.style.left=(150+(i%2)*40)+"px";x.style.top=(200-g*24-(i%2)*26)+"px";x.style.opacity=g});
  const pin=hs.querySelector("#hsBiz path");pin.setAttribute("fill",sonra?"#EA4335":"#80868B");pin.setAttribute("stroke",sonra?"#B3261E":"#5F6368");
  hs.querySelector("#hsBiz").style.transform=sonra&&t>a0?`translateY(${-Math.abs(Math.sin((t-a0)*6))*5}px)`:"";
}
window.HaritaSim={ciz,SURE:8.4};
})();
