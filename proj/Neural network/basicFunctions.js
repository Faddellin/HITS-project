import { brushSharpness } from "./globalSettings.js";

export function circleDrawing( ceils, radius, cord, xLen, yLen, needFunc){
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
			
			needFunc(ceils[coordinate],(radius*brushSharpness)/(Math.abs(xCord)+Math.abs(yCord)),coordinate);

		}
	}
}