from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)

# Database connection setup
def get_db_connection():
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="postgres",
            user="postgres",
            password="19980902",
        )
        return conn
    except Exception as e:
        print("Database connection error:", e)
        return None

# API Endpoint: Get all genres
@app.route('/genres', methods=['GET'])
def get_genres():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT GenreID, GenreName FROM Genre")
        genres = cursor.fetchall()
        return jsonify([{"GenreID": genre[0], "GenreName": genre[1]} for genre in genres])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# API Endpoint: Get all albums
@app.route('/albums', methods=['GET'])
def get_albums():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT AlbumID, AlbumName FROM Album")
        albums = cursor.fetchall()
        return jsonify([{"AlbumID": album[0], "AlbumName": album[1]} for album in albums])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# API Endpoint: Add a new song
@app.route('/add_song', methods=['POST'])
def add_song():
    data = request.json
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    cursor = conn.cursor()
    try:
        # Check if Genre exists
        cursor.execute("SELECT GenreID FROM Genre WHERE GenreName = %s", (data['genre'],))
        genre = cursor.fetchone()
        if not genre:
            return jsonify({"error": "Genre not found"}), 400
        genre_id = genre[0]

        # Check if Album exists (if provided)
        album_id = None
        if data.get('album_name'):
            cursor.execute("SELECT AlbumID FROM Album WHERE AlbumName = %s", (data['album_name'],))
            album = cursor.fetchone()
            if not album:
                return jsonify({"error": "Album not found"}), 400
            album_id = album[0]

        # Insert the song
        cursor.execute(
            """
            INSERT INTO Song (Title, ReleaseDate, Artist, Duration, AlbumID, GenreID)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING SongID
            """,
            (data['title'], data['release_date'], data['artist'], data['duration'], album_id, genre_id)
        )
        song_id = cursor.fetchone()[0]
        conn.commit()
        return jsonify({"message": "Song added successfully", "SongID": song_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# API Endpoint: Update an existing song
@app.route('/update_song/<int:song_id>', methods=['PUT'])
def update_song(song_id):
    data = request.json
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE Song
            SET Title = %s, Artist = %s, GenreID = (
                SELECT GenreID FROM Genre WHERE GenreName = %s
            ), AlbumID = (
                SELECT AlbumID FROM Album WHERE AlbumName = %s
            ), Duration = %s
            WHERE SongID = %s
            """,
            (data['title'], data['artist'], data['genre'], data['album'], data['duration'], song_id)
        )
        conn.commit()
        return jsonify({"message": "Song updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# API Endpoint: Get all songs
@app.route('/songs', methods=['GET'])
def get_songs():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT SongID, Title, ReleaseDate, Artist, Duration, 
                   (SELECT AlbumName FROM Album WHERE AlbumID = Song.AlbumID) AS Album,
                   (SELECT GenreName FROM Genre WHERE GenreID = Song.GenreID) AS Genre
            FROM Song
        """)
        songs = cursor.fetchall()
        return jsonify([{
            "SongID": song[0],
            "Title": song[1],
            "ReleaseDate": song[2],
            "Artist": song[3],
            "Duration": song[4],
            "Album": song[5],
            "Genre": song[6]
        } for song in songs])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# API Endpoint: Delete a song
@app.route('/delete_song/<int:song_id>', methods=['DELETE'])
def delete_song(song_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM Song WHERE SongID = %s RETURNING SongID", (song_id,))
        deleted_song = cursor.fetchone()
        if deleted_song is None:
            return jsonify({"error": "Song not found"}), 404
        conn.commit()
        return jsonify({"message": "Song deleted successfully", "SongID": deleted_song[0]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Database connection setup
def get_db_connection():
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="postgres",
            user="postgres",
            password="19980902",
        )
        return conn
    except Exception as e:
        print("Database connection error:", e)
        return None

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query', '')

    if not query:
        return jsonify([])  # Return empty list for empty query

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor()
    try:
        search_query = f"%{query}%"  # Use SQL LIKE pattern
        cursor.execute("""
            SELECT SongID, Title, Artist, 
                   (SELECT GenreName FROM Genre WHERE GenreID = Song.GenreID) AS Genre, 
                   (SELECT AlbumName FROM Album WHERE AlbumID = Song.AlbumID) AS Album
            FROM Song
            WHERE Title ILIKE %s OR Artist ILIKE %s OR 
                  EXISTS (SELECT 1 FROM Genre WHERE Genre.GenreID = Song.GenreID AND Genre.GenreName ILIKE %s) OR
                  EXISTS (SELECT 1 FROM Album WHERE Album.AlbumID = Song.AlbumID AND Album.AlbumName ILIKE %s)
        """, (search_query, search_query, search_query, search_query))
        results = cursor.fetchall()
        return jsonify([{
            "SongID": row[0],
            "Title": row[1],
            "Artist": row[2],
            "Genre": row[3],
            "Album": row[4]
        } for row in results])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


if __name__ == '__main__':
    app.run(debug=True)