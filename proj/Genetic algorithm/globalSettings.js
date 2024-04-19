import { geneticAlgoritmh } from "./running.js";
import { Point } from "./Point.js";

export let points = [];
export let canvas = document.getElementById("myCanvas");
export let ctx = canvas.getContext("2d");
export let numberOfIterations = 50000;
export let createAbility = 1;
export let populationLen = 500;
export let pointsRadius = 5;
export let linesWidth = 3;
export let isAlgorithmWork = 0;

canvas.addEventListener('click', function(event) {
	if(createAbility){
		console.log("fdfdfdfd");
		points.push(new Point(event.offsetX, event.offsetY,'red',pointsRadius));
		document.getElementById('countOfPoints').textContent = "Количество точек: " + points.length;
	}else{
		dropPopup('Прекратите поиск для создания новых точек');
	}
	
	
});

document.getElementById("myButton").addEventListener('click',function(){
	if(points.length < 3){
		dropPopup('Минимальное количество точек - 3');
		return;
	}
	if(!isAlgorithmWork){
		isAlgorithmWork = 1;
		document.getElementById('clearButton').disabled=true;
		createAbility = 0;
		geneticAlgoritmh();
		document.getElementById("myButton").textContent = "Прекратить поиск";
	}else{
		isAlgorithmWork = 0;
		document.getElementById('clearButton').disabled=false;
		createAbility = 1;
		document.getElementById("myButton").textContent = "Начать поиск";
	}
});

document.getElementById("clearButton").addEventListener('click', function(){
	document.getElementById('wayLenO').textContent = "Текущая длина пути: ?";
	document.getElementById('countOfPoints').textContent = "Количество точек: ?";
	points = [];
	ctx.clearRect(0, 0, 500, 500);
});

document.getElementById('pointsRadiusI').addEventListener('input', () => {
	document.getElementById('pointsRadiusO').textContent = "Радиус точек: " + document.getElementById('pointsRadiusI').value;
	pointsRadius = document.getElementById('pointsRadiusI').value;
});

document.getElementById('linesWidthI').addEventListener('input', () => {
	document.getElementById('linesWidthO').textContent = "Ширина линий: " + document.getElementById('linesWidthI').value;
	linesWidth = document.getElementById('linesWidthI').value;
});

// Отображение всплывающего окна
function dropPopup(popupText)
{
    let popup = document.getElementById("popup");
    let popupContent = document.getElementById("popupText");
    popupContent.textContent = popupText;
    popup.style.display = "block";
    setTimeout(function() {
        popup.classList.add("fadeOut");
        setTimeout(function() {
            popup.style.display = "none";
            popup.classList.remove("fadeOut");
        }, 500)
    }, 3500);

    document.querySelector(".closePopup").addEventListener("click", function() {
        document.getElementById("popup").style.display = "none";
    });
}