/* ===== AUTHENTICATION: log in, sign up, email request =====
   No server: each browser holds ONE account. Only a scrambled hash of the password is saved, on this device.
   This is NOT real security. Real accounts need a backend. */
const PW_MIN=8,PW_MAX=64;
const ADMIN_NOTE="Administrators can review content on NaijaStackForge and can block or suspend accounts that break the community rules. They cannot see your password. Right now everything you save stays on your own device.";

// ---- Password helpers (built-in browser crypto, no library) ----
const b64=a=>btoa(String.fromCharCode(...new Uint8Array(a)));
const newSalt=()=>b64(crypto.getRandomValues(new Uint8Array(16)));
const canHash=()=>!!(window.crypto&&crypto.subtle);
const hashPw=async(pw,salt)=>{
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(pw),"PBKDF2",false,["deriveBits"]);
  const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt:Uint8Array.from(atob(salt),c=>c.charCodeAt(0)),iterations:100000,hash:"SHA-256"},key,256);
  return b64(bits)};

// ---- Password rules (checked live on the sign-up screen) ----
const pwRules=(p,c)=>[["At least "+PW_MIN+" characters",p.length>=PW_MIN],["Both passwords match",p.length>0&&p===c]];
const pwRulesHtml=(p,c)=>pwRules(p,c).map(r=>`<p style="margin:2px 0;font-size:13px;color:${r[1]?"#1553c4":"#51607f"}">${r[1]?"✓":"○"} ${r[0]}</p>`).join("");
const pwLive=()=>{$("#pwr").innerHTML=pwRulesHtml($("#sp").value,$("#sc").value)};
const pwShow=(...ids)=>ids.forEach(i=>{const e=$("#"+i);if(e)e.type=e.type=="password"?"text":"password"});

// ---- Email request (starts on the date in content/site.json, default 20 Dec 2026) ----
const emailDate=()=>(CONTENT.site||{}).emailRequestDate||"2026-12-20";
const emailDue=()=>!!S.user&&!S.email&&!U.emailSkip&&today()>=emailDate();

// ---- Where to go after logging in or signing up ----
const afterEmail=()=>{if(!(S.gender&&S.dob&&S.state))return openSetup(true);go("home")};
const afterAuth=()=>{if(emailDue())return go("email");afterEmail()};

// ---- LOG IN ----
VIEWS.login=()=>`<button class="o" onclick="go('landing')">← Home page</button>${brand()}<div class="card"><h2>Log in</h2><p>Welcome back to NaijaStackForge.</p>
<label for="u"><b>Username</b></label><input id="u" maxlength="24" autocomplete="username" value="${esc(S.user||"")}">
<label for="p"><b>Password</b></label><div class="row"><input id="p" type="password" autocomplete="current-password" maxlength="64" style="flex:1"><button class="o" aria-label="Show or hide password" onclick="pwShow('p')">👁</button></div>
<div class="err" id="le" role="alert">${U.err}</div><button class="full" onclick="doLogin()">Log in</button>
<p class="c" style="margin:8px">New here? <a href="#" onclick="go('signup');return false"><b>Create an account</b></a></p>
<p class="c">— or —</p><button class="o full" onclick="startGuest()">Continue as Guest (browse only)</button>
<p class="c"><a href="#" style="color:#789;font-size:12px" onclick="adminAsk();return false">Admin</a></p></div>
<p class="demo c">This site has no server. Your account and a scrambled copy of your password are saved only on this device.</p>`;

const doLogin=async()=>{
  const u=$("#u").value.trim(),p=$("#p").value,E=t=>{$("#le").textContent=t};
  if(u.length<3)return E("Enter your username (at least 3 characters).");
  if(!p)return E("Enter your password.");
  if(!S.user||u.toLowerCase()!==S.user.toLowerCase())return E("No account with that username on this device. Create an account first.");
  if(!S.pwh)return go("signup"); // account made before passwords existed: set one
  if(!canHash())return E("This browser cannot check passwords here. Open the site through serve.py or its hosted address.");
  let h="";try{h=await hashPw(p,S.salt)}catch(x){return E("Could not check the password. Try again.")}
  if(h!==S.pwh)return E("Wrong username or password.");
  U.guest=false;U.err="";afterAuth()};

// ---- SIGN UP (also used to set a password for an older account) ----
VIEWS.signup=()=>{
  const has=S.user&&S.pwh,setpw=S.user&&!S.pwh,note=esc((CONTENT.site||{}).adminNotice||ADMIN_NOTE);
  if(has)return `<button class="o" onclick="go('login')">← Log in</button>${brand()}<div class="card"><h2>Account on this device</h2><p>This device already has an account for <b>${esc(S.user)}</b>. Log in instead.</p><button class="full" onclick="go('login')">Go to log in</button><p class="demo">Without a server, each browser can hold one account. To start a new one, clear this site's saved data in your browser settings.</p></div>`;
  return `<button class="o" onclick="go('login')">← Log in</button>${brand()}<div class="card"><h2>${setpw?"Set a password":"Create your account"}</h2>
${setpw?`<p>Your account <b>${esc(S.user)}</b> was made before passwords were added. Choose a password to keep it.</p>`:`<label for="su"><b>Username</b></label><input id="su" maxlength="24" autocomplete="username" placeholder="e.g. Amara_24"><small>3 to 24 letters, numbers, _ . or -</small>`}
<label for="sp"><b>Password</b></label><div class="row"><input id="sp" type="password" autocomplete="new-password" maxlength="${PW_MAX}" style="flex:1" oninput="pwLive()"><button class="o" aria-label="Show or hide passwords" onclick="pwShow('sp','sc')">👁</button></div>
<label for="sc"><b>Confirm password</b></label><input id="sc" type="password" autocomplete="new-password" maxlength="${PW_MAX}" oninput="pwLive()">
<div id="pwr" aria-live="polite">${pwRulesHtml("","")}</div>
<div class="err" id="se" role="alert">${U.err}</div><button class="full" onclick="doSignup()">${setpw?"Save password":"Create account"}</button>
<p class="demo">You must be 13 or older to use NaijaStackForge. You will add your date of birth next. If you forget your password it cannot be reset yet, because there is no server.</p>
<div class="card dk" style="margin:10px 0 0"><b>🛡️ Administrator access</b><p>${note}</p></div></div>`};

const doSignup=async()=>{
  const setpw=S.user&&!S.pwh,u=setpw?S.user:$("#su").value.trim(),p=$("#sp").value,c=$("#sc").value,E=t=>{$("#se").textContent=t};
  if(!setpw&&!/^[A-Za-z0-9_.-]{3,24}$/.test(u))return E("Username: 3 to 24 letters, numbers, _ . or -");
  if(p.length<PW_MIN)return E("Your password must be at least "+PW_MIN+" characters.");
  if(p.length>PW_MAX)return E("Your password can be at most "+PW_MAX+" characters.");
  if(p!==c)return E("The two passwords do not match.");
  if(!canHash())return E("This browser cannot protect passwords here. Open the site through serve.py or its hosted address.");
  const salt=newSalt();
  try{S.pwh=await hashPw(p,salt)}catch(x){return E("Could not save the password. Try again.")}
  S.user=u;S.salt=salt;U.guest=false;U.err="";sv();afterAuth()};

// ---- EMAIL REQUEST SCREEN ----
VIEWS.email=()=>`${brand()}<div class="card"><h2>Add your email</h2><p>We now ask every account holder for an email address.</p>
<label for="em"><b>Email address</b></label><input id="em" type="email" maxlength="100" autocomplete="email" value="${esc(S.email||"")}">
<div class="err" id="ee2" role="alert"></div><button class="full" onclick="saveEmail()">Save email</button><button class="o full" onclick="skipEmail()">Not now</button>
<p class="demo">There is no server yet, so this email is saved only on this device. It is not sent anywhere or checked. "Not now" asks again next time you open the site.</p></div>`;
const saveEmail=()=>{const v=$("#em").value.trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)||v.length>100)return $("#ee2").textContent="Enter a valid email address, for example name@example.com.";
  S.email=v;sv();afterEmail()};
const skipEmail=()=>{U.emailSkip=true;afterEmail()};

// ---- Safety net: guest helpers (used only if js/ui.js does not already define them) ----
if(typeof guestStop==="undefined"){window.guestStop=()=>{if(!U.guest)return false;go("login");U.err="Log in or sign up to use this feature.";R();return true}}
if(typeof startGuest==="undefined"){window.startGuest=()=>{U.guest=true;go("home")}}