//Глобальные переменные
let executionflag = false;
let previousColor = null;
let data = [];
let centroids = [];
// Инициализация канвасов
let canvas = document.getElementById('gridCanvas');
let firstctx = canvas.getContext('2d');

let secondCanvas = document.getElementById('secondCanvas');
let secondctx = secondCanvas.getContext('2d');

let thirdCanvas = document.getElementById('thirdCanvas');
let thirdctx = thirdCanvas.getContext('2d');

let height = canvas.height;
let width = canvas.width;
let cellSize = 15;

const radioButtons = document.getElementsByName("distanceFormat");
        let customerChoise;
        for(const radioButton of radioButtons){
            if(radioButton.checked){
                customerChoise = radioButton.value;
            }
        }
// Генерация рандомных точек на канвасах
function generateRandomPointsStart(){
    document.getElementById('popupRandom').style.display = 'block';
    const send = document.getElementById('sendData');

    function generateRandomPoints(numPoints) {
        data = [];
        centroids = [];
        drawGrid(firstctx);
        drawGrid(secondctx);
        drawGrid(thirdctx);

    for (let i = 0; i < numPoints; i++) {

        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;

        let cellX = (x / cellSize);
        let cellY = (y / cellSize);
        let pointX = cellX-((width/2)/cellSize);
        let pointY = ((height/2)/cellSize)-cellY;

        data.push([pointX,pointY,x,y]);

        secondctx.beginPath();
        thirdctx.beginPath();
        firstctx.beginPath();   

        firstctx.arc(x,y, 2, 0, Math.PI * 2);
        secondctx.arc(x,y, 2, 0, Math.PI * 2);
        thirdctx.arc(x,y, 2, 0, Math.PI * 2);

        firstctx.fillStyle = '#FF0000';
        secondctx.fillStyle = '#FF0000';
        thirdctx.fillStyle = '#FF0000';

        firstctx.fill();
        secondctx.fill();
        thirdctx.fill();

        firstctx.closePath();
        secondctx.closePath();
        thirdctx.closePath();

    }
    }

    send.addEventListener("click",function(){
        let numPoints = parseInt(document.getElementById('data').value);
        if(numPoints<=0){
            document.getElementById('popupRandom').style.display = 'none';
            dropPopup('Вы можете создать как минимум одну точку');
        }
        else{
        generateRandomPoints(numPoints);
        document.getElementById('popupRandom').style.display = 'none';
        }
    });
}


// Очистка
document.getElementById("resetProgram").addEventListener("click",function(){
    executionflag = true;
    document.getElementById('popupRandom').style.display = 'none';
    drawGrid(firstctx);
    drawGrid(secondctx);
    drawGrid(thirdctx);
    data = [];
    previousColors = new Set();
    centroids = [];
});

// Установка центройд
document.getElementById("addCentroid").addEventListener("click",function(){
    let ClustersAmount = document.getElementById("ClustersAmount").value;
    document.getElementById('popupRandom').style.display = 'none';
    if(data.length === 0){
        dropPopup("Установка центройда невозможна");
    }

    else{

        if(centroids.length<ClustersAmount){
            centroids.push(data[data.length-1]);
            dropPopup("Последняя установленная вами точка была помечена как центройд");
        }
        else{
            dropPopup("Допустимое количество центройд уже было установлено");
        }
    }
});

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
// Ползунки
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('epsilon');
    const sliderValue = document.getElementById('sliderValue');
    
    slider.addEventListener('input', () => {
    const value = slider.value;
    sliderValue.textContent = value;
    });
    });

document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('neighbors');
    const sliderValue = document.getElementById('neighborsValue');
    
    slider.addEventListener('input', () => {
    const value = slider.value;
    sliderValue.textContent = value;
    });
    });

// Функция для анимации кругов
function animate(radius, opacity, x, y,maxRadius,color) {
    if(executionflag===true){
        return;
    }
    // Задаем цвет круга и прозрачность
    secondctx.fillStyle = color   ; 
    
    // Рисуем круг
    secondctx.beginPath();
    secondctx.arc(x, y, radius, 0, Math.PI * 2);
    secondctx.fill();
    
    radius += 0.1;
    
    if (radius < maxRadius) {
        requestAnimationFrame(function() {
        animate(radius, opacity, x, y,maxRadius,color);
        });
    }
}

function getRandomColor() {
    const step = 51; 
    let red, green, blue;

    do {
        red = Math.floor(Math.random() * 256);
        green = Math.floor(Math.random() * 256);
        blue = Math.floor(Math.random() * 256);
    } while (
        previousColor &&
        Math.abs(red - previousColor.red) < step &&
        Math.abs(green - previousColor.green) < step &&
        Math.abs(blue - previousColor.blue) < step
    );

    const color = {
        red: red,
        green: green,
        blue: blue,
        toString: function() {
            return '#' + this.red.toString(16).padStart(2, '0') +
                       this.green.toString(16).padStart(2, '0') +
                       this.blue.toString(16).padStart(2, '0');
        }
    };

    previousColor = color;
    return color.toString();
}

//Отрисовка координатной сетки
function drawGrid(ctxNum) {
    ctxNum.clearRect(0, 0, width, height); 
    // Рисуем горизонтальные линии сетки
    for (let y = 0; y <= height; y += cellSize) {
    ctxNum.strokeStyle = '#ccc';
    ctxNum.beginPath();
    ctxNum.moveTo(0, y);
    ctxNum.lineTo(width, y);
    ctxNum.stroke();
    }
    // Рисуем вертикальные линии сетки
    for (let x = 0; x <= width; x += cellSize) {
    ctxNum.strokeStyle = '#ccc';
    ctxNum.beginPath();
    ctxNum.moveTo(x, 0);
    ctxNum.lineTo(x, height);
    ctxNum.stroke();
    }
    // Рисуем оси координат
    ctxNum.strokeStyle = '#000';
    ctxNum.beginPath();
    ctxNum.moveTo(0, height / 2);
    ctxNum.lineTo(width, height / 2);
    ctxNum.moveTo(width / 2, 0);
    ctxNum.lineTo(width / 2, height);
    ctxNum.stroke();
}
// установка точек
function setPoints(event) {
let mouseX = event.offsetX;
let mouseY = event.offsetY;
let cellX = (mouseX / cellSize);
let cellY = (mouseY / cellSize);
let pointX = cellX-((width/2)/cellSize);
let pointY = ((height/2)/cellSize)-cellY;

secondctx.beginPath();
thirdctx.beginPath();
firstctx.beginPath();

firstctx.arc(mouseX,mouseY, 2, 0, Math.PI * 2);
secondctx.arc(mouseX,mouseY, 2, 0, Math.PI * 2);
thirdctx.arc(mouseX,mouseY, 2, 0, Math.PI * 2);

firstctx.fillStyle = '#FF0000';
secondctx.fillStyle = '#FF0000';
thirdctx.fillStyle = '#FF0000';

firstctx.fill();
secondctx.fill();
thirdctx.fill();

firstctx.closePath();
secondctx.closePath();
thirdctx.closePath();


data.push([pointX,pointY,mouseX,mouseY]);
}

canvas.addEventListener('click',setPoints);
secondCanvas.addEventListener('click',setPoints);
thirdCanvas.addEventListener('click',setPoints);

drawGrid(secondctx);
drawGrid(thirdctx);
drawGrid(firstctx);

// Перезапуск алгоритма
function reRunAlgo(data){
    executionflag = true;
    document.getElementById('popupRandom').style.display = 'none';
    for(let i = 0; i < data.length; i++) {

        secondctx.beginPath();
        thirdctx.beginPath();
        firstctx.beginPath();

        firstctx.arc(data[i][2],data[i][3], 2, 0, Math.PI * 2);
        secondctx.arc(data[i][2],data[i][3], 2, 0, Math.PI * 2);
        thirdctx.arc(data[i][2],data[i][3], 2, 0, Math.PI * 2);

        firstctx.fillStyle = '#FF0000';
        secondctx.fillStyle = '#FF0000';
        thirdctx.fillStyle = '#FF0000';

        firstctx.fill();
        secondctx.fill();
        thirdctx.fill();

        firstctx.closePath();
        secondctx.closePath();
        thirdctx.closePath();

    }
}
// Запуск алгоритма
const runAlgo = document.getElementById('runAlgorithm');
runAlgo.addEventListener('click',function(event){
    runAlgo.disabled = true;
   
    newdata  = new Set(data.map(JSON.stringify));
    data = Array.from(newdata).map(JSON.parse);

    uniqueCentroids  = new Set(centroids.map(JSON.stringify));
    centroids = Array.from(uniqueCentroids).map(JSON.parse);
    
    let ClustersAmount = document.getElementById('ClustersAmount').value;
    // Валидация данных
    if(data.length===0){
        dropPopup('Установите точки на полях');
        runAlgo.disabled = false;
        return;
    }

    if( ClustersAmount<2){
        dropPopup('Минимальное количество кластеров : 2');
        runAlgo.disabled = false;
        return;
    }

    if(data.length<ClustersAmount){
        dropPopup('Количество кластеров превышает количество установленных точек');
        runAlgo.disabled = false;
        return;
    }

    drawGrid(firstctx);
    drawGrid(secondctx);
    drawGrid(thirdctx);

    reRunAlgo(data);
    executionflag = false;
// DBSCAN
    function dbscan(points,eps,minPts,value) {  
        const NOISE = 0;
        let C = 0;
       let visitedPoints = new Set();
       let clusteredPoints = new Set();
       let clusters = {[NOISE]:[]};
      // Функция для вычисления расстояний  
       function distance(pointA ,pointB,value){
        if(value==1){
        return Math.sqrt((pointA[0]-pointB[0])**2 +(pointA[1]-pointB[1])**2);
        }

        else if(value==2){
        return Math.abs(pointA[0]-pointB[0])+Math.abs(pointA[1]-pointB[1]);
        }

        else if (value==3){
        return Math.max(Math.abs(pointA[0]-pointB[0]),Math.abs(pointA[1]-pointB[1]))
        }
    }
    // Поиск соседей
        function regionQuery(point){
            return points.filter(currentNeighbor=>(
                distance(point,currentNeighbor,value)<eps && point!=currentNeighbor))
        }
        // Расширение кластеров
            function clusterExpand(point,neighbors){
            if(!(C in clusters)){
                clusters[C] = [];
            }
            clusters[C].push(point);

             let circleRadius;
            circleRadius = eps*cellSize;

            color = getRandomColor();
           animate(0,0.005,point[2],point[3],circleRadius/3,color+'01');

            clusteredPoints.add(point);

            while(neighbors.length>0){

                const currentNeighbor = neighbors.pop();

                if(!visitedPoints.has(currentNeighbor)){

                    const currentNeighborNeighbors = regionQuery(currentNeighbor);
                    visitedPoints.add(currentNeighbor);

                    if(currentNeighborNeighbors.length>=minPts){
                        neighbors.push(...currentNeighborNeighbors);
                    }
    
                    if(!clusteredPoints.has(currentNeighbor)){

                        clusteredPoints.add(currentNeighbor);
                        clusters[C].push(currentNeighbor);

                        animate(0,0.005,currentNeighbor[2],currentNeighbor[3],circleRadius/3,color+'01');

                        if(clusters[NOISE].includes(currentNeighbor)){
                            let index = clusters[NOISE].indexOf(currentNeighbor);
                            clusters[NOISE].splice(index,1);
                        }
                    }
                    
                }
                
            }
        }
        // Проходим по всем точкам
        for(const point of points){
            if(!visitedPoints.has(point)){
                const neighbors = regionQuery(point);
                if(neighbors.length<minPts){
                    clusters[NOISE].push(point);
                }
                else{
                    C++;
                    clusterExpand(point,neighbors);
                }
            }
        }
        setTimeout(()=>{
    
            for(point of clusters[0]){

                if(executionflag===true){
                    break;
                }
                secondctx.beginPath();
                secondctx.arc(point[2],point[3],4,0,Math.PI*2);
                secondctx.fillStyle = "#000";
                secondctx.fill();   
            }
        },'1000');
        return clusters;
    }
    //Получение параметров
    const epsilon = document.getElementById('epsilon').value;
    const neighborsAmount = document.getElementById('neighbors').value;
    const radioButtons = document.getElementsByName("distanceFormat");

    for(const radioButton of radioButtons){
        if(radioButton.checked){
            customerChoise = radioButton.value;
        }
    }

   const clustersDB = dbscan(data,epsilon,neighborsAmount,customerChoise);
    console.log(clustersDB);
// KMeans 
setTimeout(()=>{
function kMeansClustering(data, k, maxIterations = 100,centroids,value) {
    // Рандом центройды, если пользователь не поставил сам
    
        while (centroids.length!=k) {
        centroids.push(data[Math.floor(Math.random() * data.length)]);
        }
    
    // распределение точек
    let clusters = [];
    for (let i = 0; i < maxIterations; i++) {
    clusters = new Array(k).fill().map(() => []);
    // Вычисление расстояний
    function distance(pointA ,pointB,value){
        if(value==1){
        return Math.sqrt((pointA[0]-pointB[0])**2 +(pointA[1]-pointB[1])**2);
        }

        else if(value==2){
        return Math.abs(pointA[0]-pointB[0])+Math.abs(pointA[1]-pointB[1]);
        }

        else if (value==3){
        return Math.max(Math.abs(pointA[0]-pointB[0]),Math.abs(pointA[1]-pointB[1]))
        }
    }
    // Поиск ближайшего центройда
    function findNearestCentroid(point, centroids) {

        let nearestCentroidIndex = 0;
        let nearestDistance = distance(point, centroids[0],value);

        for (let i = 1; i < centroids.length; i++) {

            let dist = distance(point, centroids[i],value);
            if (dist < nearestDistance) {
                nearestDistance = dist;
                nearestCentroidIndex = i;
            }
        }

        return nearestCentroidIndex;
    }

    for (let point of data) {
        let nearestCentroidIndex = findNearestCentroid(point, centroids);
        clusters[nearestCentroidIndex].push(point);
    }
    
    // вычисление нового положения центройда
    let newCentroids = [];
    for (let cluster of clusters) {

        if (cluster.length > 0) {
            let centroid = calculateMean(cluster);
            newCentroids.push(centroid);
        } 
        else{
            newCentroids.push(centroids[newCentroids.length]);
        }
    }
    
    // Проверка критерия остановки
    if (centroids.toString() === newCentroids.toString()) {
        break;
    }
    
      centroids = newCentroids;
    }
    
      return clusters;
    }
    // Вычисления среднего для смены позиции центройда
    function calculateMean(cluster) {
    let dimensions = cluster[0].length;
    let sum = new Array(dimensions).fill(0);

    for (let point of cluster) {

    for (let i = 0; i < dimensions; i++) {
        sum[i] += point[i];
    }
    }
    return sum.map(val => val / cluster.length);
    }
    // Построение выпуклой оболочки по алгоритму Грэхема
    function convexHull(points) {
        points.sort(function(a, b) {
        return a[0] - b[0] || a[1] - b[1];
        });
        // Отбор Векторов
        function cross(a, b, c) {
        return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
        }
        
        let upper = [];
        for (let i = 0; i < points.length; i++) {

            while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0) {
            upper.pop();
        }

            upper.push(points[i]);
        }
        
        let lower = [];
        for (let i = points.length - 1; i >= 0; i--) {

            while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
            lower.pop();
            }
            lower.push(points[i]);
        }
        
        lower.pop();
        upper.pop();
        return upper.concat(lower);
        }
    // Отрисовка оболочки
    function drawConvexHull(clusterPoints,color) {
        if(executionflag===true){
            return;
        }

        let hull = convexHull(clusterPoints);

        firstctx.lineWidth = 2;
        firstctx.beginPath();
        firstctx.strokeStyle = color; 
        firstctx.moveTo(hull[0][2], hull[0][3]);

        for (let i = 1; i < hull.length; i++) {

        firstctx.strokeStyle = color;
        firstctx.lineTo(hull[i][2], hull[i][3]);

        }

        firstctx.closePath();
        firstctx.stroke();
        firstctx.fillStyle = color+'50';
        firstctx.fill();
    }
    
    

    let k = parseInt(document.getElementById('ClustersAmount').value);
    let clusters = kMeansClustering(data, k, 100 ,centroids,customerChoise);

    if(executionflag === true){
        return;
    }

    for (let clusterIndex = 0; clusterIndex < clusters.length; clusterIndex++) {

        let cluster = clusters[clusterIndex];
        let color = getRandomColor();

        if(cluster.length>1){
          drawConvexHull(cluster,color);
        }
        else{
            for(point of cluster){

                firstctx.beginPath();
                firstctx.arc(point[2],point[3],4,0,Math.PI*2);
                let color = getRandomColor();
                firstctx.fillStyle = color;
                firstctx.closePath();
                firstctx.fill();
            }
        }
    }
},"1000");

    // Иерархическая кластеризация
    function hierarchicalClustering(data, distanceFunction, linkageFunction) {
        let clusters = data.map(point => [point]);
        let k = parseInt(document.getElementById('ClustersAmount').value);
        while (clusters.length > k) {

            let distances = [];
            for (let i = 0; i < clusters.length; i++) {

                for (let j = i + 1; j < clusters.length; j++) {
                    const distance = distanceFunction(clusters[i], clusters[j]);
                    distances.push({ clusters: [i, j], distance: distance });
                }
            }

            let minDistance = Infinity;
            let closestClusters = [];

            for (let i = 0; i < distances.length; i++) {
                if (distances[i].distance < minDistance) {
                minDistance = distances[i].distance;
                closestClusters = distances[i].clusters;
                }
            }

            let mergedCluster = [];

            for (let clusterIndex of closestClusters) {
              mergedCluster = mergedCluster.concat(clusters[clusterIndex]);
            }

            clusters = clusters.filter((_, index) => !closestClusters.includes(index));
            clusters.push(mergedCluster);
            
            distances = distances.filter(distance => !closestClusters.includes(distance.clusters[0]) &&
            !closestClusters.includes(distance.clusters[1]));

            for (let i = 0; i < clusters.length - 1; i++) {
                const distance = linkageFunction(clusters[i], mergedCluster);
                distances.push({ clusters: [i, clusters.length - 1], distance: distance });
            }

        }
        
        return clusters;
        }
        // Функции для вычисления расстояния в зависимости от выбора пользователя
        let distanceFunction = (cluster1, cluster2) => {
            const centroid1 = cluster1.reduce((acc, val) => [acc[0] +
             val[0], acc[1] + val[1]], [0, 0]).map(val => val / cluster1.length);

            const centroid2 = cluster2.reduce((acc, val) => [acc[0] +
             val[0], acc[1] + val[1]], [0, 0]).map(val => val / cluster2.length);

            return Math.sqrt(Math.pow(centroid1[0] - centroid2[0], 2) +
             Math.pow(centroid1[1] - centroid2[1], 2));
        };

        if(customerChoise==2){
         distanceFunction = (cluster1, cluster2) => {
                const centroid1 = cluster1.reduce((acc, val) => [acc[0] +
                 val[0], acc[1] + val[1]], [0, 0]).map(val => val / cluster1.length);

                const centroid2 = cluster2.reduce((acc, val) => [acc[0] + val[0], acc[1] +
                 val[1]], [0, 0]).map(val => val / cluster2.length);

                return Math.abs(centroid1[0] - centroid2[0]) +
                 Math.abs(centroid1[1] - centroid2[1]);
            };
        }

        if(customerChoise==3){
         distanceFunction = (cluster1, cluster2) => {
                const centroid1 = cluster1.reduce((acc, val) => [acc[0] + val[0], acc[1] +
                 val[1]], [0, 0]).map(val => val / cluster1.length);

                const centroid2 = cluster2.reduce((acc, val) => [acc[0] + val[0], acc[1] +
                 val[1]], [0, 0]).map(val => val / cluster2.length);

                return Math.max(Math.abs(centroid1[0] -
                     centroid2[0]),Math.abs(centroid1[1] - centroid2[1]));
            };
        }

        const averageLinkage = (cluster1, cluster2) => {
            let sum = 0;

            for (let i = 0; i < cluster1.length; i++) {
                for (let j = 0; j < cluster2.length; j++) {
                    sum += distanceFunction([cluster1[i]], [cluster2[j]]);
                }
            }
            return sum / (cluster1.length * cluster2.length);
        };

        clusters = hierarchicalClustering(data, distanceFunction, averageLinkage);

        setTimeout(()=>{
            if(executionflag===true){
                return;
            }
            //Отрисовка кластеров
            for (let clusterIndex = 0; clusterIndex < clusters.length; clusterIndex++) {
                let cluster = clusters[clusterIndex];
                color = getRandomColor();

                for(point of cluster){
                    thirdctx.beginPath();
                    thirdctx.arc(point[2],point[3],6,0,Math.PI*2);
                    thirdctx.fillStyle = color;
                    thirdctx.fill();
                }
            }
        },'1000')

    setTimeout(()=>{
    runAlgo.disabled = false;
    },'1500');
    clearTimeout();
});
