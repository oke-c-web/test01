/* ===== LANDING PAGE (first thing visitors see) ===== */
const lpGo=id=>{const e=document.getElementById(id);if(e)e.scrollIntoView({behavior:"smooth"})};
const LP_FEATS=[["🗺️","Celebrate Nigeria","See how all 36 states and the FCT celebrate: food, fashion, music, traditions and travel."],["🎉","December Events","A calendar of concerts, carnivals, church programmes and community events. Add your own."],["🍲","Taste of December","Jollof, soups, snacks and festive dishes from every zone of the country."],["🎮","Games &amp; Quizzes","A new daily quiz, streaks, points and a 30-question quiz about your state."],["💬","Community","Chat one-to-one with people your age, and join the optional gift exchange."],["🤝","Season of Giving","Log small acts of kindness and set your goals for 2027."]];
const cdParts=k=>[["d","DAYS"],["h","HOURS"],["m","MINUTES"],["s","SECONDS"]].map(x=>`<div><b data-cdp="${k}:${x[0]}">00</b><small>${x[1]}</small></div>`).join("");

// ---- Hero photo: set in content/site.json (image, alt, credit, licence), file in assets/images/hero/ ----
// It is used only when both "image" and "alt" are filled in. If the file is missing, the blue gradient stays.
const heroOf=()=>{const h=(CONTENT.site||{}).hero;return h&&h.image&&h.alt?h:null};
const heroTint=()=>{const t=Number((CONTENT.site||{}).heroTint);return isFinite(t)&&t>=0&&t<=1?t:1};
const heroBg=()=>{const h=heroOf();return h?`<div class="lp-bg" style="--tint:${heroTint()}"><img src="assets/images/${esc(h.image)}" alt="${esc(h.alt)}" onerror="this.parentNode.remove();var c=document.getElementById('herocr');if(c)c.remove()"></div>`:""};
const heroCredit=()=>{const h=heroOf(),ok=t=>t&&!/^needs source$/i.test(String(t).trim());
  if(!h||!ok(h.credit))return "";
  return `<small class="credit" id="herocr">Photo: ${esc(h.credit)}${ok(h.licence)?" · "+esc(h.licence):""}</small>`};

VIEWS.landing=()=>`
<div class="lp-hero">${heroBg()}<div class="wrap">
 <div class="lp-top"><div class="lp-logo">${flag(30)}<span>Naija<b>StackForge</b></span></div>
  <div class="lp-links"><a class="l" onclick="lpGo('discover')">Discover</a><a class="l" onclick="lpGo('about')">About</a><button class="o" onclick="go('login')">Log in</button><button onclick="go('login')">Join the celebration</button></div></div>
 <div class="lp-grid"><div>
  <div class="eyebrow">Nigeria · December 2026</div>
  <h1>December is <em>better together.</em></h1>
  <p class="lp-sub">Explore Nigeria. Discover traditions. Celebrate the people, places and moments that make our December special.</p>
  <div class="lp-cta"><button onclick="go('login')">Get started →</button><button class="o" onclick="lpGo('discover')">Explore Nigeria</button><button class="o" onclick="startGuest()">Continue as guest</button></div>
  <p class="demo" style="color:#fff;opacity:.85;margin-top:10px">Guests can look around. To play, chat, save or join in, you will be asked to log in.</p></div>
  <div class="prev"><div class="eyebrow">✦ December moments</div>
   <div class="scene"><div class="sun"></div><div class="sk" style="left:18px;width:70px;height:56px"></div><div class="sk" style="left:100px;width:90px;height:84px"></div><div class="sk" style="left:0;right:0;height:26px"></div></div>
   <h3 style="margin:12px 0 2px">One country.</h3><small>A thousand ways to celebrate.</small>
   <span class="chipf" style="right:-6px;top:-14px">🎉 Celebrate Nigeria</span><span class="chipf" style="right:24px;bottom:-14px">🍲 Taste of December</span></div>
 </div>${heroCredit()}</div></div>
<div class="lp-band"><div class="wrap">
 <div><div class="eyebrow">The festive season is calling</div><h2 style="margin-top:4px">Make this December count.</h2>
  <div class="cdcol" style="margin-top:14px"><div class="eyebrow">🎆 Until New Year</div><div class="nums4">${cdParts("ny")}</div></div></div>
 <div class="cdcol"><div class="eyebrow">🎄 Until Christmas</div><div class="nums4">${cdParts("xmas")}</div></div></div></div>
<div class="lp-light" id="discover"><div class="wrap"><div class="eyebrow">What's waiting for you</div><h2>One platform. <em>All the vibes.</em></h2>
 <div class="feat">${LP_FEATS.map(f=>`<div><i>${f[0]}</i><b>${f[1]}</b><p>${f[2]}</p></div>`).join("")}</div></div></div>
<div class="lp-dark" id="about"><div class="wrap"><div class="eyebrow">About</div><h2>Built for every Nigerian state</h2>
 <p style="max-width:560px">NaijaStackForge turns December into a shared experience. Learn how Nigeria celebrates, play together, give back and plan a bright 2027.</p>
 <div class="steps"><div><b>1</b>Pick your state</div><div><b>2</b>Explore, play and earn points</div><div><b>3</b>Connect and give back</div></div>
 <button onclick="go('login')">Join the celebration</button></div></div>
<div class="lp-foot"><div class="wrap">NaijaStackForge · December Edition 2026 · Your data stays in your own browser.</div></div>`;