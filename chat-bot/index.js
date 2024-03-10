//Chave da API
const OPENAI_API_KEY = "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";

//variavel constante do input onde será feito a pergunta do usuário
const inputQuestion = document.getElementById("inputQuestion")

/* variavel constante que fará o armazenamento da resposta 
entregue pela API a pergunta do usuário */
const result = document.getElementById("result")

/* adiciona um evento de clique(enter) no input de entrada quando ele tiver algum
valor(texto digitado pelo usuario), chamando a função que enviaa questão para a api */
inputQuestion.addEventListener("keypress", (e) => {
    if(inputQuestion.value && e.key === "Enter"){
        SendQuestion();
    }
})

//função que envia a questão digitada pelo usuario para a API
function SendQuestion(){

    //variavel que pega o que o usuario escreveu(valor do input)
    var sQuestion = inputQuestion.value

    /* consumindo a API */
    fetch("https://api.openai.com/v1/completions", {
        //metodo http
        method: "POST",

        //cabeçalho
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + OPENAI_API_KEY
        },

       /*  corpo da requisição do usuario, onde a questao é enviada para API
        pelo metodo destacado acima(POST) */

        body: JSON.stringify({
            model: "gpt-3.5-turbo-instruct",
            prompt: sQuestion, //questão do usuario
            max_tokens: 2048, //tamanho da resposta da api
            temperature: 0.5 //criatividade do chat
        })
    })
    //transformando a resposta em JSON
    .then((response) => response.json())
    
    //processando o json 
    .then((json) => {

        /* caso não de erro durante a execução, a resposta enviada
        pelo chat sera adiconada a variavel result */
        if(result.value){
            result.value += "\n";
        }

        /* caso der erro durante o processo,
        essa condição irá armazenar o erro no campo de resposta, ou 
        em segundo caso no qual o chat não consiga responder irá 
        armazenar "sem resposta" */
        if(json.error?.message){
            result.value += `Erro: ${json.error.message}`;
        }else if(json.choices?.[0].text){
            var text = json.choices[0].text || "Sem resposta"

            //atribui "sem reposta" ao resultado

            result.value += "Chat gpt: " + text;
        }

        //abre mais espaço ao campo quando for preciso
        result.scrollTop = result.scrollHeight
    })
    //se houver erro, colocará ele no console
    .catch((error) => console.error("Error: ", error))
    //limpa o campo de questão
    .finally(() => {
        inputQuestion.value = "";
        inputQuestion.disable = false;
        inputQuestion.focus();
    })

    /* condição que verifica se o campo de respostas está ocupado,
    caso estiver o texto pulará três linhas para baixo para armazenar uma nova resposta */
    if(result.value){
        result.value += "\n\n\n";
    }

    /* adiciona a pergunta feita pelo usuario na frente da 
    resposta entregue pela API */
    result.value += `Eu: ${sQuestion}`;

    /* define o campo de perguntas como 'carregando' durante o 
    processamento da questão */
    inputQuestion.value = "Carregando...";

    /*deixa o campo de busca desabilitado enquanto a função 
    é executada */
    inputQuestion.disable = true;


    //abre mais espaço ao campo quando for preciso
    result.scrollTop = result.scrollHeight

}