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

// Recomendation Wrap Top Start 
document.querySelectorAll('.wrap').forEach($wrap => {
    const $carousel = $wrap.querySelector('.carousel');
    const $seats = $wrap.querySelectorAll('.carousel-seat');
    const $toggles = $wrap.querySelectorAll('.toggle');

    $toggles.forEach($toggle => {
        $toggle.addEventListener('click', (e) => {
        let $el = $wrap.querySelector('.carousel-seat.is-ref');
        let $newSeat;

        $el.classList.remove('is-ref');

        if ($toggle.dataset.toggle === 'next') {
            $newSeat = next($el);
            $carousel.classList.remove('is-reversing');
        } else {
            $newSeat = prev($el);
            $carousel.classList.add('is-reversing');
        }

        $newSeat.classList.add('is-ref');
        $newSeat.style.order = 1;
        let current = $newSeat;

        for (let i = 2; i <= $seats.length; i++) {
            current = next(current);
            current.style.order = i;
        }

        $carousel.classList.remove('is-set');
        setTimeout(() => {
            $carousel.classList.add('is-set');
        }, 50);
        });

        function next($el) {
        return $el.nextElementSibling || $seats[0];
        }

        function prev($el) {
        return $el.previousElementSibling || $seats[$seats.length - 1];
        }
        // function next($el) {
        //     const index = Array.from($seats).indexOf($el);
        //     return $seats[(index + 1) % $seats.length];
        //   }
          
        //   function prev($el) {
        //     const index = Array.from($seats).indexOf($el);
        //     console.log("prev")
        //     return $seats[(index - 1 + $seats.length) % $seats.length];
        //   }
    });
});  
// Recomendation Wrap Top End


// Muat data setelah halaman selesai dimuat
document.addEventListener("DOMContentLoaded", fetchData);