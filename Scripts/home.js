function startTransitionGarden() {
    document.querySelector(".cloud-left").classList.add("animate-left");
    document.querySelector(".cloud-right").classList.add("animate-right");

    setTimeout(() => {
        window.location.href = "/HTML/gardens.html";
    }, 2000);
}

function startTransitionSocial() {
    document.querySelector(".cloud-left").classList.add("animate-left");
    document.querySelector(".cloud-right").classList.add("animate-right");

    setTimeout(() => {
        window.location.href = "/HTML/social.html";
    }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
    loadPlantData();
    document.querySelectorAll('.links ul li a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

let plantData = [];

async function loadPlantData() {
    try {
        const response = await fetch("/JSON/medicinal_plants.json");
        plantData = await response.json();
    } catch (error) {
        console.error("Error loading plant data:", error);
    }
}

const searchInput = document.querySelector(".search input");
const searchResults = document.createElement("div");
searchResults.classList.add("search-results");
document.body.appendChild(searchResults);

searchInput.addEventListener("input", function () {
    let query = this.value.toLowerCase().trim();
    searchResults.innerHTML = "";
    if (!query) return;

    let results = plantData.filter(plant => plant.common_name.toLowerCase().includes(query)).slice(0, 5);

    results.forEach(plant => {
        let div = document.createElement("div");
        div.classList.add("search-item");
        div.textContent = plant.common_name;
        div.onclick = () => openPopup(plant.common_name, plant.traditional_uses);
        searchResults.appendChild(div);
    });

    positionResults();
});

searchInput.addEventListener("blur", () => {
    setTimeout(() => searchResults.innerHTML = "", 200);
});

function positionResults() {
    const rect = searchInput.getBoundingClientRect();
    searchResults.style.left = `${rect.left}px`;
    searchResults.style.top = `${rect.bottom}px`;
    searchResults.style.width = `${rect.width}px`;
}

function openPopup(name, desc) {
    document.getElementById("popup-title").innerText = name;
    document.getElementById("popup-desc").innerText = desc;
    document.getElementById("plantPopup").style.display = "flex";
}

function openAbout() {
    window.location.href = "/HTML/about.html";
}