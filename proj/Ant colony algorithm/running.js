import { countOfAnts,antSpeed,isActive } from "./globalSettings.js";
import { World } from "./World.js";

export let world = new World;
let showTime = 0;

export function Steps(){
	//Раз в 5 шагов муравьев изменяет феромоны
	if (showTime == 5){
		world.showPheromones();
		showTime = 0;
	}
	//Совершает ход каждым муравьем
	for(let i =0;i<countOfAnts;i++){
		world.ants[i].actionChoise(world);
	}
	//Если симуляция активна то продолжает шаги
	if(isActive){
		showTime++;
		setTimeout(Steps, antSpeed);
	}
	
}

