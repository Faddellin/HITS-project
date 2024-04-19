import {pow,normalizeValue } from "./basicFunctions.js";
import { chanceToGoToPheromones,tracesCoefficient,increaseReward,reducingRewardForBadPath,countOfFoodOnBase,nearCoefficient } from "./globalSettings.js";

export class Ant {
	//Направления движения муравья в зависимости от его поворота
	waysOfMove = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
	curLenOfWay = 0;
	bringFood = 0;
	antColor = "green";
	way = new Set();

	constructor(location, direction) {
		this.location = location;
		this.direction = direction;
	}

	//функция выбора действия муравья
	//Поднять еду, идти в клетку с едой или идти в клетку в зависимости от феромонов
	actionChoise(world){
		let goal,pheromones,antColor, otherPheromoens;
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
		//Если муравей дошел до цели (еда/гнездо)
		if(world.ceils[this.location][goal]){
			this.antColor = antColor;

			//Если муравей искал еду, то подбирает
			if(goal == 'hasFood'){
				this.bringFood = world.ceils[this.location][goal];
			}

			//Считывает пройденные клетки и обновляет длину лучшего пути
			let answer = Array.from(this.way);
			world.updateBestWays(this.curLenOfWay);

			let coefficientOfWay = this.bringFood*increaseReward*pow(world.bestWay/this.curLenOfWay,reducingRewardForBadPath);
			this.curLenOfWay = 0;

			//Награждение пройденного пути муравьем феромонами
			for(let i = 0; i < answer.length; i++){

				world.ceils[answer[i]][pheromones] += coefficientOfWay;

				//Награждает вокруг пройденной клетки
				for(let j = -1;j<=1;j++){
					for(let k = -1;k<=1;k++){

						let neighbourCeils = answer[i]+j+k*world.xLen;
						neighbourCeils = normalizeValue(neighbourCeils,world.xLen*world.yLen);

						if(!world.ceils[neighbourCeils].isNest && !world.ceils[neighbourCeils].hasFood){
							world.ceils[neighbourCeils][pheromones] += nearCoefficient*coefficientOfWay;
						}
					}
				}

			}

			//Если муравей искал гнездо, то увеличивает количество еды в гнезде
			if(goal == 'isNest'){
				world.updateFood(this.bringFood);
				this.bringFood = 0;
			}

			//Разворачивает муравья на 180 градусов
			this.direction =  normalizeValue(this.direction + 4,8);

			this.way.clear();
			return;
		}
		//Создание переменных для рассчитывания шага муравья
		let pheromonesPriority = [];
		let newDirections = [];
		let steps = [];
		let sum = 0;
		for(let i =-1;i<2;i++){

			//Поворот муравья
			let direct = this.direction + i;
			direct = normalizeValue(direct,8);

			let newLocate = this.location+this.waysOfMove[direct][0]+this.waysOfMove[direct][1]*world.xLen;
			newLocate = normalizeValue(newLocate,world.xLen*world.xLen);
			
			//Идем в клетку если она свободна
			if (!world.ceils[newLocate].isOccupied){

				pheromonesPriority.push(pow(world.ceils[newLocate][pheromones],chanceToGoToPheromones));
				sum += pheromonesPriority[pheromonesPriority.length - 1];
				
				newDirections.push(direct);
				steps.push(newLocate);

				//Если клетка - это цель муравья, то он точно идет в нее
				if (world.ceils[newLocate][goal]){

					this.way.add(this.location);

					//Перемещаем муравья
					world.ceils[this.location].linkToObject.style.backgroundColor = world.ceils[this.location].bgColour;
					world.ceils[this.location].isOccupied = 0;
					this.location = newLocate;
					this.direction = direct;
					world.ceils[this.location].linkToObject.style.backgroundColor = this.antColor;
					world.ceils[this.location].isOccupied = 1;
					return;
				}
			}
		}
		//Передаем значения о клетках, в которые муравей может пойти
		// в функцию выбора клетки в зависимости от феромонов
		this.move(world,otherPheromoens, newDirections, steps, sum, pheromonesPriority);
	}

	move(world, otherPheromoens, newDirections, steps, sum, pheromonesPriority){

		//Если нет свободных клеток, то муравей вращается по часовой стрелке
		if (steps.length == 0){
			this.direction = (this.direction+1)%8;
			return;
		}

		this.way.add(this.location);
		world.ceils[this.location].linkToObject.style.backgroundColor = world.ceils[this.location].bgColour;
		world.ceils[this.location].isOccupied = 0;

		let sumToRandom = 0, randomNum = Math.random();

		for (let i = 0; i < steps.length; i++) {

			//Вероятности делятся на сумму вероятностей, чтобы получить значение от 0 до 1
			sumToRandom += pheromonesPriority[i] / sum;

			//Выбор клетки для шага
			if (randomNum < sumToRandom) {

				this.curLenOfWay++;

				//Уменьшение награды в зависимости от длины пути
				let coefficient = world.bestWay/this.curLenOfWay;

				//Награждение клетки феромоном противоположному тому, что ищет муравей
				world.ceils[this.location][otherPheromoens] += coefficient * tracesCoefficient;

				this.location = steps[i];
				this.direction = newDirections[i];

				break;
			}
		}

		world.ceils[this.location].linkToObject.style.backgroundColor = this.antColor;
		world.ceils[this.location].isOccupied = 1;
	}
}