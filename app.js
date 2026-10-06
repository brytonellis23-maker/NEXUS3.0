const $=id=>document.getElementById(id);
let model,stream,voice=true,target="",locked=false,nano="",enabled=false,pan=0,tilt=90;
function speak(t){if(!voice)return;let vs=speechSynthesis.getVoices(),v=vs.find(x=>/^en/i.test(x.lang)&&/(male|david|daniel|alex|mark|guy|james|tom|fred|george|brian|richard|matthew)/i.test(x.name))||vs.find(x=>/^en/i.test(x.lang));if(!v)v=vs[0];let u=new SpeechSynthesisUtterance(t);if(v)u.voice=v;u.pitch=.82;u.rate=.96;speechSynthesis.cancel();speechSynthesis.speak(u)}
async function cmd(c){let body={cmd:c,panSpeed:+$("ps").value,tiltSpeed:+$("ts").value,enabled};try{let r=await fetch("/api/command",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});let s=await r.json();pan=s.pan??pan;tilt=s.tilt??tilt;$("pan").textContent=pan;$("tilt").textContent=tilt}catch(e){}}
$("cam").onclick=async()=>{try{stream=await navigator.mediaDevices.getUserMedia({video:true,audio:false});$("video").srcObject=stream;$("msg").style.display="none";$("ai").textContent="AI: loading";model=await cocoSsd.load();$("ai").textContent="AI: ready";detect()}catch(e){$("msg").textContent="Camera permission failed"}};
async function detect(){if(!model)return;let p=await model.detect($("video"));let c=$("cv"),v=$("video");c.width=v.videoWidth;c.height=v.videoHeight;let x=c.getContext("2d");x.clearRect(0,0,c.width,c.height);for(let q of p){x.strokeStyle="#2f9cff";x.lineWidth=3;x.strokeRect(...q.bbox);x.fillStyle="#2f9cff";x.fillText(q.class+" "+Math.round(q.score*100)+"%",q.bbox[0],q.bbox[1]);}requestAnimationFrame(detect)}
$("voice").onclick=()=>{voice=!voice;$("voice").textContent=voice?"VOICE ON":"VOICE OFF";if(voice)speak("Voice online")};
$("connect").onclick=async()=>{nano=$("nano").value.trim();await fetch("/api/config",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nano})});$("status").textContent="NANO SET";$("status").className="online";speak("Nano connection configured")};
$("scan").onclick=()=>{target=$("target").value.trim();speak(target?`Scanning for ${target}`:"Scanning")};
$("lock").onclick=()=>{locked=true;speak(target?`Locked onto ${target}`:"Target locked")};
$("unlock").onclick=()=>{locked=false;cmd("stop");speak("Target unlocked")};
document.querySelectorAll("[data-c]").forEach(b=>{b.onpointerdown=()=>{enabled=true;cmd(b.dataset.c)};b.onpointerup=()=>cmd("stop");b.onpointerleave=()=>cmd("stop")});
$("stop").onclick=()=>cmd("stop");$("estop").onclick=()=>{enabled=false;cmd("estop");speak("Emergency stop")};
window.onkeydown=e=>{if(e.repeat)return;let m={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right"}[e.key];if(m){enabled=true;cmd(m)}};window.onkeyup=e=>{if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key))cmd("stop")};
