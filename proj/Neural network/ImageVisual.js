import { brushRadius,isMouseDown,mouseMode } from "./globalSettings.js";
import { circleDrawing } from "./basicFunctions.js";

class Ceil{
	linkToObject;
	value = 0;
}
export class Image{
	ceils = [];
	init(size){
		
		//Создание контейнера с пикселями
		for (let i = 0; i < size*size; i++) { 
			this.ceils.push(new Ceil);
			
			const square = document.createElement('div'); 
			square.classList.add('square');
			this.ceils[i].linkToObject = square;
			container.appendChild(square); 
			
			square.addEventListener('mouseenter', () => {
		
				if (isMouseDown){
					if(mouseMode == "draw"){
						circleDrawing(this.ceils, brushRadius, i, size, size, function(ceil,pressForce,coordinate){
							if(ceil.value  + pressForce>=1){
								ceil.linkToObject.style.backgroundColor = "black";
								ceil.value = 1;
							}else{
								ceil.value += pressForce;
								let colour = 255 - 255*ceil.value;
								ceil.linkToObject.style.backgroundColor = "rgb("+colour+","+colour+","+colour+")";
							}
						});
					}else{
						circleDrawing(this.ceils, brushRadius, i, size, size, function(ceil,pressForce,coordinate){
						
							ceil.linkToObject.style.backgroundColor = "white";
							ceil.value = 0;
		
						});
					}
					
		
				}
			});
			square.addEventListener('mousedown', () => {
		
		
				if(mouseMode == "draw"){
					circleDrawing(this.ceils, brushRadius, i, size, size, function(ceil,pressForce,coordinate){
					
						if(ceil.value  + pressForce>=1){
							ceil.linkToObject.style.backgroundColor = "black";
							ceil.value = 1;
						}else{
							ceil.value += pressForce;
							let colour = 255 - 255*ceil.value;
							ceil.linkToObject.style.backgroundColor = "rgb("+colour+","+colour+","+colour+")";
						}
					});
				}else{
					circleDrawing(this.ceils, brushRadius, i, size, size, function(ceil,pressForce,coordinate){
					
						ceil.linkToObject.style.backgroundColor = "white";
						ceil.value = 0;
						
					});
				}
		
			});
		}
	} 
}
