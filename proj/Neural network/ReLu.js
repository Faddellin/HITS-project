export class ReLU{

	//Функция активации
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
}