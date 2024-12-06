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

            // Add Edit button
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.onclick = () => showEditModal(song);

            // Add Delete button
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => deleteSong(song.SongID);

            li.prepend(editButton); // Add Edit button first
            li.appendChild(deleteButton);
            songList.appendChild(li);
        });
    } catch (error) {
        alert("Failed to load songs.");
    }
}

function showEditModal(song) {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
        <div>
            <h3>Edit Song</h3>
            <form id="edit-song-form">
                <label for="edit-title">Title:</label>
                <input id="edit-title" type="text" value="${song.Title}" required>

                <label for="edit-artist">Artist:</label>
                <input id="edit-artist" type="text" value="${song.Artist}" required>

                <label for="edit-genre">Genre:</label>
                <input id="edit-genre" type="text" value="${song.Genre}" required>

                <label for="edit-album">Album:</label>
                <input id="edit-album" type="text" value="${song.Album || ''}">

                <label for="edit-duration">Duration:</label>
                <input id="edit-duration" type="number" value="${song.Duration}" required>

                <button type="submit">Save Changes</button>
                <button type="button" id="cancel-edit">Cancel</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("edit-song-form").onsubmit = (e) => updateSong(e, song.SongID);
    document.getElementById("cancel-edit").onclick = () => modal.remove();
}

async function updateSong(event, songId) {
    event.preventDefault();
    const updatedData = {
        title: document.getElementById("edit-title").value,
        artist: document.getElementById("edit-artist").value,
        genre: document.getElementById("edit-genre").value,
        album: document.getElementById("edit-album").value,
        duration: document.getElementById("edit-duration").value,
    };

    try {
        const response = await fetch(`${BASE_URL}/update_song/${songId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
        });

        if (response.ok) {
            alert("Song updated successfully!");
            renderSongs();
            document.querySelector(".modal").remove();
        } else {
            alert("Failed to update song.");
        }
    } catch (error) {
        alert("Error connecting to the server.");
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
