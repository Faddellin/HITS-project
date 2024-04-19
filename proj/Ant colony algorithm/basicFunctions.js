export function pow(numToPow,degree){
	let answer = 1;
	for(;degree!=0;degree--){
		answer*=numToPow;
	}
	return answer;
}
//Нормирование значения относительно максимального значения
export function normalizeValue(meaning,size){
	if(meaning < 0){
		meaning = size+meaning;
	}
	return meaning%size;
}
export function circleDrawing( isCircle, ceils, radius, cord, xLen, yLen, needFunc){
	for(let xCord = -radius;xCord<radius+1;xCord++){
		for(let yCord = -radius;yCord<radius+1;yCord++){

			let coordinate = cord + xCord + yCord * xLen;
			
			if (coordinate < 0){
				coordinate = xLen * yLen + coordinate;
			}
			coordinate %= xLen * yLen;

			if(isCircle && Math.abs(xCord)+Math.abs(yCord)>radius){
				continue;
			}
			needFunc(ceils[coordinate]);

		}
	}
}
//Блокировка элементов, не нужных во время симуляции
export function blockElements(isBlock){
	if(!isBlock){
		document.getElementById('CreateNest').disabled=true;
		document.getElementById('antCountI').disabled=true;
		document.getElementById('worldSizeI').disabled=true;
	}else{
		document.getElementById('CreateNest').disabled=false;
		document.getElementById('antCountI').disabled=false;
		document.getElementById('worldSizeI').disabled=false;
	}
}
// Отображение всплывающего окна
export function dropPopup(popupText)
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