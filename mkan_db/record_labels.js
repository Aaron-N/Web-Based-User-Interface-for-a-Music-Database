module.exports = function(){
    var express = require('express');
    var router = express.Router();

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

    /* Find record labels whose name starts with a given string in the req */
    function getRecordLabelsWithNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT labelID, name FROM Record_Labels WHERE Record_Labels.name LIKE " + mysql.pool.escape(req.params.s + '%');
      console.log(query)

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.record_labels = results;
            complete();
        });
    }

    function getRecordLabel(res, mysql, context, id, complete){
        var sql = "SELECT labelID, name FROM Record_Labels WHERE labelID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.record_labels = results[0];
            complete();
        });
    }

    /*V.1 The URI that update data is sent to in order to update a record label.*/

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Record_Labels SET name=? WHERE labelID=?";
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

    /*V.2 The URI that update data is sent to in order to update a record label. On update page.*/

    router.put('update/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Record_Labels SET name=? WHERE labelID=?";
        var inserts = [req.body.name, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.redirect('/record_labels');
            }
        });
    });

    /*Display all record labels. Requires web based javascript to delete users with AJAX.*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleterecordlabel.js","searchrecordlabels.js","updaterecordlabel.js"];
        var mysql = req.app.get('mysql');
        getRecordLabels(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('record_labels', context);
            }

        }
    });

    /*Display one record label to update it on the update page.*/

    router.get('/update/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleterecordlabel.js","searchrecordlabels.js","updaterecordlabel.js"];
        var mysql = req.app.get('mysql');
        getRecordLabel(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update', context);
            }

        }
    });

    /*Display all record labels whose name starts with a given string. Requires web based javascript to delete users with AJAX.*/
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleterecordlabel.js","searchrecordlabels.js","updaterecordlabel.js"];
        var mysql = req.app.get('mysql');
        getRecordLabelsWithNameLike(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('record_labels', context);
            }
        }
    });

    /* Adds a record label, redirects to the record labels page after adding */

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Record_Labels (name) VALUES (?)";
        var inserts = [req.body.name];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/record_labels');
            }
        });
    });

    /* Route to delete a record label, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Record_Labels WHERE labelID = ?";
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