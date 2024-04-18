let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let points = [];
let numberOfIterations = 50000;
let createAbility = 1;
let populationLen = 500;
let pointsRadius = 5;
let linesWidth = 3;
let isAlgorithmWork = 0;

// Отображение всплывающего окна
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

class Line{
	constructor(pointOne,pointTwo){
		this.pointOne = pointOne;
		this.pointTwo = pointTwo;
		this.k = (pointTwo.y - pointOne.y)/(pointTwo.x - pointOne.x);
		if(this.k == Number.NEGATIVE_INFINITY){
			this.k = Number.POSITIVE_INFINITY;
		}
		this.b = pointOne.y - (this.k * pointOne.x);
	}
	static crossTwoLines(lineOne,lineTwo){
		if(lineOne.k != lineTwo.k){

			let newX; let newY;

			if(lineOne.k == Number.POSITIVE_INFINITY){
				newX = lineOne.pointOne.x;
				newY = lineTwo.k * newX + lineTwo.b;
			}else if(lineTwo.k == Number.POSITIVE_INFINITY){
				newX = lineTwo.pointOne.x;
				newY = lineOne.k * newX + lineOne.b;
			}else{
				newX = (lineTwo.b - lineOne.b)/(lineOne.k - lineTwo.k);
				newX = newX.toFixed(3);
				newY = lineOne.k * newX + lineOne.b;
				newY = newY.toFixed(3);
			}

			if(((lineOne.pointOne.x + 0.01 <= newX && newX <= lineOne.pointTwo.x - 0.01) || (lineOne.pointTwo.x + 0.01 <= newX && newX <= lineOne.pointOne.x - 0.01)) 
			&& ((lineOne.pointOne.y + 0.01 <= newY && newY <= lineOne.pointTwo.y - 0.01) || (lineOne.pointTwo.y + 0.01 <= newY && newY <= lineOne.pointOne.y - 0.01))
			&& ((lineTwo.pointOne.x + 0.01 <= newX && newX <= lineTwo.pointTwo.x - 0.01) || (lineTwo.pointTwo.x + 0.01 <= newX && newX <= lineTwo.pointOne.x - 0.01)) 
			&& ((lineTwo.pointOne.y + 0.01 <= newY && newY <= lineTwo.pointTwo.y - 0.01) || (lineTwo.pointTwo.y + 0.01 <= newY && newY <= lineTwo.pointOne.y - 0.01))){

				return 1;

			}
		}
		return 0;
		
	}
	static fixIntersections(pointsI){
		console.log("пересечения убраны");
		let maxDepth = 0;
		let flag = true;
		while(flag && maxDepth < 500){
			flag = false;
			let lines = [];
			for(let i =0;i<pointsI.length-1;i++){
				lines.push(new Line(points[pointsI[i]],points[pointsI[i+1]]));
			}
			for(let i =0;i<lines.length-1;i++){
				for(let j = i+1;j<lines.length;j++){
					if(Line.crossTwoLines(lines[i],lines[j])){
						reverseArr(pointsI,i+1,j);
						flag = true;
					}
				}
			}
			maxDepth++;
		}
		return;
	}
}

class Point{
	constructor(x,y,colour,radius){
		this.x = x;
		this.y = y;
		this.colour = colour;
		this.radius = radius;

		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.fillStyle = colour;
		ctx.fill();
	}
}

class Gene{
	constructor(newGen,len){
		this.gens = newGen;
		this.lenOfGene = len;
	}
}

function reverseArr(arr,from,to){
	for(let i = from, j = to ; i<(to+from)/2 ; i++,j--){
		let tmp = arr[i];
		arr[i] = arr[j];
		arr[j] = tmp;
	}
}

function randomNum(from,to){
	return Math.floor(Math.random()*(to-from)) + from;
}

function mutation(curGen,countOfMutations){
	while (countOfMutations >= 0) {

		let rand = randomNum(1, curGen.length-1);
		let rand1 = randomNum(1, curGen.length-1);

		if (rand != rand1) {
			let temp = curGen[rand];
			curGen[rand] = curGen[rand1];
			curGen[rand1] = temp;
			countOfMutations--;
		}
	}
	return curGen;
}

function createGen(maxLen)
{
	numbers = [];
	for(let i =1;i<maxLen;i++){
		numbers.push(i);
	}
	
	newNumbers = [0];
	for(let i =maxLen-1;i>0;i--){
		let hz = randomNum(0,i);
		newNumbers.push(numbers[hz]);
		numbers.splice(hz,1);
	}
	newNumbers.push(0);
	return newNumbers;
}

function distBetweenPoints(pointOne,pointTwo){
	return Math.sqrt((pointOne.x-pointTwo.x) * (pointOne.x-pointTwo.x) + (pointOne.y-pointTwo.y) * (pointOne.y-pointTwo.y));
}

function calculateDist(arr){
	distantion = 0;
	for(let i =0;i<arr.length-1;i++){
		distantion += distBetweenPoints(points[arr[i]],points[arr[i+1]]);
	}
	return distantion;
}

function drawLines(arr){
	ctx.clearRect(0,0,800,800);
	for(let i =0;i<arr.length-1;i++){
		newPoint = new Point(points[arr[i]].x, points[arr[i]].y,'red',pointsRadius);
	}
	ctx.beginPath();
	ctx.moveTo(points[arr[0]].x,points[arr[0]].y);
	for(let i =1;i<arr.length;i++){
		ctx.lineTo(points[arr[i]].x,points[arr[i]].y);
		ctx.lineWidth = linesWidth;
		ctx.stroke();
	}
}

function cloneArr(arr){
	newArr = [];
	for(let i = 0;i<arr.length;i++){
		newArr.push(arr[i]);
	}
	return newArr;
}

function crossing(firstArr,secondArr){
	newArr = [0];
	checkForRepeat = new Set();
	let begin = Math.floor(Math.random()*(firstArr.length-2));

	for(let i = 0;i<firstArr.length-2;i++){
		let index = 1 + (begin+i)%(firstArr.length-2);

		if(i<(firstArr.length-2)/2){
			newArr.push(firstArr[index]);
			checkForRepeat.add(firstArr[index]);
		}else{
			if(!checkForRepeat.has(secondArr[index])){
				newArr.push(secondArr[index]);
				checkForRepeat.add(secondArr[index]);
			}
		}
	}

	for(let i =Math.floor((firstArr.length-2)/2);newArr.length != firstArr.length-1;i++){
		let index = 1 + (begin+i)%(firstArr.length-2);

		if(!checkForRepeat.has(firstArr[index])){
			newArr.push(firstArr[index]);
			
		}
	}
	newArr.push(0);

	return newArr;

}

function joinTwoPopulations(firstPopulation, secondPopulation){
	newPopulation = [];
	firstPopIndex = 0;
	secondPopIndex = 0;
	for(let i =0;i<firstPopulation.length;i++){
		if (firstPopulation[firstPopIndex].lenOfGene < secondPopulation[secondPopIndex].lenOfGene && i < firstPopulation.length/10){
			newPopulation.push(firstPopulation[firstPopIndex]);
			firstPopIndex++;
		}else{
			newPopulation.push(secondPopulation[secondPopIndex]);
			secondPopIndex++;
		}
	}
	return newPopulation;
}

function nextStep(genNumber,curBestWay,population,timer) {
	if (genNumber <= numberOfIterations && isAlgorithmWork) {
		
		newPopulation = [];

		for (let i = 0; i < populationLen; i++) {

			let index1 = randomNum(0,population.length);
			let index2 = randomNum(0,population.length);

			temp = new Gene;
			temp.gens = crossing(population[index1].gens,population[index2].gens);
			temp.lenOfGene = calculateDist(temp.gens);
			newPopulation.push(temp);

			temp2 = new Gene;
			temp2.gens = crossing(population[index2].gens,population[index1].gens);
			temp2.lenOfGene = calculateDist(temp2.gens);
			newPopulation.push(temp2);

			

		}
		
		newPopulation.sort((gen1, gen2) => gen1['lenOfGene'] > gen2['lenOfGene'] ? 1 : -1);
		population = joinTwoPopulations(population,newPopulation);
		console.log("ff");

		if(curBestWay.lenOfGene == population[0].lenOfGene){
			timer++;
		}else{
			timer = 1;
		}
		if (timer == 10){
			Line.fixIntersections(population[0].gens);
			console.log("aaaaa");
			population[0].lenOfGene = calculateDist(population[0].gens);
		}
		if (timer % 100 == 0){
			
				
			if(timer == 300){
				timer = 0;
				for(let i =1;i<population.length;i++){
					population[i].gens = mutation(population[i].gens,population[i].gens.length/2);
					population[i].lenOfGene = calculateDist(population[i].gens);
				}
			}
		}

		if (genNumber%300 == 0){
			//Line.fixIntersections(population[0].gens);
			//console.log("aaaaa");
			//population[0].lenOfGene = calculateDist(population[0].gens);
			for(let i =1;i<population.length;i++){
				population[i].gens = mutation(population[i].gens,population[i].gens.length/8);
				population[i].lenOfGene = calculateDist(population[i].gens);
			}
		}
		
		if(curBestWay.lenOfGene != population[0].lenOfGene){

			curBestWay.gens = cloneArr(population[0].gens);
			curBestWay.lenOfGene = population[0].lenOfGene;
			drawLines(curBestWay.gens);
			document.getElementById('wayLenO').textContent = "Текущая длина пути: " + curBestWay.lenOfGene.toFixed(3);
		}
		

		genNumber++;

		setTimeout(function(){
			nextStep(genNumber,curBestWay,population,timer);}
			,1);
		
	}
}  

function geneticAlgoritmh(){
	curBestWay = new Gene([],999999); 

	population = [];	

	for(let i =0; i<populationLen;i++){
		temp = new Gene;
		temp.gens = createGen(points.length);
		temp.lenOfGene = calculateDist(temp.gens);
		population.push(temp);
		if(population[i].lenOfGene < curBestWay.lenOfGene){
			temp = new Gene;
			temp.gens = cloneArr(population[i].gens);
			temp.lenOfGene = population[i].lenOfGene;
			curBestWay = temp;
		}
		
	}
	population.sort((gen1, gen2) => gen1['lenOfGene'] > gen2['lenOfGene'] ? 1 : -1);
	drawLines(population[0].gens);
	document.getElementById('wayLenO').textContent = "Текущая длина пути: " + population[0].lenOfGene.toFixed(3);
	nextStep(1,curBestWay,population,0);

}


function blockElements(){
	if (isAlgorithmWork){
		document.getElementById('clearButton').disabled=true;
		createAbility = 0;
	}else{
		document.getElementById('clearButton').disabled=false;
		createAbility = 1;
	}
}

canvas.addEventListener('click', function(event) {
	if(createAbility){
		newPoint = new Point(event.offsetX, event.offsetY,'red',pointsRadius);
		points.push(newPoint);
		document.getElementById('countOfPoints').textContent = "Количество точек: " + points.length;
	}else{
		dropPopup('Прекратите поиск для создания новых точек');
	}
	
	
});
document.getElementById("myButton").addEventListener('click',function(){
	if(points.length < 3){
		dropPopup('Минимальное количество точек - 3');
		return;
	}
	if(!isAlgorithmWork){
		isAlgorithmWork = 1;
		blockElements();
		geneticAlgoritmh();
		document.getElementById("myButton").textContent = "Прекратить поиск";
	}else{
		isAlgorithmWork = 0;
		blockElements();
		document.getElementById("myButton").textContent = "Начать поиск";
	}
});
document.getElementById("clearButton").addEventListener('click', function(){
	document.getElementById('wayLenO').textContent = "Текущая длина пути: ?";
	document.getElementById('countOfPoints').textContent = "Количество точек: ?";
	points = [];
	ctx.clearRect(0, 0, 500, 500);
});

document.getElementById('pointsRadiusI').addEventListener('input', () => {
	document.getElementById('pointsRadiusO').textContent = "Радиус точек: " + document.getElementById('pointsRadiusI').value;
	pointsRadius = document.getElementById('pointsRadiusI').value;
});

document.getElementById('linesWidthI').addEventListener('input', () => {
	document.getElementById('linesWidthO').textContent = "Ширина линий: " + document.getElementById('linesWidthI').value;
	linesWidth = document.getElementById('linesWidthI').value;
});