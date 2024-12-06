const BASE_URL = "http://localhost:5000"; // Adjust as needed

// Function to handle search
async function searchSongs(event) {
    event.preventDefault();

    const searchQuery = document.getElementById("search").value;

    try {
        const response = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) throw new Error("Search failed");

        const results = await response.json();

        const resultsList = document.getElementById("results");
        resultsList.innerHTML = ""; // Clear previous results

        if (results.length === 0) {
            const noResults = document.createElement("li");
            noResults.textContent = "No results found.";
            resultsList.appendChild(noResults);
            return;
        }

        results.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = `${item.Title} by ${item.Artist} (${item.Genre}, ${item.Album})`;
            resultsList.appendChild(li);
        });
    } catch (error) {
        console.error("Search error:", error);
        alert("Failed to perform the search. Please try again.");
    }
}

// Attach event listener to the search form
document.getElementById("search-form").addEventListener("submit", searchSongs);
