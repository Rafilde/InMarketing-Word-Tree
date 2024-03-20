function creatingTree() {
    let text = document.getElementById("words").value;
    let keyWord = document.getElementById("keyWord").value.toLowerCase();
    let selectElement = document.getElementById("type").value;
    
    wordOfTheThree(text)
    wordTreeOfGoogle(text, keyWord, selectElement);
}
     
function clearTree() {
    document.getElementById("wordtree_basic").innerHTML = "";
}
     
function wordTreeOfGoogle(text, keyWord, type){
    let textOfTextArea = clearText(text);
    
    google.charts.load('current', {packages:['wordtree']});
    google.charts.setOnLoadCallback(() => {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Phrases');

        const lines = linesWord(textOfTextArea, keyWord); // Obter as linhas que contêm a palavra raiz

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            backAndFrontWords(line, keyWord, type, (line) => {
                data.addRow([line]);
            });
        }

        const options = {
            backgroundColor: '#f0f0f0',
            wordtree: {
                format: 'implicit',
                type: type,
                word: keyWord,
            }
        };

        const chart = new google.visualization.WordTree(document.getElementById('wordtree_basic'));
        chart.draw(data, options);
    });
}
  
function clearText(text) {
    let textWithOutSpace = text.trim().toLowerCase();
    return textWithOutSpace.replace(/[^\w\sÀ-ÖØ-öø-ÿ-]|(?<=\w)-(?=\w)/g, '');
}
     
function linesWord(text, keyWord) {
    const lines = text.split('\n');
    const linesWithKeyWord = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.toLowerCase().includes(keyWord)) {
            linesWithKeyWord.push(line);
        }
    }

    return linesWithKeyWord;
}
     
function frontWords(text, rootWord, callback) {
    let beginIndex = text.indexOf(rootWord) + rootWord.length;
    let finalIndex = 0;

    while ((finalIndex = text.indexOf(rootWord, beginIndex)) !== -1) {
        const phrase = text.substring(beginIndex, finalIndex).trim();
        if (phrase !== "") {
            callback(`${rootWord} ${phrase}`);
        }
        beginIndex = finalIndex + rootWord.length;
    }

    if (beginIndex < text.length) {
        callback(`${rootWord} ${text.substring(beginIndex).trim()}`);
    }
}

function backWords(text, rootWord, callback) {
    let beginIndex = 0;
    let finalIndex = 0;

    while ((finalIndex = text.indexOf(rootWord, beginIndex)) !== -1) {
        const phrase = text.substring(beginIndex, finalIndex).trim();
        if (phrase !== "") {
            callback(`${phrase} ${rootWord}`);
        }
        beginIndex = finalIndex + rootWord.length;
    }
}

function wordsOfTheTree(text, callback) {
    let wordsMatrix = text.split(" ");
    let partsCount = []; 
    let parts = [];
    let lines = "";

    for(const line of wordsMatrix) {
        if(partsCount.length <= 13) {
            partsCount.push(line);
            lines += line + " ";
        } else {
            partsCount = []; 
            parts.push(lines.trim())
            lines += line + " ";
        }
    }

    if (partsCount.length > 0) {
        parts.push(lines.trim());
      }

    return callback(`${parts}`);
}

function backAndFrontWords(text, keyWord, type, callback) {
    if (type == 'suffix') {
        wordsOfTheTree(text,callback)
        return;
    } else {
        if (keyWord == "") {
            alert("Digite a palavra raiz");
            return;
        }
        frontWords(text, keyWord, callback);
        backWords(text, keyWord, callback);
    }
}

function wordOfTheThree(text) {
    const text = clearText(text)
    
    const words = text.split(/\s+/) 
    return print(words)
}