const BASE_URL = "http://localhost:5000";

// Function to fetch and populate genres and albums
async function populateDropdowns() {
    try {
        const [genreResponse, albumResponse] = await Promise.all([
            fetch(`${BASE_URL}/genres`),
            fetch(`${BASE_URL}/albums`)
        ]);

        if (!genreResponse.ok || !albumResponse.ok) {
            throw new Error("Failed to fetch genres or albums.");
        }

        const genres = await genreResponse.json();
        const albums = await albumResponse.json();

        const genreDropdown = document.getElementById("genre");
        const albumDropdown = document.getElementById("album");

        genreDropdown.innerHTML = '<option value="">Select Genre</option>';
        albumDropdown.innerHTML = '<option value="">None</option>';

        genres.forEach((genre) => {
            const option = document.createElement("option");
            option.value = genre.GenreName;
            option.textContent = genre.GenreName;
            genreDropdown.appendChild(option);
        });

        albums.forEach((album) => {
            const option = document.createElement("option");
            option.value = album.AlbumName;
            option.textContent = album.AlbumName;
            albumDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error populating dropdowns:", error);
        alert("Failed to load genres or albums.");
    }
}

// Function to add a new song
async function addSong(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const release_date = document.getElementById("release_date").value;
    const artist = document.getElementById("artist").value;
    const duration = document.getElementById("duration").value;
    const genre = document.getElementById("genre").value;
    const album = document.getElementById("album").value;

    try {
        const response = await fetch(`${BASE_URL}/add_song`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, release_date, artist, duration, genre, album_name: album })
        });

        if (response.ok) {
            alert("Song added successfully!");
            document.getElementById("add-song-form").reset();
            renderSongs();
        } else {
            const error = await response.json();
            alert(`Error adding song: ${error.error}`);
        }
    } catch (error) {
        alert("Failed to connect to the server.");
    }
}

// Function to fetch and render all songs
async function renderSongs() {
    try {
        const response = await fetch(`${BASE_URL}/songs`);
        if (!response.ok) throw new Error("Failed to fetch songs.");

        const songs = await response.json();
        const songList = document.getElementById("song-list");
        songList.innerHTML = ""; // Clear existing songs

        songs.forEach((song) => {
            const li = document.createElement("li");
            li.textContent = `${song.Title} by ${song.Artist} (${song.Genre}, ${song.Album})`;
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => deleteSong(song.SongID);
            li.appendChild(deleteButton);
            songList.appendChild(li);
        });
    } catch (error) {
        alert("Failed to load songs.");
    }
}

// Function to delete a song
async function deleteSong(songId) {
    try {
        const response = await fetch(`${BASE_URL}/delete_song/${songId}`, { method: "DELETE" });
        if (response.ok) {
            alert("Song deleted successfully!");
            renderSongs();
        } else {
            alert("Error deleting song.");
        }
    } catch (error) {
        alert("Failed to connect to the server.");
    }
}

// Event listeners
document.getElementById("add-song-form").addEventListener("submit", addSong);
document.addEventListener("DOMContentLoaded", () => {
    populateDropdowns();
    renderSongs();
});
