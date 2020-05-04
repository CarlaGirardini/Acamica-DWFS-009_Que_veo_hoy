var con = require('../lib/conexionbd');

function buscarTodasLasPeliculas(req, res){
    var sql = 'select * from pelicula left join genero on pelicula.genero_id = genero.id';
    var filtros;

    // Si hay filtros, agrego 'where':
    if(req.query.titulo || req.query.anio || req.query.genero){
        filtros = ' where';
    }
    // Si se filtra por título
    if(req.query.titulo){
        filtros += ' pelicula.titulo like ' + `"%${req.query.titulo}%"`;
        if(req.query.anio || req.query.genero){
            filtros += ' and';
        }
    }
    // Si se filtra por año
    if(req.query.anio){
        filtros += ` pelicula.anio = ${req.query.anio}`;
        if(req.query.genero){
            filtros += ' and';
        }
    }
    // Si se filtra por género
    if(req.query.genero){
        filtros += ` pelicula.genero_id = ${req.query.genero}`;
    }
    // armarFiltros(req,res);
    
    if(filtros){sql += filtros};
    
    // Si se establece un orden:
    if(req.query.columna_orden){
        sql += ` order by ${req.query.columna_orden}`
    }
    
    // Finalmente, limito los resultados
    var cant = req.query.cantidad;
    var pagina = req.query.pagina;
    var pag = parseInt(pagina);
    var primeraFila = cant * (pag - 1);
    
    sql += ` limit ${primeraFila}, ${cant}`

    // Antes de mandar el resultado, cuento cuántos son los resultados totales:
    sql += '; select count(pelicula.id) as "conteo" from pelicula left join genero on pelicula.genero_id = genero.id';
    // Vuelvo a añadir los filtros para poder filtrar también la segunda consulta
    if(filtros){sql += filtros};
    
    con.query(sql, function(err, resp, fields){
        if(err){
            console.log('Hubo un error en la consulta', err.message);
            return res.status(404).send('Hubo un error en la consulta');
        }
        var peliculasObtenidas = resp[0];
        var conteoRespuesta = resp[1][0].conteo;
        var respuesta = {
            'peliculas': peliculasObtenidas,
            'total': conteoRespuesta
        };
        res.send(JSON.stringify(respuesta));
    });
};

function buscarGeneros(req, res){
    var sql = 'select * from genero';

    con.query(sql, function(err, resp, fields){
        if(err){
            console.log('Hubo un error en la consulta', err.message);
            return res.status(404).send('Hubo un error en la consulta');
        }
        var respuesta = {
            'generos': resp
        };
        res.send(JSON.stringify(respuesta));
    });
};

module.exports = {
    buscarTodasLasPeliculas,
    buscarGeneros
};