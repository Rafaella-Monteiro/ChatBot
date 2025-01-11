document.getElementById("send-btn").addEventListener("click", sendMessage);

document.getElementById("user-input").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    const inputField = document.getElementById("user-input");
    const message = inputField.value.trim();

    if (!message) return; //ignorar mensagens vazias

    //para exibir as mensaegns na area das mensagens:
    addMessage("user-message", message);

    //ebiar para o back
    fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message }),
    })
        .then((response) => response.json())
        .then((data) => {
            // Exibe a resposta do bot na área de mensagens
            addMessage("bot-message", data.response);
        })
        .catch((error) => {
            console.error("Erro ao enviar mensagem:", error);
        });

    // Limpa o campo de entrada
    inputField.value = "";

}

function addMessage(type, text){
    const chatDisplay = document.getElementById("chat-display");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", type);
    messageDiv.textContent = text;
    chatDisplay.appendChild(messageDiv);

    //rola para as mensagens mais recentes
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}