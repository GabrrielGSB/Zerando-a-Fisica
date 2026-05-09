import { 
    getAllData, 
    getAllChapters, 
    getAllModules,
    getAllQuestions,
    getQuestionData,
    addQuestion
} from './firebaseActions.js';

/*===============================================================================*/
//#region FUNÇÕES UTILITÁRIAS
  function sortData(rawData) {
  if (!rawData) return {};

  const getIndex = (key) => {
    const nums = key.match(/\d+/g);
    return parseInt(nums?.at(-1) ?? '0', 10);
  };

  const sorted = {};

  Object.keys(rawData)
    .sort((a, b) => getIndex(a) - getIndex(b))
    .forEach(volKey => {
      const vol = rawData[volKey];
      sorted[volKey] = { ...vol };

      if (vol.capitulos) {
        sorted[volKey].capitulos = {};

        Object.keys(vol.capitulos)
          .sort((a, b) => getIndex(a) - getIndex(b))
          .forEach(chKey => {
            const ch = vol.capitulos[chKey];
            sorted[volKey].capitulos[chKey] = { ...ch };

            if (ch.modulos) {
              sorted[volKey].capitulos[chKey].modulos = {};

              Object.keys(ch.modulos)
                .sort((a, b) => getIndex(a) - getIndex(b))
                .forEach(modKey => {
                  const mod = ch.modulos[modKey];
                  sorted[volKey].capitulos[chKey].modulos[modKey] = { ...mod };

                  // 👇 Novo: ordena as questões dentro de cada módulo
                  if (mod.questoes) {
                    sorted[volKey].capitulos[chKey].modulos[modKey].questoes = {};

                    Object.keys(mod.questoes)
                      .sort((a, b) => getIndex(a) - getIndex(b))
                      .forEach(qKey => {
                        sorted[volKey].capitulos[chKey].modulos[modKey].questoes[qKey] = mod.questoes[qKey];
                      });
                  }
                });
            }
          });
      }
    });

  return sorted;
  }

  // Converte link do Drive para URL de imagem direta
  function convertDriveUrl(url) {
    const match = url.match(/\/d\/([\w-]+)/);
    if (match) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    return url;
  }

  // Abre o modal zerado, guardando contexto de qual módulo originou
  let modalContext = null; // { vol, ch, mod }

  function openAddQuestionModal(vol, ch, mod) {
    modalContext = { vol, ch, mod };

    document.getElementById('inputNumero').value    = '';
    document.getElementById('inputEnunciado').value = '';
    document.getElementById('inputUrl').value       = '';
    document.getElementById('imgPreviewWrap').style.display = 'none';
    document.getElementById('imgError').style.display       = 'none';

    document.getElementById('addQuestionModal').classList.add('open');
  }

  function closeAddQuestionModal() {
    document.getElementById('addQuestionModal').classList.remove('open');
    modalContext = null;
  }
//#endregion
/*===============================================================================*/

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

    // sessionStorage.setItem(`open_${id}`, isOpen ? '1' : '0');
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
//#endregion
/*===============================================================================*/

/*===============================================================================*/
//#region RENDERIZAÇÃO DE ELEMENTOS
  function renderModules(vol, ch) {
    const modules = DATA[vol]['capitulos'][ch]['modulos']

    return Object.keys(modules).map( mod => {
      const id = mod.at(-1);
      const questoes = modules[mod]['questoes'] ?? {};  // fallback para objeto vazio

      const qsHtml = Object.keys(questoes).map(
        q => {
          const isDone = false;
          if (filter === 'done'    && !isDone) return '';
          if (filter === 'pending' &&  isDone) return '';
          return `<button class="q-btn ${isDone ? 'done' : ''}" 
                    data-vol="${vol}"
                    data-ch="${ch}"
                    data-mod="${mod}"
                    data-questao="${q.replace('q_', '')}"> ${q.replace('q_', '')} 
                  </button>`;
        }
      ).join('');

      return `
        <div class="module" id="mod-${vol}-${ch}-${mod}">
          <div class="module-title">${modules[mod]['nome']}</div>
          <div class="questions"> ${qsHtml} </div>
          <div class="module-actions">
            <button class="module-action mark-all"  onclick="">✓ marcar todos</button>
            <span style="color:var(--border)">·</span>
            <button class="module-action clear-all" onclick="">✕ limpar</button>
            <span style="color:var(--border);margin-left:auto">${id}/${id}</span>
            <button class="module-action btn-add-question"
              data-vol="${vol}"
              data-ch="${ch}"
              data-mod="${mod}">
              + nova questão
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderChapters(vol) {
    const chapters = DATA[vol]['capitulos']
    return Object.keys(chapters).map(
      ch => {
        const id = ch.at(-1);
        // const cc         = countQuestionsDoneInChapter(ch);
        const hasModules = Object.keys(chapters[ch]['modulos']).length > 0
        // const hasModules = false;
        // const isOpen     = sessionStorage.getItem(`open_${ch.id}`) === '1';
        const isOpen = false;

        if (filter === 'done'    && cc.done === 0)                        return '';
        if (filter === 'pending' && cc.done === cc.total && cc.total > 0) return '';

        return `
          <div class="chapter ${isOpen ? 'open' : ''}" id="ch-${id}">

            <div class="chapter-header" data-filter="${id}">
              <span class="chapter-icon">                    ->                                       </span>
              <span class="chapter-title">                  ${chapters[ch]['nome']}                   </span>
              <span class="chapter-count">                  ${hasModules ? `${id}/${id}` : '—'} </span>
              ${hasModules ? `<span class="chapter-chevron"> ▼                                        </span>` : ''}
            </div>

            ${hasModules ? `<div class="modules">${renderModules(vol, ch)}</div>` : ''}
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
//#endregion
/*===============================================================================*/


/*===============================================================================*/
//#region JANELA DE VISUALIZAÇÃO DA QUESTÃO
  let currentActiveQuestion = null; // Armazena a questão aberta no momento

  async function openQuestionModal(vol, ch, mod, q, btnElement) {
    currentActiveQuestion = { vol, ch, mod, q, btnElement };

    const k      = stateKey(ch, mod, q);
    const isDone = !!state[k];

    // — Abre o modal imediatamente com estado de carregamento —
    document.getElementById('modalQTitle').textContent  = `Questão ${q}`;
    document.getElementById('modalQText').innerHTML     = '<span style="color:var(--muted)">Carregando...</span>';
    document.getElementById('modalQImg').style.display  = 'none';
    document.getElementById('qModal').classList.add('open');

    const toggleBtn       = document.getElementById('modalToggleBtn');
    toggleBtn.textContent = isDone ? 'Desmarcar Conclusão' : 'Marcar como Feita';
    toggleBtn.className   = isDone ? 'modal-btn done' : 'modal-btn';

    // — Extrai os índices numéricos das chaves (ex: "cap_5" → "5") —
    const volNum = vol.match(/\d+/)?.[0];
    const chNum  =  ch.match(/\d+/)?.[0];
    const modNum = mod.match(/(\d+)$/)?.[0]; // último número: "mod_5-2" → "2"

    try {
      const data = await getQuestionData({ vol: volNum, ch: chNum, mod: modNum, q });

      // — Enunciado —
      document.getElementById('modalQText').innerHTML = data?.enunciado
        ? data.enunciado
        : '<span style="color:var(--muted);font-style:italic">Sem enunciado cadastrado.</span>';

      // — Imagem de resolução —
      const imgEl = document.getElementById('modalQImg');
      if (data?.resolucao) {
        imgEl.src          = data.resolucao;
        imgEl.style.display = 'block';
        imgEl.onerror      = () => { imgEl.style.display = 'none'; };
      } else {
        imgEl.style.display = 'none';
      }

    } catch (err) {
      document.getElementById('modalQText').innerHTML =
        '<span style="color:#f76a6a">Erro ao carregar os dados da questão.</span>';
      console.error('openQuestionModal:', err);
    }
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
    updateAllCounter();
  }

  // Fecha o modal se o usuário clicar fora da caixa do conteúdo
  document.getElementById('qModal').addEventListener('click', (e) => {
    if (e.target.id === 'qModal') closeModal();
  });
//#endregion
/*===============================================================================*/
/*=============================================================================*/
//#region MAIN 
  loadCloudState();

  const rawDATA = loadLocalData();
  const DATA = sortData(rawDATA);
  console.log(DATA);
  render();


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
    (e) => {
      const volumeHeader  = e.target.closest('.volume-header');
      const chapterHeader = e.target.closest('.chapter-header');
      const qBtn          = e.target.closest('.q-btn');
      const addBtn        = e.target.closest('.btn-add-question');

      if (volumeHeader)  toggleVolume(volumeHeader.getAttribute('data-filter'));
      if (chapterHeader) toggleChapter(chapterHeader.getAttribute('data-filter'));
      if (addBtn)        openAddQuestionModal(addBtn.dataset.vol, addBtn.dataset.ch, addBtn.dataset.mod);
      if (qBtn)          openQuestionModal(
        qBtn.dataset.vol,     
        qBtn.dataset.ch,
        qBtn.dataset.mod,
        qBtn.dataset.questao,
        qBtn
      );
    }
  );

  document.getElementById('closeModalBtn').addEventListener('click', closeAddQuestionModal);
  document.getElementById('cancelModalBtn').addEventListener('click', closeAddQuestionModal);

  document.getElementById('addQuestionModal').addEventListener('click', (e) => {
    if (e.target.id === 'addQuestionModal') closeAddQuestionModal();
  });

  document.getElementById('inputUrl').addEventListener('input', () => {
    const raw  = document.getElementById('inputUrl').value.trim();
    const wrap = document.getElementById('imgPreviewWrap');
    const err  = document.getElementById('imgError');

    if (!raw) { wrap.style.display = 'none'; return; }

    const url = convertDriveUrl(raw);
    document.getElementById('imgPreview').src = url;
    wrap.style.display = 'block';
    err.style.display  = 'none';
  });

  document.getElementById('imgPreview').addEventListener('error', () => {
    document.getElementById('imgPreviewWrap').style.display = 'none';
    document.getElementById('imgError').style.display       = 'block';
  });

  document.getElementById('volumes').addEventListener('click', (e) => {
  const addBtn = e.target.closest('.btn-add-question');

  if (addBtn) {
    const vol = addBtn.dataset.vol;
    const ch  = addBtn.dataset.ch;
    const mod = addBtn.dataset.mod;
    openAddQuestionModal(vol, ch, mod);
  }
  });

  document.getElementById('saveQuestionBtn').addEventListener('click', 
    async () => {
      const numero    = document.getElementById('inputNumero').value.trim();
      const enunciado = document.getElementById('inputEnunciado').value.trim();
      const rawUrl    = document.getElementById('inputUrl').value.trim();
      const imagemUrl = rawUrl ? convertDriveUrl(rawUrl) : '';

      if (!numero) {
        document.getElementById('inputNumero').focus();
        return;
      }

      const { vol, ch, mod } = modalContext;
      const btn = document.getElementById('saveQuestionBtn');

      try {
        btn.textContent = 'Salvando...';
        btn.disabled    = true;

        await addQuestion(vol, ch, mod, numero, enunciado, imagemUrl);

        // 1. Atualiza o DATA local
        DATA[vol]['capitulos'][ch]['modulos'][mod]['questoes'][`q_${numero}`] = {
          enunciado:  enunciado || '',
          resolucao:  imagemUrl || '',
          concluida:  false,
        };

        // 2. Injeta o botão no DOM
        const questoesContainer = document.querySelector(
          `#mod-${vol}-${ch}-${mod} .questions`
        );

        const newBtn = document.createElement('button');
        newBtn.className       = 'q-btn';
        newBtn.textContent     = numero;
        newBtn.dataset.vol     = vol;
        newBtn.dataset.ch      = ch;
        newBtn.dataset.mod     = mod;
        newBtn.dataset.questao = numero;

        questoesContainer.appendChild(newBtn);

        // 3. Atualiza o contador do módulo
        const total   = Object.keys(DATA[vol]['capitulos'][ch]['modulos'][mod]['questoes']).length;
        const counter = document.querySelector(`#mod-${vol}-${ch}-${mod} .module-actions span`);
        if (counter) counter.textContent = `0/${total}`;

        closeAddQuestionModal();
      } 
      catch (e) {
        console.error(e);
        btn.textContent = 'Erro ao salvar';
      } 
      finally {
        btn.textContent = 'Salvar questão';
        btn.disabled    = false;
      }
    }
  );

  // Fechar modal de visualização
  document.getElementById('closeQModalBtn').addEventListener('click', closeModal);

  document.getElementById('qModal').addEventListener('click', (e) => {
    if (e.target.id === 'qModal') closeModal();
  });

  // Botão de marcar/desmarcar dentro do modal
  document.getElementById('modalToggleBtn').addEventListener('click', toggleCurrentQ);
//#endregion
/*==============================================================================*/