/* ===== CONTENT LOADER: reads JSON files from /content. Returns null if anything fails. ===== */
const CONTENT={};
const loadContent=async p=>{try{const r=await fetch(p);if(!r.ok)return null;return await r.json()}catch(e){return null}};