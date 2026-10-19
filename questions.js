(() => {
  const q = (title, instruction, mode, prompt, data) => ({ title, instruction, mode, prompt, ...data });
  window.questionBank = {
    "Fácil": [
      q("Monte a palavra", "Toque nas sílabas na ordem certa.", "syllables", "Que palavra forma o nome deste animal?", { icon:"🐱", parts:2, options:["GA","TO","CA"], answer:"GA-TO" }),
      q("Qual pedaço está faltando?", "Escolha o pedaço que completa a palavra.", "missing", "Complete o nome do carro.", { before:"CA", after:"RO", options:["SA","R","LA"], answer:"R" }),
      q("Ligue a letra à imagem", "Escolha a letra que começa o nome.", "letter", "Qual é a primeira letra de abelha?", { icon:"🐝", options:["A","E","O"], answer:"A" }),
      q("Alimente o personagem", "Conte e escolha a quantidade certa.", "sum", "O coelhinho tem 2 cenouras. Ganhou mais 3. Quantas tem agora?", { a:2,b:3,options:["4","5","6"],answer:"5" }),
      q("Quem tem mais?", "Toque no personagem que tem mais frutas.", "compare", "Quem juntou mais maçãs?", { left:3,right:5,leftName:"🐻 Urso",rightName:"🐰 Coelho",answer:"right" }),
      q("Conhecimentos gerais", "Pense no que você já conhece.", "general", "Qual destes animais vive na água e nada?", { options:["🐟 Peixe","🐈 Gato","🐔 Galinha"],answer:"🐟 Peixe" }),
      q("Sequência numérica", "Complete a sequência de números.", "sequence", "Qual número vem depois?", { series:"1 · 2 · ? · 4",options:["2","3","5"],answer:"3" }),
      q("Continue a sequência", "Toque no item que continua o padrão.", "pattern", "Qual figura vem agora?", { series:"🔴 🔵 🔴 🔵 ?",options:["🔴","🟡","🐸"],answer:"🔴" }),
      q("Ajude o personagem a chegar", "Arraste o personagem até o lugar certo.", "drag", "A tartaruga quer chegar até a estrela. Onde está a estrela?", { character:"🐢",route:"🌳   🪨   ⭐", options:["árvore","pedra","estrela"],answer:"estrela" }),
      q("Jogo da memória", "Observe com atenção. A figura vai sumir!", "memory", "Qual figura apareceu?", { memory:"🦋", options:["🦋","🌼","🐞"],answer:"🦋" })
    ],
    "Médio": [
      q("Monte a palavra", "Toque nas sílabas na ordem certa.", "syllables", "Que palavra forma o nome desta fruta?", { icon:"🍌",parts:3,options:["NA","BA","NA","MA"],answer:"BA-NA-NA" }),
      q("Qual pedaço está faltando?", "Escolha o pedaço que completa a palavra.", "missing", "Complete o nome do objeto usado para beber.", { before:"CA",after:"CA",options:["NE","LO","TA"],answer:"NE" }),
      q("Ligue palavra e imagem", "Escolha cada palavra e depois sua figura.", "link", "Encontre o par de cada palavra.", { pairs:[["SOL","☀️"],["GATO","🐱"],["FLOR","🌷"]] }),
      q("Alimente o personagem", "Conte e escolha a quantidade certa.", "sum", "A joaninha viu 3 folhas e depois mais 4. Quantas folhas são?", { a:3,b:4,options:["6","7","8"],answer:"7" }),
      q("Quem tem mais?", "Toque no personagem que tem mais frutas.", "compare", "Quem tem mais frutas? Conte com calma.", { left:6,right:8,leftName:"🐻 Urso",rightName:"🐰 Coelho",answer:"right" }),
      q("Conhecimentos gerais", "Pense para que cada coisa serve.", "general", "O que usamos para não nos molhar na chuva?", { options:["☂️ Guarda-chuva","🕶️ Óculos de sol","🧤 Luvas"],answer:"☂️ Guarda-chuva" }),
      q("Sequência numérica", "Complete a sequência de números.", "sequence", "Conte de dois em dois. Qual número está faltando?", { series:"2 · 4 · ? · 8",options:["5","6","7"],answer:"6" }),
      q("Continue a sequência", "Toque no item que continua o padrão.", "pattern", "Observe as frutas. Qual vem agora?", { series:"🍎 🍎 🍐 · 🍎 🍎 🍐 · ?",options:["🍎","🍐","🍌"],answer:"🍎" }),
      q("Ajude o personagem a chegar", "Arraste o coelho até a toca certa.", "drag", "O coelho passa pela ponte e chega à toca. Escolha o destino.", { character:"🐰",route:"🌉  →  🌳  →  🕳️",options:["ponte","árvore","toca"],answer:"toca" }),
      q("Onde está o tesouro?", "Use as pistas para encontrar o lugar.", "treasure", "O tesouro está ao lado da árvore e embaixo da pedra.", { cells:[{pos:"sol",icon:"☀️"},{pos:"arvore",icon:"🌳"},{pos:"pedra",icon:"🪨"},{pos:"tesouro",icon:"💎"}],answer:"tesouro" })
    ],
    "Difícil": [
      q("Monte a palavra", "Toque nas sílabas na ordem certa.", "syllables", "Que palavra forma o nome deste animal?", { icon:"🐶",parts:3,options:["RRO","CA","CHO","BA"],answer:"CA-CHO-RRO" }),
      q("Qual pedaço está faltando?", "Escolha o pedaço que completa a palavra.", "missing", "Complete o nome do animal que pula e gosta de lagoas.", { before:"SA",after:"O",options:["P","B","L"],answer:"P" }),
      q("Ligue palavra e imagem", "Escolha cada palavra e depois sua figura.", "link", "Ligue cada palavra ao animal correspondente.", { pairs:[["BORBOLETA","🦋"],["TARTARUGA","🐢"],["ELEFANTE","🐘"]] }),
      q("Alimente o personagem", "Some e escolha a quantidade certa.", "sum", "O macaco tem 4 bananas e encontra mais 5. Quantas bananas terá?", { a:4,b:5,options:["8","9","10"],answer:"9" }),
      q("Quem tem mais?", "Toque no personagem que tem mais frutas.", "compare", "Conte e escolha quem tem mais frutas.", { left:7,right:9,leftName:"🐻 Urso",rightName:"🐰 Coelho",answer:"right" }),
      q("Conhecimentos gerais", "Pense no que os animais fazem.", "general", "Qual animal põe ovos?", { options:["🐔 Galinha","🐶 Cachorro","🐄 Vaca"],answer:"🐔 Galinha" }),
      q("Sequência numérica", "Complete a sequência de números.", "sequence", "Os números estão diminuindo de um em um. Qual falta?", { series:"9 · 8 · ? · 6 · 5",options:["6","7","8"],answer:"7" }),
      q("Continue a sequência", "Observe as formas e descubra o padrão.", "pattern", "Qual forma vem depois?", { series:"🔺 🔵 🟩 · 🔺 🔵 🟩 · ?",options:["🔺","🔵","🟩"],answer:"🔺" }),
      q("Ajude o personagem a chegar", "Arraste o personagem até o destino indicado.", "drag", "O sapinho deve passar pela pedra e pela flor para chegar ao lago.", { character:"🐸",route:"🪨  →  🌼  →  🪷",options:["pedra","flor","lago"],answer:"lago" }),
      q("Jogo da memória", "Observe as figuras. Elas vão sumir!", "memory", "Quais três figuras apareceram?", { memory:"🍎　⭐　🐟", options:["🍎 ⭐ 🐟","🍎 🌙 🐟","🍐 ⭐ 🐠"],answer:"🍎 ⭐ 🐟" })
    ]
  };
})();
