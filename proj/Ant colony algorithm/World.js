import { Ceil } from "./Ceil.js";
import { isMouseDown,mouseMode,radiusOfDrawing,costOfFood,evaporationRate,isCircleDrawing,minCountOfPheromones,countOfAnts,maxCountOfPheromones } from "./globalSettings.js";
import { circleDrawing } from "./basicFunctions.js";
import {Ant} from "./ants.js";

export class World{
	countOfFoodOnBase = 0;
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
		this.bestWay = xLen*4;

		//Инициализация клеток мира
		for (let i = 0; i < xLen*yLen; i++) { 
			this.ceils.push(new Ceil);

			const square = document.createElement('div'); 
			square.classList.add('square');
			this.ceils[i].linkToObject = square;
			this.ceils[i].foodPheromones = minCountOfPheromones;
			this.ceils[i].nestPheromones = minCountOfPheromones;
			container.appendChild(square); 
			
			//Изменение клетки при проведении по ней нажатым курсором
			square.addEventListener('mouseenter', () => {

				if (isMouseDown && mouseMode == "walls"){

					//Функция изменения круга клуток вокруг нажатия
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
			//Изменение клетки при нажатии на нее
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
		//Функция делает длину лучшего пути динамичной
		if (newWay > this.bestWay*1.5){
			this.bestWay++;
		}else{
			if(newWay < this.bestWay){
				this.bestWay = newWay;
			}
		}
	}
	createNest(nestCord){
		this.nestCord = nestCord;
		//Очистка всех клеток мира от гнезда
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
		//Проход по всем клеткам, испарение феромонов и их отображение
		//Розовый - феромон гнезда
		//Голубой - феромон еды
		//Синий - оба
		for(let i =0; i<this.xLen*this.yLen;i++){

			let tmpCeil = this.ceils[i];

			if (!tmpCeil.hasFood && !tmpCeil.isNest && !tmpCeil.isWall){

				if(tmpCeil.nestPheromones> minCountOfPheromones){
					tmpCeil.nestPheromones *= evaporationRate;
				}
				if(tmpCeil.foodPheromones> minCountOfPheromones){
					tmpCeil.foodPheromones *= evaporationRate;
				}

				//Уменьшает оттенок красного и зеленого в зависимости от количества феромонов в клетке
				tmpCeil.bgColour= "rgb("+ (255 / maxCountOfPheromones) * (maxCountOfPheromones - this.ceils[i].foodPheromones) +","+ (255 / maxCountOfPheromones) * (maxCountOfPheromones - this.ceils[i].nestPheromones) +",255)";
				
				//Если в клетке нет муравья, то отображает феромоны
				if(!tmpCeil.isOccupied){
					tmpCeil.linkToObject.style.backgroundColor = this.ceils[i].bgColour;
				}
			}
		}
	}
	clearMemory() {
		//Удаляет все клетки мира
		let elements = document.querySelectorAll('.square');
		elements.forEach(element => {
			element.remove();
		});

		this.ceils = [];
		this.ants = [];
		this.bestWay = this.xLen*4;
	}
	prepareSimulation(){
		this.countOfFoodOnBase = 0;
		document.getElementById('countOfFoodO').textContent = "Количество доставленной еды: " + Math.floor(this.countOfFoodOnBase);

		this.bestWay = this.xLen*4;

		//Перед началом убирает с клеток всех муравьев и феромоны
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
		
		//Создание муравьев в центре гнезда
		for(let i =0; i<countOfAnts;i++){
			this.ants.push(new Ant(this.nestCord,Math.floor(Math.random() * 8)));
		}
	}
	updateFood(countOfFood){
		this.countOfFoodOnBase += countOfFood;
		document.getElementById('countOfFoodO').textContent = "Количество доставленной еды: " + Math.floor(this.countOfFoodOnBase);
	}
}