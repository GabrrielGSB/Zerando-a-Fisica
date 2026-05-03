// // Importe as funções do arquivo que criamos
// import { 
//     getAllVolumes, 
//     getAllChapters, 
//     getAllModules,
//     getAllQuestions,
//     getQuestionData
// } from './firebaseActions.js';

// async function rodarTestes() {
//     console.log("🚀 Iniciando testes de comunicação com o Firebase...");

//     try {
//         // ─── TESTE 1: Buscar Todos os Dados ────────────────────────────────
//         console.log("\n⏳ [Teste 1] Buscando todos os dados do documento 'Volumes'...");

//         // const dadosCompletos = await getAllChapters(1);
//         const dadosCompletos = await getQuestionData({vol: 1, ch: 1, mod: 1, q: 1});
        
//         if (dadosCompletos) {
//             console.log("✅ [Teste 1 Sucesso] Dados recebidos:", dadosCompletos);
//         } else {
//             console.warn("⚠️ [Teste 1 Aviso] A requisição funcionou, mas o documento está vazio ou não existe.");
//         }

//         // // ─── TESTE 2: Buscar Detalhes de uma Questão ───────────────────────
//         // // ATENÇÃO: Substitua 'c01', 'm01', 'q1' pelas chaves EXATAS que você criou lá no painel do Firestore
//         // const testeCapitulo = 'c01'; 
//         // const testeModulo = 'm01';
//         // const testeQuestao = 'q1';
        
//         // console.log(`\n⏳ [Teste 2] Buscando detalhes da questão ${testeQuestao}...`);
//         // const detalhes = await buscarDetalhesQuestao(testeCapitulo, testeModulo, testeQuestao);
        
//         // if (detalhes) {
//         //     console.log("✅ [Teste 2 Sucesso] Detalhes encontrados:");
//         //     console.log(`   📝 Enunciado: ${detalhes.enunciado}`);
//         //     console.log(`   💡 Resolução: ${detalhes.resolucao}`);
//         // } else {
//         //     console.warn("⚠️ [Teste 2 Aviso] Questão não encontrada. Verifique se o caminho no Firebase está exatamente igual às variáveis de teste.");
//         // }

//         // // ─── TESTE 3: Salvar Progresso (Bônus) ─────────────────────────────
//         // console.log("\n⏳ [Teste 3] Simulando salvamento de progresso na nuvem...");
        
//         // const usuarioSimuladoId = "usuario_teste_123";
//         // // Um exemplo de objeto state que sua aplicação já gera [cite: 54, 55]
//         // const stateSimulado = { 
//         //     "c01_m1_q1": true, 
//         //     "c01_m1_q2": true 
//         // }; 

//         // await salvarProgressoNuvem(usuarioSimuladoId, stateSimulado);
//         // console.log("✅ [Teste 3 Sucesso] Comando de salvar enviado sem erros. Verifique a coleção 'Usuarios' no console do Firestore!");

//     } catch (error) {
//         console.error("\n❌ [Erro Crítico] Os testes falharam devido a um erro:", error);
//     }

//     console.log("\n🏁 Fim dos testes do Firebase.");
// }

// // Exemplo de uso em algum lugar do seu código:
// import { atualizarDadosQuestao } from './firebaseActions.js';

// async function salvarEnunciado() {
//   const param = { vol: 1, ch: 1, mod: 1, q: 1, field: "concluida" };
//   const novoParam = false;
  
//   await updateQuestionField(param, novoParam);
// }

// salvarEnunciado();
// // rodarTestes();