// firebaseActions.js
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import db from "./firebaseConfig.js"; 

/* Busca os dados do documento principal 'Volumes' de dentro da coleção 'Dados'. */
export async function getAllData() {
  try {
    const docRef = doc(db, "Dados", "Volumes");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data(); 
    } 
    else {
      console.log("Nenhum dado encontrado no banco de dados!");
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar dados dos livros:", error);
    throw error;
  }
}

export async  function getAllChapters({vol}){
  try{
    const docVolumes = await getAllData();
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

export async function getQuestionData({vol, ch, mod, q}){
  try{
    const docQuestions = await getAllQuestions({vol: vol, ch: ch, mod: mod});
    const docSnap      = docQuestions[`q_${q}`];

    return docSnap;
  }
  catch(error) {
    console.error("Erro ao buscar dados das questões:", error);
    throw error;
  }
}



/* Atualiza APENAS um campo específico de uma questão (ex: adicionando a URL da imagem ou texto). */
export async function atualizarDadosQuestao({vol, ch, mod, q, field}, newValue) {
  try {
    const docRef = doc(db, "Dados", "Volumes");
    const fieldPath = `volume-${vol}.capitulos.cap_${ch}.modulos.mod_${ch}-${mod}.questoes.q_${q}.${field}`;

    await updateDoc(docRef, { [fieldPath]: newValue });

    console.log(`Campo '${field}' da questão ${q} atualizado com sucesso!`);
  } catch (error) {
    console.error(`Erro ao atualizar o campo ${field}:`, error);
    throw error;
  }
}