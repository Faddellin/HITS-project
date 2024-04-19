import { populationLen,points } from "./globalSettings.js";
import { Gene } from "./Gene.js";
import { Line } from "./Line.js";
import { randomNum,cloneArr,drawLines } from "./basicFunctions.js";
export class Population{
	population = [];
	curBestGene = new Gene;
	timer;

	generatePopulation(){
		//Очистка прошлой популяции
		this.population = [];
		this.curBestGene = new Gene(points.length);
		this.timer = 0;

		//Создание новой популяции
		for(let i =0; i<populationLen;i++){
			let temp = new Gene(points.length);
			temp.calculateDist(temp.gens);
			this.population.push(temp);
			if(this.population[i].lenOfGene < this.curBestGene.lenOfGene){
				let temp = new Gene;
				temp.gens = cloneArr(population[i].gens);
				temp.lenOfGene = population[i].lenOfGene;
				this.curBestGene = temp;
			}
			
		}
		//Сортировка для нахождения лучших особей
		this.population.sort((gen1, gen2) => gen1['lenOfGene'] > gen2['lenOfGene'] ? 1 : -1);
	}
	populationStep(genNumber){

		//Создание новой популяции путем кроссинговера родителей прошлой популяции
		let newPopulation = [];
		for (let i = 0; i < populationLen; i++) {
			
			let index1 = randomNum(0,this.population.length);
			let index2 = randomNum(0,this.population.length);

			let temp1 = new Gene;
			temp1.gens = Gene.crossing(this.population[index1].gens,this.population[index2].gens);
			temp1.calculateDist();
			newPopulation.push(temp1);
			
			let temp2 = new Gene;
			temp2.gens = Gene.crossing(this.population[index2].gens,this.population[index1].gens);
			temp2.calculateDist();
			newPopulation.push(temp2);
		}
		//Сортировка новой популяции
		newPopulation.sort((gen1, gen2) => gen1['lenOfGene'] > gen2['lenOfGene'] ? 1 : -1);

		//Объединение лучших особей обеих популяций и части плохих для разнообразия
		this.population = Population.joinTwoPopulations(this.population,newPopulation);

		//Если лучший путь не изменился увеличиваю timer
		if(this.curBestGene.lenOfGene == this.population[0].lenOfGene){
			this.timer++;
		}else{
			this.timer = 0;
		}

		//Если timer достиг 10, то алгоритм проверяет путь на узлы и убирает их
		if (this.timer == 10){
			Line.fixIntersections(this.population[0].gens);
			this.population[0].calculateDist();
		}

		//Если timer достиг 300, то алгоритм производит сильную мутацию
		if(this.timer == 300){
			this.timer = 0;
			for(let i =1;i<this.population.length;i++){
				this.population[i].gens = Gene.mutation(this.population[i].gens,this.population[i].gens.length/2);
				this.population[i].calculateDist();
			}
		}

		//Раз в 300 поколений алгоритм производит небольшие мутации
		if (genNumber%300 == 0){
			for(let i =1;i<this.population.length;i++){
				this.population[i].gens = Gene.mutation(this.population[i].gens,this.population[i].gens.length/8);
				this.population[i].calculateDist();
			}
		}
		
		//Присваиваю переменной лучшего гена лучшую особь данной популяции
		if(this.curBestGene.lenOfGene != this.population[0].lenOfGene){

			this.curBestGene.gens = cloneArr(this.population[0].gens);
			this.curBestGene.lenOfGene = this.population[0].lenOfGene;
			drawLines(this.curBestGene.gens);
			document.getElementById('wayLenO').textContent = "Текущая длина пути: " + this.curBestGene.lenOfGene.toFixed(3);
		}
		
	}
	static joinTwoPopulations(firstPopulation, secondPopulation){
		let newPopulation = [];
		let firstPopIndex = 0;
		let secondPopIndex = 0;

		//Алгоритм создает новую популяцию из 10% лучших особей старой и новой популяции
		// и 90% особей новой популяции
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
	
}