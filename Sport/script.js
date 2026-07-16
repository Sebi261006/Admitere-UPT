let data = [];

function getBasePath(){
    const path = window.location.pathname;
    const match = path.match(/^(.*\/)(?:index\.html|exercitii\.html|exercitiu\.html|nutritie\.html|program\.html|contact\.html)?$/);
    return match ? match[1] : '/';
}

const BASE_PATH = getBasePath();

document.addEventListener("DOMContentLoaded", () => {
    
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if(href && href.endsWith('.html') && !href.startsWith('http')){
            link.href = BASE_PATH + href;
        }
    });

    const categorii = ["piept", "spate", "picioare", "brate", "umeri", "abdomen"];

    const numeExercitii = {
        piept: [
            "Flotări clasice", "Flotări diamant", "Flotări cu picioarele ridicate", "Bench Press", "Push-ups", "Dips", "Butterfly", "Cable Flyes",
            "Decline Bench Press", "Incline Dumbbell Press", "Chest Press Machine", "Pec Deck", "Dumbbell Flyes", "Floor Press", "Svend Press",
            "One-Arm Dumbbell Press", "Hammer Strength Chest Press", "Smith Machine Bench Press", "Close-Grip Bench Press", "Wide-Grip Bench Press"
        ],
        spate: [
            "Tracțiuni la bară", "Tracțiuni inversate", "Remarcări", "Deadlift", "Pull-ups", "Lat Pulldown", "Bent-Over Rows", "T-Bar Rows",
            "Seated Cable Rows", "Face Pulls", "Rear Delt Flyes", "Shrugs", "Good Mornings", "Romanian Deadlift", "Stiff-Legged Deadlift",
            "Single-Arm Dumbbell Rows", "Hammer Strength Rows", "Machine Rows", "Wide-Grip Pull-ups", "Close-Grip Pull-ups"
        ],
        picioare: [
            "Ghemuituri", "Fandări", "Presa pentru picioare", "Deadlift românesc", "Squats", "Lunges", "Leg Press", "Leg Extensions",
            "Leg Curls", "Calf Raises", "Bulgarian Split Squats", "Step-Ups", "Glute Bridges", "Hip Thrusts", "Box Jumps",
            "Walking Lunges", "Reverse Lunges", "Hack Squats", "Front Squats", "Zercher Squats"
        ],
        brate: [
            "Flexii biceps", "Extensii triceps", "Hammer Curls", "Tricep Dips", "Bicep Curls", "Tricep Extensions", "Preacher Curls", "Overhead Tricep Extensions",
            "Concentration Curls", "Tricep Kickbacks", "Cable Curls", "Rope Pushdowns", "Close-Grip Bench Press", "Diamond Push-ups", "Zottman Curls",
            "Reverse Grip Curls", "Tricep Rope Extensions", "Bicep Machine Curls", "Skull Crushers", "French Press"
        ],
        umeri: [
            "Ridicare laterală", "Ridicare frontală", "Ridicare posterioară", "Military Press", "Lateral Raises", "Front Raises", "Rear Delt Raises", "Shoulder Press",
            "Arnold Press", "Upright Rows", "Face Pulls", "Shrugs", "Dumbbell Shoulder Press", "Machine Shoulder Press", "Cable Lateral Raises",
            "Bent-Over Lateral Raises", "Seated Dumbbell Press", "Standing Military Press", "Push Press", "Clean and Press"
        ],
        abdomen: [
            "Abdomene", "Plank", "Russian Twists", "Mountain Climbers", "Crunches", "Leg Raises", "Bicycle Crunches", "Plank Jacks",
            "Flutter Kicks", "Heel Touches", "V-Ups", "Sit-ups", "Hanging Leg Raises", "Captain's Chair", "Ab Wheel Rollouts",
            "Woodchoppers", "Reverse Crunches", "Side Planks", "Dragon Flags", "L-Sit"
        ]
    };

    const tipuri = {
        piept: ["dezvoltă pieptul", "crește forța de împins", "activează pectoralii"],
        spate: ["îmbunătățește postura", "lărgește spatele", "crește forța de tracțiune"],
        picioare: ["dezvoltă coapsele", "crește explozia", "îmbunătățește stabilitatea"],
        brate: ["dezvoltă bicepsul și tricepsul", "crește masa brațelor", "definire musculară"],
        umeri: ["dezvoltă deltoizii", "îmbunătățește forma V", "crește stabilitatea"],
        abdomen: ["întărește core-ul", "activează abdomenul", "îmbunătățește echilibrul"]
    };

    function random(arr){
        return arr[Math.floor(Math.random() * arr.length)];
    }

    for(let i = 1; i <= 100; i++){

        let cat = categorii[i % categorii.length];
        let intensitate = Math.floor(Math.random() * 5) + 1;
        let numeExercitiu = random(numeExercitii[cat]);

        data.push({
            id: i,
            nume: numeExercitiu,
            categorie: cat,
            descriere: `${random(tipuri[cat])}. Intensitate: ${intensitate}/5`
        });
    }

    renderExercitii();
    loadProgram();
    renderDetalii();
});

function renderExercitii(){

    const container = document.getElementById("exercitii");
    if(!container) return;

    container.innerHTML = "";

    data.forEach(e => {

        let div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <h3>${e.nume}</h3>
            <p>${e.descriere}</p>
            <small>${e.categorie}</small>
            <br><br>

            <a href="${BASE_PATH}exercitiu.html?id=${e.id}" class="btn">Vezi detalii</a>
            <button onclick="adaugaFavorite('${e.nume}')">⭐</button>
        `;

        container.appendChild(div);
    });
}

document.addEventListener("input", () => {

    const search = document.getElementById("search");
    const filter = document.getElementById("filter");

    if(!search || !filter) return;

    let text = search.value.toLowerCase();
    let cat = filter.value;

    let rezultat = data.filter(e =>
        e.nume.toLowerCase().includes(text) &&
        (cat === "toate" || e.categorie === cat)
    );

    const container = document.getElementById("exercitii");
    container.innerHTML = "";

    rezultat.forEach(e => {

        let div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <h3>${e.nume}</h3>
            <p>${e.descriere}</p>

            <a href="${BASE_PATH}exercitiu.html?id=${e.id}" class="btn">Vezi detalii</a>
        `;

        container.appendChild(div);
    });
});

function adaugaFavorite(nume){

    let fav = JSON.parse(localStorage.getItem("fav")) || [];

    if(!fav.includes(nume)){
        fav.push(nume);
        localStorage.setItem("fav", JSON.stringify(fav));
        alert("Adăugat la favorite!");
    } else {
        alert("Deja există!");
    }
}

function calcCalorii(){

    let g = document.getElementById("greutate")?.value;
    let i = document.getElementById("inaltime")?.value;
    let v = document.getElementById("varsta")?.value;
    let sex = document.getElementById("sex")?.value;

    if(!g || !i || !v){
        document.getElementById("rezultat").innerText = "Completează toate câmpurile!";
        return;
    }

    let bmr;

    if(sex === "m"){
        bmr = 10*g + 6.25*i - 5*v + 5;
    } else {
        bmr = 10*g + 6.25*i - 5*v - 161;
    }

    document.getElementById("rezultat").innerText =
        "Calorii zilnice: " + Math.round(bmr);
}

function adaugaProgram(){

    let zi = document.getElementById("zi")?.value;
    let antr = document.getElementById("antrenament")?.value;

    if(!zi || !antr) return;

    let prog = JSON.parse(localStorage.getItem("program")) || [];

    prog.push({ zi, antr });

    localStorage.setItem("program", JSON.stringify(prog));

    loadProgram();
}


function loadProgram(){

    let lista = document.getElementById("listaProgram");
    if(!lista) return;

    let prog = JSON.parse(localStorage.getItem("program")) || [];

    lista.innerHTML = "";

    prog.forEach(p => {
        let li = document.createElement("li");
        li.innerText = `${p.zi} - ${p.antr}`;
        lista.appendChild(li);
    });
}

function getInstructiuniExercitiu(nume, categorie){
    const instructiuniGenerale = {
        piept: {
            executie: "Întinde-te pe bancă cu spatele plat. Apucă bara cu palmele îndreptate înainte, la lățimea umerilor. Coborî bara controlat până atinge pieptul, apoi împinge în sus până brațele sunt întinse.",
            muschi: "Pectorali major și minor, deltoizi anteriori, triceps",
            seturi: "3-4",
            repetari: "8-12",
            pauza: "90-120 secunde",
            variante: ["Bench Press cu haltere", "Incline Bench Press", "Decline Bench Press", "Close-grip Bench Press"]
        },
        spate: {
            executie: "Apucă bara cu palmele îndreptate înainte, la lățimea umerilor. Trage bara spre piept menținând coatele aproape de corp. Coborî controlat bara până brațele sunt întinse.",
            muschi: "Lats, rhomboizi, trapizi mijlocii, biceps",
            seturi: "3-4",
            repetari: "8-12",
            pauza: "90-120 secunde",
            variante: ["Remarcări cu haltere", "Lat Pulldown", "Seated Cable Rows", "T-Bar Rows"]
        },
        picioare: {
            executie: "Stai în picioare cu picioarele la lățimea umerilor. Coborî șoldurile înapoi și în jos ca și cum te-ai așeza pe un scaun. Menține genunchii aliniați cu vârfurile picioarelor.",
            muschi: "Cvadriceps, glutei, ischiogambieri",
            seturi: "3-4",
            repetari: "8-12",
            pauza: "120-150 secunde",
            variante: ["Ghemuituri cu haltere", "Front Squats", "Bulgarian Split Squats", "Leg Press"]
        },
        brate: {
            executie: "Stai în picioare cu halterele în mâini, palme îndreptate înainte. Flexează bicepsul ridicând halterele spre umeri, menținând coatele fixe lângă corp.",
            muschi: "Biceps brahial, brahialis",
            seturi: "3-4",
            repetari: "10-15",
            pauza: "60-90 secunde",
            variante: ["Hammer Curls", "Preacher Curls", "Concentration Curls", "Cable Curls"]
        },
        umeri: {
            executie: "Stai în picioare cu halterele în mâini, palme îndreptate spre corp. Ridică halterele lateral până la înălțimea umerilor, menținând coatele ușor flexate.",
            muschi: "Deltoizi laterali, deltoizi posteriori",
            seturi: "3-4",
            repetari: "10-15",
            pauza: "60-90 secunde",
            variante: ["Front Raises", "Rear Delt Flyes", "Military Press", "Upright Rows"]
        },
        abdomen: {
            executie: "Întinde-te pe spate cu genunchii flexați. Ridică umerii de pe podea spre genunchi, contractând musculatura abdominală. Coborî controlat.",
            muschi: "Rectus abdominis, oblici",
            seturi: "3-4",
            repetari: "15-25",
            pauza: "30-60 secunde",
            variante: ["Bicycle Crunches", "Russian Twists", "Leg Raises", "Plank"]
        }
    };

    return instructiuniGenerale[categorie] || instructiuniGenerale.piept;
}

function renderDetalii(){
    const box = document.getElementById("detalii");
    if(!box) return;

    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"), 10);

    if(isNaN(id)){
        box.innerHTML = "<h2>ID exercițiu invalid</h2>";
        return;
    }

    const exercitiu = data.find(e => e.id === id);

    if(exercitiu){
        const instructiuni = getInstructiuniExercitiu(exercitiu.nume, exercitiu.categorie);

        box.innerHTML = `
            <h1>${exercitiu.nume}</h1>
            <p><b>Categorie:</b> ${exercitiu.categorie}</p>
            <p><b>Descriere:</b> ${exercitiu.descriere}</p>

            <hr>

            <h3>Execuție</h3>
            <p>${instructiuni.executie}</p>

            <h3>Muschi vizați</h3>
            <p>${instructiuni.muschi}</p>

            <h3>Recomandări</h3>
            <ul>
                <li><b>Seturi:</b> ${instructiuni.seturi}</li>
                <li><b>Repetări:</b> ${instructiuni.repetari}</li>
                <li><b>Pauză:</b> ${instructiuni.pauza}</li>
            </ul>

            ${instructiuni.variante ? `<h3>Variante</h3><ul>${instructiuni.variante.map(v => `<li>${v}</li>`).join('')}</ul>` : ''}

            <a href=\"${BASE_PATH}exercitii.html\">Înapoi la exerciții</a>
        `;
    } else {
        box.innerHTML = "<h2>Exercițiul nu a fost găsit</h2>";
    }
}
