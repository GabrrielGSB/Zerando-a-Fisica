// firebaseActions.js
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import db from "./firebaseConfig.js"; // Certifique-se de que o caminho está correto

// ─── 1. BUSCAR TODOS OS DADOS (LIVROS, CAPÍTULOS E QUESTÕES) ───────────

/*Busca o documento principal 'livros' de dentro da coleção 'Dados'.*/
export async function buscarTodosOsDados() {
  try {
    // Referência para o documento: coleção "Dados", documento "livros"
    const docRef = doc(db, "Dados", "Volumes");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Dados carregados com sucesso!");
      return docSnap.data(); 
    } else {
      console.log("Nenhum dado encontrado no documento 'livros'!");
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar dados dos livros:", error);
    throw error;
  }
}

// ─── 2. BUSCAR DETALHES DE UMA QUESTÃO ESPECÍFICA (MODAL) ──────────────
/**
 * Busca o enunciado e a resolução de uma questão específica.
 * Como tudo está num único documento, buscamos o doc e filtramos no JS.
 * Perfeito para usar no gatilho do Modal que abre ao clicar na questão!
 */
export async function buscarDetalhesQuestao(capitulo, modulo, questaoId) {
  try {
    const docRef = doc(db, "Dados", "livros");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const dados = docSnap.data();
      
      // Navegando pelos mapas aninhados: capitulos -> modulos -> questoes
      // Adapte as chaves abaixo exatamente para como elas estiverem escritas no seu Firestore
      const questaoData = dados.capitulos?.[capitulo]?.modulos?.[modulo]?.questoes?.[questaoId];

      if (questaoData) {
        return {
          enunciado: questaoData.enunciado,
          resolucao: questaoData.resolucao
        };
      } else {
        console.log("Questão não encontrada na base de dados.");
        return null;
      }
    }
  } catch (error) {
    console.error("Erro ao buscar a questão:", error);
    return null;
  }
}

// ─── 3. (BÔNUS) SALVAR PROGRESSO DO USUÁRIO NA NUVEM ───────────────────
/**
 * Se você tiver um sistema de login (Firebase Auth) no futuro, 
 * pode salvar o objeto 'state' de questões feitas direto no Firestore 
 * em vez de usar apenas o localStorage.
 */
export async function salvarProgressoNuvem(userId, stateObject) {
  try {
    // Cria ou atualiza um documento com o ID do usuário em uma coleção 'Usuarios'
    const userRef = doc(db, "Usuarios", userId);
    
    // O setDoc com merge: true atualiza os dados sem apagar os existentes
    await setDoc(userRef, { 
        progressoFisica: stateObject 
    }, { merge: true });

    console.log("Progresso salvo na nuvem com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar progresso:", error);
  }
}