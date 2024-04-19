export class Matrix{
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
	
	//Умноежение матриц
	static multi(matrix1,neuron1,c){
		for(let i =0;i<matrix1.row;++i){
			let tmp = 0;
			for(let j =0;j<matrix1.col;++j){
				tmp+= matrix1.matrix[i][j] * neuron1[j];
			}
			c[i] = tmp;
		}
	}

	//Сумма векторов
	static sumVector(vector1,vector2){
		for(let i =0;i<vector1.length;i++){
			vector1[i] += vector2[i];
		}
	}
}