import { Point } from "./Point.js";
import { points } from "./globalSettings.js";
import { randomNum } from "./basicFunctions.js";

export class Gene{
	constructor(len){

		this.gens = [];
		this.lenOfGene = len;

		//Заполнение массива индексов
		let numbers = [];
		for(let i =1;i<len;i++){
			numbers.push(i);
		}

		//Первое значение гена всегда начальная точка - 0
		this.gens = [0];

		//Выбирает рандомный индекс и удаляет его из массива number
		// чтобы индексы не повторялись
		for(let i =len-1;i>0;i--){
			let hz = randomNum(0,i);
			this.gens.push(numbers[hz]);
			numbers.splice(hz,1);
		}

		//Последнее значение гена всегда начальная точка - 0
		this.gens.push(0);
	}
	
	static mutation(curGen,countOfMutations){

		//Производит countOfMutations раз смену двух индексов гена местами
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
	static crossing(firstGen,secondGen){
		let newArr = [0];
		let checkForRepeat = new Set();

		//Начальный индекс для кроссинговера половины генов каждого из родителей
		let begin = Math.floor(Math.random()*(firstGen.length-2));

		//Создает новый ген из половины первого гена, и оставшихся, еще не задействованных
		// элементов второго гена
		for(let i = 0;i<firstGen.length-2;i++){
			let index = 1 + (begin+i)%(firstGen.length-2);
	
			if(i<(firstGen.length-2)/2){
				newArr.push(firstGen[index]);
				checkForRepeat.add(firstGen[index]);
			}else{
				if(!checkForRepeat.has(secondGen[index])){
					newArr.push(secondGen[index]);
					checkForRepeat.add(secondGen[index]);
				}
			}
		}
		
		//Добавляет оставшиеся элементы первого гена в случае повторений
		for(let i =Math.floor((firstGen.length-2)/2);newArr.length != firstGen.length-1;i++){
			let index = 1 + (begin+i)%(firstGen.length-2);
			if(!checkForRepeat.has(firstGen[index])){
				newArr.push(firstGen[index]);
				
			}
		}
		newArr.push(0);
		return newArr;
	
	}
	//Рассчитывает расстояние между всеми точками для текущего гена
	calculateDist(){
		let distantion = 0;
		for(let i =0;i<this.gens.length-1;i++){
			distantion += Point.distBetweenPoints(points[this.gens[i]],points[this.gens[i+1]]);
		}
		this.lenOfGene = distantion;
	}
}