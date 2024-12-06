USE music_management;
INSERT INTO Genre (GenreID, GenreName) VALUES
(1, 'Pop'),
(2, 'Rock'),
(3, 'Jazz'),
(4, 'Electronic'),
(5, 'Classical'),
(6, 'Blues'),
(7, 'Hip-Hop'),
(8, 'Reggae'),
(9, 'Country'),
(10, 'Indie'),
(11, 'Folk'),
(12, 'Metal'),
(13, 'R&B'),
(14, 'Soul'),
(15, 'Latin');

INSERT INTO Album (AlbumID, AlbumName, Artist, SongCount, Duration, ReleaseDate)
VALUES
(8, 'Album A', 'Artist A', 12, '00:39:15', '2020-02-10'),
(4, 'Album B', 'Artist B', 10, '00:44:22', '2019-03-05'),
(15, 'Album C', 'Artist C', 8, '00:34:10', '2021-05-17'),
(10, 'Album D', 'Artist D', 15, '00:49:50', '2022-07-21'),
(6, 'Album E', 'Artist E', 20, '00:58:45', '2020-01-15'),
(2, 'Album F', 'Artist F', 10, '00:52:30', '2018-04-08'),
(7, 'Album G', 'Artist G', 14, '00:46:10', '2021-11-03'),
(9, 'Album H', 'Artist H', 11, '00:41:30', '2019-06-12'),
(3, 'Album I', 'Artist I', 9, '00:36:05', '2020-08-18'),
(1, 'Album J', 'Artist J', 13, '00:48:45', '2021-09-25');


INSERT INTO Song (SongID, Title, ReleaseDate, Artist, Duration, AlbumID, GenreID)
VALUES
(5, 'Song A', '2020-01-01', 'Artist A', 215, 8, 1),
(14, 'Song B', '2019-04-02', 'Artist B', 255, 4, 2),
(3, 'Song C', '2021-05-15', 'Artist C', 325, 15, 3),
(12, 'Song D', '2022-08-07', 'Artist D', 195, 10, 4),
(9, 'Song E', '2020-06-25', 'Artist E', 350, 6, 5),
(7, 'Song F', '2018-10-11', 'Artist F', 290, 2, 6),
(11, 'Song G', '2021-12-05', 'Artist G', 220, 7, 7),
(2, 'Song H', '2019-03-09', 'Artist H', 245, 9, 8),
(8, 'Song I', '2020-11-20', 'Artist I', 195, 3, 9),
(1, 'Song J', '2021-07-30', 'Artist J', 290, 1, 10);


INSERT INTO User (UserID, Username, Email, Password, DaysRegistered) VALUES
(13, 'user1', 'random1@domain.com', 'passA124', 100),
(5, 'user2', 'unique2@domain.com', 'secureB457', 200),
(8, 'user3', 'distinct3@domain.com', 'lockC792', 150),
(2, 'user4', 'user4_special@domain.com', 'keyD013', 300),
(10, 'user5', 'mail5_here@domain.com', 'safeE348', 400),
(11, 'user6', 'example6@domain.com', 'vaultF679', 250),
(4, 'user7', 'random7_user@domain.com', 'guardG902', 350),
(14, 'user8', 'unique8@domain.com', 'lockH235', 175),
(1, 'user9', 'distinct9@domain.com', 'shieldI568', 225),
(6, 'user10', 'random10@domain.com', 'defendJ891', 275),
(12, 'user11', 'unique11@domain.com', 'protectK124', 325),
(3, 'user12', 'distinct12@domain.com', 'fortL457', 375),
(9, 'user13', 'user13_special@domain.com', 'safeM790', 425),
(15, 'user14', 'mail14_here@domain.com', 'secureN013', 450),
(7, 'user15', 'example15@domain.com', 'lockO346', 500);


INSERT INTO Playlist (PlaylistID, PlaylistName, CreationDate, Description, UserID, SongID)
VALUES
(9, 'Chill Vibes', '2023-03-15', 'Relaxing music for studying', 13, 5),
(1, 'Workout Mix', '2023-01-20', 'High-energy workout tunes', 5, 14),
(8, 'Party Hits', '2023-04-12', 'Popular hits for parties', 8, 3),
(3, 'Classical', '2023-02-14', 'Soothing classical music', 2, 12),
(6, 'Road Trip', '2023-05-21', 'Perfect for long drives', 10, 9),
(4, 'Focus', '2023-03-05', 'Focus-enhancing tracks', 11, 7),
(15, 'Jazz Collection', '2023-04-27', 'Classic jazz favorites', 4, 11),
(12, 'Pop Essentials', '2023-06-10', 'Top pop hits', 14, 2),
(7, 'Retro Playlist', '2023-07-19', 'Hits from the 80s and 90s', 1, 8),
(10, 'Acoustic', '2023-08-13', 'Unplugged and acoustic versions', 6, 1);