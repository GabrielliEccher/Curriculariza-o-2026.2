(() => {
  const app = document.querySelector("#app");
  const bank = window.questionBank;
  const levels = Object.keys(bank);
  const totalQuestions = 10;
  const maxAttempts = { Fácil: 3, Médio: 3, Difícil: 2 };
  let level = "Fácil", game = null, memoryTimer = null, soundOn = true, audioContext = null;
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const art = { "🐱":"cat","🐈":"cat","🐝":"bee","🍎":"apple","🐻":"bear","🐰":"rabbit","🐟":"fish","🐠":"fish","🐔":"hen","🐶":"dog","🐸":"frog","🐢":"turtle","🦋":"butterfly","🐞":"ladybug","🌼":"flower","☀️":"sun","🍌":"banana","🍐":"pear","🌳":"tree","🪨":"rock","⭐":"star","🌟":"star","💎":"gem","🌉":"bridge","🕳️":"hole","☂️":"umbrella","🕶️":"glasses","🧤":"gloves","🍃":"leaf","🌷":"tulip","🪷":"lotus","🌙":"moon","🔴":"red-circle","🔵":"blue-circle","🟡":"yellow-circle","🔺":"triangle","🟩":"green-square","🐘":"elephant","🐄":"cow" };
  const artNames = { cat:"gato",bee:"abelha",apple:"maçã",bear:"urso",rabbit:"coelho",fish:"peixe",hen:"galinha",dog:"cachorro",frog:"sapinho",turtle:"tartaruga",butterfly:"borboleta",ladybug:"joaninha",flower:"flor",sun:"sol",banana:"banana",pear:"pera",tree:"árvore",rock:"pedra",star:"estrela",gem:"tesouro",bridge:"ponte",hole:"toca",umbrella:"guarda-chuva",glasses:"óculos de sol",gloves:"luvas",leaf:"folha",tulip:"tulipa",lotus:"flor do lago",moon:"lua", "red-circle":"círculo vermelho", "blue-circle":"círculo azul", "yellow-circle":"círculo amarelo",triangle:"triângulo", "green-square":"quadrado verde",elephant:"elefante",cow:"vaca" };
  const illustrated = (value, className = "illustration") => {
    let html = escapeHtml(value);
    for (const [emoji, id] of Object.entries(art).sort((a,b) => b[0].length-a[0].length)) html = html.replaceAll(emoji, `<svg class="${className}" role="img" aria-label="${artNames[id]}"><use href="#${id}"></use></svg>`);
    return html;
  };
  const questions = () => bank[level];
  const currentQuestion = () => questions()[game.question];

  function renderHome() {
    clearTimeout(memoryTimer);
    app.innerHTML = `<section class="screen home"><img class="mascot-home" src="assets/mascote-inicio.png" alt="Mascote da trilha de aprendizagem"><h1>APRENDER É UMA <span>TRILHA</span> DE DESCOBERTAS.</h1><button class="comic-button" type="button" data-action="levels">COMEÇAR</button></section>`;
    addSoundToggle(); app.querySelector('[data-action="levels"]').addEventListener("click", renderLevels);
  }
  function renderLevels() {
    clearTimeout(memoryTimer);
    app.innerHTML = `<section class="screen difficulty"><h1 class="screen-title">ESCOLHA UM NÍVEL DE DIFICULDADE</h1><div class="level-list" role="group" aria-label="Níveis de dificuldade">
      ${[["Fácil","facil.png"],["Médio","medio.png"],["Difícil","dificil.png"]].map(([name,img])=>`<button class="level-card" type="button" data-level="${name}"><img src="assets/${img}" alt=""><strong>${name}</strong><small>10 perguntas</small><span class="star-row" aria-hidden="true"><img src="assets/estrela.svg" alt=""><img src="assets/estrela.svg" alt=""><img src="assets/estrela.svg" alt=""></span></button>`).join("")}
      </div><p class="selection-hint">Escolha um nível para começar a aventura.</p></section>`;
    addSoundToggle(); app.querySelectorAll(".level-card").forEach((b)=>b.addEventListener("click",()=>startGame(b.dataset.level)));
  }
  function addSoundToggle() {
    const screen=app.querySelector(".screen"); if(!screen)return;
    const button=document.createElement("button"); button.type="button"; button.className="sound-toggle"; button.setAttribute("aria-pressed",String(soundOn)); button.textContent=soundOn?"Som ligado":"Som desligado"; button.setAttribute("aria-label",soundOn?"Desligar som":"Ligar som");
    button.addEventListener("click",()=>{soundOn=!soundOn;if(!soundOn&&"speechSynthesis" in window)window.speechSynthesis.cancel();addSoundToggle();if(soundOn)playSound("tap");}); screen.append(button);
  }
  function playSound(kind) {
    if(!soundOn)return; const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
    try { audioContext ||= new Audio(); if(audioContext.state==="suspended")audioContext.resume(); const notes=kind==="good"?[523,659,784]:kind==="bad"?[310,260]:[440];
      notes.forEach((frequency,index)=>{const start=audioContext.currentTime+index*.12,osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type=kind==="bad"?"sine":"triangle";osc.frequency.value=frequency;gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(kind==="bad"?.045:.055,start+.025);gain.gain.exponentialRampToValueAtTime(.0001,start+.2);osc.connect(gain);gain.connect(audioContext.destination);osc.start(start);osc.stop(start+.21);});
    } catch (_) { /* O jogo continua mesmo sem áudio. */ }
  }
  function speakQuestion(q) { if(!soundOn||!("speechSynthesis" in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(`${q.instruction} ${q.prompt}`);u.lang="pt-BR";u.rate=.86;u.pitch=1.08;window.speechSynthesis.speak(u); }
  function startGame(chosen) { level=chosen;game={question:0,correct:0,errors:0,extras:0,attemptsLeft:maxAttempts[level],locked:false,feedback:"",feedbackKind:"",selectedParts:[],selectedLeft:null,linked:[]};renderGame(); }
  function optionButtons(options,cls="") { return `<div class="option-grid ${cls}">${options.map(x=>`<button type="button" class="option" data-value="${escapeHtml(x)}" ${game.locked?"disabled":""}>${illustrated(x)}</button>`).join("")}</div>`; }
  function renderMode(q) {
    switch(q.mode) {
      case "syllables": { const shown=game.selectedParts.map(i=>q.options[i]).join(" · ");return `<div class="visual">${illustrated(q.icon)}</div><div class="syllable-answer">${shown||"Toque nas sílabas abaixo"}</div><div class="option-grid">${q.options.map((x,i)=>`<button class="option ${game.selectedParts.includes(i)?"active":""}" data-token="${i}" ${game.locked||game.selectedParts.includes(i)?"disabled":""}>${x}</button>`).join("")}</div><button class="check-button" data-action="check-syllables" ${game.locked||game.selectedParts.length!==q.parts?"disabled":""}>Conferir</button>`; }
      case "missing": return `<div class="word-display">${q.before}<span>＿</span>${q.after}</div>${optionButtons(q.options)}`;
      case "letter": return `<div class="visual letter-target">${illustrated(q.icon)}</div>${optionButtons(q.options)}`;
      case "sum": return `<div class="sum-equation" aria-label="${q.a} mais ${q.b}"><span>${illustrated("🍎".repeat(q.a))}</span><b>+</b><span>${illustrated("🍎".repeat(q.b))}</span><b>= ?</b></div>${optionButtons(q.options)}`;
      case "compare": return `<div class="compare">${[["left",q.left,q.leftName],["right",q.right,q.rightName]].map(([side,n,name])=>`<button class="compare-card" data-value="${side}" ${game.locked?"disabled":""}><span class="visual">${illustrated(name.split(" ")[0])}</span><span class="fruit-row">${illustrated("🍎".repeat(n))}</span><strong>${escapeHtml(name.split(" ").slice(1).join(" ")||"Tem frutas")}</strong></button>`).join("")}</div>`;
      case "general": case "sequence": case "pattern": return `<div class="visual sequence-display">${illustrated(q.series||"")}</div>${optionButtons(q.options)}`;
      case "drag": return `<div class="drag-board"><div class="route-display">${illustrated(q.route)}</div><button type="button" class="drag-character" aria-label="Arraste o personagem">${illustrated(q.character)}</button><p class="drag-help">Arraste o personagem ou toque no destino:</p><div class="drop-zones">${q.options.map(x=>`<button type="button" class="drop-zone" data-drop="${escapeHtml(x)}" ${game.locked?"disabled":""}>${escapeHtml(x)}</button>`).join("")}</div></div>`;
      case "treasure": return `<div class="map-grid" aria-label="Mapa do tesouro">${q.cells.map(c=>`<button type="button" class="map-cell" data-position="${c.pos}" aria-label="Escolher ${c.pos}" ${game.locked?"disabled":""}>${illustrated(c.icon)}</button>`).join("")}</div>`;
      case "link": { const right=q.pairs.map(p=>p[1]).slice().reverse();return `<div class="link-board"><div class="link-column"><strong>Palavras</strong>${q.pairs.map(([word])=>`<button class="link-item ${game.linked.includes(word)?"matched":""} ${game.selectedLeft===word?"active":""}" data-link="left" data-key="${escapeHtml(word)}" ${game.locked||game.linked.includes(word)?"disabled":""}>${escapeHtml(word)}</button>`).join("")}</div><div class="link-column"><strong>Figuras</strong>${right.map(icon=>`<button class="link-item ${game.linked.includes(q.pairs.find(p=>p[1]===icon)?.[0])?"matched":""}" data-link="right" data-key="${escapeHtml(icon)}" ${game.locked||game.linked.includes(q.pairs.find(p=>p[1]===icon)?.[0])?"disabled":""}>${illustrated(icon)}</button>`).join("")}</div></div><p class="link-help">${game.linked.length} de ${q.pairs.length} pares encontrados</p>`; }
      case "memory": return `<div class="visual memory-symbol" id="memory-symbol">${illustrated(q.memory)}</div><p class="memory-hint" id="memory-hint">Memorize!</p><div class="memory-options" id="memory-options" hidden>${optionButtons(q.options)}</div>`;
      default:return optionButtons(q.options||[]);
    }
  }
  function renderGame() {
    clearTimeout(memoryTimer);const q=currentQuestion(),progress=((game.question+1)/totalQuestions)*100;
    app.innerHTML=`<section class="screen exercise"><header class="hud"><button class="back-button" data-action="back">← Voltar</button><span class="hud-pill">${level} · Pergunta ${String(game.question+1).padStart(2,"0")} / 10</span><span class="hud-pill">${game.correct} acertos</span><span class="hud-pill">Erros ${game.errors}</span></header><div class="progress" role="progressbar" aria-label="Progresso" aria-valuenow="${Math.round(progress)}" aria-valuemin="0" aria-valuemax="100"><span style="width:${progress}%"></span></div><h1 class="screen-title">${escapeHtml(q.title)}</h1><p class="subtitle">${escapeHtml(q.instruction)}</p><div class="play-area"><p class="prompt">${escapeHtml(q.prompt)}</p><button class="speak-button" data-action="speak" ${"speechSynthesis" in window?"":"hidden"}>Ouvir pergunta</button>${renderMode(q)}<p class="feedback ${game.feedbackKind}" aria-live="polite">${escapeHtml(game.feedback)}</p>${game.locked?`<button class="next-button" data-action="next">${game.question===9?"Ver resultado →":"Continuar →"}</button>`:""}</div></section>`;
    addSoundToggle();app.querySelector('[data-action="back"]').addEventListener("click",renderLevels);app.querySelector('[data-action="speak"]').addEventListener("click",()=>{speakQuestion(q);playSound("tap");});
    app.querySelectorAll("[data-value]").forEach(b=>b.addEventListener("click",()=>submitAnswer(b.dataset.value)));
    app.querySelectorAll("[data-position]").forEach(b=>b.addEventListener("click",()=>submitAnswer(b.dataset.position)));
    app.querySelectorAll("[data-token]").forEach(b=>b.addEventListener("click",()=>{game.selectedParts.push(Number(b.dataset.token));renderGame();}));
    app.querySelector('[data-action="check-syllables"]')?.addEventListener("click",()=>submitAnswer(game.selectedParts.map(i=>q.options[i]).join("-")));
    app.querySelector('[data-action="next"]')?.addEventListener("click",nextQuestion);
    app.querySelectorAll("[data-drop]").forEach(b=>b.addEventListener("click",()=>submitAnswer(b.dataset.drop)));
    app.querySelectorAll("[data-link]").forEach(b=>b.addEventListener("click",()=>handleLink(b.dataset.link,b.dataset.key)));
    if(q.mode==="drag")attachDrag();
    if(q.mode==="memory") memoryTimer=setTimeout(()=>{const s=app.querySelector("#memory-symbol"),h=app.querySelector("#memory-hint"),o=app.querySelector("#memory-options");if(s)s.classList.add("memory-hidden");if(h)h.textContent="O que você viu?";if(o)o.hidden=false;},3500);
  }
  function attachDrag() {
    const character=app.querySelector(".drag-character");if(!character)return;let dragging=false,startX=0,startY=0;
    character.addEventListener("pointerdown",e=>{if(game.locked)return;dragging=true;startX=e.clientX;startY=e.clientY;character.setPointerCapture(e.pointerId);character.classList.add("dragging");});
    character.addEventListener("pointermove",e=>{if(!dragging)return;character.style.transform=`translate(${e.clientX-startX}px,${e.clientY-startY}px) scale(1.12)`;});
    character.addEventListener("pointerup",e=>{if(!dragging)return;dragging=false;character.classList.remove("dragging");character.style.transform="";const target=document.elementFromPoint(e.clientX,e.clientY)?.closest("[data-drop]");if(target)submitAnswer(target.dataset.drop);});
    character.addEventListener("pointercancel",()=>{dragging=false;character.classList.remove("dragging");character.style.transform="";});
  }
  function handleLink(side,key) {
    if(game.locked)return;const q=currentQuestion();
    if(side==="left"){game.selectedLeft=key;renderGame();return;}
    if(!game.selectedLeft)return;
    const pair=q.pairs.find(p=>p[0]===game.selectedLeft);
    if(pair&&pair[1]===key){game.linked.push(pair[0]);game.selectedLeft=null;playSound("good");if(game.linked.length===q.pairs.length){game.correct++;game.locked=true;game.feedback="Muito bem! Todos os pares encontrados!";game.feedbackKind="good";}renderGame();}
    else wrongAnswer();
  }
  function answerLabel(q) { if(q.mode==="syllables")return q.answer.replaceAll("-"," · ");if(q.mode==="missing")return `${q.before}${q.answer}${q.after}`;if(q.mode==="compare")return q.answer==="left"?q.leftName:q.rightName;if(q.mode==="treasure")return q.cells.find(c=>c.pos===q.answer)?.icon||q.answer;if(q.mode==="link")return "todos os pares corretos";return q.answer; }
  function submitAnswer(value) { if(game.locked)return;const q=currentQuestion();if(String(value)===String(q.answer)){game.correct++;game.locked=true;game.feedback="Muito bem! Você acertou!";game.feedbackKind="good";playSound("good");renderGame();}else wrongAnswer(); }
  function wrongAnswer() { if(game.locked)return;game.errors++;game.attemptsLeft--;playSound("bad");if(game.attemptsLeft>0){game.extras++;game.feedback=`Ainda não! Tente de novo. Mais ${game.attemptsLeft} ${game.attemptsLeft===1?"chance":"chances"}.`;game.feedbackKind="bad";if(currentQuestion().mode==="syllables")game.selectedParts=[];if(currentQuestion().mode==="link")game.selectedLeft=null;renderGame();}else{game.locked=true;game.feedback=`A resposta era ${answerLabel(currentQuestion())}. Vamos para a próxima!`;game.feedbackKind="bad";renderGame();} }
  function nextQuestion() { if(game.question<9)game.question++;else{renderFinish();return;}game.attemptsLeft=maxAttempts[level];game.locked=false;game.feedback="";game.feedbackKind="";game.selectedParts=[];game.selectedLeft=null;game.linked=[];renderGame(); }
  function renderFinish() { clearTimeout(memoryTimer);const percentage=Math.round(game.correct/totalQuestions*100);app.innerHTML=`<section class="screen finish"><h1>PARABÉNS!</h1><p class="subtitle">Você completou a trilha de descobertas!</p><div class="finish-card"><p>PONTOS: ${game.correct} / 10</p><p>ERROS: ${game.errors}</p><p>TENTATIVAS EXTRAS: ${game.extras}</p><p>RESULTADO: ${percentage}% de acertos</p></div><div class="finish-actions"><button class="comic-button" data-action="menu">VOLTAR AO MENU</button><button class="comic-button" data-action="replay">TENTAR DE NOVO</button></div></section>`;addSoundToggle();app.querySelector('[data-action="menu"]').addEventListener("click",renderHome);app.querySelector('[data-action="replay"]').addEventListener("click",()=>startGame(level)); }
  renderHome();
})();
