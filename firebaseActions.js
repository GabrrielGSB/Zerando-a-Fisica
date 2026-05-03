// firebaseActions.js
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import db from "./firebaseConfig.js"; 

/* Busca os dados do documento principal 'Volumes' de dentro da coleção 'Dados'. */
export async function getAllVolumes() {
  try {
    const docRef = doc(db, "Dados", "Volumes");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Dados carregados com sucesso!");
      return docSnap.data(); 
    } 
    else {
      console.log("Nenhum dado encontrado no documento 'livros'!");
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar dados dos livros:", error);
    throw error;
  }
}

export async  function getAllChapters({vol}){
  try{
    const docVolumes = await getAllVolumes();
    const docSnap    = docVolumes[`volume-${vol}`]["capitulos"];

    return docSnap; 
  } 
  catch (error) {
    console.error("Erro ao buscar dados dos capítulos:", error);
    throw error;
  }
}

export async function getAllModules({vol, ch}){
  try{
    const docChapters = await getAllChapters({vol: vol});
    const docSnap     = docChapters[`cap_${ch}`]["modulos"];

    return docSnap;
  }
  catch (error) {
    console.error("Erro ao buscar dados dos módulos:", error);
    throw error;
  }
}

export async function getAllQuestions({vol, ch, mod}){
  try{
    const docModules = await getAllModules({vol: vol, ch: ch});
    const docSnap    = docModules[`mod_${ch}-${mod}`]["questoes"];

    return docSnap;
  }
  catch (error) {
    console.error("Erro ao buscar dados das questões:", error);
    throw error;
  }
}

/* Busca o enunciado e a resolução de uma questão específica. */
export async function buscarDetalhesQuestao(capitulo, modulo, questaoId) {
  try {
    const docSnap = getAllVolumes();

    if (docSnap.exists()) {
      // Navegando pelos mapas aninhados: capitulos -> modulos -> questoes
      const questaoData = docSnap.capitulos?.[capitulo]?.modulos?.[modulo]?.questoes?.[questaoId];

      if (questaoData) {
        return {
          enunciado: questaoData.enunciado,
          resolucao: questaoData.resolucao
        };
      } 
      else {
        console.log("Questão não encontrada na base de dados.");
        return null;
      }
    }
  } 
  catch (error) {
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