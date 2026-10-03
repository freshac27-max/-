// ============================================
// ROAMLY — MY TRAVELS PAGE
// (uses helpers from shared.js)
// ============================================



// ============================================
// STATE
// ============================================

// All European countries: [ { name, code }, ... ]
let countriesList = [];

// Codes of countries the user has visited
let visitedCountries = getVisitedCountries();

// Current country filter: "all" | "visited" | "unvisited"
let currentFilter = "all";



// ============================================
// DOM ELEMENTS
// ============================================

const countriesContainer =
    document.querySelector("#countries-container");

const loading =
    document.querySelector("#countries-loading");

const searchInput =
    document.querySelector("#country-search");

const filterButtons =
    document.querySelectorAll(".filter-button");

const visitedCount =
    document.querySelector("#visited-count");

const remainingCount =
    document.querySelector("#remaining-count");

const travelPercentage =
    document.querySelector("#travel-percentage");

const challengesCompleted =
    document.querySelector("#challenges-completed");

const progressPercentage =
    document.querySelector("#progress-percentage");

const progressFill =
    document.querySelector("#progress-fill");

const visitedContainer =
    document.querySelector("#visited-countries-container");

const visitedSectionCount =
    document.querySelector("#visited-section-count");



// ============================================
// LOAD COUNTRIES
// ============================================

fetchEuropeanCountries()

    .then(function(data) {

        countriesList = data;

        loading.style.display = "none";

        renderAll();

    })

    .catch(function(error) {

        console.error(error);

        loading.innerHTML = `
            <p>
                Countries couldn't be loaded.
                Check that the server is running, then refresh.
            </p>
        `;

    });



// Redraw everything that depends on visited countries

function renderAll() {

    displayCountries();
    displayVisitedCountries();
    updateStats();

}



// ============================================
// DISPLAY COUNTRY CARDS
// ============================================

function displayCountries() {

    countriesContainer.innerHTML = "";


    const searchTerm =
        searchInput.value.trim().toLowerCase();


    const filteredCountries =
        countriesList.filter(function(country) {

            const matchesSearch =
                country.name.toLowerCase().includes(searchTerm);

            const isVisited =
                visitedCountries.includes(country.code);


            if (!matchesSearch) {
                return false;
            }

            if (currentFilter === "visited" && !isVisited) {
                return false;
            }

            if (currentFilter === "unvisited" && isVisited) {
                return false;
            }

            return true;

        });



    // No results

    if (filteredCountries.length === 0) {

        countriesContainer.innerHTML = `

            <div class="empty-state">

                <span>🌍</span>

                <h3>No countries found</h3>

                <p>Try a different search or filter.</p>

            </div>

        `;

        return;

    }



    // Build a card for each country

    filteredCountries.forEach(function(country) {

        const isVisited =
            visitedCountries.includes(country.code);


        const card =
            document.createElement("article");

        card.className =
            isVisited ? "country-card visited" : "country-card";


        card.innerHTML = `

            <div class="country-flag">
                ${flagImage(country.code)}
            </div>

            <div class="country-info">
                <h3>${country.name}</h3>
            </div>

            <button
                class="visit-button"
                data-code="${country.code}"
                title="${isVisited ? "Remove from visited" : "Mark as visited"}"
            >
                ${isVisited ? "✓ Visited" : "+ Add"}
            </button>

        `;


        countriesContainer.appendChild(card);

    });

}



// ============================================
// COUNTRY BUTTON CLICKS
// ============================================

countriesContainer.addEventListener("click", function(event) {

    // closest() still works if you click on text
    // inside the button
    const button =
        event.target.closest(".visit-button");

    if (!button) {
        return;
    }

    toggleVisited(button.dataset.code);

});



// ============================================
// ADD / REMOVE VISITED COUNTRY
// ============================================

function toggleVisited(countryCode) {

    if (visitedCountries.includes(countryCode)) {

        visitedCountries =
            visitedCountries.filter(function(code) {
                return code !== countryCode;
            });

    }

    else {

        visitedCountries.push(countryCode);

    }


    saveVisitedCountries(visitedCountries);

    renderAll();

}



// ============================================
// VISITED COUNTRIES SECTION
// ============================================

function displayVisitedCountries() {

    visitedContainer.innerHTML = "";


    const visited =
        countriesList.filter(function(country) {
            return visitedCountries.includes(country.code);
        });


    visitedSectionCount.textContent =
        visited.length === 1
            ? "1 country"
            : visited.length + " countries";


    if (visited.length === 0) {

        visitedContainer.innerHTML = `

            <div class="visited-empty">

                <span>✈️</span>

                <div>
                    <strong>Your journey starts here</strong>
                    <p>Add a country you've visited and it'll appear here.</p>
                </div>

            </div>

        `;

        return;

    }


    visited.forEach(function(country) {

        const card =
            document.createElement("div");

        card.className = "visited-country-card";

        card.innerHTML = `

            <div class="visited-flag">
                ${flagImage(country.code)}
            </div>

            <div>
                <strong>${country.name}</strong>
                <span>Visited</span>
            </div>

        `;

        visitedContainer.appendChild(card);

    });

}



// ============================================
// STATISTICS
// ============================================

function updateStats() {

    const totalCountries = countriesList.length;

    const validVisited =
        getValidVisited(visitedCountries, countriesList);

    const totalVisited = validVisited.length;

    const remaining = totalCountries - totalVisited;


    let percentage = 0;

    if (totalCountries > 0) {

        percentage = Math.round(
            (totalVisited / totalCountries) * 100
        );

    }


    const completed =
        getChallengeProgress(validVisited)
            .filter(function(challenge) {
                return challenge.completed;
            })
            .length;


    visitedCount.textContent = totalVisited;
    remainingCount.textContent = remaining;
    travelPercentage.textContent = percentage + "%";
    challengesCompleted.textContent = completed;

    progressPercentage.textContent = percentage + "%";
    progressFill.style.width = percentage + "%";

}



// ============================================
// SEARCH
// ============================================

searchInput.addEventListener("input", function() {

    displayCountries();

});



// ============================================
// FILTER BUTTONS
// ============================================

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        displayCountries();

    });

});
