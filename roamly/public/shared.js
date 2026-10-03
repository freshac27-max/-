// ============================================
// ROAMLY — SHARED HELPERS
// Loaded on every page BEFORE the page's own script
// ============================================



// ============================================
// SAVED COUNTRIES (localStorage)
// ============================================

const STORAGE_KEY = "visitedCountries";


// Returns an array of country codes, e.g. ["DK", "FR"]
// The order is the order they were added, so the
// last item is the most recently added country.

function getVisitedCountries() {

    try {

        const saved =
            JSON.parse(localStorage.getItem(STORAGE_KEY));

        return Array.isArray(saved) ? saved : [];

    }

    catch (error) {

        // Saved data was broken somehow, start fresh
        return [];

    }

}


function saveVisitedCountries(codes) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(codes)
    );

}



// ============================================
// FLAGS
// ============================================

// Emoji flags don't display on Windows (you just see "ES"),
// so we use real flag images from flagcdn.com instead.

function flagImage(code, className) {

    const lower = code.toLowerCase();

    return `
        <img
            class="${className || "flag-img"}"
            src="https://flagcdn.com/w80/${lower}.png"
            srcset="https://flagcdn.com/w160/${lower}.png 2x"
            alt=""
            loading="lazy"
        >
    `;

}



// ============================================
// COUNTRIES FROM OUR BACKEND
// ============================================

// Resolves to [ { name: "Denmark", code: "DK" }, ... ]

function fetchEuropeanCountries() {

    return fetch("/api/countries")

        .then(function(response) {

            if (!response.ok) {

                throw new Error("Could not load countries");

            }

            return response.json();

        });

}


// Only keep saved codes that are in the country list
// (protects us from old or broken saved data)

function getValidVisited(visitedCodes, countriesList) {

    return visitedCodes.filter(function(code) {

        return countriesList.some(function(country) {

            return country.code === code;

        });

    });

}



// ============================================
// CHALLENGES
// ============================================

const NORDIC_COUNTRIES = ["DK", "SE", "NO", "FI", "IS"];


const CHALLENGES = [

    {
        id: "first-steps",
        icon: "👣",
        title: "First Steps",
        description: "Visit your first country",
        target: 1,
        progress: function(visited) {
            return visited.length;
        }
    },

    {
        id: "european-explorer",
        icon: "🏰",
        title: "European Explorer",
        description: "Visit 10 European countries",
        target: 10,
        progress: function(visited) {
            return visited.length;
        }
    },

    {
        id: "nordic-explorer",
        icon: "❄️",
        title: "Nordic Explorer",
        description: "Visit Denmark, Sweden, Norway, Finland and Iceland",
        target: NORDIC_COUNTRIES.length,
        progress: function(visited) {
            return visited.filter(function(code) {
                return NORDIC_COUNTRIES.includes(code);
            }).length;
        }
    },

    {
        id: "world-traveller",
        icon: "🌍",
        title: "World Traveller",
        description: "Visit 25 countries",
        target: 25,
        progress: function(visited) {
            return visited.length;
        }
    }

];


// Works out how far along the user is in every challenge

function getChallengeProgress(visitedCodes) {

    return CHALLENGES.map(function(challenge) {

        const current = Math.min(
            challenge.progress(visitedCodes),
            challenge.target
        );

        return {
            id: challenge.id,
            icon: challenge.icon,
            title: challenge.title,
            description: challenge.description,
            target: challenge.target,
            current: current,
            percent: Math.round((current / challenge.target) * 100),
            completed: current >= challenge.target
        };

    });

}
