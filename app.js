
/**
 * Module dependencies.
 */

var express = require('express');
var fileUpload = require('express-fileupload');
var routes = require('./routes');
var http = require('http');
var path = require('path');

//load customers route
var monos = require('./routes/monos');
var app = express();

var connection  = require('express-myconnection');
var mysql = require('mysql');

// all environments
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request
-------------------------------------------*/

app.use(

    connection(mysql,{

        host: 'localhost', //'localhost',
        user: 'root',
        password : '',
        port : 3306, //port mysql
        database:'sampledb'

    },'pool') //or single

);


//monos ql's
app.get('/', monos.list);
app.get('/monos', monos.list);
app.get('/monos/add', monos.add);
app.post('/monos/add', monos.save);
app.get('/monos/delete/:id', monos.delete_customer);
app.get('/monos/edit/:id', monos.edit);
app.post('/monos/edit/:id', monos.save_edit);

app.use(app.router);

http.createServer(app).listen(app.get('port'), function(){
  //console.log(app);
  console.log('Express server listening on port ' + app.get('port'));
});
