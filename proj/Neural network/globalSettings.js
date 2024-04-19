import { image,netWork } from "./script.js";

export let isMouseDown = false;
export let mouseMode = "draw";
export let brushRadius = 3;
export let brushSharpness = 0.3;

document.addEventListener('mousedown', () => {
	isMouseDown = true;
});

document.addEventListener('mouseup', () => {
	isMouseDown = false;
});

document.getElementById("fileButton").addEventListener('click', function(){
	
	//Установка весов изображения и вывод ответа
	netWork.setImage(image.ceils);
	netWork.printAnswer();
	
});

document.getElementById("clearButton").addEventListener('click', function(){

	for(let i=0;i<image.ceils.length;i++){
		image.ceils[i].value=0;
	}
	for(let i=0;i<image.ceils.length;i++){
		image.ceils[i].linkToObject.style.backgroundColor = "white";
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

document.getElementById("brushSize").addEventListener('click', function(){

	brushRadius = document.getElementById('brushSize').value;
	
});

document.getElementById("brushSharp").addEventListener('click', function(){

	brushSharpness = document.getElementById('brushSharp').value;
	
});