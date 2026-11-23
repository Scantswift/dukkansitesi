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
.hs-rota{position:absolute;left:12px;right:12px;bottom:14px;z-index:9;background:#fff;border-radius:16px;box-shadow:0 4px 16px rgba(0,0,0,.2);padding:12px 14px;display:flex;justify-content:space-between;align-items:center;font-weight:800}
.hs-rota span{color:#1E8E3E;font-size:16px}
.hs-git{background:#1A73E8;color:#fff;border-radius:999px;padding:8px 16px}
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
<polyline id="hsRota" points="66,520 66,404 156,404 156,334 246,334 246,268" fill="none" stroke="#1A73E8" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="700" stroke-dashoffset="700"/>
<circle cx="66" cy="520" r="9" fill="#1A73E8" stroke="#fff" stroke-width="3"/><circle cx="66" cy="520" r="18" fill="#1A73E8" opacity=".15"/>
<g id="hsPin0"><path d="M118,232 c-9,0 -15,7 -15,15 c0,11 15,24 15,24 s15,-13 15,-24 c0,-8 -6,-15 -15,-15z" fill="#EA4335" stroke="#B3261E" stroke-width="1.5"/><circle cx="118" cy="247" r="5" fill="#fff"/></g>
<g id="hsPin1"><path d="M196,384 c-9,0 -15,7 -15,15 c0,11 15,24 15,24 s15,-13 15,-24 c0,-8 -6,-15 -15,-15z" fill="#EA4335" stroke="#B3261E" stroke-width="1.5"/><circle cx="196" cy="399" r="5" fill="#fff"/></g>
<g id="hsBiz"><path d="M246,248 c-11,0 -18,8 -18,18 c0,13 18,29 18,29 s18,-16 18,-29 c0,-10 -7,-18 -18,-18z" fill="#80868B" stroke="#5F6368" stroke-width="1.5"/><circle cx="246" cy="266" r="6" fill="#fff"/></g>
</svg>`;
function ciz(kok,o){
  if(!cssEklendi){const st=document.createElement("style");st.textContent=CSS;document.head.appendChild(st);cssEklendi=true}
  const t=o.t,sonra=o.mod==="sonra",ad=esc(o.ad),kat=o.kategori;
  const sorgu=`${kat} yakınımda`,n=Math.floor(cl((t-.2)/1)*sorgu.length);
  if(!kok._hs){kok.innerHTML=`<div class="hs">${HARITA}<div class="hs-ara"><i></i><span class="hs-q"></span><span class="hs-imlec"></span></div><div class="hs-sayfa"></div><div class="hs-profil"></div><div class="hs-rota"></div><div class="hs-dokun"></div><div class="hs-uyarilar"></div></div>`;kok._hs={}}
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
    hs.querySelector(".hs-rota").innerHTML=`<div>${ad}<br><span>6 dk</span> <span class="hs-gri" style="font-size:11px">· 450 m yürüme</span></div><div class="hs-git">Başla</div>`;
    hs.querySelector(".hs-uyarilar").innerHTML=sonra?
      ["✓ 24 fotoğraf","✓ Saatler doğru","✓ Site ve WhatsApp","✓ Yorumlara cevap"].map(x=>`<div class="hs-uyari hs-iyi">${x}</div>`).join(""):
      ["✕ Fotoğraf yok","✕ Saat yok","✕ Site yok","✕ Cevapsız yorum"].map(x=>`<div class="hs-uyari">${x}</div>`).join("");
  }
  // sahneler: 0-1.2 yaz · 1.3-2 liste · 2.3 dokun · 2.6-3.2 profil · (önce) 3.4-6 uyarılar · (sonra) 3.4-4.6 galeri, 4.8 yol tarifi, 5.2-6.8 rota
  const liste=out(seg(t,1.3,2)),sayfa=hs.querySelector(".hs-sayfa"),gizle=sonra?io(seg(t,4.9,5.4)):0;sayfa.style.transform=`translateY(${(1-liste+gizle)*100}%)`;
  const biz=sayfa.querySelector("[data-biz]");biz.style.background=t>2.3&&t<2.8?"#EEF4FE":"";
  const prof=out(seg(t,2.6,3.2)),yolT=sonra?seg(t,4.9,5.4):0,p=hs.querySelector(".hs-profil");
  p.style.transform=`translateY(${(1-prof)*100+yolT*100}%)`;
  const gal=p.querySelector(".hs-galeri");if(sonra&&gal)gal.style.transform=`translateX(${-io(seg(t,3.5,4.6))*164}px)`;
  const dk=hs.querySelector(".hs-dokun");let dx=-99,dy=-99,da=0;
  if(t>2.2&&t<2.7){const r=biz.getBoundingClientRect(),h=hs.getBoundingClientRect(),s=h.width/300;dx=(r.left-h.left)/s+120;dy=(r.top-h.top)/s+34;da=1-seg(t,2.45,2.7)}
  if(sonra&&t>4.6&&t<5.1){dx=58;dy=120+160+82;da=1-seg(t,4.85,5.1)}
  dk.style.left=dx+"px";dk.style.top=dy+"px";dk.style.opacity=da;dk.style.transform=`scale(${.6+da*.6})`;
  const uy=[...hs.querySelectorAll(".hs-uyari")];uy.forEach((u,i)=>{const a=(sonra?5.6:3.5)+i*.5,g=out(seg(t,a,a+.3));u.style.top=(136+i*34)+"px";u.style.opacity=g;u.style.transform=`translateX(${(1-g)*30}px)`});
  const rota=hs.querySelector("#hsRota");rota.style.strokeDashoffset=sonra?700-380*io(seg(t,5.3,6.6)):700;
  const rk=hs.querySelector(".hs-rota");const rg=sonra?out(seg(t,5.6,6)):0;rk.style.opacity=rg;rk.style.transform=`translateY(${(1-rg)*40}px)`;
  const pin=hs.querySelector("#hsBiz path");pin.setAttribute("fill",sonra?"#EA4335":"#80868B");pin.setAttribute("stroke",sonra?"#B3261E":"#5F6368");
  hs.querySelector("#hsBiz").style.transform=sonra&&t>5.3?`translateY(${-Math.abs(Math.sin((t-5.3)*6))*6}px)`:"";
}
window.HaritaSim={ciz,SURE:7.4};
})();
