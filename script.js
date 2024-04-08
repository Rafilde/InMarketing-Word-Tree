function captureDiv() {
    html2canvas(document.getElementById('wordtree_basic'), {backgroundColor: "#ffffff"}).then(function(canvas) {
        var imgData = canvas.toDataURL('image/png');
        var link = document.createElement('a');
        link.download = 'wordtree_capture.png';
        link.href = imgData;
        link.click();
    });
}

function creatingTree() {
    let text = document.getElementById("words").value;
    let keyWord = document.getElementById("keyWord").value.toLowerCase().trim();
    let selectElement = document.getElementById("type").value;
    
    alertInfo(text, keyWord, selectElement);
}
     
function clearTree() {
    document.getElementById("wordtree_basic").innerHTML = "";
    document.getElementById("words-table").innerHTML = '';

    let wordsContainer = document.getElementById("words-container");
    wordsContainer.style.display = "none";
    
    document.getElementById("words").value = "";
    document.getElementById("keyWord").value = ""; 
}

function alertInfo(text, keyWord, selectElement) {
    const keyWordNullOrNot = keyWord != "" || keyWord == ""
    const keyWordNull = keyWord == ""
    const elementDoubleOrSuffixWithOutText = text == ""

    if (((keyWordNullOrNot) && elementDoubleOrSuffixWithOutText)) {
        return  alert("Digite o texto para gerar a árvore");
    } else if (keyWordNull) {
        return  alert("Digite a palavra raiz");
    } else {
        wordTreeOfGoogle(text, keyWord, selectElement);
    }
    
}
     
function wordTreeOfGoogle(text, keyWord, type){
    let textOfTextArea = clearText(text);

    if (!textOfTextArea.toLowerCase().includes(keyWord)) {
        alert("A palavra-chave não foi encontrada no texto.");
        return;
    }
    
    google.charts.load('current', {packages:['wordtree']});
    google.charts.setOnLoadCallback(() => {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Phrases');

        const lines = linesWord(textOfTextArea, keyWord);

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            backAndFrontWords(line, keyWord, type, (line) => {
                data.addRow([line]);
            });
        }

        const options = {
            backgroundColor: '#ffffff',
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
        frontWords(text, keyWord, callback);
        backWords(text, keyWord, callback);
    }
}

//TABLE OF WORDS
function wordOfTheThree(text) {
    const arrayWordsText = clearText(text).split(/\s+/)
    
    let wordsCount = {}
    for(let i = 0; i < arrayWordsText.length; i++) {
    	let word = arrayWordsText[i]
    	if(wordsCount[word] === undefined) {
      	wordsCount[word] = 1
      } else {
      	wordsCount[word]++
      }
    }
    
    let newWordsCount = []
    for(let word in wordsCount) {
    	newWordsCount.push([word, wordsCount[word]])
    }
    newWordsCount.sort(function(a, b) {
        return b[1] - a[1];
    })

    return newWordsCount
}

function creatingWordsTable(text) {
    let tbl = document.createElement("table");
    tbl.id = "myTable"
    let tbody = document.createElement("tbody");

    var thead = document.createElement("thead");
    let tr = document.createElement('tr');

    const cellHeader = ["Palavras", "Quantidades"];
    for (let i = 0; i < 2; i++) {
        let th = document.createElement('th');
        th.innerText = cellHeader[i];
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    tbl.appendChild(thead);

    for (let i = 0; i < text.length; i++) {
        let tr = document.createElement('tr'); 

        let td = document.createElement('td');
        td.innerText = text[i][0];
        tr.appendChild(td);

        let tdTow = document.createElement('td');
        tdTow.innerText = text[i][1];
        tr.appendChild(tdTow);

        tbody.appendChild(tr); 
    }
    tbl.appendChild(tbody);
    return tbl;
}


function showRepeatedWords() {
    const text = document.getElementById("words").value

    if(text.trim() == "") {
        alert("Informe o texto para visualizar as palavras")
    } else {
        const wordsRepeated = wordOfTheThree(text) 

        let tableHTML = creatingWordsTable(wordsRepeated)
    
        const tableContainer = document.getElementById("words-table");
        tableContainer.innerHTML = '';
        tableContainer.appendChild(tableHTML);
    
        const divWithTableContainer = document.getElementById("words-container");
        divWithTableContainer.style.display = "block";
        divWithTableContainer.style.overflowX = "hidden"
        divWithTableContainer.style.overflowY = "scroll"

        sortOrder = 'asc';

    }
}

let sortOrder; 

function sortTable() {
    const table = document.getElementById("myTable");
    const rows = Array.from(table.rows).slice(1); 

    const compareRows = (a, b) => {
        const countA = parseInt(a.cells[1].innerText);
        const countB = parseInt(b.cells[1].innerText);
        if (sortOrder === 'asc') {
            return countA - countB;
        } else {
            return countB - countA;
        }
    };

    const sortedRows = rows.sort(compareRows);

    while (table.rows.length > 1) {
        table.deleteRow(1); 
    }
    sortedRows.forEach(row => {
        table.appendChild(row); 
    });
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
}