import { Matrix } from "./Matrix.js";
import { ReLU } from "./ReLu.js";
export class NetWork{
	layers;
	countOfNeuronsOnLevel;
	weights = [];
	biosMatrix = [];
	neuronsMatrix;
	neuronsErrorMatrix;

	init(layers,countOfNeuronsOnLevel){
		this.layers = layers;
		this.countOfNeuronsOnLevel = new Array(layers);
		for(let i =0;i<layers;i++){
			this.countOfNeuronsOnLevel[i] = countOfNeuronsOnLevel[i];
		}

		//Инициализация всех весов и нейронов
		for(let i =0;i<layers-1;i++){
			this.weights.push(new Matrix);
			this.weights[i].init(countOfNeuronsOnLevel[i+1],countOfNeuronsOnLevel[i]);
			this.biosMatrix.push(Array(countOfNeuronsOnLevel[i+1]));
			
			for(let j =0;j<countOfNeuronsOnLevel[i+1];j++){
				this.biosMatrix[i][j] = (Math.random() * 3)/(countOfNeuronsOnLevel[i] + 35); 
			}
		}
		this.neuronsMatrix = Array(layers);
		this.neuronsErrorMatrix = Array(layers);

		for(let i =0; i<layers;i++){
			this.neuronsMatrix[i] = Array(countOfNeuronsOnLevel[i]);
			this.neuronsErrorMatrix[i] = Array(countOfNeuronsOnLevel[i]);
		}

	}

	//Находит индекс с наибольшей вероятностью среди нейронов
	searchMaxIndex(values){
		let curMax = values[0];
		console.log(values);
		let prediction = 0;
		for(let i =1;i<this.countOfNeuronsOnLevel[this.layers-1];i++){
			if(values[i] > curMax){
				curMax = values[i];
				prediction = i;
			}
		}
		return prediction;
	}

	//Прямое распространение
	forwardFeed(){
		for(let i = 1;i<this.layers;++i){
			Matrix.multi(this.weights[i-1],this.neuronsMatrix[i-1],this.neuronsMatrix[i]);
			Matrix.sumVector(this.neuronsMatrix[i],this.biosMatrix[i-1]);
			ReLU.use(this.neuronsMatrix[i]);
			console.log(this.neuronsMatrix[i][0]);
		}
		return this.searchMaxIndex(this.neuronsMatrix[this.layers-1]);
	}

	//Считывает обученные веса и устанавливаент их
	readWeights(information){
		information = information.split(" ");
		let curIndex = 0;
		for(let k = 0;k<this.layers-1;k++){
			for (let i = 0; i < this.weights[k].row; ++i) {
				for (let j = 0; j < this.weights[k].col; ++j) {
					this.weights[k].matrix[i][j] = Number(information[curIndex]);
					curIndex++;
				}
			}
			curIndex++;
		}

		for (let i = 0; i < this.layers - 1; ++i) {
			for (let j = 0; j < this.countOfNeuronsOnLevel[i + 1]; ++j) {
				this.biosMatrix[i][j] = Number(information[curIndex]);
				curIndex++;
			}
		}

	}
	setImage(pixels){
		for(let i =0;i<pixels.length;i++){
			this.neuronsMatrix[0][i] = pixels[i].value;
		}

	}
	printAnswer(){
		let answer = this.forwardFeed()
		document.getElementById("zero").textContent = "0: " + this.neuronsMatrix[this.layers-1][0].toFixed(2);
		document.getElementById("one").textContent = "1: " + this.neuronsMatrix[this.layers-1][1].toFixed(2);
		document.getElementById("two").textContent = "2: " + this.neuronsMatrix[this.layers-1][2].toFixed(2);
		document.getElementById("three").textContent = "3: " + this.neuronsMatrix[this.layers-1][3].toFixed(2);
		document.getElementById("four").textContent = "4: " + this.neuronsMatrix[this.layers-1][4].toFixed(2);
		document.getElementById("five").textContent = "5: " + this.neuronsMatrix[this.layers-1][5].toFixed(2);
		document.getElementById("six").textContent = "6: " + this.neuronsMatrix[this.layers-1][6].toFixed(2);
		document.getElementById("seven").textContent = "7: " + this.neuronsMatrix[this.layers-1][7].toFixed(2);
		document.getElementById("eight").textContent = "8: " + this.neuronsMatrix[this.layers-1][8].toFixed(2);
		document.getElementById("nine").textContent = "9: " + this.neuronsMatrix[this.layers-1][9].toFixed(2);
		document.getElementById("answer").textContent = "Ответ: " + answer;
	}
}