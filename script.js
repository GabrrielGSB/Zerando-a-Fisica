// ─── Dados ────────────────────────────────────────────────────────────────────

const DATA = [
  {
    id: 'v1', label: 'Volume 1', icon: '◈', cls: 'vol-1',
    chapters: [
      { id: 'c01', label: '01 — Medição', icon: '📏',
        modules: [
          { label: 'Módulo 1-1 Medindo Grandezas como o Comprimento', qs: [1,2,6,9] },
          { label: 'Módulo 1-2 Tempo',                                 qs: [10,13,18,19] },
          { label: 'Módulo 1-3 Massa',                                 qs: [20,24,26,31] },
        ]
      },
      { id: 'c02', label: '02 — Movimento Retilíneo', icon: '→',
        modules: [
          { label: 'Módulo 2-1 Posição, Deslocamento e Velocidade Média', qs: [1,5,8,10,12,13] },
          { label: 'Módulo 2-2 Velocidade Instantânea e Escalar',         qs: [14,17] },
          { label: 'Módulo 2-3 Aceleração',                               qs: [18,21] },
          { label: 'Módulo 2-4 Aceleração Constante',                     qs: [23,24,34,35,42,43] },
          { label: 'Módulo 2-5 Aceleração em Queda Livre',                qs: [45,48,50,52,54,56] },
          { label: 'Módulo 2-6 Integração Gráfica',                       qs: [65,66,68,70] },
        ]
      },
      { id: 'c03', label: '03 — Vetores', icon: '⟶',
        modules: [
          { label: 'Módulo 3-1 Vetores e Suas Componentes', qs: [1,3,6,7] },
          { label: 'Módulo 3-2 Vetores Unitários e Soma',   qs: [8,9,20,21,30,32] },
          { label: 'Módulo 3-3 Multiplicação de Vetores',   qs: [33,34,38,39,42,43] },
        ]
      },
      { id: 'c04', label: '04 — Movimento 2D e 3D', icon: '⤢',
        modules: [
          { label: 'Módulo 4-1 Posição e Deslocamento',          qs: [1,2,3,4] },
          { label: 'Módulo 4-2 Velocidade Média e Instantânea',  qs: [5,8,9,10] },
          { label: 'Módulo 4-3 Aceleração Média e Instantânea',  qs: [11,15,19,20] },
          { label: 'Módulo 4-4 Movimento Balístico',             qs: [21,24,28,53] },
          { label: 'Módulo 4-5 Movimento Circular Uniforme',     qs: [56,58,63,68] },
          { label: 'Módulo 4-6 Movimento Relativo 1D',           qs: [69,70,71] },
          { label: 'Módulo 4-7 Movimento Relativo 2D',           qs: [72,73,77,81] },
        ]
      },
      { id: 'c05', label: '05 — Força e Movimento I', icon: '⚡',
        modules: [
          { label: 'Módulo 5-1 1ª e 2ª Lei de Newton',          qs: [1,2,4,5,11,12] },
          { label: 'Módulo 5-2 Algumas Forças Especiais',        qs: [13,14,15,16] },
          { label: 'Módulo 5-3 Aplicações das Leis de Newton',   qs: [17,18,31,32,62,67,68] },
        ]
      },
      { id: 'c06', label: '06 — Força e Movimento II',              icon: '⚡', modules: [] },
      { id: 'c07', label: '07 — Energia Cinética e Trabalho',       icon: '⚙',  modules: [] },
      { id: 'c08', label: '08 — Energia Potencial e Conservação',   icon: '⚙',  modules: [] },
      { id: 'c09', label: '09 — Centro de Massa e Momento Linear',  icon: '◎',  modules: [] },
      { id: 'c10', label: '10 — Rotação',                           icon: '↻',  modules: [] },
      { id: 'c11', label: '11 — Rolagem, Torque e Momento Angular', icon: '↻',  modules: [] },
    ]
  },
  {
    id: 'v2', label: 'Volume 2', icon: '◈', cls: 'vol-2',
    chapters: [
      { id: 'c12', label: '12 — Equilíbrio e Elasticidade', icon: '⊡', modules: [] },
      { id: 'c13', label: '13 — Gravitação',                icon: '🪐', modules: [] },
      { id: 'c14', label: '14 — Fluidos', icon: '💧',
        modules: [
          { label: 'Módulo 14-1 Massa Específica e Pressão', qs: [2,3,5] },
          { label: 'Módulo 14-2 Fluidos em Repouso',         qs: [10,12,14,19,20,24,27] },
          { label: 'Módulo 14-4 Princípio de Pascal',        qs: [28] },
          { label: 'Módulo 14-5 Princípio de Arquimedes',    qs: [30,31,33,37,39,45,48] },
          { label: 'Módulo 14-6 Equação de Continuidade',    qs: [51,52] },
          { label: 'Módulo 14-7 Equação de Bernoulli',       qs: [55,57,58,59,61,64,65,67,71] },
        ]
      },
      { id: 'c15', label: '15 — Oscilações', icon: '〜',
        modules: [
          { label: 'Módulo 15-1 Movimento Harmônico Simples',     qs: [1,2,3,8,9,11,12,17,21,22,24,25,26] },
          { label: 'Módulo 15-2 Energia do MHS',                  qs: [28,29,30,32,33,36] },
          { label: 'Módulo 15-3 Oscilador Harmônico Angular',     qs: [38] },
          { label: 'Módulo 15-4 Pêndulos e Movimento Circular',   qs: [40,41,42,49,50,51] },
        ]
      },
      { id: 'c16', label: '16 — Ondas I', icon: '∿',
        modules: [
          { label: 'Módulo 16-1 Ondas Transversais',                  qs: [1,3,5,7,10,12] },
          { label: 'Módulo 16-2 Velocidade da Onda em Corda',         qs: [14,15,16,17,18,22,25] },
          { label: 'Módulo 16-3 Energia e Potência',                  qs: [26] },
          { label: 'Módulo 16-4 Equação de Onda',                     qs: [28,29,30] },
          { label: 'Módulo 16-5 Interferência de Ondas',              qs: [31,32] },
          { label: 'Módulo 16-6 Fasores',                             qs: [35,36,37,39] },
          { label: 'Módulo 16-7 Ondas Estacionárias e Ressonância',   qs: [40,41,42,43,44,47,49,52,58,60] },
        ]
      },
      { id: 'c17', label: '17 — Ondas II',                    icon: '∿', modules: [] },
      { id: 'c18', label: '18 — Temperatura, Calor e 1ª Lei', icon: '🌡', modules: [] },
      { id: 'c19', label: '19 — Teoria Cinética dos Gases',   icon: '⚛', modules: [] },
      { id: 'c20', label: '20 — Entropia e 2ª Lei',           icon: '∞', modules: [] },
    ]
  },
  {
    id: 'v3', label: 'Volume 3', icon: '◈', cls: 'vol-3',
    chapters: [
      { id: 'c21', label: '21 — Lei de Coulomb',                    icon: '⊕', modules: [] },
      { id: 'c22', label: '22 — Campos Elétricos',                  icon: '⊕', modules: [] },
      { id: 'c23', label: '23 — Lei de Gauss',                      icon: '⊕', modules: [] },
      { id: 'c24', label: '24 — Potencial Elétrico',                icon: '⊕', modules: [] },
      { id: 'c25', label: '25 — Capacitância',                      icon: '⊕', modules: [] },
      { id: 'c26', label: '26 — Corrente e Resistência',            icon: '⊡', modules: [] },
      { id: 'c27', label: '27 — Circuitos',                         icon: '⊡', modules: [] },
      { id: 'c28', label: '28 — Campos Magnéticos',                 icon: '⊗', modules: [] },
      { id: 'c29', label: '29 — Campos Magnéticos por Correntes',   icon: '⊗', modules: [] },
      { id: 'c30', label: '30 — Indução e Indutância',              icon: '⊗', modules: [] },
      { id: 'c31', label: '31 — Oscilações Eletromagnéticas e CA',  icon: '∿', modules: [] },
      { id: 'c32', label: '32 — Equações de Maxwell',               icon: '∿', modules: [] },
    ]
  },
  {
    id: 'v4', label: 'Volume 4', icon: '◈', cls: 'vol-4',
    chapters: [
      { id: 'c33', label: '33 — Ondas Eletromagnéticas',    icon: '∿', modules: [] },
      { id: 'c34', label: '34 — Imagens',                   icon: '◎', modules: [] },
      { id: 'c35', label: '35 — Interferência',             icon: '≋', modules: [] },
      { id: 'c36', label: '36 — Difração',                  icon: '≋', modules: [] },
      { id: 'c37', label: '37 — Relatividade',              icon: '⊛', modules: [] },
      { id: 'c38', label: '38 — Fótons e Ondas de Matéria', icon: '⚛', modules: [] },
      { id: 'c39', label: '39 — Mais Ondas de Matéria',     icon: '⚛', modules: [] },
      { id: 'c40', label: '40 — Tudo sobre os Átomos',      icon: '⚛', modules: [] },
      { id: 'c41', label: '41 — Condução nos Sólidos',      icon: '⊡', modules: [] },
      { id: 'c42', label: '42 — Física Nuclear',            icon: '☢', modules: [] },
      { id: 'c43', label: '43 — Energia Nuclear',           icon: '☢', modules: [] },
      { id: 'c44', label: '44 — Quarks, Léptons e Big Bang', icon: '🌌',
        modules: [
          { label: 'Módulo 44-1 Propriedades das Partículas',      qs: [1,2,6,7,9,10] },
          { label: 'Módulo 44-2 Léptons, Hádrons e Estranheza',    qs: [11,12,16,21,22,23,24] },
          { label: 'Módulo 44-3 Quarks e Partículas Mensageiras',  qs: [25,27,30] },
          { label: 'Módulo 44-4 Cosmologia',                       qs: [31,34,39,40,43,44] },
        ]
      },
    ]
  },
];


// ─── Estado (salvar/carregar progresso) ───────────────────────────────────────

let state  = {};
let filter = 'all';

// Gera uma chave única para identificar cada questão no estado,
function stateKey(capitulo, modulo, questao) {
  return `${capitulo}_m${modulo}_q${questao}`;
}

// Carrega o progresso salvo do localStorage para a variável state.
// Se não houver nada salvo, inicializa vazio.
function loadState() {
  try { state = JSON.parse(localStorage.getItem('fisica_roadmap') || '{}'); }
  catch(e) { state = {}; }
}

// Salva o estado atual no localStorage, persistindo o progresso entre sessões.
function saveState() {
  localStorage.setItem('fisica_roadmap', JSON.stringify(state));
}


// ─── Ações do Usuário ─────────────────────────────────────────────────────────

// Alterna uma questão entre feita/não-feita ao clicar no botão dela,
// salva e atualiza a tela.
function toggleQ(chId, modIdx, q, btn) {
  const k = stateKey(chId, modIdx, q);
  state[k] = !state[k];
  saveState();
  btn.classList.toggle('done', state[k]);
  updateAll();
}

// Marca todas as questões de um módulo como feitas de uma vez.
function markAll(chId, modIdx, qs) {
  qs.forEach(q => { state[stateKey(chId, modIdx, q)] = true; });
  saveState();
  render();
  updateAll();
}

// Remove o progresso de todas as questões de um módulo.
function clearMod(chId, modIdx, qs) {
  qs.forEach(q => { delete state[stateKey(chId, modIdx, q)]; });
  saveState();
  render();
  updateAll();
}

// Apaga todo o progresso após pedir confirmação ao usuário.
function resetAll() {
  if (!confirm('Resetar todo o progresso?')) return;
  state = {};
  saveState();
  render();
  updateAll();
}

// Define o filtro de exibição (all, done ou pending) e re-renderiza a tela.
function setFilter(f, btn) {
  filter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  render();
}

// Abre ou fecha o painel de um volume, salvando esse estado na sessionStorage.
function toggleVolume(id) {
  const el = document.getElementById(`vol-${id}`);
  const isOpen = el.classList.toggle('open');
  sessionStorage.setItem(`open_${id}`, isOpen ? '1' : '0');
}

// Abre ou fecha o painel de um capítulo, salvando esse estado na sessionStorage.
function toggleChapter(id) {
  const el = document.getElementById(`ch-${id}`);
  if (!el) return;
  const isOpen = el.classList.toggle('open');
  sessionStorage.setItem(`open_${id}`, isOpen ? '1' : '0');
}


// ─── Contagens ────────────────────────────────────────────────────────────────

// Conta quantas questões de um módulo específico estão marcadas como feitas.
function countModule(chId, modIdx, qs) {
  return qs.filter(q => state[stateKey(chId, modIdx, q)]).length;
}

// Soma o total de questões feitas e o total geral de um capítulo inteiro.
function countChapter(ch) {
  let done = 0, total = 0;
  ch.modules.forEach((m, mi) => {
    total += m.qs.length;
    done  += countModule(ch.id, mi, m.qs);
  });
  return { done, total };
}

// Soma o total de questões feitas e o total geral de todos os capítulos de um volume.
function countVolume(vol) {
  let done = 0, total = 0;
  vol.chapters.forEach(ch => {
    const c = countChapter(ch);
    done  += c.done;
    total += c.total;
  });
  return { done, total };
}


// ─── Atualização Visual ───────────────────────────────────────────────────────

// Recalcula e atualiza as barras de progresso e contadores
// de todos os volumes e do progresso global.
function updateAll() {
  let gDone = 0, gTotal = 0;

  DATA.forEach(vol => {
    const vc  = countVolume(vol);
    gDone  += vc.done;
    gTotal += vc.total;

    const pct  = vc.total ? Math.round(vc.done / vc.total * 100) : 0;
    const bar  = document.querySelector(`#vol-bar-${vol.id}`);
    const prog = document.querySelector(`#vol-prog-${vol.id}`);
    if (bar)  bar.style.width    = pct + '%';
    if (prog) prog.textContent   = `${vc.done}/${vc.total}`;
  });

  const gpct = gTotal ? Math.round(gDone / gTotal * 100) : 0;
  document.getElementById('globalDone').textContent    = gDone;
  document.getElementById('globalTotal').textContent   = gTotal;
  document.getElementById('globalBar').style.width     = gpct + '%';
  document.getElementById('globalBarPct').textContent  = gpct + '%';
}


// ─── Renderização ─────────────────────────────────────────────────────────────

// Gera o HTML de todos os módulos de um capítulo, com os botões de questão
// e as ações de marcar/limpar, respeitando o filtro ativo.
function renderModules(ch) {
  return ch.modules.map((mod, mi) => {
    const done  = countModule(ch.id, mi, mod.qs);
    const qsHtml = mod.qs.map(q => {
      const isDone = !!state[stateKey(ch.id, mi, q)];
      if (filter === 'done'    && !isDone) return '';
      if (filter === 'pending' &&  isDone) return '';
      return `<button class="q-btn ${isDone ? 'done' : ''}" onclick="openQuestionModal('${ch.id}', ${mi}, ${q}, this)">${q}</button>`;
  }).join('');

    if (!qsHtml.trim()) return '';

    return `
      <div class="module">
        <div class="module-title">${mod.label}</div>
        <div class="questions">${qsHtml}</div>
        <div class="module-actions">
          <button class="module-action mark-all"  onclick="markAll('${ch.id}',${mi},[${mod.qs}])">✓ marcar todos</button>
          <span style="color:var(--border)">·</span>
          <button class="module-action clear-all" onclick="clearMod('${ch.id}',${mi},[${mod.qs}])">✕ limpar</button>
          <span style="color:var(--border);margin-left:auto">${done}/${mod.qs.length}</span>
        </div>
      </div>
    `;
  }).join('');
}

// Gera o HTML de todos os capítulos de um volume,
// incluindo o cabeçalho e chamando renderModules.
function renderChapters(vol) {
  return vol.chapters.map(ch => {
    const cc         = countChapter(ch);
    const hasModules = ch.modules.length > 0;
    const isOpen     = sessionStorage.getItem(`open_${ch.id}`) === '1';

    if (filter === 'done'    && cc.done === 0)                        return '';
    if (filter === 'pending' && cc.done === cc.total && cc.total > 0) return '';

    return `
      <div class="chapter ${isOpen ? 'open' : ''}" id="ch-${ch.id}">
        <div class="chapter-header" onclick="toggleChapter('${ch.id}')">
          <span class="chapter-icon">${ch.icon}</span>
          <span class="chapter-title">${ch.label}</span>
          <span class="chapter-count">${hasModules ? `${cc.done}/${cc.total}` : '—'}</span>
          ${hasModules ? `<span class="chapter-chevron">▼</span>` : ''}
        </div>
        ${hasModules ? `<div class="modules">${renderModules(ch)}</div>` : ''}
      </div>
    `;
  }).join('');
}

// Função principal que reconstrói toda a interface do zero,
// iterando sobre os volumes, e ao final chama updateAll.
function render() {
  const container = document.getElementById('volumes');
  container.innerHTML = '';

  DATA.forEach(vol => {
    const vc  = countVolume(vol);
    const pct = vc.total ? Math.round(vc.done / vc.total * 100) : 0;

    const volEl = document.createElement('div');
    volEl.className = `volume ${vol.cls}`;
    volEl.id        = `vol-${vol.id}`;

    const isOpen = sessionStorage.getItem(`open_${vol.id}`) === '1';
    if (isOpen) volEl.classList.add('open');

    volEl.innerHTML = `
      <div class="volume-header" onclick="toggleVolume('${vol.id}')">
        <span class="volume-icon">${vol.icon}</span>
        <span class="volume-title">${vol.label}</span>
        <span class="volume-progress" id="vol-prog-${vol.id}">${vc.done}/${vc.total}</span>
        <span class="volume-chevron">▼</span>
      </div>
      <div class="volume-bar">
        <div class="progress-fill" id="vol-bar-${vol.id}" style="width:${pct}%"></div>
      </div>
      <div class="chapters" id="chapters-${vol.id}">
        ${renderChapters(vol)}
      </div>
    `;

    container.appendChild(volEl);
  });

  updateAll();
}

// ─── Modal e Lógica da Questão ───────────────────────────────────────

let currentActiveQuestion = null; // Armazena a questão aberta no momento

function openQuestionModal(chId, modIdx, q, btnElement) {
  // 1. Salva o contexto para podermos marcar como concluída depois
  currentActiveQuestion = { chId, modIdx, q, btnElement };
  const k = stateKey(chId, modIdx, q);
  const isDone = !!state[k];

  // 2. Aqui você pode integrar sua base de dados de textos e imagens.
  // Exemplo de dados simulados (Substitua por sua lógica de busca real):
  const mockText = `Este é o texto descritivo da questão ${q}. Aqui você pode inserir o enunciado completo da física.`;
  // Exemplo de como montar a URL da imagem baseada no capítulo e questão:
  const mockImgSrc = `assets/resolucoes/${chId}_q${q}.jpg`; 

  // 3. Atualiza os elementos visuais do modal
  document.getElementById('modalQTitle').textContent = `Questão ${q}`;
  document.getElementById('modalQText').innerHTML = mockText; 
  
  const imgEl = document.getElementById('modalQImg');
  imgEl.src = mockImgSrc;
  imgEl.style.display = 'block';
  // Oculta a tag <img> caso o arquivo da resolução não exista na pasta
  imgEl.onerror = () => { imgEl.style.display = 'none'; };

  // 4. Configura o estado visual do botão principal do modal
  const toggleBtn = document.getElementById('modalToggleBtn');
  toggleBtn.textContent = isDone ? 'Desmarcar Conclusão' : 'Marcar como Feita';
  toggleBtn.className = isDone ? 'modal-btn done' : 'modal-btn';

  // 5. Abre o modal
  document.getElementById('qModal').classList.add('open');
}

function closeModal() {
  document.getElementById('qModal').classList.remove('open');
  currentActiveQuestion = null;
}

// 6. Função para alternar o estado da questão estando dentro do modal
function toggleCurrentQ() {
  if (!currentActiveQuestion) return;
  const { chId, modIdx, q, btnElement } = currentActiveQuestion;

  const k = stateKey(chId, modIdx, q);
  state[k] = !state[k]; // Inverte o estado
  saveState();          // Salva no localStorage [cite: 18]

  const isDone = state[k];

  // Atualiza o visual do botão dentro do próprio modal
  const toggleBtn = document.getElementById('modalToggleBtn');
  toggleBtn.textContent = isDone ? 'Desmarcar Conclusão' : 'Marcar como Feita';
  toggleBtn.className = isDone ? 'modal-btn done' : 'modal-btn';

  // Atualiza o botão pequeno lá atrás na grid de módulos
  btnElement.classList.toggle('done', isDone);
  
  // Atualiza as barras de progresso globais e dos volumes [cite: 41, 44]
  updateAll();
}

// Fecha o modal se o usuário clicar fora da caixa do conteúdo
document.getElementById('qModal').addEventListener('click', (e) => {
  if (e.target.id === 'qModal') closeModal();
});


// ─── Init ─────────────────────────────────────────────────────────────────────

// Carrega o progresso salvo e renderiza a interface assim que a página carrega.
loadState();
render();