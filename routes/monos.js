
/*
 * GET users listing.
 */
exports.list = function(req, res){

  req.getConnection(function(err,connection){

        var query = connection.query('SELECT * FROM monos',function(err,rows)
        {

            if(err)
                console.log("Error Selecting : %s ",err );

            res.render('monos',{page_title:"Listado de Monos",data:rows});

         });

         //console.log(query.sql);
    });

};

exports.add = function(req, res){
  res.render('add_mono',{page_title:"Agregar Mono"});
};

exports.edit = function(req, res){

    var id = req.params.id;
    var host = "http://"+req.headers.host;
    console.log(req.headers.host);
    req.getConnection(function(err,connection){

        var query = connection.query('SELECT * FROM monos WHERE id = ?',[id],function(err,rows)
        {

            if(err)
                console.log("Error Selecting : %s ",err );

            res.render('edit_mono',{page_title:"Editar Mono",data:rows,'host':host});

         });

         //console.log(query.sql);
    });
};

/*Save the customer*/
exports.save = function(req,res){
    var path = process.cwd();
    console.log(path);
    var input = JSON.parse(JSON.stringify(req.body));

    var archivo ="";
    console.log(req.files);

    if (req.files){

      archivo = removeSpecialChars(req.files.imagen.name);
      var imagen = req.files.imagen;
      // Use the mv() method to place the file somewhere on your server
      imagen.mv(path+'/public/uploads/'+archivo, function(err) {
        if (err){
          //return res.status(500).send(err);
          console.log('error al subir '+archivo + '/'+err);
        }else{
          console.log('se subio: '+archivo);
        }

      });

    }

    req.getConnection(function (err, connection) {

        var data = {
            'nombre' : input.nombre,
            'imagen' : archivo
        };

        var query = connection.query("INSERT INTO monos set ? ",data, function(err, rows)
        {

          if (err)
              console.log("Error inserting : %s ",err );

          res.redirect('/monos');

        });

       // console.log(query.sql); get raw query

    });
};

exports.save_edit = function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    var path = process.cwd();
    var archivo = "";




    req.getConnection(function (err, connection) {

        console.log(req.files);

        if (req.files){

          archivo = removeSpecialChars(req.files.imagen.name);
          var imagen = req.files.imagen;
          // Use the mv() method to place the file somewhere on your server
          imagen.mv(path+'/public/uploads/'+archivo, function(err) {
            if (err){
              //return res.status(500).send(err);
              console.log('error al subir '+archivo + '/'+err);
            }else{
              console.log('se subio: '+archivo);

            }

          });

        }

        console.log(archivo);
        if(archivo != ''){
          var data = {
              'nombre' : input.nombre,
              'imagen' : archivo
          };
        }else{
          var data = {
              'nombre' : input.nombre
          };
        }

        console.log(data);
        connection.query("UPDATE monos set ? WHERE id = ? ",[data,id], function(err, rows){
          if (err)
              console.log("Error Updating : %s ",err );
              res.redirect('/monos');
        });

    });
};


exports.delete_customer = function(req,res){

     var id = req.params.id;

     req.getConnection(function (err, connection) {

        connection.query("DELETE FROM monos WHERE id = ? ",[id], function(err, rows)
        {

             if(err)
                 console.log("Error deleting : %s ",err );

             res.redirect('/monos');

        });

     });
};

function removeSpecialChars(str) {
  var fileExtension = '.' + str.split('.').pop();
  str = Math.random().toString(36).substring(7) + new Date().getTime() + fileExtension;
  return str;
}
