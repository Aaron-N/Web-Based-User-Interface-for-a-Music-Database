module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getLabelStreams(res, mysql, context, complete){
        mysql.pool.query("SELECT Label_Stream.labelStreamID, Streaming_Services.name AS streamingService, Record_Labels.name AS recordLabel FROM Label_Stream INNER JOIN Streaming_Services ON Streaming_Services.serviceID = Label_Stream.streamingService INNER JOIN Record_Labels ON Record_Labels.labelID = Label_Stream.recordLabel ORDER BY Label_Stream.labelStreamID ASC", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.label_stream = results;
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

    function getStreamingServices(res, mysql, context, complete){
        mysql.pool.query("SELECT serviceID, name FROM Streaming_Services", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.streaming_services = results;
            complete();
        });
    }

    function getLabelStreambyRecordLabel(req, res, mysql, context, complete){
      var query = "SELECT Label_Stream.labelStreamID, Streaming_Services.name AS streamingService, Record_Labels.name AS recordLabel FROM Label_Stream INNER JOIN Streaming_Services ON Streaming_Services.serviceID = Label_Stream.streamingService INNER JOIN Record_Labels ON Record_Labels.labelID = Label_Stream.recordLabel WHERE Label_Stream.recordLabel = ?";
      console.log(req.params)
      var inserts = [req.params.recordLabel]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.label_stream = results;
            complete();
        });
    }

    function getLabelStreambyStreamingService(req, res, mysql, context, complete){
      var query = "SELECT Label_Stream.labelStreamID, Streaming_Services.name AS streamingService, Record_Labels.name AS recordLabel FROM Label_Stream INNER JOIN Streaming_Services ON Streaming_Services.serviceID = Label_Stream.streamingService INNER JOIN Record_Labels ON Record_Labels.labelID = Label_Stream.recordLabel WHERE Label_Stream.streamingService = ?";
      console.log(req.params)
      var inserts = [req.params.streamingService]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.label_stream = results;
            complete();
        });
    }

    /*function getLabelStreambyLabelOrService(req, res, mysql, context, complete){
        var queryString;
        console.log(req.params)
        //var streamingServiceID = req.params.streamingService
        //var recordLabelID = req.params.recordLabel
        //var inserts = [req.params.streamingService, req.params.recordLabel]
        if (!req.params){
            queryString = "SELECT labelStreamID, Streaming_Services.name, Record_Labels.name FROM Label_Stream INNER JOIN Streaming_Services ON streamingService = Streaming_Services.serviceID INNER JOIN Record_Labels ON recordLabel = Record_Labels.labelID";
            console.log(queryString)
        }
        else if (!req.params.streamingService){
            queryString = "SELECT labelStreamID, Streaming_Services.name, Record_Labels.name FROM Label_Stream INNER JOIN Streaming_Services ON streamingService = Streaming_Services.serviceID INNER JOIN Record_Labels ON recordLabel = Record_Labels.labelID WHERE Label_Stream.recordLabel = " + mysql.pool.escape(req.params.recordLabel);
            console.log(queryString)
        }
        else if (!req.params.recordLabel){
            queryString = "SELECT labelStreamID, Streaming_Services.name, Record_Labels.name FROM Label_Stream INNER JOIN Streaming_Services ON streamingService = Streaming_Services.serviceID INNER JOIN Record_Labels ON recordLabel = Record_Labels.labelID WHERE Label_Stream.streamingService = " + mysql.pool.escape(req.params.streamingService);
            console.log(queryString)
        }
        else{
            queryString = "SELECT labelStreamID, Streaming_Services.name, Record_Labels.name FROM Label_Stream INNER JOIN Streaming_Services ON streamingService = Streaming_Services.serviceID INNER JOIN Record_Labels ON recordLabel = Record_Labels.labelID WHERE Label_Stream.streamingService = " + mysql.pool.escape(req.params.streamingService) + " AND Label_Stream.recordLabel = " + mysql.pool.escape(req.params.recordLabel);
            console.log(queryString)
        }
        mysql.pool.query(queryString, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.label_stream = results;
            complete();
        });
    }*/

    /*Display a single label stream based on labelStreamID.*/

    function getLabelStream(res, mysql, context, id, complete){
        var sql = "SELECT Label_Stream.labelStreamID, Streaming_Services.name AS streamingService, Record_Labels.name AS recordLabel FROM Label_Stream INNER JOIN Streaming_Services ON Streaming_Services.serviceID = Label_Stream.streamingService INNER JOIN Record_Labels ON Record_Labels.labelID = Label_Stream.recordLabel WHERE labelStreamID = ?";
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

    /* The URI that update data is sent to in order to update a label stream relationship. */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Label_Stream SET streamingService=?, recordLabel=? WHERE labelStreamID=?";
        var inserts = [req.body.streamingService, req.body.recordLabel, req.params.id];
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

    /*V.2 The URI that update data is sent to in order to update a label stream. On update page.*/

    router.put('update/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Label_Stream SET streamingService=?, recordLabel=? WHERE labelStreamID=?";
        var inserts = [req.body.streamingService, req.body.recordLabel, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.redirect('/label_stream');
            }
        });
    });

    /*Display all label streams. Requires web based javascript to delete users with AJAX.*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletelabelstream.js","filterlabelstream.js","searchlabelstream.js","updatelabelstream.js"];
        var mysql = req.app.get('mysql');
        getLabelStreams(res, mysql, context, complete);
        getStreamingServices(res, mysql, context, complete);
        getRecordLabels(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('label_stream', context);
            }

        }
    });

    /*Display one label stream to update it on the update page.*/

    router.get('/update/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletelabelstream.js","filterlabelstream.js","searchlabelstream.js","updatelabelstream.js"];
        var mysql = req.app.get('mysql');
        getRecordLabel(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update', context);
            }

        }
    });

    /*Display all label streams currently with a given record label. Requires web based javascript to delete users
     with AJAX.*/

    router.get('/search/:recordLabel', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletelabelstream.js","filterlabelstream.js","searchlabelstream.js","updatelabelstream.js"];
        var mysql = req.app.get('mysql');
        getLabelStreambyRecordLabel(req,res, mysql, context, complete);
        getStreamingServices(res, mysql, context, complete);
        getRecordLabels(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('label_stream', context);
            }

        }
    });

    /*Display all label streams by a given streaming service. Requires web based javascript to delete users with AJAX.*/

    router.get('/search/:streamingService', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletelabelstream.js","filterlabelstream.js","searchlabelstream.js","updatelabelstream.js"];
        var mysql = req.app.get('mysql');
        getLabelStreambyStreamingService(req,res, mysql, context, complete);
        getStreamingServices(res, mysql, context, complete);
        getRecordLabels(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('label_stream', context);
            }

        }
    });

    /*Display all label streams in search. Requires web based javascript to delete users with AJAX 
    router.get('/search/:streamingService/:recordLabel', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletelabelstream.js","filterlabelstream.js","searchlabelstream.js"];
        var mysql = req.app.get('mysql');
        getLabelStreambyLabelOrService(req, res, mysql, context, complete);
        getStreamingServices(res, mysql, context, complete);
        getRecordLabels(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('label_stream', context);
            }
        }
    });*/

    /* Adds a label stream relationship, redirects to the label stream page after adding */

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Label_Stream (streamingService, recordLabel) VALUES (?,?)";
        var inserts = [req.body.streamingService, req.body.recordLabel];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/label_stream');
            }
        });
    });

    /* Route to delete a label stream, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Label_Stream WHERE labelStreamID = ?";
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