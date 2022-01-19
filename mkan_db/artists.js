module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getArtists(res, mysql, context, complete){
        mysql.pool.query("SELECT Artists.artistID, Artists.name, Record_Labels.name AS recordLabel FROM Artists LEFT JOIN Record_Labels ON Record_Labels.labelID = Artists.recordLabel", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.artists = results;
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

    function getArtistsbyRecordLabel(req, res, mysql, context, complete){
      var query = "SELECT Artists.artistID, Artists.name, Record_Labels.name AS recordLabel FROM Artists LEFT JOIN Record_Labels ON Artists.recordLabel = Record_Labels.labelID WHERE Artists.recordLabel = ?";
      console.log(req.params)
      var inserts = [req.params.recordLabel]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.artists = results;
            complete();
        });
    }

    /* Find artists whose name starts with a given string in the req*/ 
    function getArtistsWithNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
        var query = "SELECT Artists.artistID, Artists.name, Record_Labels.name AS recordLabel FROM Artists LEFT JOIN Record_Labels ON Artists.recordLabel = Record_Labels.labelID WHERE Artists.name LIKE " + mysql.pool.escape(req.params.s + '%');
        console.log(query)

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.artists = results;
            complete();
        });
    }

    /* Find artists by name or record label.
    function getArtistsByNameRecordLabel(req, res, mysql, context, complete) {
      var queryString;
      console.log(req.params)
      //var recordLabelID = req.params.recordLabel;
      if (!req.params){
        queryString = "SELECT artistID, Artists.name, Record_Labels.name AS recordLabel FROM Artists INNER JOIN Record_Labels ON recordLabel = Record_Labels.labelID";
        console.log(queryString)
      }
      else if (!req.params.recordLabel){
        queryString = "SELECT artistID, Artists.name, Record_Labels.name AS recordLabel FROM Artists INNER JOIN Record_Labels ON recordLabel = Record_Labels.labelID WHERE Artists.name LIKE " + mysql.pool.escape(req.params.s + '%');
        console.log(queryString)
      }
      else if (!req.params.s){
        queryString = "SELECT artistID, Artists.name, Record_Labels.name AS recordLabel FROM Artists INNER JOIN Record_Labels ON recordLabel = Record_Labels.labelID WHERE Artists.recordLabel = " + mysql.pool.escape(req.params.recordLabel);
        console.log(queryString)
      }
      else{
        queryString = "SELECT artistID, Artists.name, Record_Labels.name AS recordLabel FROM Artists INNER JOIN Record_Labels ON recordLabel = Record_Labels.labelID WHERE Artists.recordLabel = " + mysql.pool.escape(req.params.recordLabel) + " AND Artists.name LIKE " + mysql.pool.escape(req.params.s + '%');
        console.log(queryString)
      }           

      mysql.pool.query(queryString, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.artists = results;
            complete();
        });
    }*/

    /*Display a single artist based on artistID.*/
    
    function getArtist(res, mysql, context, id, complete){
        var sql = "SELECT Artists.artistID, Artists.name, Record_Labels.name AS recordLabel FROM Artists LEFT JOIN Record_Labels ON Record_Labels.labelID = Artists.recordLabel WHERE artistID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.artists = results[0];
            complete();
        });
    }

    /*The URI that update data is sent to in order to update an artist.*/

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Artists SET name=?, recordLabel=? WHERE artistID=?";
        var inserts = [req.body.name, req.body.recordLabel, req.params.id];
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

    /*V.2 The URI that update data is sent to in order to update an artist. On update page.*/

    router.put('update/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Artists SET name=?, recordLabel=? WHERE artistID=?";
        var inserts = [req.body.name, req.body.recordLabel, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.redirect('/artists');
            }
        });
    });

    /*Display all artists. Requires web based javascript to delete users with AJAX.*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteartist.js","filterartists.js","searchartists.js","updateartist.js"];
        var mysql = req.app.get('mysql');
        getArtists(res, mysql, context, complete);
        getRecordLabels(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('artists', context);
            }

        }
    });

    /*Display one artist to update it on the update page.*/

    router.get('/update/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteartist.js","filterartists.js","searchartists.js","updateartist.js"];
        var mysql = req.app.get('mysql');
        getRecordLabel(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update', context);
            }

        }
    });

    /*Display all artists currently with a given record label. Requires web based javascript to delete users with AJAX.*/

    router.get('/search/:recordLabel', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteartist.js","filterartists.js","searchartists.js","updateartist.js"];
        var mysql = req.app.get('mysql');
        getArtistsbyRecordLabel(req,res, mysql, context, complete);
        getRecordLabels(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('artists', context);
            }

        }
    });

    /*Display all artists whose name starts with a given string. Requires web based javascript to delete users with AJAX.*/
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteartist.js","filterartists.js","searchartists.js","updateartist.js"];
        var mysql = req.app.get('mysql');
        getArtistsWithNameLike(req, res, mysql, context, complete);
        getRecordLabels(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('artists', context);
            }
        }
    });

    /*Display all artists in search. Requires web based javascript to delete users with AJAX 
    router.get('/search/:s/:recordLabel', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteartist.js","filterartists.js","searchartists.js"];
        var mysql = req.app.get('mysql');
        getArtistsByNameRecordLabel(req, res, mysql, context, complete);
        getRecordLabels(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('artists', context);
            }
        }
    });*/

    /* Adds an artist, redirects to the artists page after adding */

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Artists (name, recordLabel) VALUES (?,?)";
        var inserts = [req.body.name, req.body.recordLabel];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/artists');
            }
        });
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Artists WHERE artistID = ?";
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