const OPENAI_API_KEY = env.APIKEY;
const inputQuestion = document.getElementById("inputQuestion")

const result = document.getElementById("result")

inputQuestion.addEventListener("keypress", (e) => {
    if(inputQuestion.value && e.key === "Enter"){
        SendQuestion();
    }
})

function SendQuestion(){

    var sQuestion = inputQuestion.value

    fetch("https://api.openai.com/v1/completions", {
        method: "POST",

        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + OPENAI_API_KEY
        },

        body: JSON.stringify({
            model: "gpt-3.5-turbo-instruct",
            prompt: sQuestion,
            max_tokens: 2048,
            temperature: 0.5
        })
    })
        
    .then((response) => response.json())
    
    .then((json) => {

        if(result.value){
            result.value += "\n";
        }

        if(json.error?.message){
            result.value += `Erro: ${json.error.message}`;
        }else if(json.choices?.[0].text){
            var text = json.choices[0].text || "Sem resposta"
            result.value += "Chat gpt: " + text;
        }
        
        result.scrollTop = result.scrollHeight
    })
        
    .catch((error) => console.error("Error: ", error))

    .finally(() => {
        inputQuestion.value = "";
        inputQuestion.disable = false;
        inputQuestion.focus();
    })

    if(result.value){
        result.value += "\n\n\n";
    }

    result.value += `Eu: ${sQuestion}`;
    inputQuestion.value = "Carregando...";
    inputQuestion.disable = true;
    result.scrollTop = result.scrollHeight
}
