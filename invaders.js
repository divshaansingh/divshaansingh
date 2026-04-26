/* PIXEL INVADERS — shared arcade game (home + 404) */
(function(){
  const canvas=document.getElementById('game-canvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height;

  // Audio
  const AudioCtx=window.AudioContext||window.webkitAudioContext;
  let audioCtx;
  function initAudio(){if(!audioCtx)audioCtx=new AudioCtx()}
  function playSound(freq,dur,type,vol){
    if(!audioCtx)return;
    const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();
    osc.type=type||'square';osc.frequency.value=freq;
    gain.gain.value=vol||.08;
    gain.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+dur);
    osc.connect(gain);gain.connect(audioCtx.destination);
    osc.start();osc.stop(audioCtx.currentTime+dur);
  }
  const sfxShoot=()=>playSound(880,.08,'square',.06);
  const sfxHit=()=>playSound(220,.15,'sawtooth',.08);
  const sfxDie=()=>playSound(120,.4,'sawtooth',.1);

  const PIXEL=2;
  function drawPixelArray(arr,x,y,color,scale){
    const s=scale||PIXEL;
    ctx.fillStyle=color;
    for(let r=0;r<arr.length;r++)for(let c=0;c<arr[r].length;c++)if(arr[r][c])ctx.fillRect(x+c*s,y+r*s,s,s);
  }

  const PLAYER_SPRITE=[[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],[0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],[0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],[0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],[0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,0,0,1,1,1,1,1,0,0,1,1,1]];
  const ENEMY1_A=[[0,0,0,1,1,0,0,0],[0,0,1,1,1,1,0,0],[0,1,1,1,1,1,1,0],[1,1,0,1,1,0,1,1],[1,1,1,1,1,1,1,1],[0,1,0,1,1,0,1,0],[1,0,0,0,0,0,0,1],[0,1,0,0,0,0,1,0]];
  const ENEMY1_B=[[0,0,0,1,1,0,0,0],[0,0,1,1,1,1,0,0],[0,1,1,1,1,1,1,0],[1,1,0,1,1,0,1,1],[1,1,1,1,1,1,1,1],[0,0,1,0,0,1,0,0],[0,1,0,1,1,0,1,0],[1,0,1,0,0,1,0,1]];
  const ENEMY2_A=[[0,0,1,0,0,0,0,0,1,0,0],[0,0,0,1,0,0,0,1,0,0,0],[0,0,1,1,1,1,1,1,1,0,0],[0,1,1,0,1,1,1,0,1,1,0],[1,1,1,1,1,1,1,1,1,1,1],[1,0,1,1,1,1,1,1,1,0,1],[1,0,1,0,0,0,0,0,1,0,1],[0,0,0,1,1,0,1,1,0,0,0]];
  const ENEMY2_B=[[0,0,1,0,0,0,0,0,1,0,0],[1,0,0,1,0,0,0,1,0,0,1],[1,0,1,1,1,1,1,1,1,0,1],[1,1,1,0,1,1,1,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1],[0,1,1,1,1,1,1,1,1,1,0],[0,0,1,0,0,0,0,0,1,0,0],[0,1,0,0,0,0,0,0,0,1,0]];
  const EXPLOSION=[[0,0,1,0,0,1,0,0],[0,1,0,0,0,0,1,0],[1,0,0,1,1,0,0,1],[0,0,1,0,0,1,0,0],[0,0,1,0,0,1,0,0],[1,0,0,1,1,0,0,1],[0,1,0,0,0,0,1,0],[0,0,1,0,0,1,0,0]];

  let state='title',score=0,lives=3,level=1,frameCount=0,animFrame=0;
  let hiScore=parseInt(localStorage.getItem('pixelHiScore')||'0');
  const keys={};
  let player={x:W/2-15,y:H-30,w:30,h:18,speed:4};
  let playerBullets=[],playerCooldown=0;
  let enemies=[],enemyDir=1,enemySpeed=.5,enemyBullets=[],particles=[];
  const stars=[];
  for(let i=0;i<60;i++)stars.push({x:Math.random()*W,y:Math.random()*H,size:Math.random()>.7?2:1,speed:.2+Math.random()*.5,blink:Math.random()*100});

  function spawnEnemies(){
    enemies=[];
    const cols=8,rows=4,sx=46,sy=36;
    const startX=(W-(cols-1)*sx)/2,startY=40;
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)enemies.push({x:startX+c*sx,y:startY+r*sy,w:r<2?16:22,h:16,type:r<2?1:2,alive:true,hitTimer:0});
    enemyDir=1;enemySpeed=.4+level*.15;
  }
  function resetGame(){
    score=0;lives=3;level=1;
    player.x=W/2-15;playerBullets=[];enemyBullets=[];particles=[];playerCooldown=0;
    spawnEnemies();updateHUD();
  }
  function updateHUD(){
    const s=document.getElementById('hud-score'),h=document.getElementById('hud-hi'),l=document.getElementById('hud-lives');
    if(s)s.textContent=String(score).padStart(4,'0');
    if(h)h.textContent=String(hiScore).padStart(4,'0');
    if(l){let hs='';for(let i=0;i<3;i++)hs+=i<lives?'♥ ':'♡ ';l.textContent=hs.trim()}
  }

  document.addEventListener('keydown',e=>{
    if(!canvas.isConnected)return;
    keys[e.key]=true;
    const typing=document.activeElement&&/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if(typing)return;
    if(e.key===' '||e.key==='ArrowLeft'||e.key==='ArrowRight')e.preventDefault();
    initAudio();
    if(state==='title'&&(e.key===' '||e.key==='Enter')){state='playing';resetGame()}
    if(state==='gameover'&&(e.key===' '||e.key==='Enter')){state='playing';resetGame()}
    if(state==='playing'&&e.key==='p')state='paused';
    else if(state==='paused'&&e.key==='p')state='playing';
  });
  document.addEventListener('keyup',e=>{keys[e.key]=false});

  let touchLeft=false,touchRight=false,touchFire=false;
  function setupTouch(id,fn){
    const el=document.getElementById(id);if(!el)return;
    el.addEventListener('touchstart',e=>{e.preventDefault();initAudio();fn(true)});
    el.addEventListener('touchend',e=>{e.preventDefault();fn(false)});
    el.addEventListener('mousedown',()=>{initAudio();fn(true)});
    el.addEventListener('mouseup',()=>fn(false));
    el.addEventListener('mouseleave',()=>fn(false));
  }
  setupTouch('btn-left',v=>touchLeft=v);
  setupTouch('btn-right',v=>touchRight=v);
  setupTouch('btn-fire',v=>touchFire=v);

  canvas.addEventListener('click',()=>{
    initAudio();
    if(state==='title'||state==='gameover'){state='playing';resetGame()}
  });

  function update(){
    if(state!=='playing')return;
    frameCount++;
    if(frameCount%30===0)animFrame=1-animFrame;
    const mL=keys['ArrowLeft']||keys['a']||touchLeft;
    const mR=keys['ArrowRight']||keys['d']||touchRight;
    const fire=keys[' ']||touchFire;
    if(mL)player.x-=player.speed;
    if(mR)player.x+=player.speed;
    player.x=Math.max(4,Math.min(W-player.w-4,player.x));
    if(fire&&playerCooldown<=0){
      playerBullets.push({x:player.x+player.w/2-1,y:player.y-4,w:2,h:6});
      playerCooldown=12;sfxShoot();
    }
    if(playerCooldown>0)playerCooldown--;
    for(let i=playerBullets.length-1;i>=0;i--){playerBullets[i].y-=6;if(playerBullets[i].y<-10)playerBullets.splice(i,1)}
    let hitEdge=false;
    const alive=enemies.filter(e=>e.alive);
    alive.forEach(e=>{e.x+=enemySpeed*enemyDir;if(e.x<=4||e.x+e.w>=W-4)hitEdge=true});
    if(hitEdge){enemyDir*=-1;alive.forEach(e=>{e.y+=12})}
    if(frameCount%Math.max(30,80-level*8)===0&&alive.length>0){
      const sh=alive[Math.floor(Math.random()*alive.length)];
      enemyBullets.push({x:sh.x+sh.w/2-1,y:sh.y+sh.h,w:2,h:6});
    }
    for(let i=enemyBullets.length-1;i>=0;i--){enemyBullets[i].y+=3.5;if(enemyBullets[i].y>H+10)enemyBullets.splice(i,1)}
    for(let i=playerBullets.length-1;i>=0;i--){
      const b=playerBullets[i];
      for(let j=0;j<enemies.length;j++){
        const e=enemies[j];if(!e.alive)continue;
        if(b.x<e.x+e.w*PIXEL&&b.x+b.w>e.x&&b.y<e.y+e.h*PIXEL&&b.y+b.h>e.y){
          e.alive=false;e.hitTimer=12;
          playerBullets.splice(i,1);
          score+=e.type===1?30:20;
          if(score>hiScore){hiScore=score;localStorage.setItem('pixelHiScore',hiScore)}
          sfxHit();
          for(let p=0;p<6;p++)particles.push({x:e.x+e.w,y:e.y+e.h/2,vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4,life:15+Math.random()*10,color:e.type===1?'#5dade2':'#2ecc71'});
          updateHUD();break;
        }
      }
    }
    for(let i=enemyBullets.length-1;i>=0;i--){
      const b=enemyBullets[i];
      if(b.x<player.x+player.w&&b.x+b.w>player.x&&b.y<player.y+player.h&&b.y+b.h>player.y){
        enemyBullets.splice(i,1);lives--;sfxDie();
        for(let p=0;p<10;p++)particles.push({x:player.x+player.w/2,y:player.y,vx:(Math.random()-.5)*5,vy:(Math.random()-.5)*5,life:20+Math.random()*15,color:'#e74c3c'});
        updateHUD();
        if(lives<=0)state='gameover';
      }
    }
    alive.forEach(e=>{if(e.y+e.h*PIXEL>=player.y)state='gameover'});
    if(alive.length===0){level++;enemyBullets=[];playerBullets=[];spawnEnemies()}
    for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x+=p.vx;p.y+=p.vy;p.life--;if(p.life<=0)particles.splice(i,1)}
    enemies.forEach(e=>{if(e.hitTimer>0)e.hitTimer--});
  }

  function drawStars(){
    stars.forEach(s=>{
      s.y+=s.speed;if(s.y>H){s.y=0;s.x=Math.random()*W}
      const blink=Math.sin((frameCount+s.blink)*.05)>0;
      if(blink||s.size>1){ctx.fillStyle=s.size>1?'rgba(236,240,241,.6)':'rgba(236,240,241,.3)';ctx.fillRect(Math.round(s.x),Math.round(s.y),s.size,s.size)}
    });
  }
  function drawPlayer(){
    drawPixelArray(PLAYER_SPRITE,player.x,player.y,'#5dade2',PIXEL);
    if(frameCount%4<2){ctx.fillStyle='#e67e22';ctx.fillRect(player.x+12,player.y+18,2,3);ctx.fillRect(player.x+16,player.y+18,2,3)}
  }
  function drawEnemies(){
    enemies.forEach(e=>{
      if(e.hitTimer>0){drawPixelArray(EXPLOSION,e.x,e.y,'#f1c40f',PIXEL);return}
      if(!e.alive)return;
      if(e.type===1)drawPixelArray(animFrame===0?ENEMY1_A:ENEMY1_B,e.x,e.y,'#e056a0',PIXEL);
      else drawPixelArray(animFrame===0?ENEMY2_A:ENEMY2_B,e.x,e.y,'#2ecc71',PIXEL);
    });
  }
  function drawBullets(){
    ctx.fillStyle='#5dade2';playerBullets.forEach(b=>{ctx.fillRect(b.x,b.y,b.w,b.h);ctx.fillStyle='rgba(93,173,226,.3)';ctx.fillRect(b.x-1,b.y+4,b.w+2,4);ctx.fillStyle='#5dade2'});
    ctx.fillStyle='#e74c3c';enemyBullets.forEach(b=>ctx.fillRect(b.x,b.y,b.w,b.h));
  }
  function drawParticles(){particles.forEach(p=>{ctx.globalAlpha=p.life/30;ctx.fillStyle=p.color;ctx.fillRect(Math.round(p.x),Math.round(p.y),2,2)});ctx.globalAlpha=1}
  function drawTitle(){
    ctx.fillStyle='#f1c40f';ctx.font='20px "Press Start 2P"';ctx.textAlign='center';
    ctx.fillText('PIXEL INVADERS',W/2,120);
    ctx.fillStyle='#5dade2';ctx.font='10px "Press Start 2P"';ctx.fillText('ARCADE EDITION',W/2,150);
    drawPixelArray(animFrame===0?ENEMY1_A:ENEMY1_B,W/2-24,180,'#e056a0',3);
    drawPixelArray(animFrame===0?ENEMY2_A:ENEMY2_B,W/2-30,230,'#2ecc71',3);
    ctx.fillStyle='#ecf0f1';ctx.font='7px "Press Start 2P"';
    ctx.fillText('= 30 PTS',W/2+30,200);
    ctx.fillText('= 20 PTS',W/2+30,252);
    if(Math.floor(frameCount/30)%2===0){ctx.fillStyle='#ecf0f1';ctx.font='9px "Press Start 2P"';ctx.fillText('PRESS SPACE OR TAP TO START',W/2,330)}
    ctx.fillStyle='#7f8c8d';ctx.font='7px "Press Start 2P"';ctx.fillText('HIGH SCORE: '+String(hiScore).padStart(4,'0'),W/2,370);
  }
  function drawPaused(){ctx.fillStyle='rgba(15,15,27,.7)';ctx.fillRect(0,0,W,H);ctx.fillStyle='#f1c40f';ctx.font='16px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('PAUSED',W/2,H/2-10);ctx.fillStyle='#7f8c8d';ctx.font='8px "Press Start 2P"';ctx.fillText('PRESS P TO RESUME',W/2,H/2+20)}
  function drawGameOver(){
    ctx.fillStyle='rgba(15,15,27,.8)';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#e74c3c';ctx.font='20px "Press Start 2P"';ctx.textAlign='center';ctx.fillText('GAME OVER',W/2,H/2-30);
    ctx.fillStyle='#f1c40f';ctx.font='10px "Press Start 2P"';ctx.fillText('SCORE: '+String(score).padStart(4,'0'),W/2,H/2+10);
    ctx.fillStyle='#5dade2';ctx.font='8px "Press Start 2P"';ctx.fillText('LEVEL: '+level,W/2,H/2+35);
    if(Math.floor(frameCount/30)%2===0){ctx.fillStyle='#ecf0f1';ctx.font='8px "Press Start 2P"';ctx.fillText('PRESS SPACE OR TAP TO RETRY',W/2,H/2+70)}
  }
  function gameLoop(){
    ctx.fillStyle='#050510';ctx.fillRect(0,0,W,H);
    drawStars();
    if(state==='title'){frameCount++;if(frameCount%30===0)animFrame=1-animFrame;drawTitle()}
    else if(state==='playing'){update();drawPlayer();drawEnemies();drawBullets();drawParticles()}
    else if(state==='paused'){drawPlayer();drawEnemies();drawBullets();drawPaused()}
    else if(state==='gameover'){frameCount++;drawParticles();drawGameOver()}
    requestAnimationFrame(gameLoop);
  }
  updateHUD();gameLoop();
})();
