import { pow,blockElements,dropPopup } from "./basicFunctions.js";
import { world,Steps } from "./running.js";

export const maxCountOfPheromones = 30;
export const minCountOfPheromones = 0.1;
export let mouseMode = "walls";
export let isMouseDown = false;
export let sizeOfImg = 200;
export let increaseReward = 5;
export let tracesCoefficient = 0.05;
export let antSpeed = 10;
export let countOfAnts = 500;
export let chanceToGoToPheromones = 2;
export let reducingRewardForBadPath = 4;
export let evaporationRate = 0.999;
export let countOfFoodOnBase = 0;
export let nearCoefficient = 0.5;
export let midOfNest = 0;
export let costOfFood = 1;
export let isActive = 0;
export let radiusOfDrawing = 6;
export let isCircleDrawing = 0;

document.getElementById("MyButton").addEventListener('click', function() {
	if(world.nestCord == -1){
		dropPopup("Невозможно начать симуляцию без гнезда");
		return;
	}
	//Если симуляция была активна, то останавливаем ее, если нет то запускаем
	if(!isActive){
		blockElements(0);
		document.getElementById("MyButton").textContent = "Прекратить симуляцию"
		isActive = 1;
		world.prepareSimulation();
		Steps(0);
	}else{
		blockElements(1);
		document.getElementById("MyButton").textContent = "Начать симуляцию"
		isActive = 0;
	}
	
});

document.getElementById('worldSizeI').addEventListener('input', () => {
	document.getElementById('worldSizeO').textContent = "Размер: " + document.getElementById('worldSizeI').value;
	sizeOfImg = document.getElementById('worldSizeI').value;

	document.querySelector('.container').style.gridTemplateColumns = 'repeat('+ sizeOfImg + ', 4px)';
	document.querySelector('.container').style.gridTemplateRows = 'repeat('+ sizeOfImg + ', 4px)';
	//Центрирование мира разных размеров
	document.querySelector('.container').style.transform = 'translate(' + -sizeOfImg*2 + 'px, ' + (500-sizeOfImg*2) + 'px)';

	world.createWorld(sizeOfImg,sizeOfImg);
});

document.getElementById('increaseRewardI').addEventListener('input', () => {
	document.getElementById('increaseRewardO').textContent = "Увеличить награду в: " + document.getElementById('increaseRewardI').value;
	increaseReward = document.getElementById('increaseRewardI').value;
});

document.getElementById('pheromoneEffectI').addEventListener('input', () => {
	document.getElementById('pheromoneEffectO').textContent = "Приоритет феромонов: " + document.getElementById('pheromoneEffectI').value;
	chanceToGoToPheromones = document.getElementById('pheromoneEffectI').value;
});

document.getElementById('rewardForBadPathI').addEventListener('input', () => {
	document.getElementById('rewardForBadPathO').textContent = "Приоритет хороших путей: " + document.getElementById('rewardForBadPathI').value;
	reducingRewardForBadPath = document.getElementById('rewardForBadPathI').value;
});

document.getElementById('nearCoefficientI').addEventListener('input', () => {
	document.getElementById('nearCoefficientO').textContent = "Награждать вокруг: " + document.getElementById('nearCoefficientI').value;
	nearCoefficient = document.getElementById('nearCoefficientI').value;
});

document.getElementById('wayCoefficientI').addEventListener('input', () => {
	document.getElementById('wayCoefficientO').textContent = "Награда за передвижение: " + document.getElementById('wayCoefficientI').value;
	tracesCoefficient = document.getElementById('wayCoefficientI').value;
});

document.getElementById('radiusOfBuildingsI').addEventListener('input', () => {
	document.getElementById('radiusOfBuildingsO').textContent = "Радиус построек: " + document.getElementById('radiusOfBuildingsI').value;
	radiusOfDrawing = document.getElementById('radiusOfBuildingsI').value - 1;
});

document.getElementById('evaporationSpeedI').addEventListener('input', () => {
	document.getElementById('evaporationSpeedO').textContent = "Скорость испарения: " + document.getElementById('evaporationSpeedI').value;
	//Задание скорости испарения и возведение в степень равной количеству пропускаемых ходов, функции showPheromones
	evaporationRate = pow(document.getElementById('evaporationSpeedI').value,5);
});

document.getElementById('foodCostsI').addEventListener('input', () => {
	document.getElementById('foodCostsO').textContent = "Ценность еды: " + document.getElementById('foodCostsI').value;
	costOfFood = document.getElementById('foodCostsI').value;
});

document.getElementById('antsSpeedI').addEventListener('input', () => {
	document.getElementById('antsSpeedO').textContent = "Скорость муравьев: " + document.getElementById('antsSpeedI').value;
	antSpeed = document.getElementById('antsSpeedI').value;
});

document.getElementById('antCountI').addEventListener('input', () => {
	document.getElementById('antCountO').textContent = "Количество муравьев: " + document.getElementById('antCountI').value;
	countOfAnts = document.getElementById('antCountI').value;
});

document.getElementById('isCircleI').addEventListener('change', () => {
	if (document.getElementById('isCircleI').checked) {
		isCircleDrawing = 1;
	} else {
		isCircleDrawing = 0;
	}

});

document.getElementById('CreateFood').addEventListener('click', function() {
	mouseMode = "food";
});

document.getElementById('CreateNest').addEventListener('click', function() {
	mouseMode = "nest";
});

document.getElementById('CreateWalls').addEventListener('click', function() {
	mouseMode = "walls";
});

document.addEventListener('mousedown', () => {
	isMouseDown = true;
});

document.addEventListener('mouseup', () => {
	isMouseDown = false;
});