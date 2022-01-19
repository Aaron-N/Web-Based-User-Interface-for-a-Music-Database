module.exports = function(){
    var express = require('express');
    var router = express.Router();

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

    /* Find streaming services whose name starts with a given string in the req */
    function getStreamingServicesWithNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT serviceID, name FROM Streaming_Services WHERE Streaming_Services.name LIKE " + mysql.pool.escape(req.params.s + '%');
      console.log(query)

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.streaming_services = results;
            complete();
        });
    }

    function getStreamingService(res, mysql, context, id, complete){
        var sql = "SELECT serviceID, name FROM Streaming_Services WHERE serviceID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.streaming_services = results[0];
            complete();
        });
    }

        /* The URI that update data is sent to in order to update a streaming service.*/

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Streaming_Services SET name=? WHERE serviceID=?";
        var inserts = [req.body.name, req.params.id];
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

    /*V.2 The URI that update data is sent to in order to update a streaming service. On update page.*/

    router.put('update/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Streaming_Services SET name=? WHERE labelID=?";
        var inserts = [req.body.name, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.redirect('/streaming_services');
            }
        });
    });

    /*Display all streaming services. Requires web based javascript to delete users with AJAX.*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletestreamingservice.js","searchstreamingservices.js","updatestreamingservice.js"];
        var mysql = req.app.get('mysql');
        getStreamingServices(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('streaming_services', context);
            }

        }
    });

    /*Display one streaming service to update it on the update page.*/

    router.get('/update/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletestreamingservice.js","searchstreamingservices.js","updatestreamingservice.js"];
        var mysql = req.app.get('mysql');
        getRecordLabel(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update', context);
            }

        }
    });

    /*Display all streaming services whose name starts with a given string. Requires web based javascript to delete
     users*/
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletestreamingservice.js","searchstreamingservices.js","updatestreamingservice.js"];
        var mysql = req.app.get('mysql');
        getStreamingServicesWithNameLike(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('streaming_services', context);
            }
        }
    });

    /* Adds a streaming service, redirects to the streaming services page after adding */

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Streaming_Services (name) VALUES (?)";
        var inserts = [req.body.name];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/streaming_services');
            }
        });
    });

    /* Route to delete a streaming service, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Streaming_Services WHERE serviceID = ?";
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