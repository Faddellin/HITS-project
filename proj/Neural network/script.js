import { weights } from "./weights.js";
let isMouseDown = false;
let mouseMode = "draw";

class Ceil{
	linkToObject;
}

class NetWork{
	layers;
	countOfNeuronsOnLevel;
	weights = [];
	biosMatrix = [];
	neuronsMatrix;
	neuronsErrorMatrix;
	neuronsBios = [];

	init(layers,countOfNeuronsOnLevel){
		this.layers = layers;
		this.countOfNeuronsOnLevel = new Array(layers);
		for(let i =0;i<layers;i++){
			this.countOfNeuronsOnLevel[i] = countOfNeuronsOnLevel[i];
		}

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

		for(let i =0;i<layers;i++){
			this.neuronsBios.push(1);
		}
	}
	printConfig(){
		console.log("********************************************");
		console.log("Network has " + this.layers + " layers");
		console.log(this.countOfNeuronsOnLevel)
		console.log("********************************************");
	}
	setInputToNeurons(values){
		for(let i =0;i<this.countOfNeuronsOnLevel[0];i++){
			this.neuronsMatrix[0][i] = values[i];
		}
	}
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
	forwardFeed(){
		for(let i = 1;i<this.layers;++i){
			Matrix.multi(this.weights[i-1],this.neuronsMatrix[i-1],this.neuronsMatrix[i]);
			Matrix.sumVector(this.neuronsMatrix[i],this.biosMatrix[i-1]);
			ReLU.use(this.neuronsMatrix[i]);
			console.log(this.neuronsMatrix[i][0]);
		}
		return this.searchMaxIndex(this.neuronsMatrix[this.layers-1]);
	}
	printValues(layer){
		console.log(this.neuronsMatrix[layer]);
	}
	backPropogation(expectedNumber){
		for (let i = 0; i < this.countOfNeuronsOnLevel[this.layers-1]; i++) {
			if (i != expectedNumber){
				this.neuronsErrorMatrix[this.layers-1][i] = -this.neuronsMatrix[this.layers-1][i] * ReLU.useDer(this.neuronsMatrix[this.layers-1][i],'double');
			}else{
				this.neuronsErrorMatrix[this.layers-1][i] = (1.0 - this.neuronsMatrix[this.layers-1][i]) * ReLU.useDer(this.neuronsMatrix[this.layers-1][i],'double');
			}
		}
		for (let k = this.layers - 2; k > 0; k--) {
			Matrix.multiT(this.weights[k], this.neuronsErrorMatrix[k + 1], this.countOfNeuronsOnLevel[k + 1], this.neuronsErrorMatrix[k]);
			for (let j = 0; j < size[k]; j++){
				this.neuronsErrorMatrix[k][j] *= ReLU.useDer(this.neuronsMatrix[k][j]);
			}
		}
	}
	weightsUpdater(learningRate) {
		for (let i = 0; i < this.layers - 1; i++) {
			for (let j = 0; j < this.countOfNeuronsOnLevel[i + 1]; j++) {
				for (let k = 0; k < this.countOfNeuronsOnLevel[i]; k++) {
					this.weights[i].matrix[j][k] += this.neuronsMatrix[i][k] * this.neuronsErrorMatrix[i + 1][j] * learningRate;
				}
			}
		}
		for (let i = 0; i < this.layers - 1; i++) {
			for (let k = 0; k < this.countOfNeuronsOnLevel[i + 1]; k++) {
				this.biosMatrix[i][k] += this.neuronsErrorMatrix[i + 1][k] * learningRate;
			}
		}
	}
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
			this.neuronsMatrix[0][i] = Number(pixels[i]);
		}

		console.log();
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

class Matrix{
	matrix;
	row;
	col;

	init(row,col){
		this.row = row;
		this.col = col;
		this.matrix = new Array(row);
		for(let i =0; i<row;i++){
			this.matrix[i] = new Array(col);
			for(let j =0; j<col;j++){
				this.matrix[i][j] = (Math.random() * 3)/(row + 35); 
			}
		}
	}
	static multi(matrix1,neuron1,c){
		if(matrix1.col != neuron1.length){
			console.log("Error Multi func")
		}
		for(let i =0;i<matrix1.row;++i){
			let tmp = 0;
			for(let j =0;j<matrix1.col;++j){
				tmp+= matrix1.matrix[i][j] * neuron1[j];
			}
			c[i] = tmp;
		}
	}
	static multiT(matrix1,neuron1,c){
		if(matrix1.row != neuron1.length){
			console.log("Error MultiT func")
		}
		for(let i =0;i<matrix1.col;++i){
			let tmp = 0;
			for(let j =0;j<matrix1.row;++j){
				tmp+= matrix1.matrix[j][i] * neuron1[j];
			}
			c[i] = tmp;
		}
	}
	static sumVector(vector1,vector2){
		for(let i =0;i<vector1.length;i++){
			vector1[i] += vector2[i];
		}
	}
}

class ReLU{
	static use(vector){
		for(let i =0;i<vector.length;i++){
			if(vector[i] < 0){
				vector[i] *= 0.01;
			}else{
				if(vector[i] > 1){
					vector[i] = 1 + 0.01*(vector[i] - 1);
				}
			}
		}
	}
	static useDer(vector, typeOfWork){
		switch(typeOfWork){
			case 'vector':
				for(let i =0;i<vector.length;i++){
					if(vector[i] > 1 || vector[i]<0){
						vector[i] = 0.01;
					}else{
						vector[i] = 1;
					}
				}
				break;
			case 'double':
				if(vector > 1 || vector<0){
					vector = 0.01;
				}else{
					vector = 1;
				}
				break;
		}
		
	}
}

function circleDrawing( ceils, radius, cord, xLen, yLen, needFunc){
	for(let xCord = -radius;xCord<radius+1;xCord++){
		for(let yCord = -radius;yCord<radius+1;yCord++){

			let coordinate = cord + xCord + yCord * xLen;
			
			if (coordinate < 0){
				coordinate = xLen * yLen + coordinate;
			}
			coordinate %= xLen * yLen;

			if(Math.abs(xCord)+Math.abs(yCord)>radius ){
				continue;
			}
			
			needFunc(ceils[coordinate],(radius-1.5)/(Math.abs(xCord)+Math.abs(yCord)),coordinate);

		}
	}
}

let netWork = new NetWork();
netWork.init(3,[2500,300,10]);
netWork.readWeights(weights);


let ceils = [];
let image = [];
for (let i = 0; i < 50*50; i++) { 
	image.push(0);
	ceils.push(new Ceil);
	
	const square = document.createElement('div'); 
	square.classList.add('square');
	ceils[i].linkToObject = square;
	container.appendChild(square); 
	
	square.addEventListener('mouseenter', () => {

		if (isMouseDown){
			if(mouseMode == "draw"){
				circleDrawing(ceils, 3, i, 50, 50, function(ceil,pressForce,coordinate){
				
					if(image[coordinate]  + pressForce>=1){
						ceil.linkToObject.style.backgroundColor = "black";
						image[coordinate] = 1;
					}else{
						image[coordinate] += pressForce;
						let colour = 255 - 255*image[coordinate];
						ceil.linkToObject.style.backgroundColor = "rgb("+colour+","+colour+","+colour+")";
					}
				});
			}else{
				circleDrawing(ceils, 3, i, 50, 50, function(ceil,pressForce,coordinate){
				
					ceil.linkToObject.style.backgroundColor = "white";
					image[coordinate] = 0;

				});
			}
			

		}
	});
	square.addEventListener('mousedown', () => {


		if(mouseMode == "draw"){
			circleDrawing(ceils, 3, i, 50, 50, function(ceil,pressForce,coordinate){
			
				if(image[coordinate]  + pressForce>=1){
					ceil.linkToObject.style.backgroundColor = "black";
					image[coordinate] = 1;
				}else{
					image[coordinate] += pressForce;
					let colour = 255 - 255*image[coordinate];
					ceil.linkToObject.style.backgroundColor = "rgb("+colour+","+colour+","+colour+")";
				}
			});
		}else{
			circleDrawing(ceils, 3, i, 50, 50, function(ceil,pressForce,coordinate){
			
				ceil.linkToObject.style.backgroundColor = "white";
				image[coordinate] = 0;
				
			});
		}

	});
} 

document.addEventListener('mousedown', () => {
	isMouseDown = true;
});

document.addEventListener('mouseup', () => {
	isMouseDown = false;
});
document.getElementById("fileButton").addEventListener('click', function(){

	netWork.setImage(image);
	netWork.printAnswer();
	
});
document.getElementById("clearButton").addEventListener('click', function(){

	for(let i=0;i<image.length;i++){
		image[i]=0;
	}
	for(let i=0;i<ceils.length;i++){
		ceils[i].linkToObject.style.backgroundColor = "white";
	}
	
});

document.getElementById("mouseMode").addEventListener('click', function(){

	if(mouseMode == "draw"){
		document.getElementById("mouseMode").textContent = "Режим карандаша";
		mouseMode = "rubber";
	}else{
		document.getElementById("mouseMode").textContent = "Режим ластика";
		mouseMode = "draw";
	}
	
});
