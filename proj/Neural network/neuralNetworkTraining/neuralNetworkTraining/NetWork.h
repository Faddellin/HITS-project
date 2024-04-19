#pragma once
#include "ActivateFunction.h"
#include "Matrix.h"
#include <fstream>
using namespace std;
struct dataNetWork {
	int Layers;
	int* sizeOfLayers;
};
class NetWork
{
	int Layers;
	int* sizeOfLayers;
	ActivateFunction actFunc;
	Matrix* weights;
	double** bios;
	double** neuronsVal, ** neuronsErr;
public:
	void Init(dataNetWork data);
	void SetInput(double* values);

	double ForwardFeed();
	int SearchMaxIndex(double* value);
	void PrintValues(int L);

	void BackPropogation(double expect);
	void WeightsUpdater(double lr);

	void SaveWeights();
	void ReadWeights();
};

