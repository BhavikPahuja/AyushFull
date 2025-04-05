document.addEventListener("DOMContentLoaded", async () => {
    await loadPlantData();
    setupSearch();
    startTransition();
    setupSmoothScroll();
});

let plantData = [];

async function loadPlantData() {
    try {
        const response = await fetch("/JSON/medicinal_plants.json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        plantData = await response.json();
        displayGardens(plantData);
    } catch (error) {
        console.error("Error loading plant data:", error);
    }
}

function displayGardens(plants) {
    const gardensContainer = document.getElementById("gardens");
    if (!gardensContainer) return;
    gardensContainer.innerHTML = "";
    
    const gardens = {};
    plants.forEach(plant => {
        const firstLetter = plant.Family || "Unknown";
        if (!gardens[firstLetter]) {
            gardens[firstLetter] = [];
        }
        gardens[firstLetter].push(plant);
    });

    Object.keys(gardens).sort().forEach(letter => {
        const gardenDiv = document.createElement("div");
        gardenDiv.classList.add("garden");
        gardenDiv.innerHTML = `<h2>Garden ${letter}</h2>`;

        const plantsContainer = document.createElement("div");
        plantsContainer.classList.add("plants");

        gardens[letter].forEach(plant => {
            const plantDiv = document.createElement("div");
            plantDiv.classList.add("plant");
            plantDiv.innerHTML = `
                <p>${plant.Name}</p>
                <img src="${plant["Image URL"]}" alt="${plant.Name}" class="plant-image">
            `;
            plantDiv.onclick = () => openPopup(plant);
            plantsContainer.appendChild(plantDiv);
        });

        gardenDiv.appendChild(plantsContainer);
        gardensContainer.appendChild(gardenDiv);
    });
}

function openPopup(plant) {
    const popupTitle = document.getElementById("popup-title");
    const popupDesc = document.getElementById("popup-desc");
    const plantPopup = document.getElementById("plantPopup");

    if (!popupTitle || !popupDesc || !plantPopup) return; // Prevents errors

    popupTitle.innerText = plant.Name;
    popupDesc.innerHTML = `
        <p><strong>Scientific Name:</strong> ${plant["Scientific Name"]}</p>
        <p><strong>Family:</strong> ${plant.Family}</p>
        <p><strong>Uses:</strong> ${plant.Uses}</p>
        <img src="${plant["Image URL"]}" alt="${plant.Name}" class="popup-image">
    `;
    plantPopup.style.display = "flex";
}

function closePopup() {
    const plantPopup = document.getElementById("plantPopup");
    if (plantPopup) plantPopup.style.display = "none";
}

function setupSearch() {
    const searchInput = document.getElementById("searchBar");
    if (!searchInput) return;

    const searchResults = document.createElement("div");
    searchResults.classList.add("search-results");
    searchInput.parentElement.appendChild(searchResults);

    searchInput.addEventListener("input", function () {
        let query = this.value.toLowerCase().trim();
        searchResults.innerHTML = "";
        if (!query || plantData.length === 0) return;

        let results = plantData.filter(plant => plant.Name.toLowerCase().includes(query)).slice(0, 5);

        results.forEach(plant => {
            let div = document.createElement("div");
            div.classList.add("search-item");
            div.textContent = plant.Name;
            div.onclick = () => {
                openPopup(plant);
                searchResults.innerHTML = "";
                searchInput.value = "";
            };
            searchResults.appendChild(div);
        });

        positionResults(searchInput, searchResults);
    });

    document.addEventListener("click", function (e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.innerHTML = "";
        }
    });
}

function positionResults(searchInput, searchResults) {
    const rect = searchInput.getBoundingClientRect();
    searchResults.style.position = "absolute";
    searchResults.style.top = rect.bottom + "px";
    searchResults.style.left = rect.left + "px";
    searchResults.style.width = rect.width + "px";
}

function startTransition() {
    const cloudLeft = document.querySelector(".cloud-left");
    const cloudRight = document.querySelector(".cloud-right");

    if (cloudLeft) cloudLeft.classList.add("animate-left");
    if (cloudRight) cloudRight.classList.add("animate-right");
}

function setupSmoothScroll() {
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
}