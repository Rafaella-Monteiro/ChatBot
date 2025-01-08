import os
from flask import Flask, request, jsonify, render_template
from flask_session import Session
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

app = Flask(__name__)

#Configurar sessões
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

template = """
Responda a questâo abaixo:

Este é um histórico da nossa conversa {context}

Pergunta: {question}

Resposta:
"""

model = OllamaLLM(model="llama3")
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model
context = ""

@app.route("/")
def index():
    return render_template("homepage.html")

@app.route("/chat", methods=["POST"])
def chat():
    global context
    user_input = request.json.get("message", "")
    if user_input.lower() == "sair":
        return jsonify({"response": "Conversa encerrada. Espero ter ajudado!"})

    #processar a conversa do usuário como modelo:
    result = chain.invoke({"context": context, "question": user_input})
    context += f"Usuário: {user_input}\nBot:{result}\n"
    return jsonify({"response": result}) #resposta retornada para  o front

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
