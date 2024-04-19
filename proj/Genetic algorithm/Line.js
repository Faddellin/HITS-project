import { reverseArr } from "./basicFunctions.js";
import { points } from "./globalSettings.js";

export class Line{
	constructor(pointOne,pointTwo){
		this.pointOne = pointOne;
		this.pointTwo = pointTwo;
		
		//Рассчитывает коэффициенты для формулы прямой
		this.k = (pointTwo.y - pointOne.y)/(pointTwo.x - pointOne.x);
		if(this.k == Number.NEGATIVE_INFINITY){
			this.k = Number.POSITIVE_INFINITY;
		}
		this.b = pointOne.y - (this.k * pointOne.x);
	}
	static crossTwoLines(lineOne,lineTwo){

		//Если линии не параллельны то ищет пересечение
		if(lineOne.k != lineTwo.k){

			let newX; let newY;

			//Если коеффициент k = inf, то есть прямая вертикальна, то
			// уравнение меняет свой вид на x = number
			if(lineOne.k == Number.POSITIVE_INFINITY){
				newX = lineOne.pointOne.x;
				newY = lineTwo.k * newX + lineTwo.b;
			}else if(lineTwo.k == Number.POSITIVE_INFINITY){
				newX = lineTwo.pointOne.x;
				newY = lineOne.k * newX + lineOne.b;
			}else{
				//Если линии не вертикальны, то обычным способом находит пересечение
				newX = (lineTwo.b - lineOne.b)/(lineOne.k - lineTwo.k);
				newX = newX.toFixed(3);
				newY = lineOne.k * newX + lineOne.b;
				newY = newY.toFixed(3);
			}
			//Проверяет находится ли точка на пересечении двух линий ВНУТРИ этих линий, а не на их продолжении
			if(((lineOne.pointOne.x + 0.01 <= newX && newX <= lineOne.pointTwo.x - 0.01) || (lineOne.pointTwo.x + 0.01 <= newX && newX <= lineOne.pointOne.x - 0.01)) 
			&& ((lineOne.pointOne.y + 0.01 <= newY && newY <= lineOne.pointTwo.y - 0.01) || (lineOne.pointTwo.y + 0.01 <= newY && newY <= lineOne.pointOne.y - 0.01))
			&& ((lineTwo.pointOne.x + 0.01 <= newX && newX <= lineTwo.pointTwo.x - 0.01) || (lineTwo.pointTwo.x + 0.01 <= newX && newX <= lineTwo.pointOne.x - 0.01)) 
			&& ((lineTwo.pointOne.y + 0.01 <= newY && newY <= lineTwo.pointTwo.y - 0.01) || (lineTwo.pointTwo.y + 0.01 <= newY && newY <= lineTwo.pointOne.y - 0.01))){

				return 1;

			}
		}
		return 0;
		
	}
	//Функция устранения пересечений прямых
	static fixIntersections(pointsI){
		let maxDepth = 0;
		let flag = true;
		while(flag && maxDepth < 500){
			flag = false;
			let lines = [];

			//Создание прямых из точек
			for(let i =0;i<pointsI.length-1;i++){
				lines.push(new Line(points[pointsI[i]],points[pointsI[i+1]]));
			}

			//Проверка всех прямых на пересечение, если пересекаются, то узел раскручивается
			// и поиск узлов продолжается, если узлов нет, то функция остановит работу
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