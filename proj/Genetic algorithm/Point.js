import { ctx } from "./globalSettings.js";
export class Point{
	constructor(x,y,colour,radius){
		this.x = x;
		this.y = y;
		this.colour = colour;
		this.radius = radius;

		//Рисует точку на канвасе при ее инициализации
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.fillStyle = colour;
		ctx.fill();
	}
	static distBetweenPoints(pointOne,pointTwo){
		return Math.sqrt((pointOne.x-pointTwo.x) * (pointOne.x-pointTwo.x) + (pointOne.y-pointTwo.y) * (pointOne.y-pointTwo.y));
	}
}