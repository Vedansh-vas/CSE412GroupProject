-- -- 创建数据库
DROP DATABASE IF EXISTS music_management;
CREATE DATABASE music_management
DEFAULT CHARACTER SET utf8mb4 
DEFAULT COLLATE utf8mb4_general_ci;

USE music_management;

-- 创建所有表
DROP TABLE IF EXISTS Playlist;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Song;
DROP TABLE IF EXISTS Album;
DROP TABLE IF EXISTS Genre;

CREATE TABLE Genre (
    GenreID INT PRIMARY KEY,
    GenreName VARCHAR(255) NOT NULL
);

CREATE TABLE Album (
    AlbumID INT PRIMARY KEY,
    AlbumName VARCHAR(255) NOT NULL,
    Artist VARCHAR(255) NOT NULL,
    SongCount INT DEFAULT 0,
    Duration TIME,
    ReleaseDate DATE NOT NULL
);

CREATE TABLE Song (
    SongID INT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    ReleaseDate DATE,
    Artist VARCHAR(255) NOT NULL,
    Duration INT,
    AlbumID INT,
    GenreID INT,
    FOREIGN KEY (AlbumID) REFERENCES Album(AlbumID) ON DELETE SET NULL,
    FOREIGN KEY (GenreID) REFERENCES Genre(GenreID) ON DELETE SET NULL
);

CREATE TABLE User (
    UserID INT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    DaysRegistered INT
);

CREATE TABLE Playlist (
    PlaylistID INT PRIMARY KEY,
    PlaylistName VARCHAR(255) NOT NULL,
    CreationDate DATE,
    Description TEXT,
    UserID INT NOT NULL,
    SongID INT,
    FOREIGN KEY (SongID) REFERENCES Song(SongID),
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

