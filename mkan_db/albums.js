module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getAlbums(res, mysql, context, complete){
        mysql.pool.query("SELECT Albums.albumID, Albums.albumName, Artists.name AS artist, Record_Labels.name AS recordLabel, Albums.releaseDate FROM Albums INNER JOIN Artists ON Artists.artistID = Albums.artist INNER JOIN Record_Labels ON Record_Labels.labelID = Albums.recordLabel", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.albums = results;
            complete();
        });
    }

    function getRecordLabels(res, mysql, context, complete){
        mysql.pool.query("SELECT labelID, name FROM Record_Labels", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.record_labels = results;
            complete();
        });
    }

    function getArtists(res, mysql, context, complete){
        mysql.pool.query("SELECT artistID, name FROM Artists", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.artists = results;
            complete();
        });
    }

    function getAlbumsbyRecordLabel(req, res, mysql, context, complete){
      var query = "SELECT Albums.albumID, Albums.albumName, Artists.name AS artist, Record_Labels.name AS recordLabel, Albums.releaseDate FROM Albums INNER JOIN Artists ON Artists.artistID = Albums.artist INNER JOIN Record_Labels ON Record_Labels.labelID = Albums.recordLabel WHERE Albums.recordLabel = ?";
      console.log(req.params)
      var inserts = [req.params.recordLabel]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.albums = results;
            complete();
        });
    }

    function getAlbumsbyArtist(req, res, mysql, context, complete){
      var query = "SELECT Albums.albumID, Albums.albumName, Artists.name AS artist, Record_Labels.name AS recordLabel, Albums.releaseDate FROM Albums INNER JOIN Artists ON Artists.artistID = Albums.artist INNER JOIN Record_Labels ON Record_Labels.labelID = Albums.recordLabel WHERE Albums.artist = ?";
      console.log(req.params)
      var inserts = [req.params.artist]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.albums = results;
            complete();
        });
    }

    /* Find albums whose name starts with a given string in the req*/
    function getAlbumsWithNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT Albums.albumID, Albums.albumName, Artists.name AS artist, Record_Labels.name AS recordLabel, Albums.releaseDate FROM Albums INNER JOIN Artists ON Artists.artistID = Albums.artist INNER JOIN Record_Labels ON Record_Labels.labelID = Albums.recordLabel WHERE Albums.name LIKE " + mysql.pool.escape(req.params.s + '%');
      console.log(query)

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.albums = results;
            complete();
        });
    }

     /* Find albums by name, artist, record label.
    function getAlbumsByNameArtistLabel(req, res, mysql, context, complete) {
      
        var queryString;
        //var inserts = [req.params.artist, req.params.recordLabel]
        console.log(req.params)
        if (!req.params){
            queryString = "SELECT albumID, albumName, Artists.name, Record_Labels.name, releaseDate FROM Albums INNER JOIN Artists ON artist = Artists.artistID INNER JOIN Record_Labels ON Albums.recordLabel = Record_Labels.labelID";
            console.log(queryString)
        }
        else if (!req.params.albumName && !req.params.artist){
            queryString = "SELECT albumID, albumName, Artists.name, Record_Labels.name, releaseDate FROM Albums INNER JOIN Artists ON artist = Artists.artistID INNER JOIN Record_Labels ON Albums.recordLabel = Record_Labels.labelID WHERE Albums.recordLabel = " + mysql.pool.escape(req.params.recordLabel);
            console.log(queryString)
        }
        else if (!req.params.albumName && !req.params.recordLabel){
            queryString = "SELECT albumID, albumName, Artists.name, Record_Labels.name, releaseDate FROM Albums INNER JOIN Record_Labels ON Albums.recordLabel = Record_Labels.labelID INNER JOIN Artists ON artist = Artists.artistID WHERE Albums.artist = " + mysql.pool.escape(req.params.artist);
            console.log(queryString)
        }
        else if (!req.params.artist && !req.params.recordLabel){
            queryString = "SELECT albumID, albumName, Artists.name, Record_Labels.name, releaseDate FROM Albums INNER JOIN Artists ON artist = Artists.artistID INNER JOIN Record_Labels ON Albums.recordLabel = Record_Labels.labelID WHERE Albums.albumName LIKE " + mysql.pool.escape(req.params.albumName + '%');
            console.log(queryString)
        }
        else if (!req.params.albumName){
            queryString = "SELECT albumID, albumName, Artists.name, Record_Labels.name, releaseDate FROM Albums INNER JOIN Record_Labels ON Albums.recordLabel = Record_Labels.labelID INNER JOIN Artists ON artist = Artists.artistID WHERE Albums.artist = " + mysql.pool.escape(req.params.artist) + " AND Albums.recordLabel = " + mysql.pool.escape(req.params.recordLabel);
            console.log(queryString)
        }
        else if (!req.params.artist){
            queryString = "SELECT albumID, albumName, Artists.name, Record_Labels.name, releaseDate FROM Albums INNER JOIN Artists ON artist = Artists.artistID INNER JOIN Record_Labels ON Albums.recordLabel = Record_Labels.labelID WHERE Albums.recordLabel = " + mysql.pool.escape(req.params.recordLabel) + " AND Albums.albumName LIKE " + mysql.pool.escape(req.params.albumName + '%');
            console.log(queryString)
        }
        else if (!req.params.recordLabel){
            queryString = "SELECT albumID, albumName, Artists.name, Record_Labels.name, releaseDate FROM Albums INNER JOIN Artists ON artist = Artists.artistID INNER JOIN Record_Labels ON Albums.recordLabel = Record_Labels.labelID WHERE Albums.artist = " + mysql.pool.escape(req.params.artist) + " AND Albums.albumName LIKE " + mysql.pool.escape(req.params.albumName + '%');
            console.log(queryString)
        }
        else{
            queryString = "SELECT albumID, albumName, Artists.name, Record_Labels.name, releaseDate FROM Albums INNER JOIN Artists ON artist = Artists.artistID INNER JOIN Record_Labels ON Albums.recordLabel = Record_Labels.labelID WHERE Albums.artist = " + mysql.pool.escape(req.params.artist) + " AND Albums.recordLabel = " + mysql.pool.escape(req.params.recordLabel) + " AND Albums.albumName LIKE " + mysql.pool.escape(req.params.albumName + '%');
            console.log(queryString)
        }

        mysql.pool.query(queryString, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.albums = results;
            complete();
        });
    }*/

    /*Display one album based on albumID.*/

    function getAlbum(res, mysql, context, id, complete){
        var sql = "SELECT Albums.albumID, Albums.albumName, Artists.name AS artist, Record_Labels.name AS recordLabel, Albums.releaseDate FROM Albums INNER JOIN Artists ON Artists.artistID = Albums.artist INNER JOIN Record_Labels ON Record_Labels.labelID = Albums.recordLabel WHERE albumID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.albums = results[0];
            complete();
        });
    }

    /* The URI that update data is sent to in order to update an album.*/

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Albums SET albumName=?, artist=?, recordLabel=?, releaseDate=? WHERE albumID=?";
        var inserts = [req.body.albumName, req.body.artist, req.body.recordLabel, req.body.releaseDate, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /*V.2 The URI that update data is sent to in order to update an album. On update page.*/

    router.put('update/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Albums SET albumName=?, artist=?, recordLabel=?, releaseDate=? WHERE albumID=?";
        var inserts = [req.body.albumName, req.body.artist, req.body.recordLabel, req.body.releaseDate, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.redirect('/albums');
            }
        });
    });

    /*Display all albums. Requires web based javascript to delete users with AJAX.*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletealbum.js","filteralbums.js","searchalbums.js","updatealbum.js"];
        var mysql = req.app.get('mysql');
        getAlbums(res, mysql, context, complete);
        getArtists(res, mysql, context, complete);
        getRecordLabels(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('albums', context);
            }

        }
    });

    /*Display one album to update it on the update page.*/

    router.get('/update/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletealbum.js","filteralbums.js","searchalbums.js","updatealbum.js"];
        var mysql = req.app.get('mysql');
        getRecordLabel(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update', context);
            }

        }
    });

    /*Display all albums currently with a given record label. Requires web based javascript to delete users with AJAX.*/

    router.get('/search/:recordLabel', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletealbum.js","filteralbums.js","searchalbums.js","updatealbum.js"];
        var mysql = req.app.get('mysql');
        getAlbumsbyRecordLabel(req,res, mysql, context, complete);
        getArtists(res, mysql, context, complete);
        getRecordLabels(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('albums', context);
            }

        }
    });

    /*Display all albums by a given artist. Requires web based javascript to delete users with AJAX.*/

    router.get('/search/:artist', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletealbum.js","filteralbums.js","searchalbums.js","updatealbum.js"];
        var mysql = req.app.get('mysql');
        getAlbumsbyArtist(req,res, mysql, context, complete);
        getArtists(res, mysql, context, complete);
        getRecordLabels(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('albums', context);
            }

        }
    });

    /*Display all albums whose name starts with a given string. Requires web based javascript to delete users with AJAX*/
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletealbum.js","filteralbums.js","searchalbums.js","updatealbum.js"];
        var mysql = req.app.get('mysql');
        getAlbumsWithNameLike(req, res, mysql, context, complete);
        getArtists(res, mysql, context, complete);
        getRecordLabels(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('albums', context);
            }
        }
    });

     /*Display all albums by search Requires web based javascript to delete users with AJAX.
    router.get('/search/:albumName/:artist/:recordLabel', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletealbum.js","filteralbums.js","searchalbums.js"];
        var mysql = req.app.get('mysql');
        getAlbumsByNameArtistLabel(req, res, mysql, context, complete);
        getArtists(res, mysql, context, complete);
        getRecordLabels(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('albums', context);
            }
        }
    });*/

    /* Adds an album, redirects to the albums page after adding */

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Albums (albumName, artist, recordLabel, releaseDate) VALUES (?,?,?,?)";
        var inserts = [req.body.albumName, req.body.artist, req.body.recordLabel, req.body.releaseDate];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/albums');
            }
        });
    });

    /* Route to delete an album, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Albums WHERE albumID = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();