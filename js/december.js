/* ===== DECEMBER EDITION: countdowns, events, state celebrations, games, community extras ===== */
const pad=n=>String(n).padStart(2,"0");
const ymd=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const today=()=>ymd(new Date());
const yday=()=>{const d=new Date();d.setDate(d.getDate()-1);return ymd(d)};
const fmtD=s=>new Date(s+"T00:00").toLocaleDateString(undefined,{weekday:"short",day:"numeric",month:"short"});

/* ---------- Countdown (updates every second without redrawing the page) ---------- */
function cdSecs(k){
  const n=new Date(),m=n.getMonth(),d=n.getDate(),y=n.getFullYear();
  if(k=="xmas"&&m==11&&d>=25)return -1;
  if(k=="ny"&&m==0&&d==1)return -1;
  const t=k=="xmas"?new Date(y,11,25):new Date(y+1,0,1);
  return Math.max(0,Math.floor((t-n)/1000));
}
function cdText(k){
  const s=cdSecs(k),d=new Date().getDate();
  if(s<0)return k=="xmas"?(d==25?"🎄 Merry Christmas!":"🎄 See you next Christmas!"):"🎆 Happy New Year!";
  return `${Math.floor(s/86400)}d ${pad(Math.floor(s%86400/3600))}h ${pad(Math.floor(s%3600/60))}m ${pad(s%60)}s`;
}
const tick=()=>{
  document.querySelectorAll("[data-cd]").forEach(e=>e.textContent=cdText(e.dataset.cd));
  document.querySelectorAll("[data-cdp]").forEach(e=>{const [k,p]=e.dataset.cdp.split(":"),s=Math.max(0,cdSecs(k));
    const v=p=="d"?Math.floor(s/86400):p=="h"?Math.floor(s%86400/3600):p=="m"?Math.floor(s%3600/60):s%60;e.textContent=p=="d"?v:pad(v)});
};
const cdTile=(k,label)=>`<div class="cd"><b data-cd="${k}">${cdText(k)}</b><small>${label}</small></div>`;

/* ---------- DATA (demo: edit freely) ---------- */
const DEC_CARDS=[["🍲","Taste of December","Food"],["👘","December Fashion","Fashion"],["🎵","Music & Concerts","Music"],["🎉","Major Events","Events"],["🏘️","Home & Traditions","Traditions"],["🧭","Travel Guide","Travel"],["🎁","Gift Ideas","Gift"],["🤝","Season of Giving","Giving"],["🎆","New Year","NewYear"]];

// General text per zone. Replace or extend per state in STATE_DEC below.
const ZD={
"South West":{Food:"Jollof rice, pounded yam with egusi, moin moin, fried rice, chin-chin and puff-puff.",Fashion:"Aso-oke, ankara, agbada and gele are popular for church, family photos and parties.",Music:"Afrobeats, juju, fuji and gospel at parties, churches and concerts.",Traditions:"Family visits, church services, street parties and Boxing Day gatherings. Many people travel home.",Travel:"Olumo Rock (Ogun), Osun-Osogbo Sacred Grove (Osun), and beaches around Lagos such as Lekki and Badagry."},
"South East":{Food:"Jollof and fried rice, ofe onugbu (bitterleaf soup) with fufu, isi ewu (goat head), abacha and roasted meat.",Fashion:"George wrappers, isi-agu tops, red caps and beads, plus lace and wrappers.",Music:"Highlife, gospel and Igbo contemporary music, with masquerade displays in many towns.",Traditions:"Returning home for December is a big tradition, with family reunions, village meetings and thanksgiving services.",Travel:"Nike Lake Resort and Ngwo Pine Forest in Enugu are popular day trips."},
"South South":{Food:"Banga soup, afang, edikang ikong, pepper soup and jollof rice.",Fashion:"Efik and Ibibio attire, Edo coral beads and wrappers, and ankara.",Music:"Carnival bands, highlife, Afrobeats and gospel.",Traditions:"Carnival season, family gatherings and church services. Cross River hosts the famous Calabar Carnival in December.",Travel:"Calabar and Obudu Mountain Resort in Cross River."},
"North Central":{Food:"Jollof rice, yam porridge, pounded yam and soups, tuwo, and suya.",Fashion:"Ankara, caftans, and traditional wear such as Tiv a'nger in Benue.",Music:"Gospel, Afrobeats, local drumming and cultural dances.",Traditions:"Carol services, family dinners and community gatherings.",Travel:"Zuma Rock and parks around Abuja (FCT), Jos Wildlife Park (Plateau), Owu Falls (Kwara)."},
"North East":{Food:"Tuwo and soups, masa, suya, kilishi, jollof rice and roasted meat.",Fashion:"Babban riga (flowing gown), caps and wrappers, plus ankara.",Music:"Local drums and songs, and gospel music in Christian communities.",Traditions:"Church services and family gatherings. Neighbours of all faiths often visit and share food.",Travel:"Yankari Game Reserve (Bauchi) and Gashaka-Gumti National Park (Taraba). Check current travel advisories before you go."},
"North West":{Food:"Tuwo shinkafa with soups, suya, kilishi, masa and jollof rice.",Fashion:"Babban riga, fila caps, lace and brocade.",Music:"Hausa music and gospel in Christian communities.",Traditions:"Christmas services and family gatherings for Christian communities, with neighbours of all faiths sharing food and good wishes.",Travel:"Kano's old city and Kofar Mata dye pits (Kano), Kajuru Castle (Kaduna). Check current travel advisories before you go."}
};
// Real, state-specific notes (override the zone text). Format: STATE_DEC.State.Key
const STATE_DEC={
"Cross River":{Events:"The Calabar Carnival runs through December with bands, floats and street parades. Check the official dates."},
Lagos:{Music:"Lagos is the heart of 'Detty December', with concerts, beach parties and nightlife."}
};

const EKINDS=["Concert","Carnival","Church","Party","Fashion","Giving","Community","Festival"];
// Sample events. demo:true marks sample entries. Public holidays: confirm with official announcements.
const EVENTS=[
{t:"Calabar Carnival (check official dates)",d:"2026-12-01",s:"Cross River",k:"Carnival",note:"Runs through December."},
{t:"Detty December concerts",d:"2026-12-20",s:"Lagos",k:"Concert",demo:1},
{t:"Community carol night",d:"2026-12-18",s:"FCT",k:"Church",demo:1},
{t:"Fashion showcase",d:"2026-12-22",s:"Enugu",k:"Fashion",demo:1},
{t:"Share-a-meal giving day",d:"2026-12-24",s:"All states",k:"Giving",demo:1},
{t:"Christmas Day",d:"2026-12-25",s:"All states",k:"Holiday"},
{t:"Boxing Day",d:"2026-12-26",s:"All states",k:"Holiday"},
{t:"New Year's Eve countdown parties",d:"2026-12-31",s:"All states",k:"Party"},
{t:"New Year's Day",d:"2027-01-01",s:"All states",k:"Holiday"}
];
const allEvents=()=>[...EVENTS,...(S.events||[]).map((e,i)=>({...e,own:i}))].sort((a,b)=>a.d<b.d?-1:a.d>b.d?1:0);

const DEC_Q=[
["Christmas Day is on which date?",["25 December","24 December","26 December","1 January"],0],
["Boxing Day is on which date?",["26 December","25 December","31 December","27 December"],0],
["Which Nigerian city is famous for its December carnival?",["Calabar","Kano","Jos","Sokoto"],0],
["Calabar is the capital of which state?",["Cross River","Akwa Ibom","Rivers","Delta"],0],
["Which rice dish is a favourite at Nigerian Christmas parties?",["Jollof rice","Porridge oats","Risotto","Sushi rice"],0],
["Moin moin is mainly made from?",["Beans","Maize","Yam","Cassava"],0],
["Chin-chin is a?",["Fried crunchy snack","Soup","Drink","Fabric"],0],
["Puff-puff is?",["Deep-fried dough balls","Grilled fish","A type of soup","A drink"],0],
["Aso-oke is a hand-woven cloth from which people?",["Yoruba","Tiv","Efik","Kanuri"],0],
["A gele is a?",["Head wrap","Shoe","Soup","Drum"],0],
["The dry dusty wind common in Nigeria's December is called?",["Harmattan","Monsoon","Sirocco","Typhoon"],0],
["New Year's Eve is on?",["31 December","30 December","1 January","25 December"],0],
["New Year's Day is on?",["1 January","31 December","6 January","25 December"],0],
["'Detty December' is best described as?",["A festive season of parties, concerts and travel","A farming season","A school exam period","A rainy-season festival"],0],
["Suya is?",["Spiced grilled meat on skewers","A rice dish","A soup","A dessert"],0],
["Pounded yam is commonly eaten with?",["Egusi soup","Cornflakes","Ice cream","Pasta"],0],
["Christmas Day and Boxing Day are what in Nigeria?",["Public holidays","Normal working days","Exam days","Market-only days"],0]
];
const GIFTEES=[["Tolu_20","books and notebooks",20],["Ife_22","chin-chin and snacks",22],["Hauwa_19","hair accessories",19],["Obi_16","football socks",16],["Ada_15","a sketchbook",15]];
const KIND_IDEAS=["Share a meal with a neighbour","Give clothes you no longer wear","Visit someone who lives alone","Help a younger person with schoolwork","Volunteer with a church, mosque or community group"];

/* ---------- Helpers ---------- */
function decText(s,k){
  const o=(STATE_DEC[s]||{})[k];if(o)return o;
  if(k=="Events"){const l=allEvents().filter(e=>e.s==s);return l.length?l.map(e=>`${fmtD(e.d)}: ${esc(e.t)}`).join("<br>"):`No events listed for ${s} yet. Check the Events tab or add one.`}
  if(k=="Gift")return "Local fabric or a cap, chin-chin or snacks, a book, phone credit, a handwritten note, or a day of help with chores. Choose something the person will use.";
  if(k=="Giving")return "Share a meal, give clothes you no longer wear, visit a neighbour who lives alone, or volunteer with a church, mosque or community group.";
  if(k=="NewYear")return "Watch-night services, family dinners and fireworks are common. Write your 2027 goals in Community → New Year.";
  return (ZD[ZONE_OF[s]]||{})[k]||"Add real details in js/december.js.";
}
const decInfo=k=>{const s=U.bs||S.state||"Lagos",c=DEC_CARDS.find(x=>x[2]==k);openModal(`<h3>${c[0]} ${c[1]} · ${s}</h3><p>${decText(s,k)}</p><p class="demo">General guide for the ${ZONE_OF[s]} zone unless noted. Add state-specific detail in js/december.js.</p><button class="full" onclick="closeModal()">Close</button>`)};
const viewState=n=>{U.bs=n;go("statepage")};
const evCard=e=>`<div class="card"><div class="row sp"><b>${esc(e.t)}</b><span class="tag">${e.k}</span></div><small>${fmtD(e.d)} · ${esc(e.s)}${e.demo?" · sample":""}</small>${e.note?`<br><small>${e.note}</small>`:""}${e.own!=null?`<br><a href="#" style="font-size:12px" onclick="delEvent(${e.own});return false">Remove my event</a>`:""}</div>`;

/* ---------- Screens ---------- */
VIEWS.home=()=>{
  const ev=allEvents().filter(e=>e.d>=today()).slice(0,3),dn=S.daily&&S.daily.d==today();
  return `${board()}
<div class="card hero c">${flag(36)}<h1 style="font-size:24px">Naija<b>StackForge</b></h1><small class="gold">🎄 DECEMBER EDITION · 2026</small>
<h2 style="margin:10px 0">December Is Better Together.</h2>
<div class="row" style="justify-content:center">${cdTile("xmas","until Christmas")}${cdTile("ny","until New Year")}</div>
<button style="margin-top:12px" onclick="go('states')">Explore December in Nigeria</button></div>
<h3>Featured events</h3>${ev.map(evCard).join("")||"<p>No upcoming events. Add one in Events.</p>"}<button class="o full" onclick="go('events')">See all events</button>
<div class="card"><b>🎯 Daily December Challenge</b><p>${dn?`Done today: ${S.daily.score}/5. Streak: ${S.streak||1} 🔥 Come back tomorrow for new questions.`:"Five new questions every day. Earn 10 points for each correct answer."}</p><button onclick="startQuiz('daily')">${dn?"Practice again":"Play now"}</button></div>
<h3>${S.state||"Your state"} this December</h3>
<div class="grid">${[["🍲","Taste","Food"],["👘","Fashion","Fashion"],["🧭","Travel","Travel"],["🎁","Gifts","Gift"],["🤝","Giving","Giving"],["🎆","New Year","NewYear"]].map(c=>`<div class="card c" style="margin:0;cursor:pointer" onclick="U.bs='';decInfo('${c[2]}')"><div style="font-size:26px">${c[0]}</div><small>${c[1]}</small></div>`).join("")}</div>
<div class="row" style="margin-top:12px"><button class="o" onclick="U.ct='Gifts';go('community')">🎁 Gift exchange</button><button class="o" onclick="U.ct='New Year';go('community')">🎆 2027 goals</button></div>`;
};

VIEWS.events=()=>{
  const l=allEvents().filter(e=>U.ef=="All"||e.k==U.ef);
  return `<h2>🎉 December Events</h2>
<div class="row" style="overflow-x:auto;flex-wrap:nowrap;padding:4px 0">${["All","Holiday",...EKINDS].map(k=>`<span class="chip" style="${U.ef==k?"outline:2px solid var(--m)":""}" onclick="U.ef='${k}';R()">${k}</span>`).join("")}</div>
<button class="full" style="margin-top:8px" onclick="addEventAsk()">+ Add an event</button>
${l.map(evCard).join("")||"<p>No events in this group yet.</p>"}
<p class="demo">Sample events are marked. Dates for carnivals and concerts change each year, so confirm with the organisers. Government may shift public holidays, so check official announcements. Events you add are saved only in this browser.</p>`;
};

VIEWS.states=()=>`<h2>🗺️ Explore December in Nigeria</h2><p class="demo">Tap a state to see its food, fashion, music, events, travel and traditions.</p>${grid()}`;

VIEWS.statepage=()=>{
  const s=U.bs||S.state||"Lagos";
  return `<button class="o" onclick="go('states')">← All states</button>
<div class="card hero"><div class="row">${pic(`states/${slug(s)}.png`,"🛡️",54)}<div><h2>${s}</h2><small>Capital: ${cap(s)} · ${ZONE_OF[s]}</small><br><i class="gold">"${slog(s)}"</i></div></div></div>
${s!=S.state?`<button class="o full" onclick="S.state='${s}';sv();R()">Make ${s} my state</button>`:""}
<h3>December in ${s}</h3><div class="grid">${DEC_CARDS.map(c=>`<div class="card c" style="margin:0;cursor:pointer" onclick="decInfo('${c[2]}')"><div style="font-size:26px">${c[0]}</div><small>${c[1]}</small></div>`).join("")}</div>
<p class="demo">Zone-level guides, not exhaustive. Add real state details in js/december.js.</p>`;
};

VIEWS.games=()=>{
  const dn=S.daily&&S.daily.d==today();
  return `<h2>🎮 December Games</h2><div class="card dk c"><b>${S.pts}</b> points · 🔥 <b>${S.streak||0}</b>-day streak · <b>${S.games}</b> games</div>
<div class="card"><b>🎯 Daily December Quiz</b><p>5 questions on Christmas, Nigerian culture and general knowledge. 10 points per correct answer, once a day.</p><p class="demo">${dn?"You already earned today's points. Replays are practice.":"New questions every day."}</p><button class="full" onclick="startQuiz('daily')">${dn?"Practice again":"Play daily quiz"}</button></div>
<div class="card"><b>🧠 ${S.state||"State"} Knowledge Quiz</b><p>30 questions about your state and Nigeria. 10 points per correct answer.</p><button class="full" onclick="startQuiz('state')">Play state quiz</button></div>
<div class="card"><b>💬 Play with a friend</b><p>Open a chat and tap State Game to play live while you talk.</p><button class="o full" onclick="U.ct='Chat';go('community')">Go to Community</button></div>`;
};

VIEWS.quiz=()=>{
  const z=U.qz;if(!z)return VIEWS.games();
  if(z.done)return `<div class="card c"><h2>${z.title}</h2><h1>${z.score}/${z.qs.length}</h1><p>${z.pts?`+${z.score*z.pts} points earned`:"Practice round: no points this time."}</p><p>🔥 Streak: ${S.streak||0}</p><button class="full" onclick="startQuiz('${z.kind}')">Play again</button><button class="o full" onclick="go('games')">Back to Games</button></div>`;
  const q=z.qs[z.i];
  return `<div class="row sp"><button class="o" onclick="go('games')">← Games</button><b>${z.i+1}/${z.qs.length}</b></div>
<div class="card"><b>${z.title}</b><p><b>${q.q}</b></p>${q.o.map((x,i)=>`<button class="opt ${z.ans!=null?(i==q.c?"ok":i==z.ans?"bad":""):""}" onclick="answerQ(${i})">${"ABCD"[i]}. ${x}</button>`).join("")}
${z.ans!=null?`<p><b>${z.ans==q.c?"Correct!"+(z.pts?" +"+z.pts+" pts":""):"Not quite. The answer is "+q.o[q.c]+"."}</b></p><button onclick="nextQ()">${z.i+1<z.qs.length?"Next":"Finish"}</button>`:""}</div>`;
};

/* Community: chat + gift exchange + giving + new year */
VIEWS.community=()=>`<div class="row">${["Chat","Gifts","Giving","New Year"].map(t=>`<button class="${U.ct==t?"":"o"}" onclick="U.ct='${t}';R()">${t}</button>`).join("")}</div>${commTab()}`;
function commTab(){
  if(U.ct=="Gifts")return giftsTab();
  if(U.ct=="Giving")return givingTab();
  if(U.ct=="New Year")return nyTab();
  return `<div class="card dk c"><b>💬 One-to-one chat</b><p>Chat with 2 people only, matched by age and opposite gender. Never a group.</p><button onclick="openChat()">Open my chat spaces</button></div>
<div class="card"><b>🛡️ Safe &amp; Respectful</b><p>Be kind. Never share your address, phone number or bank details. You must be 13 or older to chat.</p></div>`;
}
const giftsTab=()=>{const g=S.gift||{},gt=g.giftee!=null?GIFTEES[g.giftee]:null;
  return `<div class="card dk"><b>🎁 Gift Exchange</b><p>Optional and friendly. Join, share a wish, then draw someone in your age group to surprise.</p><p class="demo">Never share your address, phone number or bank details here. Under-18s should agree any swap with a parent or guardian. Demo: real matching needs a backend, and the giftees below are sample profiles.</p></div>
<div class="card">${!g.in?`<button class="full" onclick="giftJoin(1)">Join the gift exchange</button>`:`<b>You're in 🎉</b><input id="gw" maxlength="100" placeholder="Your wishlist (e.g. books, snacks)" aria-label="Wishlist" value="${esc(g.wish||"")}"><button class="full" onclick="giftSave()">Save wishlist</button>${gt?`<p>You're giving to <b>${gt[0]}</b>, who likes ${gt[1]}.</p>`:`<button class="full" onclick="giftDraw()">Draw my giftee</button>`}<button class="o full" onclick="giftJoin(0)">Leave the exchange</button>`}</div>`};
const givingTab=()=>{const k=S.kind||[],n=k.filter(x=>x.d==today()).length;
  return `<div class="card dk"><b>🤝 Season of Giving</b><p>Small acts add up. Ideas:</p>${KIND_IDEAS.map(i=>`<p>• ${i}</p>`).join("")}</div>
<div class="card"><b>My kindness log</b><p class="demo">+5 points for up to 3 acts a day. Nothing is shared with anyone.</p><div class="row"><input id="kd" maxlength="100" placeholder="What kind thing did you do?" aria-label="Kind act" style="flex:1"><button onclick="logKind()">Add</button></div>
<p>Total acts: <b>${k.length}</b> · Today: <b>${n}</b></p>${k.slice(-5).reverse().map(x=>`<p>💚 ${esc(x.t)} <small>${x.d}</small></p>`).join("")}</div>`};
const nyTab=()=>{const n=S.ny||(S.ny={ach:[],goals:[],ref:""});
  return `<div class="card hero c">${cdTile("ny","until 2027")}</div>
<div class="card"><b>🏆 My 2026 achievements</b>${n.ach.map((a,i)=>`<p>✅ ${esc(a)} <a href="#" onclick="nyDel('ach',${i});return false">remove</a></p>`).join("")}<div class="row"><input id="na" maxlength="100" placeholder="Add an achievement" aria-label="Achievement" style="flex:1"><button onclick="nyAdd('ach')">Add</button></div></div>
<div class="card"><b>🎯 My 2027 goals</b>${n.goals.map((g,i)=>`<p><input type="checkbox" style="width:auto" aria-label="Done" ${g.done?"checked":""} onchange="nyTog(${i})"> ${esc(g.t)} <a href="#" onclick="nyDel('goals',${i});return false">remove</a></p>`).join("")}<div class="row"><input id="ng" maxlength="100" placeholder="Add a goal" aria-label="Goal" style="flex:1"><button onclick="nyAdd('goals')">Add</button></div></div>
<div class="card"><b>📝 Reflection</b><textarea id="nr" rows="4" maxlength="500" placeholder="What did 2026 teach you?" aria-label="Reflection">${esc(n.ref)}</textarea><button class="full" onclick="nySave()">Save reflection</button></div>
<p class="demo">Saved only in this browser.</p>`};

/* ---------- Actions ---------- */
const addEventAsk=()=>openModal(`<h3>Add an event</h3><input id="et" maxlength="60" placeholder="Event name" aria-label="Event name"><input id="ed" type="date" aria-label="Date"><select id="es" aria-label="State"><option>All states</option>${ST.map(s=>`<option>${s[0]}</option>`).join("")}</select><select id="ek" aria-label="Type">${EKINDS.map(k=>`<option>${k}</option>`).join("")}</select><div class="err" id="ee"></div><button class="full" onclick="addEvent()">Add event</button><button class="o full" onclick="closeModal()">Cancel</button>`);
const addEvent=()=>{const t=$("#et").value.trim(),d=$("#ed").value;if(!t||!d){$("#ee").textContent="Add a name and a date.";return}(S.events=S.events||[]).push({t:t.slice(0,60),d,s:$("#es").value,k:$("#ek").value});sv();closeModal()};
const delEvent=i=>{S.events.splice(i,1);sv();R()};

const dailyQs=()=>{const r=rng([...today()].reduce((a,c)=>a+c.charCodeAt(0)*7,3));return shuf([...DEC_Q,...GENERIC.slice(0,12)],r).slice(0,5).map(x=>buildQ(x,r))};
const startQuiz=k=>{const first=!(S.daily&&S.daily.d==today());U.qz=k=="daily"?{kind:k,title:"Daily December Quiz",qs:dailyQs(),i:0,ans:null,score:0,pts:first?10:0,first}:{kind:k,title:`${S.state||"Lagos"} State Quiz`,qs:getQs().slice(),i:0,ans:null,score:0,pts:10};go("quiz")};
const answerQ=i=>{const z=U.qz;if(z.ans!=null)return;z.ans=i;if(i==z.qs[z.i].c){z.score++;S.pts+=z.pts;sv()}R()};
const nextQ=()=>{const z=U.qz;z.ans=null;z.i++;
  if(z.i>=z.qs.length){z.done=true;S.games++;
    if(z.kind=="daily"&&z.first){S.daily={d:today(),score:z.score};S.streak=S.last==yday()?(S.streak||0)+1:1;S.last=today()}
    sv()}
  R()};

const giftJoin=v=>{S.gift=S.gift||{};S.gift.in=!!v;if(!v)S.gift.giftee=null;sv();R()};
const giftSave=()=>{S.gift.wish=$("#gw").value.slice(0,100);sv();notice("Wishlist saved.")};
const giftDraw=()=>{
  if(!S.dob)return openModal(`<p>Fill in your gender and date of birth in Chat Info first, so we can match you with your age group.</p><button class="full" onclick="closeModal();openChat()">Go to Chat Info</button>`);
  const minor=age(S.dob)<18,l=GIFTEES.map((x,i)=>[x,i]).filter(x=>(x[0][2]<18)==minor);
  S.gift.giftee=l[Math.random()*l.length|0][1];sv();R()};
const logKind=()=>{const i=$("#kd"),t=i.value.trim();if(!t)return;S.kind=S.kind||[];const n=S.kind.filter(k=>k.d==today()).length;S.kind.push({t:t.slice(0,100),d:today()});if(n<3)S.pts+=5;sv();R()};
const nyAdd=k=>{const v=$(k=="ach"?"#na":"#ng").value.trim();if(!v)return;const n=S.ny;if(k=="ach")n.ach.push(v.slice(0,100));else n.goals.push({t:v.slice(0,100),done:false});sv();R()};
const nyDel=(k,i)=>{S.ny[k].splice(i,1);sv();R()};
const nyTog=i=>{S.ny.goals[i].done=!S.ny.goals[i].done;sv()};
const nySave=()=>{S.ny.ref=$("#nr").value.slice(0,500);sv();notice("Reflection saved.")};
