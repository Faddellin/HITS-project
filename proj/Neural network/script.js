import { weights } from "./weights.js";
import { NetWork } from "./NetWork.js";
import { Image } from "./ImageVisual.js";

//Инициализация нейросети и изображения
export let image = new Image;
image.init(50);
export let netWork = new NetWork();
netWork.init(3,[2500,300,10]);
netWork.readWeights(weights);