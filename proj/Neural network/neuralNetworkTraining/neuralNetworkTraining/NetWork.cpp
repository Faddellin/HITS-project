#include "NetWork.h"
void NetWork::Init(dataNetWork data) {

	srand(time(NULL));
	Layers = data.Layers;
	sizeOfLayers = new int[Layers];
	for (int i = 0; i < Layers; i++)
		sizeOfLayers[i] = data.sizeOfLayers[i];

	weights = new Matrix[Layers - 1];
	bios = new double* [Layers - 1];
	for (int i = 0; i < Layers - 1; i++) {
		weights[i].Init(sizeOfLayers[i + 1], sizeOfLayers[i]);
		bios[i] = new double[sizeOfLayers[i + 1]];
		for (int j = 0; j < sizeOfLayers[i + 1]; j++) {
			bios[i][j] = ((rand() % 50)) * 0.06 / (sizeOfLayers[i] + 15);
		}
	}
	neuronsVal = new double* [Layers]; neuronsErr = new double* [Layers];
	for (int i = 0; i < Layers; i++) {
		neuronsVal[i] = new double[sizeOfLayers[i]]; neuronsErr[i] = new double[sizeOfLayers[i]];
	}
}
void NetWork::SetInput(double* values) {
	for (int i = 0; i < sizeOfLayers[0]; i++) {
		neuronsVal[0][i] = values[i];
	}
}

double NetWork::ForwardFeed() {
	for (int k = 1; k < Layers; k++) {
		Matrix::Multi(weights[k - 1], neuronsVal[k - 1], sizeOfLayers[k - 1], neuronsVal[k]);
		Matrix::SumVector(neuronsVal[k], bios[k - 1], sizeOfLayers[k]);
		actFunc.use(neuronsVal[k], sizeOfLayers[k]);
	}

	int pred = SearchMaxIndex(neuronsVal[Layers - 1]);
	return pred;
}
int NetWork::SearchMaxIndex(double* value) {
	double max = value[0];
	int prediction = 0;
	double tmp;
	for (int j = 1; j < sizeOfLayers[Layers - 1]; j++) {
		tmp = value[j];
		if (tmp > max) {
			prediction = j;
			max = tmp;
		}
	}
	return prediction;
}
void NetWork::PrintValues(int Layers) {
	for (int j = 0; j < sizeOfLayers[Layers]; j++) {
		cout << j << " " << neuronsVal[Layers][j] << endl;
	}
}

void NetWork::BackPropogation(double expect) {
	for (int i = 0; i < sizeOfLayers[Layers - 1]; i++) {
		if (i != int(expect))
			neuronsErr[Layers - 1][i] = -neuronsVal[Layers - 1][i] * actFunc.useDer(neuronsVal[Layers - 1][i]);
		else
			neuronsErr[Layers - 1][i] = (1.0 - neuronsVal[Layers - 1][i]) * actFunc.useDer(neuronsVal[Layers - 1][i]);
	}
	for (int k = Layers - 2; k > 0; k--) {
		Matrix::Multi_T(weights[k], neuronsErr[k + 1], sizeOfLayers[k + 1], neuronsErr[k]);
		for (int j = 0; j < sizeOfLayers[k]; j++)
			neuronsErr[k][j] *= actFunc.useDer(neuronsVal[k][j]);
	}
}
void NetWork::WeightsUpdater(double lr) {
	for (int i = 0; i < Layers - 1; i++) {
		for (int j = 0; j < sizeOfLayers[i + 1]; j++) {
			for (int k = 0; k < sizeOfLayers[i]; k++) {
				weights[i].point(j, k) += neuronsVal[i][k] * neuronsErr[i + 1][j] * lr;
			}
		}
	}
	for (int i = 0; i < Layers - 1; i++) {
		for (int k = 0; k < sizeOfLayers[i + 1]; k++) {
			bios[i][k] += neuronsErr[i + 1][k] * lr;
		}
	}
}
void NetWork::SaveWeights() {
	ofstream fout;
	fout.open("Weights.txt");

	for (int i = 0; i < Layers - 1; i++)
		fout << weights[i] << " ";

	for (int i = 0; i < Layers - 1; i++) {
		for (int j = 0; j < sizeOfLayers[i + 1]; j++) {
			fout << bios[i][j] << " ";
		}
	}
	cout << "Weights saved" << endl;
	fout.close();
}
void NetWork::ReadWeights() {
	ifstream fin;
	fin.open("Weights.txt");

	for (int i = 0; i < Layers - 1; i++) {
		fin >> weights[i];
	}
	for (int i = 0; i < Layers - 1; i++) {
		for (int j = 0; j < sizeOfLayers[i + 1]; j++) {
			fin >> bios[i][j];
		}
	}
	cout << "Weights readed \n";
	fin.close();
}