//Глобальные переменные для библиотеки и взаимодействия с html
let nodesId = [];
let net;
let container = document.getElementById('mynetwork');
let displayStyle = 1;

// структура дерева
class TreeNode {
    constructor(value,attributeValue,branch,threshold,NodeData) {
        this.value = value;
        this.children = [];
        this.attributeValue = attributeValue;
        this.branch = branch;
        this.threshold = threshold;
        this.NodeData = NodeData;
        this.Id = null;
    }

    addChild(node) {
        this.children.push(node);
    }
}

function dropPopup(popupText)
{
    let popup = document.getElementById("popup");
    let popupContent = document.getElementById("popupText");

    popupContent.textContent = popupText;
    popup.style.display = "block";

    setTimeout(function() {
        popup.classList.add("fadeOut");
        setTimeout(function() {

            popup.style.display = "none";
            popup.classList.remove("fadeOut");

        }, 500)
    }, 3500);

    document.querySelector(".closePopup").addEventListener("click", function() {
        document.getElementById("popup").style.display = "none";
    });
}
// функция для выбора наилучшего разбиения
function chooseBestAttribute(attributes,data){
    let bestAttribute;
    let gain =-Infinity;
    let bestThreshold = 0;

    let fulldataEnt = calculateEntropy(data);

    for(attribute of attributes){

        if(attribute!==targetAttribute){
            if(ifAttributeIsContinuous(attribute)){
                let thresholds = findThresholds(attribute,data);

                for(threshold of thresholds){

                   [subsetGreater,subsetLess] = splitSubsets(data,attribute,threshold);
                   let subsetGreaterEnt = calculateEntropy(subsetGreater);
                   let subsetLessEnt = calculateEntropy(subsetLess);

                   let infoGain = fulldataEnt-(((subsetLess.length/data.length)*subsetLessEnt)+
                   ((subsetGreater.length/data.length)*subsetGreaterEnt));

                   let splitinfo = -((subsetLess.length/data.length)*
                   Math.log2(subsetLess.length/data.length))-
                   ((subsetGreater.length/data.length)*
                   Math.log2(subsetGreater.length/data.length));

                   currentAttributeGain = infoGain/splitinfo;

                   if(currentAttributeGain>gain){

                     gain = currentAttributeGain;
                     bestAttribute = attribute; 
                     bestThreshold = threshold;

                   } 
                }
            }
            currentAttributeGain = calculateInfoGain(attribute,data);
            if(currentAttributeGain>gain){
                gain = currentAttributeGain;
                bestAttribute = attribute;
            }
        }   
    }
   return [bestAttribute,bestThreshold];
}
// Проверка на непрерывный атрибут
function ifAttributeIsContinuous(attribute){
    attributeValues =getAttributeValues(data,attribute);
    for(attributeValue of attributeValues){
        if(!isNaN(parseFloat(attributeValue))){
            return true;
        }
    }
}
// Вычисление порога для разбиения
function findThresholds(attribute,data){
    let values = getAttributeValues(data,attribute);
    values.sort(function(a,b){
        return a-b;
    });
    return values;
}
// Деление на подмножества
function splitSubsets(data,attribute,threshold){

    let subsetGreater = [];
    let subsetLess = [];

    for(entry of data){
        entry[attribute]<=threshold?subsetLess.push(entry):subsetGreater.push(entry);
    }
    return [subsetGreater,subsetLess];
}

// Вычисление энтропии
function calculateEntropy(data){
   let totalLength = data.length;
    let classCounter = {};

    for(let entry of data){

        if(classCounter[entry[targetAttribute]]){
            classCounter[entry[targetAttribute]]++;
        }
        else{
            classCounter[entry[targetAttribute]] = 1;
        }
    }

    let entropy = 0;

    for(const amount of Object.values(classCounter)){

        const probability = amount/totalLength;     
        entropy -= probability * Math.log2(probability);

    }

    return entropy;
}

// Получение значений атрибутов
function getAttributeValues(data,attribute){
   const attributeValues = new Set();

    for(const entry of data){

        attributeValues.add(entry[attribute]);

    }

    return Array.from(attributeValues);
}
// Получение подмножества по атрибуту
function getSubset(data,attribute,attributeValue){
    let subset = new Set();

    for(entry of data){

        if(entry[attribute]==attributeValue){
            subset.add(entry);
        }

    }
    return Array.from(subset);
}

// Вычисление информационного выигрыша
function calculateInfoGain(attribute,data){

    let gain;
    let entropyBeforeSplit  = calculateEntropy(data,attribute);
    let attributeValues = getAttributeValues(data,attribute);

    let entropyAfter = 0;
    let splitinfo = 0;

    for(attributeValue of attributeValues){

        let subset = getSubset(data,attribute,attributeValue);
        let subsetEntropy = calculateEntropy(subset,attributeValue);

        entropyAfter+=(subset.length/data.length)*subsetEntropy;
        splitinfo +=(subset.length/data.length*Math.log2(subset.length/data.length));
    }

    if(splitinfo===0){
        gain = 0;
    }

    else{
      gain = (entropyBeforeSplit-entropyAfter)/(-splitinfo);
    }
    
    return gain;
}

// Получение самого частого класса данного подмножества
function mode(data) {
    let modeValue;
    let classCounter = {};
    let max = -Infinity;

    for(let entry of data){

        if(classCounter[entry[targetAttribute]]){
            classCounter[entry[targetAttribute]]++;
        }

        else{
            classCounter[entry[targetAttribute]] = 1;
        }
    }

    for(const amount of Object.values(classCounter)){
        if(amount>max){
            max = amount;
            modeValue = getKeyByValue(classCounter,amount);
        }
    }
    

    return modeValue;
}
// Проверка на ветвь с одним классом
function allSameClass(data){
   let classValue = data[0][targetAttribute];

   for(entry of data){

      if(entry[targetAttribute]!==classValue){
        return false;
      }
   }
   return true;
}


// Построение дерева
function buildDecisionTreeC45(data,attributes,attributeValue){  
    let lastAttributeValue;
    let firstChild;
    let secondChild;

    if (allSameClass(data) || attributes.length === 1) {
        return new TreeNode(targetAttribute, mode(data), attributeValue, NaN,data);
    }

    let [bestAttribute,bestThreshold] = chooseBestAttribute(attributes,data);
    const bestAttributeValues = getAttributeValues(data,bestAttribute);

    if(!(ifAttributeIsContinuous(bestAttribute))){
        bestThreshold  = NaN;
    }

    const tree = new TreeNode(bestAttribute,null,attributeValue,bestThreshold,data);

    if(ifAttributeIsContinuous(bestAttribute)){
        const [subsetGreater,subsetLess] = splitSubsets(data,bestAttribute,bestThreshold);
        
         firstChild = buildDecisionTreeC45(subsetGreater,attributes.filter(attr=>attr!=bestAttribute),">"+bestThreshold);
         secondChild = buildDecisionTreeC45(subsetLess,attributes.filter(attr=>attr!=bestAttribute),"<="+bestThreshold);
        
        tree.addChild(firstChild);
        tree.addChild(secondChild);  
    }
    else{

        for(bestAttributeValue of bestAttributeValues){

            const subset = getSubset(data,bestAttribute,bestAttributeValue);
            lastAttributeValue = bestAttributeValue;

            const childNode = buildDecisionTreeC45(subset, attributes.
                filter(attr=>attr!=bestAttribute),lastAttributeValue,NaN);

            tree.addChild(childNode);
            
        }
    }
    return tree;
}

// Усечение дерева
function prune(decisionTree,data){

    prunePercent = document.getElementById('prunePercent').value;

   if(decisionTree.NodeData.length<Math.floor(data.length*prunePercent)){

    decisionTree.value = targetAttribute;
    decisionTree.attributeValue = mode(decisionTree.NodeData);
    decisionTree.children = [];
    decisionTree.threshold = NaN;

   }
   
   else if(decisionTree.children.length!==0) {

     for(child of decisionTree.children){

         prune(child,data);

     }
   }
   return decisionTree;
}



let data = [];
let targetAttribute;
let attributesName;
let decisionTree;

//Получение дерева по данным
function getDecisionTree(){

    if(document.getElementById('atributes').value === ''){
        dropPopup("Пожалуйста , убедитесь , что вы ввели названия аттрибутов в правильном формате");
        return;
    }

    let inputAttributes = document.getElementById('atributes').value;

    if(document.getElementById('targetClass').value === ''){
        dropPopup("Пожалуйста , убедитесь , что вы ввели название аттрибута , для которого будет сделано предсказание");
        return;
    }

    targetAttribute = document.getElementById('targetClass').value;

    attributesName = inputAttributes.split(',');

    if (document.getElementById('csvInput').value.trim() === '') {
        dropPopup("Вы не ввели данные для обучения");
        return;
    }

    let csvData = document.getElementById('csvInput').value;
    let rows = csvData.trim().split('\n');

    rows.forEach(function(row){
        let values = row.split(',');
        let rowData = {};

        attributesName.forEach(function(attributesName,index){
            rowData[attributesName.trim()] = values[index].trim();
        });
        data.push(rowData);
    });
        
 
  decisionTree = buildDecisionTreeC45(data,attributesName,null);
  showTree(decisionTree);
}


// Предсказание
function runAlgorithm(){

    let attributesNameInstance = deepCopyArray(attributesName);
    attributesNameInstance = deepRemoveFromArray(attributesNameInstance,targetAttribute);
    if(checkWay(net)){
        cleanWay(nodesId,net,0);
    }

    nodesId = [];

    if(document.getElementById('newDecision').value === ''){
        dropPopup("Пожалуйста , убедитесь , что вы ввели данные для предсказания в правильном формате");
        return;
    }

    let stringInstance = document.getElementById('newDecision').value.split(',');
    const instanceToClassify = createObject(attributesNameInstance);

    for(let i = 0;i<stringInstance.length;i++){
        instanceToClassify[attributesNameInstance[i]] = stringInstance[i];
    }
        const predictedClass = classify(decisionTree, instanceToClassify,targetAttribute);
        showDecision(nodesId,net,0);        
        console.log("Predicted class:", predictedClass);
}
// Проверка на отрисованный путь решения
function checkWay(network){
    network.body.data.nodes.get().filter(function(node) {
        return node.color === 'green'; 
    });
}
// Визуал дерева
function showTree(decisionTree){
  let nodes = [];
  let edges = [];

  convertToVisNodesEdges(decisionTree, undefined, nodes, edges);

  let dataVis = { nodes, edges };

  const options = {
      nodes:{
          color:{
            background:"#b3ffff",
            border:"#c3073f"
        },
          font:{
              size: 12, 
              face: 'Franklin Gothic Medium',
              color: "white", 
              strokeWidth: 1.5,
              strokeColor: "black"
        }
    },
      edges:{
          color:"#c3073f",
          width: 3,
          font:{
              size: 12, 
              face: 'Franklin Gothic Medium',
              color: "white", 
              strokeWidth: 1.5,
              strokeColor: "black" 
        }
    }
};

    let network = new vis.Network(container, dataVis, options);
    network.body.data.nodes.update({ id: 0, color: "red",shape:"circle" });
    net = network;
}

// Классификация данных для прогноза
function classify(decisionTree,instanceToClassify,targetAttribute){
    
      let currentTreeAttribute = decisionTree.value;
    
        if(ifAttributeIsContinuous(currentTreeAttribute)){

            if(parseFloat(instanceToClassify[currentTreeAttribute])>parseFloat(decisionTree.threshold)){

                if(decisionTree.children.length===0){

                    nodesId.push(decisionTree.Id);

                    if(decisionTree.attributeValue==null){
                        dropPopup('Дереву не хватает данных , чтобы сделать более точный прогноз, предполагаемый класс'+ mode(decisionTree.NodeData));
                        return mode(decisionTree.NodeData);
                    }

                    else{
                        return decisionTree.attributeValue;
                    }

                }

              nodesId.push(decisionTree.Id);
              return classify(decisionTree.children[0],instanceToClassify,targetAttribute);
            }

            else{

                if(decisionTree.children.length===0){
                    nodesId.push(decisionTree.Id);
                    return decisionTree.attributeValue;
                }
                nodesId.push(decisionTree.Id);
                return classify(decisionTree.children[1],instanceToClassify,targetAttribute);
            }
        }

        else{

            if(decisionTree.children.length===0){
                nodesId.push(decisionTree.Id);

                if(decisionTree.attributeValue==null){
                    return mode(decisionTree.NodeData);
                }
                else{
                return decisionTree.attributeValue;
                }

            }

            let instanceAttributeValue = instanceToClassify[currentTreeAttribute];

            if(decisionTree.children && decisionTree.children.length!==0){

                for(child of decisionTree.children){

                    if(child.branch===instanceAttributeValue){
                        nodesId.push(decisionTree.Id);
                        return classify(child,instanceToClassify,targetAttribute);
                    }

                }

                return mode(decisionTree.NodeData);
            }
        }
    }
// Преобразование дерева в библиотечный формат
  function convertToVisNodesEdges(node, parentNodeId, nodes, edges) {
    const nodeId = nodes.length;
    node.Id = nodeId;

    if(node.attributeValue!==null){
        nodes.push({ id: nodeId, label: node.attributeValue});
    }
    else{
        nodes.push({ id: nodeId, label: node.value });
    }

    if (parentNodeId !== undefined) {
        edges.push({ from: parentNodeId, to: nodeId,label: node.branch });
    }
    node.children.forEach(child => {
        convertToVisNodesEdges(child, nodeId, nodes, edges);
    });
}
// Показать путь решения
function showDecision(nodesId,network,rootId){
    let classNode = nodesId[nodesId.length-1];
    for(let node of nodesId){

        if(node!==rootId && node!==classNode){
            network.body.data.nodes.update({ id: node, color: "green" });
        }
    }
    network.body.data.nodes.update({ id: classNode, color:{background:"green", border:"red" }});
    colorEdges(nodesId,network,"green");
}
// Очистить путь
function cleanWay(nodesId,network,rootId){
    for(let node of nodesId){

        if(node!==rootId){
            network.body.data.nodes.update({ id: node, color:{ border:"#c3073f",background:"#b3ffff"}});
        }
    }

    colorEdges(nodesId,network,"#c3073f");
}

// Покраска
function colorEdges(nodesId,network,color){

    for(let i = 0;i<nodesId.length-1;i++){

        let nodeId1 = nodesId[i];
        let nodeId2 = nodesId[i+1];

        const edgesIds = network.getConnectedEdges(nodeId1).filter(edgeId => {
            const edge = network.body.data.edges.get(edgeId);
            return edge.to === nodeId2 || edge.from === nodeId2;

        });

        network.body.data.edges.update({id:edgesIds[0], color:color});

    }
   
}
// Обрезать дерево
function showPrunedTree(){

   let  prunedTree = prune(decisionTree,data);
    showTree(prunedTree);
    
}

let displayTreeButton  = document.getElementById("displayTree");
displayTreeButton.addEventListener('click',function(){
    if(displayStyle === 1){
        displayStyle = 0;
        displayTreeButton.textContent = "Показать Дерево";
        container.style.display = "none";
    }
    else{
        displayStyle  = 1;
        container.style.display = "inline-block";
        displayTreeButton.textContent = "Скрыть Дерево";
    }
});

//Вспомогательные функции
 function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

 function copyObjectWithoutKey(obj, keyToRemove) {
    
    const copiedObject = { ...obj };

    if (copiedObject.hasOwnProperty(keyToRemove)) {
        delete copiedObject[keyToRemove];
    }

    return copiedObject;
}


 function deepCopyArray(arr) {
    return arr.map(item => Array.isArray(item) ? deepCopyArray(item) :
     (item instanceof Object) ? deepCopyObject(item) : item);
}

function deepRemoveFromArray(arr, itemToRemove) {
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            deepRemoveFromArray(arr[i], itemToRemove);
        } else if (arr[i] instanceof Object) {
            deepRemoveFromObject(arr[i], itemToRemove);
        } else if (arr[i] === itemToRemove) {
            arr.splice(i, 1);
            i--;
        }
    }
    return arr;
}

 function createObject(atributesName){
    const object = {};
    atributesName.forEach((atributesName)=>{
      object[atributesName] = null;
    });
    return object;
}

document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('prunePercent');
    const sliderValue = document.getElementById('sliderValue');
    
    slider.addEventListener('input', () => {
    const value = slider.value;
    sliderValue.textContent = value;
    });
});