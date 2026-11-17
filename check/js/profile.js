/* ===== PROFILE: users create and edit their own profile ===== */
const INTERESTS=["Music","Food","Travel","Sports","Tech","Books","Art","Fashion","Movies","Gaming","Dance","History","Photography","Giving"];

// Shows a photo if there is one, otherwise a neutral placeholder
const photoHtml=(src,sz=44)=>src?`<span class="pic" style="--s:${sz}px"><img src="${src}" alt="Profile photo"></span>`:`<span class="pic" style="--s:${sz}px"><i>👤</i></span>`;
const mypic=(sz=44)=>photoHtml(S.photo,sz);

// Reads a chosen image, crops it square, shrinks it, and stores it as text (so it fits in localStorage)
const photoPick=inp=>{
  const f=inp.files&&inp.files[0];if(!f)return;
  if(!/^image\//.test(f.type)){notice("Please choose an image file.");return}
  if(f.size>8*1024*1024){notice("That image is too large. Choose one under 8 MB.");return}
  const r=new FileReader();
  r.onload=()=>{const im=new Image();
    im.onload=()=>{const c=document.createElement("canvas"),n=240;c.width=c.height=n;
      const s=Math.min(im.width,im.height);c.getContext("2d").drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,n,n);
      const d=c.toDataURL("image/jpeg",.82);
      if(U.v=="setup")U.pf.photo=d;else{S.photo=d;sv()}
      R()};
    im.onerror=()=>notice("Could not read that image. Try another one.");
    im.src=r.result};
  r.readAsDataURL(f);
};

const openSetup=isNew=>{
  U.pf={user:S.user||"",gender:S.gender||"",dob:S.dob||"",state:S.state||"",bio:S.bio||"",interests:(S.interests||[]).slice(),photo:S.photo||""};
  U.pfNew=!!isNew;go("setup");
};

VIEWS.setup=()=>{const f=U.pf;return `${U.pfNew?brand():`<button class="o" onclick="go('profile')">← Back</button>`}
<h2 class="c">${U.pfNew?"Create your profile":"Edit your profile"}</h2>
<div class="card c">${photoHtml(f.photo,96)}<br>
<input type="file" id="pfile" accept="image/*" style="display:none" onchange="photoPick(this)">
<button class="o" style="margin-top:8px" onclick="$('#pfile').click()">${f.photo?"Change photo":"Add a photo"}</button>${f.photo?` <button class="o" onclick="U.pf.photo='';R()">Remove</button>`:""}
<p class="demo">Your photo is saved only on this device. Choose a safe picture and avoid showing your school, address or other personal details.</p></div>
<div class="card">
<label for="pu"><b>Username</b></label><input id="pu" maxlength="24" value="${esc(f.user)}" oninput="U.pf.user=this.value" placeholder="e.g. Amara_24">
<b>Gender</b><div class="row" style="margin:6px 0"><button class="${f.gender=="Male"?"":"o"}" onclick="U.pf.gender='Male';R()">Male</button><button class="${f.gender=="Female"?"":"o"}" onclick="U.pf.gender='Female';R()">Female</button></div>
<label for="pd"><b>Date of birth</b></label><input id="pd" type="date" value="${f.dob}" onchange="U.pf.dob=this.value">
<div class="demo" style="color:#456">You must be 13 or older. Chat partners see only your age.</div>
<label for="ps"><b>Your state</b></label><select id="ps" onchange="U.pf.state=this.value"><option value="">Choose your state</option>${ST.map(s=>`<option ${f.state==s[0]?"selected":""}>${s[0]}</option>`).join("")}</select>
<label for="pb"><b>Short bio</b></label><textarea id="pb" rows="3" maxlength="120" oninput="U.pf.bio=this.value" placeholder="Tell people about yourself">${esc(f.bio)}</textarea>
<b>Interests</b> <small>(pick up to 5)</small><div class="row" style="margin:6px 0 10px">${INTERESTS.map(t=>`<span class="chip pill ${f.interests.includes(t)?"on":""}" onclick="pfTog('${t}')">${t}</span>`).join("")}</div>
<div class="err">${U.err}</div><button class="full" onclick="pfSave()">${U.pfNew?"Save and continue":"Save changes"}</button></div>`};

const pfTog=t=>{const l=U.pf.interests;U.err="";const i=l.indexOf(t);if(i>=0)l.splice(i,1);else if(l.length<5)l.push(t);else U.err="You can pick up to 5 interests.";R()};

const pfSave=()=>{
  const f=U.pf,u=(f.user||"").trim();let e="";
  if(u.length<3)e="Enter a username with at least 3 characters.";
  else if(!f.gender)e="Choose a gender.";
  else if(!f.dob||isNaN(new Date(f.dob)))e="Enter your date of birth.";
  else if(age(f.dob)<13)e="You must be 13 or older to use NaijaStackForge.";
  else if(age(f.dob)>110)e="Check your date of birth.";
  else if(!f.state)e="Choose your state.";
  if(e){U.err=e;return R()}
  const rematch=S.peers&&(S.gender!=f.gender||S.dob!=f.dob);
  Object.assign(S,{user:u.slice(0,24),gender:f.gender,dob:f.dob,state:f.state,bio:(f.bio||"").trim().slice(0,120),interests:f.interests.slice(),photo:f.photo});
  if(rematch){makePeers();S.msgs={}}
  sv();U.err="";
  go(U.pfNew?"welcome":"profile");
};
