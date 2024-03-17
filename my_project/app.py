from flask import Flask, request, render_template
import spacy
nlp = spacy.load("pt_core_news_sm")

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Obtém o texto do <textarea>
        text = request.form.get('user_text')

        words = {"noun":[], "adj":[], "verb": []}

        doc = nlp(text)
        for token in doc:
            if token.pos_ == "NOUN":
                words["noun"].append(token.text)
            elif token.pos_ == "ADJ":
                words["adj"].append(token.text)
            elif token.pos_ == "VERB":
                words["verb"].append(token.lemma_)
        

        # Processa o texto com SpaCy (substitua isso pela sua lógica)
        # Aqui, estou apenas adicionando "Processado" ao texto
        processed_text = words["noun"]

        return render_template('index.html', processed_text=processed_text)
    else:
        return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
