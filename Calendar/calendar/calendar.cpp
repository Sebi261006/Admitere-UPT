#include <iostream>

using namespace std;

int GPrimaZi(int luna, int an) {
    if (luna < 3) {
        luna += 12;
        an--;
    }
    int K = an % 100;
    int J = an / 100;
    int ZiPeSaptamana = (1 + (13 * (luna + 1)) / 5 + K + (K / 4) + (J / 4) + (5 * J)) % 7;
    return (ZiPeSaptamana + 5) % 7; 
}

void Afis(int luna, int an) {
    int zileInFiecareLuna[] = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };
    if (an % 4 == 0 && (an % 100 != 0 || an % 400 == 0)) {
        zileInFiecareLuna[1] = 29;
    }
    int primaZi = GPrimaZi(luna, an);
    int zileInLuna = zileInFiecareLuna[luna - 1];

    int zi = 1;
    for (int i = 0; i < 6; i++) {
        bool S = true;
        for (int j = 0; j < 7; j++) {
            if (i == 0 && j < primaZi) {
                cout << "xx ";
            }
            else if (zi <= zileInLuna) {
                if (zi < 10) cout << "0";
                cout << zi << " ";
                zi++;
                S = false;
            }
            else {
                cout << "xx ";
            }
        }
        cout << endl;
        if (zi > zileInLuna) break;
    }
}

int main() {
    int luna, an;
    cin >> luna >> an;
    Afis(luna, an);
    return 0;
}
