document.addEventListener("DOMContentLoaded", () => {
    fetch("movies.json")
        .then(response => response.json())
        .then(data => {
            populateTable(data);
            populateFilters(data);
        }) 
        .catch(error => console.error("Error loading movie data:", error));
});

// Populate table
function populateTable(movies) {
    const tableBody = document.querySelector("#movies-table tbody");

    // Sort movies by box office revenue (highest first)
    movies.sort((a, b) => Number(b.box_office) - Number(a.box_office));

    movies.forEach(movie => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${movie.title}</td>
            <td>${movie.release_year}</td>
            <td>${movie.director}</td>
            <td>$${Number(movie.box_office).toLocaleString()}</td>
            <td>${movie.country}</td>
        `;

        tableBody.appendChild(row);
    });
}


// Search Functionality
document.getElementById("searchInput").addEventListener("keyup", function() {
    let filter = this.value.toLowerCase();
    let rows = document.querySelectorAll("#movies-table tbody tr");

    rows.forEach(row => {
        let text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
    });
});

// Sorting Functionality
document.querySelectorAll("#movies-table thead th").forEach(header => {
    header.addEventListener("click", () => {
        let columnIndex = header.cellIndex;
        let tableBody = document.querySelector("#movies-table tbody");
        let rows = Array.from(tableBody.rows);
        let isAscending = header.classList.contains("asc");

        rows.sort((rowA, rowB) => {
            let cellA = rowA.cells[columnIndex].textContent.trim();
            let cellB = rowB.cells[columnIndex].textContent.trim();

            if (!isNaN(cellA) && !isNaN(cellB)) {
                return isAscending ? cellA - cellB : cellB - cellA;
            }

            return isAscending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
        });

        header.classList.toggle("asc", !isAscending);
        header.classList.toggle("desc", isAscending);

        tableBody.append(...rows);
    });
});

// Populate filter dropdowns
function populateFilters(movies) {
    let years = new Set();
    let directors = new Set();
    let countries = new Set();

    movies.forEach(movie => {
        years.add(movie.release_year);
        directors.add(movie.director);
        movie.country.split(",").forEach(c => countries.add(c.trim()));
    });

    populateDropdown("filterYear", years);
    populateDropdown("filterDirector", directors);
    populateDropdown("filterCountry", countries);
}

// Populate dropdown helper function
function populateDropdown(id, items) {
    let dropdown = document.getElementById(id);
    if (!dropdown) return;

    items.forEach(item => {
        let option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        dropdown.appendChild(option);
    });
}

// Filtering functionality
document.querySelectorAll("#filterYear, #filterDirector, #filterCountry").forEach(filter => {
    filter.addEventListener("change", filterMovies);
});

function filterMovies() {
    let selectedYear = document.getElementById("filterYear").value;
    let selectedDirector = document.getElementById("filterDirector").value;
    let selectedCountry = document.getElementById("filterCountry").value;

    let rows = document.querySelectorAll("#movies-table tbody tr");

    rows.forEach(row => {
        let year = row.cells[1].textContent;
        let director = row.cells[2].textContent;
        let country = row.cells[4].textContent;

        let matchYear = selectedYear === "" || year.includes(selectedYear);
        let matchDirector = selectedDirector === "" || director.includes(selectedDirector);
        let matchCountry = selectedCountry === "" || country.includes(selectedCountry);

        row.style.display = matchYear && matchDirector && matchCountry ? "" : "none";
    });
}
