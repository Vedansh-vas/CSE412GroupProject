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
