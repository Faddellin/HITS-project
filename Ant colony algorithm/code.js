mouseMode = "walls";
sizeOfImg = 0;
isMouseDown = false;
increaseReward = 11;
tracesCoefficient = 0;
antSpeed = 10;
midOfNest = 0;
countOfAnts = 10;
chanceToGoToPheromones = 4;
reducingRewardForBadPath = 3;
evaporationRate = 0.993;
maxCountOfPheromones = 20;
minCountOfPheromones = 0.1;
foodCosts = 1;
countOfFoodOnBase = 0;
nearCoefficient = 0.01;
isActive = 0;

class Ant {
	waysOfMove = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
	bringFood = 0;
	antColor = "green";
	way = new Set();

	constructor(location, direction) {
		this.location = location;
		this.direction = direction;
	}

	actionChoise(world){
		let goal,pheromones,antColor,isBase;
		if (this.bringFood == 0){
			goal = 'hasFood';
			pheromones = 'foodPheromones';
			antColor = 'greenyellow';
			isBase = 0;
		}
		else{
			goal = 'isNest';
			pheromones = 'nestPheromones';
			antColor = 'green';
			isBase = 1;
		}
		if(world.ceils[this.location][goal]){
			this.antColor = antColor;

			if(isBase == 0){
				this.bringFood = world.ceils[this.location][goal];
			}

			let answer = Array.from(this.way);
			world.bestWay = Math.min(world.bestWay,answer.length);

			for(let i = 0; i < answer.length; i++){

				world.ceils[answer[i]][pheromones] += this.bringFood*increaseReward*pow(world.bestWay/answer.length,reducingRewardForBadPath);

				for(let j = -1;j<=1;j++){
					for(let k = -1;k<=1;k++){
						let neighbourCeils = answer[i]+j+k*world.xLen;
						neighbourCeils = normalizeValue(neighbourCeils,world.xLen*world.yLen);
						if(!world.ceils[neighbourCeils].isNest && !world.ceils[neighbourCeils].hasFood){
							world.ceils[neighbourCeils][pheromones] += this.bringFood*increaseReward*nearCoefficient*pow(world.bestWay/answer.length,reducingRewardForBadPath);
						}
					}
				}

				if (world.ceils[answer[i]][pheromones] < minCountOfPheromones){
					world.ceils[answer[i]][pheromones] = minCountOfPheromones;
				}

			}

			if(isBase == 1){
				document.getElementById('countOfFoodO').textContent = "Количество доставленной еды: " + Math.floor(countOfFoodOnBase);
				countOfFoodOnBase += this.bringFood;
				this.bringFood = 0;
			}

			this.way.clear();
			return;
		}
		let newDirections = [];
		let steps = [];
		let sum = 0;
		for(let i =-1;i<2;i++){

			
			let direct = this.direction + i;

			direct = normalizeValue(direct,8);

			let newLocate = this.location+this.waysOfMove[direct][0]+this.waysOfMove[direct][1]*world.xLen;
			
			newLocate = normalizeValue(newLocate,world.xLen*world.xLen);
			
			if (!world.ceils[newLocate].isOccupied){

				sum+= pow(world.ceils[newLocate][pheromones],chanceToGoToPheromones);
				
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
		this.move(world,pheromones, newDirections, steps, sum);
	}

	move(world, pheromones, newDirections, steps, sum){
		let check = this.location;

		this.way.add(this.location);

		world.ceils[this.location].linkToObject.style.backgroundColor = world.ceils[this.location].bgColour;
		world.ceils[this.location].isOccupied = 0;

		let sumToRandom = 0, randomNum = Math.random();

		for (let i = 0; i < steps.length; i++) {

			sumToRandom += pow(world.ceils[steps[i]][pheromones],chanceToGoToPheromones) / sum;

			if (randomNum < sumToRandom) {

				if (pheromones == "foodPheromones"){
					world.ceils[this.location].nestPheromones = world.ceils[this.location].nestPheromones + 0.1 * tracesCoefficient;
				}else{
					world.ceils[this.location].foodPheromones = world.ceils[this.location].foodPheromones + 0.1 * tracesCoefficient;
				}

				this.location = steps[i];
				this.direction = newDirections[i];
				break;
			}
		}

		if (steps.length == 0){
			this.direction = (this.direction+1)%8;
		}

		world.ceils[this.location].linkToObject.style.backgroundColor = this.antColor;
		world.ceils[this.location].isOccupied = 1;
	}
}

class World{
	ceils = [];
	ants = [];
	bestWay = 99999;
	isWorldExist = 0;
	nestCord = 0;

	
	createWorld(xLen, yLen) {
		
		if(this.isWorldExist){
			this.clearMemory();
		}

		this.xLen = xLen;
		this.yLen = yLen;
		this.isWorldExist = 1;

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
					this.ceils[i].bgColour = "black";
					this.ceils[i].linkToObject.style.backgroundColor = "black";
					this.ceils[i].isOccupied = 1;
					this.ceils[i].isWall = 1;
				}
			});
			square.addEventListener('mousedown', () => {
				if (mouseMode == "walls"){
					this.ceils[i].bgColour = "black";
					this.ceils[i].linkToObject.style.backgroundColor = "black";
					this.ceils[i].isOccupied = 1;
					this.ceils[i].isWall = 1;
				}
				if (mouseMode == "nest"){
					this.createNest(i);
				}
				if (mouseMode == "food"){
					this.createFood(i,foodCosts);
				}
			});
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

		for(let lenX = -2;lenX<3;lenX++){
			for(let lenY = -2;lenY<3;lenY++){
				let coordinate = nestCord + lenX + lenY * this.xLen;
				if (coordinate < 0){
					coordinate = this.xLen*this.yLen + coordinate;
				}
				coordinate %= this.xLen*this.yLen;
				this.ceils[coordinate].bgColour = "yellow";
				this.ceils[coordinate].isNest = 1;
				this.ceils[coordinate].linkToObject.style.backgroundColor = "yellow";
			}
		}

	}
	createFood(food, cost){
		for(let lenX = -2;lenX<3;lenX++){
			for(let lenY = -2;lenY<3;lenY++){
				let coordinate = food + lenX + lenY*  this.xLen;
				if (coordinate < 0){
					coordinate = this.xLen*this.yLen + coordinate;
				}
				coordinate %= this.xLen*this.yLen;
				this.ceils[coordinate].bgColour = "grey";
				this.ceils[coordinate].hasFood = 1*cost;
				this.ceils[coordinate].linkToObject.style.backgroundColor = "grey";
			}
		}
	}
	showPheromones() {
		for(let i =0; i<this.xLen*this.yLen;i++){

			let tmpCeil = this.ceils[i];

			if (!tmpCeil.hasFood && !tmpCeil.isNest && !tmpCeil.isWall){
				tmpCeil.nestPheromones *= evaporationRate;
				tmpCeil.foodPheromones *= evaporationRate;
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
		this.bestWay = 99999;
	}
	startSimulation(){
		countOfFoodOnBase = 0;
		document.getElementById('countOfFoodO').textContent = "Количество доставленной еды: " + Math.floor(countOfFoodOnBase);
		this.bestWay = 9999;
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

world = new World;
world.createWorld(10, 10);

document.getElementById("MyButton").addEventListener('click', function() {
	if(!isActive){
		blockElements(0);
		document.getElementById("MyButton").textContent = "Прекратить симуляцию"
		isActive = 1;
		world.startSimulation();
		Steps(world);
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

	world.createWorld(sizeOfImg,sizeOfImg);
});

document.getElementById('foodCostsI').addEventListener('input', () => {
	document.getElementById('foodCostsO').textContent = "Ценность еды: " + document.getElementById('foodCostsI').value;
	foodCosts = document.getElementById('foodCostsI').value;
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

document.addEventListener('mousedown', () => {
	isMouseDown = true;
});

document.addEventListener('mouseup', () => {
	isMouseDown = false;
});
