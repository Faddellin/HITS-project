import { Population } from "./Population.js";
import { isAlgorithmWork, numberOfIterations } from "./globalSettings.js";

let genNumber = 0;
let MainPopulation = new Population();

export function geneticAlgoritmh(){

	MainPopulation.generatePopulation();
	algoritmhSteps();

}
function algoritmhSteps(){
	if(genNumber != numberOfIterations && isAlgorithmWork){
		MainPopulation.populationStep(genNumber);
		genNumber++;
		setTimeout(algoritmhSteps,1);
	}
}

