using System;
using System.Collections.Generic;
using System.Text;

namespace app
{
    class Program
    {
        static void Main()
        {
            string[] cuvinte = { "programare", "calculator", "cuvinte", "joc", "computer", "utilizator" };
            Random random = new Random();
            string cuvantSecret = cuvinte[random.Next(cuvinte.Length)].ToLower();
            string cuvantCurent = new string('_', cuvantSecret.Length);
            int incercariRamase = 6;

            Console.WriteLine("Bun venit la Jocul de Cuvinte!");
            Console.WriteLine("Cuvântul: " + cuvantCurent);

            while (incercariRamase > 0 && cuvantCurent.Contains("_"))
            {
                Console.Write("Introduceți o literă: ");
                char litera;

                while (!char.TryParse(Console.ReadLine(), out litera) || !char.IsLetter(litera))
                {
                    Console.WriteLine("Introduceți o literă validă!");
                }

                litera = char.ToLower(litera);

                if (cuvantSecret.Contains(litera.ToString()))
                {
                    for (int i = 0; i < cuvantSecret.Length; i++)
                    {
                        if (cuvantSecret[i] == litera)
                        {
                            cuvantCurent = cuvantCurent.Substring(0, i) + litera + cuvantCurent.Substring(i + 1);
                        }
                    }
                }
                else
                {
                    incercariRamase--;
                    Console.WriteLine($"Litera '{litera}' nu se află în cuvânt. Mai aveți {incercariRamase} încercări.");
                }

                Console.WriteLine("Cuvântul: " + cuvantCurent);
            }

            if (cuvantCurent == cuvantSecret)
            {
                Console.WriteLine("Felicitări! Ați ghicit cuvântul: " + cuvantSecret);
            }
            else
            {
                Console.WriteLine("Game over! Cuvântul corect era: " + cuvantSecret);
            }
        }

    }
}

