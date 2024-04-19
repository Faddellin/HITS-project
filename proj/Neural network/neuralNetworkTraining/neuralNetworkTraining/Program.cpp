#include "NetWork.h"
#include <chrono>

struct dataInfo {
    double* pixels;
    int digit;
};
dataNetWork ReadDataNetWork() {
    dataNetWork data{};

    std::cout << "Write cntOfLayers and layers: ";
    std::cin >> data.Layers;
    data.sizeOfLayers = new int[data.Layers];

    for (int i = 0; i < data.Layers; i++) {
        std::cin >> data.sizeOfLayers[i];
    }

    return data;
}

double* resize(double* readArr, int newSize, int oldSize) {

    double* newImage = new double[newSize * newSize];

    for (int i = 0; i < newSize; i++) {

        for (int j = 0; j < newSize; j++) {

            int smallIndex = round((double(oldSize) / newSize) * i);
            int smallJindex = round((double(oldSize) / newSize) * j);
            newImage[i * newSize + j] = readArr[smallIndex * oldSize + smallJindex];

        }
    }

    return newImage;
}

dataInfo* ReadData(string path, int& examples) {
    dataInfo* data;
    ifstream fin;
    double number[28 * 28];
    fin.open(path);

    std::cout << path << " loading... \n";
    string tmp;
    fin >> tmp;
    fin >> examples;
    std::cout << "Examples: " << examples << endl;
    data = new dataInfo[examples];

    for (int i = 0; i < examples; ++i) {
        fin >> data[i].digit;
        for (int j = 0; j < 28 * 28; ++j) {
            fin >> number[j];

        }
        data[i].pixels = resize(number,50,28);

        std::cout << i + 1 << " Image has loaded" << endl;
    }

    fin.close();

    std::cout << "examples loaded... \n";
    return data;

}



int main()
{
    NetWork NW{};
    dataInfo* data;
    double ra = 0, right, predict, maxra = 0;
    int epoch = 0;
    bool study;
    chrono::duration<double> time;

    NW.Init(ReadDataNetWork());

    std::cout << "Studying has started!" << endl;
    int examples;
    data = ReadData("lib_MNIST_edit.txt", examples);
    auto begin = chrono::steady_clock::now();
    while (epoch != 5) {
        ra = 0;
        auto t1 = chrono::steady_clock::now();
        for (int i = 0; i < examples; ++i) {

            NW.SetInput(data[i].pixels);
            right = data[i].digit;
            predict = NW.ForwardFeed();

            if (predict != right) {
                NW.BackPropogation(right);
                NW.WeightsUpdater(0.15 * exp(-epoch / 20.));
            }
            else {
                ra++;
            }
                
        }
        auto t2 = chrono::steady_clock::now();
        time = t2 - t1;
        if (ra > maxra) maxra = ra;
        cout << "ra: " << ra / examples * 100 <<  "    maxra: " << maxra / examples * 100 << "    epoch: " << epoch << "    time: " << time.count() << endl;
        epoch++;
    }
    auto end = chrono::steady_clock::now();
    time = end - begin;
    cout << "All time for studying: " << time.count() / 60. << " min" << endl;
    NW.SaveWeights();

    return 0;
}
