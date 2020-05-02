var con = require('../lib/conexionbd');

function buscarTodasLasPeliculas(req, res){
    var sql = 'select * from pelicula';

    con.query(sql, function(err, resp, fields){
        if(err){
            console.log('Hubo un error en la consulta', err.message);
            return res.status(404).send('Hubo un error en la consulta');
        }
        var respuesta = {
            'peliculas': resp
        };
        res.send(JSON.stringify(respuesta));
    });
};


module.exports = {
    buscarTodasLasPeliculas
};