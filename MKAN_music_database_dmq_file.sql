-- Group 103 Team MKAN Database Manipulation Queries for CS340 Project website using the MKAN Music Database
--Data input from website forms is indicated with a colon (:) before the data name

--Populate dropdown menus on the index page of the website and subsequent pages
SELECT artistID, name FROM artists
SELECT albumID, albumName FROM albums
SELECT labelID, name FROM record_labels
SELECT serviceID, name FROM streaming_services

--Index page query
SELECT artists.name AS Artist, album_rs_joint.albumName AS Album, album_rs_joint.releaseDate AS Release_Date,
 album_rs_joint.label_name AS Record_Label, album_rs_joint.service_name AS Streaming_Service FROM artists JOIN
	(SELECT albums.albumID, albums.albumName, albums.artist, albums.releaseDate, rs_joint.labelID, rs_joint.label_name, rs_joint.service_name FROM albums JOIN
		(SELECT record_labels.labelID, record_labels.name AS label_name, label_stream_info.name AS service_name FROM record_labels JOIN
			(SELECT streaming_services.serviceID, streaming_services.name, label_stream.recordLabel FROM label_stream JOIN 
				(SELECT * FROM streaming_services WHERE streaming_services.serviceID = :serviceInput) 
			ON label_stream.streamingService = streaming_services.serviceID AS label_stream_info)
		ON record_labels.labelID = label_stream_info.recordLabel WHERE record_labels.labelID = :labelInput AS rs_joint)
	ON albums.recordLabel = rs_joint.labelID WHERE albums.albumName = :albumNameInput AND albums.releaseDate = :dateInput AS album_rs_joint)
ON artists.artistID = album_rs_joint.artist WHERE artists.name = :artistInput

--Artists page queries
--Add a new artist
INSERT INTO artists (name, recordLabel) VALUES (:nameInput, :labelInput)

--Display artists on the Artists page using Search form
SELECT * FROM artists WHERE name = :nameInput AND recordLabel = :labelInput

--Display all artists
SELECT * FROM artists

--Update an entry in the artists entity table
UPDATE artists SET name = :nameInput, recordLabel = :labelInput WHERE artistID = :artistID_from_row

--Delete an entry from the artists entity table
DELETE FROM artists WHERE artistID = :artistID_from_row

--Albums page queries
--Add new album
INSERT INTO albums (albumName, artist, recordLabel, releaseDate) 
VALUES (:albumNameInput, :artistInput, :labelInput, :dateInput)

--Display albums on the Albums page using Search form
SELECT * FROM albums WHERE albumName = :albumNameInput AND artist = :artistInput AND recordLabel = :labelInput 
AND releaseDate = :dateInput

--Display all albums
SELECT * FROM albums

--Update an entry in the albums entity table
UPDATE albums SET albumName = :albumNameInput, artist = :artistInput, recordLabel = :labelInput, releaseDate = :dateInput 
WHERE albumID = :albumID_from_row

--Delete an entry from the albums entity table
DELETE FROM albums WHERE albumID = :albumID_from_row

--Record Labels page queries
--Add new record label
INSERT INTO record_labels (name) VALUES (:labelNameInput)

--Display record labels on the Record Labels page using Search form
SELECT * FROM record_labels WHERE name = :labelNameInput

--Display all record labels
SELECT * FROM record_labels

--Update an entry in the record labels entity table
UPDATE record_labels SET name = :labelNameInput WHERE labelID = :labelID_from_row

--Delete an entry from the record labels entity table
DELETE FROM record_labels WHERE labelID = :labelID_from_row

--Streaming Services page queries
--Add new streaming service
INSERT INTO streaming_services (name) VALUES (:serviceNameInput)

--Display streaming services on the Streaming Services page using Search form
SELECT * FROM streaming_services WHERE name = :serviceNameInput

--Display all streaming services
SELECT * FROM streaming_services

--Update an entry in the streaming services entity table
UPDATE streaming_services SET name = :serviceNameInput WHERE serviceID = :serviceID_from_row

--Delete an entry from the streaming services entity table
DELETE FROM streaming_services WHERE serviceID = :serviceID_from_row

--Label Stream page queries
--Add new label stream
INSERT INTO label_stream (streamingService, recordLabel) VALUES (:serviceInput, :labelInput)

--Display label stream on the Label Stream page using Search form
SELECT * FROM label_stream WHERE streamingService = :serviceInput AND recordLabel = :labelInput

--Display all label streams
SELECT * FROM label_stream

--Display record labels on the Label Stream page for reference
SELECT * FROM record_labels

--Display streaming services on the Label Stream page for reference
SELECT * FROM streaming_services

--Update an entry in the label stream entity table
UPDATE label_stream SET streamingService = :serviceInput, recordLabel = :labelInput 
WHERE labelStreamID = :labelStreamID_from_row

--Delete an entry from the label stream entity table
DELETE FROM label_stream WHERE labelStreamID = :labelStreamID_from_row
