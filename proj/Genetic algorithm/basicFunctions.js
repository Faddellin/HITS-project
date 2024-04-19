import { points,ctx,pointsRadius,linesWidth } from "./globalSettings.js";
import { Point } from "./Point.js";

//Функция инвертирует путь от определенного индекса до определенного
export function reverseArr(arr,from,to){
	for(let i = from, j = to ; i<(to+from)/2 ; i++,j--){
		let tmp = arr[i];
		arr[i] = arr[j];
		arr[j] = tmp;
	}
}

export function randomNum(from,to){
	return Math.floor(Math.random()*(to-from)) + from;
}

export function cloneArr(arr){
	let newArr = [];
	for(let i = 0;i<arr.length;i++){
		newArr.push(arr[i]);
	}
	return newArr;
}

//Отрисовка пути
export function drawLines(arr){
	ctx.clearRect(0,0,800,800);
	for(let i =0;i<arr.length-1;i++){
		let newPoint = new Point(points[arr[i]].x, points[arr[i]].y,'red',pointsRadius);
	}
	ctx.beginPath();
	ctx.moveTo(points[arr[0]].x,points[arr[0]].y);
	for(let i =1;i<arr.length;i++){
		ctx.lineTo(points[arr[i]].x,points[arr[i]].y);
		ctx.lineWidth = linesWidth;
		ctx.stroke();
	}
}