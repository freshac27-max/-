// ============================================
// ROAMLY — HOME PAGE
// (uses helpers from shared.js)
// ============================================


const visitedCountries = getVisitedCountries();



// ============================================
// DOM ELEMENTS
// ============================================

const profileCountryCount =
    document.querySelector("#profile-country-count");

const recentVisitsContainer =
    document.querySelector("#recent-visits");

const progressCircle =
    document.querySelector("#progress-circle");

const progressCount =
    document.querySelector("#progress-count");

const progressCountLabel =
    document.querySelector("#progress-count-label");

const progressTitle =
    document.querySelector("#progress-title");

const progressText =
    document.querySelector("#progress-text");

const challengesContainer =
    document.querySelector("#home-challenges");

const badgesContainer =
    document.querySelector("#home-badges");



// ============================================
// LOAD
// ============================================

// We need the country list for names and for the
// "% of Europe" number. If it fails we still show
// what we can from the saved codes.

fetchEuropeanCountries()

    .then(function(countriesList) {

        renderHome(countriesList);

    })

    .catch(function(error) {

        console.error(error);

        renderHome([]);

    });



function renderHome(countriesList) {

    const validVisited =
        countriesList.length > 0
            ? getValidVisited(visitedCountries, countriesList)
            : visitedCountries;


    updateProfile(validVisited);
    displayRecentVisits(validVisited, countriesList);
    updateProgress(validVisited, countriesList);

    const challenges = getChallengeProgress(validVisited);

    displayChallenges(challenges);
    displayBadges(challenges);

}



// ============================================
// PROFILE CARD
// ============================================

function updateProfile(visited) {

    profileCountryCount.textContent = visited.length;

}



// ============================================
// RECENT VISITS
// ============================================

function displayRecentVisits(visited, countriesList) {

    if (visited.length === 0) {

        // Keep the empty state that's already in the HTML
        return;

    }


    // Last added = most recent, so take the last 3
    // and flip them so the newest is on top
    const recent =
        visited.slice(-3).reverse();


    recentVisitsContainer.innerHTML = "";

    const list = document.createElement("div");
    list.className = "recent-list";


    recent.forEach(function(code) {

        const country =
            countriesList.find(function(c) {
                return c.code === code;
            });

        const name = country ? country.name : code;


        const item = document.createElement("div");
        item.className = "recent-item";

        item.innerHTML = `
            ${flagImage(code)}
            <div>
                <strong>${name}</strong>
                <span>Visited</span>
            </div>
        `;

        list.appendChild(item);

    });


    recentVisitsContainer.appendChild(list);

}



// ============================================
// PROGRESS CIRCLE
// ============================================

function updateProgress(visited, countriesList) {

    const total = countriesList.length;

    let percentage = 0;

    if (total > 0) {

        percentage = Math.round(
            (visited.length / total) * 100
        );

    }


    progressCount.textContent = visited.length;

    progressCountLabel.textContent =
        visited.length === 1 ? "country" : "countries";


    // Fill the ring
    progressCircle.style.background = `
        conic-gradient(
            var(--purple) ${percentage}%,
            #ededf3 ${percentage}%
        )
    `;


    if (visited.length === 0) {

        progressTitle.textContent = "The world is waiting.";
        progressText.textContent = "Start marking the places you've explored.";

    }

    else if (total > 0) {

        const remaining = total - visited.length;

        progressTitle.textContent = percentage + "% of Europe explored";
        progressText.textContent = remaining + " European countries left to discover.";

    }

    else {

        progressTitle.textContent = "Nice work, keep going.";
        progressText.textContent = "Every country gets you closer to a badge.";

    }

}



// ============================================
// CHALLENGES
// ============================================

function displayChallenges(challenges) {

    challengesContainer.innerHTML = "";


    // "First Steps" is basically a starter badge,
    // so we leave it out of the challenge list here
    const shown =
        challenges.filter(function(challenge) {
            return challenge.id !== "first-steps";
        });


    shown.forEach(function(challenge) {

        const item = document.createElement("div");

        item.className =
            challenge.completed ? "challenge completed" : "challenge";

        item.innerHTML = `

            <div class="challenge-icon">
                ${challenge.icon}
            </div>

            <div class="challenge-info">

                <strong>${challenge.title}</strong>

                <span>${challenge.description}</span>

                <div class="mini-progress">
                    <div style="width: ${challenge.percent}%"></div>
                </div>

                <small>
                    ${challenge.completed
                        ? "Completed ✓"
                        : challenge.current + " / " + challenge.target}
                </small>

            </div>

        `;

        challengesContainer.appendChild(item);

    });

}



// ============================================
// BADGES
// ============================================

function displayBadges(challenges) {

    badgesContainer.innerHTML = "";


    challenges.forEach(function(challenge) {

        const badge = document.createElement("div");

        badge.className =
            challenge.completed ? "badge earned" : "badge locked";

        badge.title =
            challenge.completed
                ? challenge.title + " — earned"
                : challenge.title + " — " + challenge.description;

        badge.textContent = challenge.icon;

        badgesContainer.appendChild(badge);

    });

}
