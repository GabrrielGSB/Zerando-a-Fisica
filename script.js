import { 
    getAllData, 
    getAllChapters, 
    getAllModules,
    getAllQuestions
} from './firebaseActions.js';

/*===============================================================================*/
//#region SALVAR OU CARREGAR ESTADO 
  let state  = {};
  let filter = 'all';

  // Gera uma chave única para identificar cada questão no estado,
  function stateKey(chId, modIdx, q) { return `${chId}_m${modIdx}_q${q}`; }

  async function loadCloudState() {
    try {
      const docSnap = await getAllData();

      localStorage.setItem('DATA', JSON.stringify(docSnap));

      console.log("Progresso carregado da nuvem e salvo no localStorage com sucesso!");
    } 
    catch (error) {
      console.error("Erro ao carregar o estado da nuvem:", error);
      throw error;
    }
  }
  
  function loadState() {
    try { state = JSON.parse(localStorage.getItem('fisica_roadmap') || '{}'); }
    catch(e) { state = {}; }
  }

  function loadLocalData(){
    try { 
      const DATA = JSON.parse(localStorage.getItem("DATA"));
      
      console.log("Dados copiados do localStorage para variável local com sucesso")
      return DATA;
    }
    catch (error) {
      console.error("Erro ao salvar localStorage em variável local");
      throw error;
    }
  }

  function saveStateToLocalStorage() { localStorage.setItem('DATA', JSON.stringify(DATA)); }
//#endregion
/*===============================================================================*/

/*===============================================================================*/
//#region AÇÕES DO USUÁRIO 
  // Marca todas as questões de um módulo como feitas de uma vez.
  function markAll(chId, modIdx, qs) {
    qs.forEach(q => { state[stateKey(chId, modIdx, q)] = true; });
    saveState(); render(); updateAllCounter();
  }

  // Remove o progresso de todas as questões de um módulo.
  function clearMod(chId, modIdx, qs) {
    qs.forEach(q => { delete state[stateKey(chId, modIdx, q)]; });
    saveState(); render(); updateAllCounter();
  }

  // Apaga todo o progresso após pedir confirmação ao usuário.
  function resetAll() {
    if (!confirm('Resetar todo o progresso?')) return;
    state = {};
    saveState(); render(); updateAllCounter();
  }

  // Define o filtro de exibição (all, done ou pending) e re-renderiza a tela.
  function setFilter(f, btn) {
    filter = f;

    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));

    btn.classList.add('active');
    // render();
  }

  // Abre ou fecha o painel de um volume, salvando esse estado na sessionStorage.
  function toggleVolume(id) {
    const vol    = document.getElementById(`vol-v${id}`);
    const isOpen = vol.classList.toggle('open');

    // sessionStorage.setItem(`open_${id}`, isOpen ? '1' : '0');
  }

  // Abre ou fecha o painel de um capítulo, salvando esse estado na sessionStorage.
  function toggleChapter(id) {
    const chap   = document.getElementById(`ch-${id}`);
    if (!chap) return;

    const isOpen = chap.classList.toggle('open');

    sessionStorage.setItem(`open_${id}`, isOpen ? '1' : '0');
  }
//#endregion
/*===============================================================================*/

/*===============================================================================*/
//#region CONTAGENS 
  // Conta quantas questões de um módulo específico estão marcadas como feitas.
  function countQuestionsDone(chId, modIdx, qs) {
    return qs.filter(q => state[stateKey(chId, modIdx, q)]).length;
  }

  // Soma o total de questões feitas e o total geral de um capítulo inteiro.
  function countQuestionsDoneInChapter(ch) {
    let done = 0, total = 0;
    ch.modules.forEach((m, mi) => {
      total += m.qs.length;
      done  += countQuestionsDone(ch.id, mi, m.qs);
    });

    return { done, total };
  }

  // Soma o total de questões feitas e o total geral de todos os capítulos de um volume.
  function countQuestionsDoneInVolume(vol) {
    let done = 0, total = 0;
    vol.chapters.forEach(ch => {
      const c = countQuestionsDoneInChapter(ch);
      done  += c.done;
      total += c.total;
    });
    return { done, total };
  }
//#endregion
/*===============================================================================*/

//===============================================================================
// ATUALIZAÇÃO CONTADORES DE PROGRESSO
  // Recalcula e atualiza as barras de progresso e contadores
  // de todos os volumes e do progresso global.
  function updateAllCounter() {
    let gDone = 0, gTotal = 0;

    DATA.forEach(vol => {
      const vc  = countQuestionsDoneInVolume(vol);
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
//===============================================================================


// ─── Renderização ─────────────────────────────────────────────────────────────

// Gera o HTML de todos os módulos de um capítulo, com os botões de questão
// e as ações de marcar/limpar, respeitando o filtro ativo.
function renderModules(ch) {
  return ch.modules.map((mod, mi) => {
    const done  = countQuestionsDone(ch.id, mi, mod.qs);
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
  let chapters = DATA[vol]['capitulos']
  return Object.keys(chapters).map(
    ch => {
      const id = ch.at(-1);
      // const cc         = countQuestionsDoneInChapter(ch);
      // const hasModules = ch.modules.length > 0;
      const hasModules = false;
      // const isOpen     = sessionStorage.getItem(`open_${ch.id}`) === '1';
      const isOpen = false;

      if (filter === 'done'    && cc.done === 0)                        return '';
      if (filter === 'pending' && cc.done === cc.total && cc.total > 0) return '';

      return `
        <div class="chapter ${isOpen ? 'open' : ''}" id="ch-${id}">

          <div class="chapter-header" onclick="toggleChapter('${ch.id}')">
            <span class="chapter-icon">  ->                                            </span>
            <span class="chapter-title"> ${chapters[ch]['nome']}                       </span>
            <span class="chapter-count"> ${hasModules ? `${cc.done}/${cc.total}` : '—'}</span>
            ${hasModules ? `<span class="chapter-chevron">▼</span>` : ''}
          </div>

          ${hasModules ? `<div class="modules">${renderModules(ch)}</div>` : ''}
        </div>
      `;
  }).join('');
}

/* Função principal que reconstrói toda a interface do zero */
function render() {
  const container = document.getElementById('volumes');
  container.innerHTML = '';

  Object.keys(DATA).forEach(vol => {
    const id = vol.at(-1); 
    // console.log(DATA[`${vol}`]);
    // const vc  = countQuestionsDoneInVolume(vol);                      //
    // const pct = vc.total ? Math.round(vc.done / vc.total * 100) : 0;  //

    const volEl = document.createElement('div');
    volEl.className = `volume vol-${id}`;
    volEl.id        = `vol-v${id}`;

    // const isOpen = sessionStorage.getItem(`open_${vol.id}`) === '1';
    // if (isOpen) volEl.classList.add('open');

    volEl.innerHTML = `
      <div class="volume-header" data-filter="${id}">
        <span class="volume-icon">         📚          </span>
        <span class="volume-title">        Volume ${id} </span>
        <span class="volume-progress" 
              id="vol-prog-${id}">         1/1          </span>
        <span class="volume-chevron">      ▼            </span>
      </div>

      <div class="volume-bar">
        <div class="progress-fill" id="vol-bar-${id}" style="width:${0}%"></div>
      </div>

      <div class="chapters" id="chapters-${id}">
        ${renderChapters(vol)}
      </div>
    `;

    container.appendChild(volEl);
  });

  // updateAllCounter();
}

// ─── Modal e Lógica da Questão ───────────────────────────────────────

// let currentActiveQuestion = null; // Armazena a questão aberta no momento

// function openQuestionModal(chId, modIdx, q, btnElement) {
//   // 1. Salva o contexto para podermos marcar como concluída depois
//   currentActiveQuestion = { chId, modIdx, q, btnElement };
//   const k = stateKey(chId, modIdx, q);
//   const isDone = !!state[k];

//   // 2. Aqui você pode integrar sua base de dados de textos e imagens.
//   // Exemplo de dados simulados (Substitua por sua lógica de busca real):
//   const mockText = `Este é o texto descritivo da questão ${q}. Aqui você pode inserir o enunciado completo da física.`;
//   // Exemplo de como montar a URL da imagem baseada no capítulo e questão:
//   const mockImgSrc = `assets/resolucoes/${chId}_q${q}.jpg`; 

//   // 3. Atualiza os elementos visuais do modal
//   document.getElementById('modalQTitle').textContent = `Questão ${q}`;
//   document.getElementById('modalQText').innerHTML = mockText; 
  
//   const imgEl = document.getElementById('modalQImg');
//   imgEl.src = mockImgSrc;
//   imgEl.style.display = 'block';
//   // Oculta a tag <img> caso o arquivo da resolução não exista na pasta
//   imgEl.onerror = () => { imgEl.style.display = 'none'; };

//   // 4. Configura o estado visual do botão principal do modal
//   const toggleBtn = document.getElementById('modalToggleBtn');
//   toggleBtn.textContent = isDone ? 'Desmarcar Conclusão' : 'Marcar como Feita';
//   toggleBtn.className = isDone ? 'modal-btn done' : 'modal-btn';

//   // 5. Abre o modal
//   document.getElementById('qModal').classList.add('open');
// }

// function closeModal() {
//   document.getElementById('qModal').classList.remove('open');
//   currentActiveQuestion = null;
// }

// // 6. Função para alternar o estado da questão estando dentro do modal
// function toggleCurrentQ() {
//   if (!currentActiveQuestion) return;
//   const { chId, modIdx, q, btnElement } = currentActiveQuestion;

//   const k = stateKey(chId, modIdx, q);
//   state[k] = !state[k]; // Inverte o estado
//   saveState();          // Salva no localStorage [cite: 18]

//   const isDone = state[k];

//   // Atualiza o visual do botão dentro do próprio modal
//   const toggleBtn = document.getElementById('modalToggleBtn');
//   toggleBtn.textContent = isDone ? 'Desmarcar Conclusão' : 'Marcar como Feita';
//   toggleBtn.className = isDone ? 'modal-btn done' : 'modal-btn';

//   // Atualiza o botão pequeno lá atrás na grid de módulos
//   btnElement.classList.toggle('done', isDone);
  
//   // Atualiza as barras de progresso globais e dos volumes [cite: 41, 44]
//   updateAllCounter();
// }

// // Fecha o modal se o usuário clicar fora da caixa do conteúdo
// document.getElementById('qModal').addEventListener('click', (e) => {
//   if (e.target.id === 'qModal') closeModal();
// });

/*=============================================================================*/
/* INIT */
  loadCloudState();
  const DATA = loadLocalData();
  render();

  /* Escuta pelo pressionar de algum botão de filtro e aplica a função correta */
  document.querySelectorAll('.filter-btn').forEach(
    btn => {
      btn.addEventListener('click', 
        (event) => {
          const filterValue = event.target.getAttribute('data-filter');
          setFilter(filterValue, event.target)
        }
      )
    }
  );

  document.getElementById('volumes').addEventListener('click', 
    (event) => {
      const header = event.target.closest('.volume-header');
      
      if (header) {
          const filterValue = header.getAttribute('data-filter');
          toggleVolume(filterValue);
      }
  });
/*==============================================================================*/