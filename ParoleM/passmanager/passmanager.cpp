#include <iostream>
#include <vector>
#include <string>

struct pass {
    std::string parola;
};

int main() {
    int nr;
    bool isrunning = true;
    std::vector<pass> parole;

    while (isrunning) {
        std::cout << "Introduceti un numar:" << std::endl;
        std::cout << "1. Adaugati o parola" << std::endl;
        std::cout << "2. Afisati parolele" << std::endl;
        std::cout << "3. Iesiti din program" << std::endl;

        std::cin >> nr;

        switch (nr) {
        case 1: {
            pass parolaNoua;
            std::cout << "Introduceti parola: ";
            std::cin >> parolaNoua.parola;
            parole.push_back(parolaNoua);
            break;
        }
        case 2: {
            std::cout << "Parolele introduse sunt:" << std::endl;
            for (size_t i = 0; i < parole.size(); ++i) {
                std::cout << i + 1 << ". " << parole[i].parola << std::endl;
            }
            break;
        }
        case 3: {
            isrunning = false;
            break;
        }
        default: {
            std::cout << "Optiune invalida. Incercati din nou." << std::endl;
            break;
        }
        }
    }

    return 0;
}
