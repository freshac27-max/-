require("dotenv").config();
const express = require("express");

const app = express();

console.log(
    "API key loaded:",
    !!process.env.REST_COUNTRIES_KEY
);

// Give the browser access to our frontend files
// (public/index.html is served at "/", so that's the Home page)
app.use(express.static("public"));


app.get("/api/hello", function(req, res) {

    res.json({
        message: "Hello from the Roamly backend!"
    });

});



// ============================================
// COUNTRIES
// ============================================

// The country list basically never changes, so we only
// ask REST Countries once and then reuse the answer.
let cachedCountries = null;


app.get("/api/countries", async function(req, res) {

    if (cachedCountries) {

        return res.json(cachedCountries);

    }


    try {

        const response = await fetch(
            "https://api.restcountries.com/countries/v5?region=Europe&limit=100&response_fields=names.common,codes.alpha_2,flag.emoji",
            {
                headers: {
                    Authorization: process.env.REST_COUNTRIES_KEY
                }
            }
        );


        if (!response.ok) {

            return res.status(response.status).json({
                error: "Failed to fetch countries"
            });

        }


        const data = await response.json();


        // Turn the API's big objects into a simple list
        // the frontend can use directly:
        // [ { name: "Denmark", code: "DK" }, ... ]

        cachedCountries = data.data.objects

            .map(function(country) {

                return {
                    name: country.names.common,
                    code: country.codes.alpha_2
                };

            })

            .filter(function(country) {

                return country.name && country.code;

            })

            .sort(function(a, b) {

                return a.name.localeCompare(b.name);

            });


        res.json(cachedCountries);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Server error"
        });

    }

});



// Start the server
app.listen(3000, function() {

    console.log(
        "Roamly is running at http://localhost:3000"
    );

});
