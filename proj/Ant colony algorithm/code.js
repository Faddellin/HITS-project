mouseMode = "walls";
sizeOfImg = 0;
isMouseDown = false;

increaseReward = 4;
tracesCoefficient = 2;
antSpeed = 10;
countOfAnts = 10;
chanceToGoToPheromones = 4;
reducingRewardForBadPath = 4;
evaporationRate = 0.995;
maxCountOfPheromones = 30;
minCountOfPheromones = 0.01;
countOfFoodOnBase = 0;
nearCoefficient = 0.3;

midOfNest = 0;
costOfFood = 1;
isActive = 0;
radiusOfDrawing = 2;
isCircleDrawing = 0;

class Ant {
	waysOfMove = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
	curLenOfWay = 0;
	bringFood = 0;
	antColor = "green";
	way = new Set();

	constructor(location, direction) {
		this.location = location;
		this.direction = direction;
	}

	actionChoise(world){
		let goal,pheromones,antColor,isBase, otherPheromoens;
		if (this.bringFood == 0){
			goal = 'hasFood';
			pheromones = 'foodPheromones';
			otherPheromoens = 'nestPheromones';
			antColor = 'greenyellow';
		}
		else{
			goal = 'isNest';
			pheromones = 'nestPheromones';
			otherPheromoens = 'foodPheromones';
			antColor = 'green';
		}
		if(world.ceils[this.location][goal]){
			this.antColor = antColor;

			if(goal == 'hasFood'){
				this.bringFood = world.ceils[this.location][goal];
			}

			let answer = Array.from(this.way);
			world.updateBestWays(answer.length);

			this.curLenOfWay = 0;

			let coefficientOfWay = pow(Math.min(world.bestWay)/answer.length,reducingRewardForBadPath);
			for(let i = 0; i < answer.length; i++){

				world.ceils[answer[i]][pheromones] += this.bringFood*increaseReward*coefficientOfWay;

				for(let j = -1;j<=1;j++){
					for(let k = -1;k<=1;k++){
						let neighbourCeils = answer[i]+j+k*world.xLen;
						neighbourCeils = normalizeValue(neighbourCeils,world.xLen*world.yLen);
						if(!world.ceils[neighbourCeils].isNest && !world.ceils[neighbourCeils].hasFood){
							world.ceils[neighbourCeils][pheromones] += this.bringFood*increaseReward*nearCoefficient*coefficientOfWay;
						}
					}
				}

			}

			if(goal == 'isNest'){
				countOfFoodOnBase += this.bringFood;
				document.getElementById('countOfFoodO').textContent = "Количество доставленной еды: " + Math.floor(countOfFoodOnBase);
				this.bringFood = 0;
			}

			this.way.clear();
			return;
		}
		let pheromonesPriority = [];
		let newDirections = [];
		let steps = [];
		let sum = 0;
		for(let i =-1;i<2;i++){

			
			let direct = this.direction + i;

			direct = normalizeValue(direct,8);

			let newLocate = this.location+this.waysOfMove[direct][0]+this.waysOfMove[direct][1]*world.xLen;
			
			newLocate = normalizeValue(newLocate,world.xLen*world.xLen);
			
			if (!world.ceils[newLocate].isOccupied){

				pheromonesPriority.push(pow(world.ceils[newLocate][pheromones],chanceToGoToPheromones));
				sum += pheromonesPriority[pheromonesPriority.length - 1];
				
				newDirections.push(direct);
				steps.push(newLocate);

			}

			if (world.ceils[newLocate][goal]){

				this.way.add(this.location);

				world.ceils[this.location].linkToObject.style.backgroundColor = world.ceils[this.location].bgColour;
				world.ceils[this.location].isOccupied = 0;
				this.location = newLocate;
				this.direction = direct;
				world.ceils[this.location].linkToObject.style.backgroundColor = this.antColor;
				world.ceils[this.location].isOccupied = 1;
				return;
			}
		}

		this.move(world,otherPheromoens, newDirections, steps, sum, pheromonesPriority);
	}

	move(world, otherPheromoens, newDirections, steps, sum, pheromonesPriority){

		if (steps.length == 0){
			this.direction = (this.direction+1)%8;
			return;
		}

		this.way.add(this.location);

		world.ceils[this.location].linkToObject.style.backgroundColor = world.ceils[this.location].bgColour;
		world.ceils[this.location].isOccupied = 0;

		let sumToRandom = 0, randomNum = Math.random();

		for (let i = 0; i < steps.length; i++) {

			sumToRandom += pheromonesPriority[i] / sum;

			if (randomNum < sumToRandom) {

				this.curLenOfWay++;

				let mnozitel = world.bestWay/this.curLenOfWay;

				world.ceils[this.location][otherPheromoens] = world.ceils[this.location][otherPheromoens] + mnozitel * tracesCoefficient;

				this.location = steps[i];
				this.direction = newDirections[i];

				break;
			}
		}

		world.ceils[this.location].linkToObject.style.backgroundColor = this.antColor;
		world.ceils[this.location].isOccupied = 1;
	}
}

class World{
	ceils = [];
	ants = [];
	isWorldExist = 0;
	nestCord = -1;
	
	createWorld(xLen, yLen) {
		
		if(this.isWorldExist){
			this.clearMemory();
		}

		this.xLen = xLen;
		this.yLen = yLen;
		this.isWorldExist = 1;
		this.nestCord = -1;
		this.bestWay = xLen;

		for (let i = 0; i < xLen*yLen; i++) { 
			this.ceils.push(new Ceil);

			const square = document.createElement('div'); 
			square.classList.add('square');
			this.ceils[i].linkToObject = square;
			this.ceils[i].foodPheromones = minCountOfPheromones;
			this.ceils[i].nestPheromones = minCountOfPheromones;
			container.appendChild(square); 
			
			square.addEventListener('mouseenter', () => {

				if (isMouseDown && mouseMode == "walls"){

					circleDrawing( isCircleDrawing, this.ceils, radiusOfDrawing, i, this.xLen, this.yLen, function(ceil){
						ceil.isNest = 0;
						ceil.hasFood = 0;
						ceil.bgColour = "black";
						ceil.linkToObject.style.backgroundColor = "black";
						ceil.isOccupied = 1;
						ceil.isWall = 1;
					});

				}
			});
			square.addEventListener('mousedown', () => {

				if (mouseMode == "walls"){

					circleDrawing( isCircleDrawing, this.ceils, radiusOfDrawing, i, this.xLen, this.yLen, function(ceil){
						ceil.isNest = 0;
						ceil.hasFood = 0;
						ceil.bgColour = "black";
						ceil.linkToObject.style.backgroundColor = "black";
						ceil.isOccupied = 1;
						ceil.isWall = 1;
					});

				}
				if (mouseMode == "nest"){

					this.createNest(i);
				}
				if (mouseMode == "food"){

					circleDrawing( isCircleDrawing, this.ceils, radiusOfDrawing, i, this.xLen, this.yLen, function(ceil){
						ceil.hasFood = 1*costOfFood;
						ceil.isWall = 0;
						ceil.isOccupied = 0;
						ceil.bgColour = "grey";
						ceil.isNest = 0;
						ceil.linkToObject.style.backgroundColor = "grey";
					});

				}
			});
		} 
	}
	updateBestWays(newWay){
		if (newWay > this.bestWay*2){
			this.bestWay++;
		}else{
			if(newWay < this.bestWay){
				this.bestWay = newWay;
			}
		}
	}
	createNest(nestCord){
		this.nestCord = nestCord;
		for(let i = 0;i<this.ceils.length;i++){

			if (this.ceils[i].isNest){
				this.ceils[i].bgColour = "white";
				this.ceils[i].isNest = 0;
				this.ceils[i].linkToObject.style.backgroundColor = "white";
			}
		}
		circleDrawing( isCircleDrawing, this.ceils, radiusOfDrawing, nestCord, this.xLen, this.yLen, function(ceil){
			ceil.hasFood = 0;
			ceil.isWall = 0;
			ceil.isOccupied = 0;
			ceil.bgColour = "yellow";
			ceil.isNest = 1;
			ceil.linkToObject.style.backgroundColor = "yellow";
		});
		

	}
	showPheromones() {
		for(let i =0; i<this.xLen*this.yLen;i++){

			let tmpCeil = this.ceils[i];

			if (!tmpCeil.hasFood && !tmpCeil.isNest && !tmpCeil.isWall){

				if(tmpCeil.nestPheromones> minCountOfPheromones){
					tmpCeil.nestPheromones *= evaporationRate;
				}
				if(tmpCeil.foodPheromones> minCountOfPheromones){
					tmpCeil.foodPheromones *= evaporationRate;
				}

				tmpCeil.bgColour= "rgb("+ (255 / maxCountOfPheromones) * (maxCountOfPheromones - this.ceils[i].foodPheromones) +","+ (255 / maxCountOfPheromones) * (maxCountOfPheromones - this.ceils[i].nestPheromones) +",255)";
				if(!tmpCeil.isOccupied){
					tmpCeil.linkToObject.style.backgroundColor = this.ceils[i].bgColour;
				}
			}
		}
	}
	clearMemory() {
		let elements = document.querySelectorAll('.square');

		elements.forEach(element => {
			element.remove();
		});

		this.ceils = [];
		this.ants = [];
		this.bestWay = this.xLen;
	}
	startSimulation(){
		countOfFoodOnBase = 0;
		document.getElementById('countOfFoodO').textContent = "Количество доставленной еды: " + Math.floor(countOfFoodOnBase);
		this.bestWay = this.xLen;
		for(let i =0; i<this.xLen*this.yLen;i++){

			let tmpCeil = this.ceils[i];

			if(!tmpCeil.isWall && !tmpCeil.hasFood && !tmpCeil.isNest){
				tmpCeil.bgColour = "white";
			}
			if(!tmpCeil.isWall){
				tmpCeil.isOccupied = 0;
			}
			tmpCeil.foodPheromones = minCountOfPheromones;
			tmpCeil.nestPheromones = minCountOfPheromones;
			tmpCeil.linkToObject.style.backgroundColor = tmpCeil.bgColour;
		}
		this.ants = [];
		for(let i =0; i<countOfAnts;i++){
			this.ants.push(new Ant(this.nestCord,Math.floor(Math.random() * 8)));
		}
	}
}
class Ceil{
	hasFood = 0;
	foodPheromones = 0;
	nestPheromones = 0;
	isOccupied = 0;
	isWall = 0;
	isNest = 0;
	bgColour = "white";
	linkToObject;
}

function circleDrawing( isCircle, ceils, radius, cord, xLen, yLen, needFunc){
	for(let xCord = -radius;xCord<radius+1;xCord++){
		for(let yCord = -radius;yCord<radius+1;yCord++){

			let coordinate = cord + xCord + yCord * xLen;
			
			if (coordinate < 0){
				coordinate = xLen * yLen + coordinate;
			}
			coordinate %= xLen * yLen;

			if(isCircle && Math.abs(xCord)+Math.abs(yCord)>radius){
				continue;
			}
			needFunc(ceils[coordinate]);

		}
	}
}

function normalizeValue(meaning,size){
	if(meaning < 0){
		meaning = size+meaning;
	}
	return meaning%size;
}


function Steps(){

	world.showPheromones();
	
	for(let i =0;i<countOfAnts;i++){
		world.ants[i].actionChoise(world);
	}
	if(isActive){
		setTimeout(Steps, antSpeed);
	}
	
}

function pow(numToPow,degree){
	answer = 1;
	for(;degree!=0;degree--){
		answer*=numToPow;
	}
	return answer;
}
function changeMouseMode(mode){
	mouseMode = mode;
}

function blockElements(isBlock){
	if(!isBlock){
		document.getElementById('CreateNest').disabled=true;
		document.getElementById('antCountI').disabled=true;
		document.getElementById('worldSizeI').disabled=true;
	}else{
		document.getElementById('CreateNest').disabled=false;
		document.getElementById('antCountI').disabled=false;
		document.getElementById('worldSizeI').disabled=false;
	}
}

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

world = new World;

document.getElementById("MyButton").addEventListener('click', function() {
	if(world.nestCord == -1){
		dropPopup("Невозможно начать симуляцию без гнезда");
		return;
	}
	if(!isActive){
		blockElements(0);
		document.getElementById("MyButton").textContent = "Прекратить симуляцию"
		isActive = 1;
		world.startSimulation();
		Steps(0);
	}else{
		blockElements(1);
		document.getElementById("MyButton").textContent = "Начать симуляцию"
		isActive = 0;
		
	}
	
});
document.getElementById('CreateFood').addEventListener('click', function() {
	changeMouseMode("food");
});
document.getElementById('CreateNest').addEventListener('click', function() {
	changeMouseMode("nest");
});
document.getElementById('CreateWalls').addEventListener('click', function() {
	changeMouseMode("walls");
});

document.getElementById('antsSpeedI').addEventListener('input', () => {
	document.getElementById('antsSpeedO').textContent = "Скорость муравьев: " + document.getElementById('antsSpeedI').value;
	antSpeed = document.getElementById('antsSpeedI').value;
});

document.getElementById('worldSizeI').addEventListener('input', () => {
	document.getElementById('worldSizeO').textContent = "Размер: " + document.getElementById('worldSizeI').value;
	sizeOfImg = document.getElementById('worldSizeI').value;

	document.querySelector('.container').style.gridTemplateColumns = 'repeat('+ sizeOfImg + ', 4px)';
	document.querySelector('.container').style.gridTemplateRows = 'repeat('+ sizeOfImg + ', 4px)';
	document.querySelector('.container').style.transform = 'translate(' + -sizeOfImg*2 + 'px, ' + (500-sizeOfImg*2) + 'px)';

	world.createWorld(sizeOfImg,sizeOfImg);
});

document.getElementById('foodCostsI').addEventListener('input', () => {
	document.getElementById('foodCostsO').textContent = "Ценность еды: " + document.getElementById('foodCostsI').value;
	costOfFood = document.getElementById('foodCostsI').value;
});

document.getElementById('antCountI').addEventListener('input', () => {
	document.getElementById('antCountO').textContent = "Количество муравьев: " + document.getElementById('antCountI').value;
	countOfAnts = document.getElementById('antCountI').value;
});

document.getElementById('evaporationSpeedI').addEventListener('input', () => {
	document.getElementById('evaporationSpeedO').textContent = "Скорость испарения: " + document.getElementById('evaporationSpeedI').value;
	evaporationRate = document.getElementById('evaporationSpeedI').value;
});

document.getElementById('increaseRewardI').addEventListener('input', () => {
	document.getElementById('increaseRewardO').textContent = "Увеличить награду в: " + document.getElementById('increaseRewardI').value;
	increaseReward = document.getElementById('increaseRewardI').value;
});

document.getElementById('pheromoneEffectI').addEventListener('input', () => {
	document.getElementById('pheromoneEffectO').textContent = "Приоритет феромонов: " + document.getElementById('pheromoneEffectI').value;
	chanceToGoToPheromones = document.getElementById('pheromoneEffectI').value;
});

document.getElementById('rewardForBadPathI').addEventListener('input', () => {
	document.getElementById('rewardForBadPathO').textContent = "Приоритет хороших путей: " + document.getElementById('rewardForBadPathI').value;
	reducingRewardForBadPath = document.getElementById('rewardForBadPathI').value;
});

document.getElementById('nearCoefficientI').addEventListener('input', () => {
	document.getElementById('nearCoefficientO').textContent = "Награждать вокруг: " + document.getElementById('nearCoefficientI').value;
	nearCoefficient = document.getElementById('nearCoefficientI').value;
});

document.getElementById('radiusOfBuildingsI').addEventListener('input', () => {
	document.getElementById('radiusOfBuildingsO').textContent = "Радиус построек: " + document.getElementById('radiusOfBuildingsI').value;
	radiusOfDrawing = document.getElementById('radiusOfBuildingsI').value - 1;
});

document.getElementById('isCircleI').addEventListener('change', () => {
	if (document.getElementById('isCircleI').checked) {
		isCircleDrawing = 1;
	} else {
		isCircleDrawing = 0;
	}

});

document.addEventListener('mousedown', () => {
	isMouseDown = true;
});

document.addEventListener('mouseup', () => {
	isMouseDown = false;
});
