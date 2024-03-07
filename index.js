function genereteTree() {
  let text = document.getElementById("words").value;
  let keyWord = document.getElementById("keyWord").value.toLowerCase();
  let selectElement = document.getElementById("type").value;
   
  wordTreeOfGoogle(text, keyWord, selectElement);
}
   
function clearTree() {
  document.getElementById("wordtree_basic").innerHTML = "";
}
   
function wordTreeOfGoogle(text, keyWord, type){
  let textOfTextArea = clearText(text)
  let lines = textToMatrix(textOfTextArea)
  let wordsOnly = textToMatrixOnlyWords(textOfTextArea)
  //alert(lines)
 
  //--------------
  /*let parts = [];
const wordsMatrix = textOfTextArea.split(' ');
  for(const line of wordsMatrix){
    parts.push(line);
    alert(line)
}
  alert(parts.length)
  let teste = ["oi", "olá", "eae", "como vai"]
  let testeDois = "oi olá eae como vai"
  alert(teste.length)
  alert(testeDois.length)*/
  //--------------

  google.charts.load('current', {packages:['wordtree']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      var data = google.visualization.arrayToDataTable(
        [ ['Phrases'],
        /*['are awesome cats are better than dogs'],
            ['are awesome cats eat kibble'],
            ['are awesome cats are better than hamsters'],
            ['eat mice cats are awesome'],
            ['are awesome cats are people too'],
            ['eat mice cats eat mice'],
            ['eat mice cats meowing'],
            ['eat mice cats in the cradle'],
            ['in the cradle cats eat mice'],
            ['in the cradle cats in the cradle lyrics'],
            ['in the cradle cats eat kibble'],
            ['cats for adoption'],
            ['cats are family'],
            ['cats eat mice'],
            ['cats are better than kittens'],
            ['cats are evil'],
            ['cats are weird'],
            ['cats eat mice'],*/
         //...wordsOnly.map(line => [line]),
        ...lines.map(line => [line]),
      ]
    );

    var options = {
      wordtree: {
        format: 'implicit',
        type: type,
        word: keyWord,
      }
    };

    var chart = new google.visualization.WordTree(document.getElementById('wordtree_basic'));
    chart.draw(data, options);
  }
}

function clearText(text) {
  let textWithOutSpace = text.trim().toLowerCase()
  let clear = textWithOutSpace.replace(/[^\w\sÀ-ÖØ-öø-ÿ-]|(?<=\w)-(?=\w)/g, '');
  return clear
}
   
function textToMatrix(text) {
const wordsMatrix = text.split(' ');
let parts = [];
  let partsCount = [];
let lines = "";
 
for(const line of wordsMatrix){
    if(partsCount.length <= 13) {
    partsCount.push(line);
    lines += line + " ";
    } else {
    partsCount = [];
    parts.push(lines.trim());
      partsCount.push(line);
      lines = line + " ";
    }
}
 
  if (partsCount.length > 0) {
    parts.push(lines.trim());
  }
 
return parts;
}

function textToMatrixOnlyWords(text) {
  return text.split(' ');
}