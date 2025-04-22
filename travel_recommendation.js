let data = { countries: [], beaches: [], temples: [] }; // Data awal kosong

async function fetchData() {
    try {
        const response = await fetch("travel_recommendation_api.json");
        data = await response.json();
        displayPlaces(data.countries[0]?.cities || []);
        displayPlaces(data.countries[1]?.cities || []);
        displayPlaces(data.countries[2]?.cities || []);
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

function displayPlaces(places) {
    const container = document.getElementById("recommendation-container");
    if (!container) {
        console.error("Element #recommendation-container not found!");
        return;
    }

    // container.innerHTML = "";

    if (places.length === 0) {
        container.innerHTML = "<p>No results found.</p>";
        return;
    }

    places.forEach(place => {
        const card = document.createElement("div");
        card.classList.add("place-card");

        card.innerHTML = `
            <img src="${place.imageUrl}" alt="${place.name}">
            <h3>${place.name}</h3>
            <p>${place.description}</p>
            <button>Select</button>
        `;

        container.appendChild(card);
    });
}

function searchPlaces() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    let results = [];

    if (query === "countries") {
        // Jika user mencari "countries", tampilkan semua kota dari semua negara
        data.countries.forEach(country => {
            results = results.concat(country.cities);
        });
    } else if (query === "beach" || query === "beaches") {
        // Jika user mencari "beach" atau "beaches", tampilkan semua pantai
        results = data.beaches;
    } else if (query === "temple" || query === "temples") {
        // Jika user mencari "temple" atau "temples", tampilkan semua kuil
        results = data.temples;
    } else {
        // Cari di dalam daftar kota dari setiap negara
        data.countries.forEach(country => {
            country.cities.forEach(city => {
                if (city.name.toLowerCase().includes(query)) {
                    results.push(city);
                }
            });
        });

        // Cari di dalam daftar pantai
        data.beaches.forEach(beach => {
            if (beach.name.toLowerCase().includes(query)) {
                results.push(beach);
            }
        });

        // Cari di dalam daftar kuil
        data.temples.forEach(temple => {
            if (temple.name.toLowerCase().includes(query)) {
                results.push(temple);
            }
        });
    }

    displayPlaces(results);
}

function resetSearch() {
    document.getElementById("searchInput").value = "";
    displayPlaces(data.countries[0]?.cities || []);
}

document.querySelectorAll(".recommendations").forEach((slider) => {
    const prevBtn = slider.querySelector(".prevBtn");
    const nextBtn = slider.querySelector(".nextBtn");
    const container = slider.querySelector(".recommendation");
    const card = container.querySelector(".place-card, .place-card2");
    if (!card) return;
    const cardWidth = card.offsetWidth + 1264; 

    function updateButtons() {
        console.log("l");
        prevBtn.style.display = container.scrollLeft > 0 ? "block" : "none";
        nextBtn.style.display = 
            container.scrollLeft + container.clientWidth >= container.scrollWidth
            ? "none" : "block";
    }

    nextBtn.addEventListener("click", () => {
        container.scrollLeft += cardWidth;
        setTimeout(updateButtons, 300);
    });

    prevBtn.addEventListener("click", () => {
        container.scrollLeft -= cardWidth;
        setTimeout(updateButtons, 300);
    });

    document.addEventListener("DOMContentLoaded", updateButtons);
});


// Muat data setelah halaman selesai dimuat
document.addEventListener("DOMContentLoaded", fetchData);