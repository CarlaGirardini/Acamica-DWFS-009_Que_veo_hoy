var con = require('../lib/conexionbd');

function buscarTodasLasPeliculas(req, res){
    var sql = 'select pelicula.id, pelicula.titulo, pelicula.duracion, pelicula.director, pelicula.anio, pelicula.fecha_lanzamiento, pelicula.puntuacion, pelicula.poster, pelicula.trama from pelicula left join genero on pelicula.genero_id = genero.id';
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

function buscarPeliculaId(req, res){
    var id = req.params.id;
    // Agrego el if que sigue para solucionar un problema de rutas.
    sql = `select pelicula.titulo, pelicula.duracion, pelicula.director, pelicula.anio, pelicula.fecha_lanzamiento, pelicula.puntuacion, pelicula.poster, pelicula.trama, genero.nombre as genero, actor.nombre from pelicula join genero on pelicula.genero_id = genero.id join actor_pelicula on actor_pelicula.pelicula_id = pelicula.id join actor on actor_pelicula.actor_id = actor.id where pelicula.id = ${id}`;

    con.query(sql, function(err, resp, fields){
        if(err){
            console.log('Hubo un error en la consulta', err.message);
            return res.status(404).send('Hubo un error en la consulta');
        }
        var pelicula = {
            'titulo': resp[0].titulo,
            'duracion': resp[0].duracion,
            'director': resp[0].director,
            'anio': resp[0].anio,
            'fecha_lanzamiento': resp[0].fecha_lanzamiento,
            'puntuacion': resp[0].puntuacion,
            'poster': resp[0].poster,
            'trama': resp[0].trama
        };
        var genero = resp[0].genero;
        var actores = [];
        resp.forEach(pel => {
            actores.push(pel.nombre);
        });
        var data = {
            'pelicula': pelicula,
            'genero': genero,
            'actores': actores
        }
        res.send(JSON.stringify(data));
    });
};

function recomendarPeliculas(req, res){
    var sql = 'select pelicula.id, pelicula.titulo, pelicula.duracion, pelicula.director, pelicula.anio, pelicula.fecha_lanzamiento, pelicula.puntuacion, pelicula.poster, pelicula.trama, genero.nombre from pelicula left join genero on pelicula.genero_id = genero.id';

    // Los posibles query params son:
        // genero
        // anio_inicio
        // anio_fin
        // puntuacion
        
        var filtros = ' where';
        
        if (req.query.genero){
            var nombre = req.query.genero;
            filtros += ` genero.nombre = "${nombre}"`
            // Si hay más filtros, agrego el AND
            if(req.query.anio_inicio || req.query.puntuacion){
                filtros += ' and'
            }
        };
        if (req.query.anio_inicio && req.query.anio_fin){
            var inicio = req.query.anio_inicio;
            var fin = req.query.anio_fin;
            filtros += ` pelicula.anio between ${inicio} and ${fin}`
            // Si hay más filtros, agrego el AND
            if(req.query.puntuacion){
                filtros += ' and'
            }
        };
        if (req.query.puntuacion){
            var puntMin = req.query.puntuacion;
            filtros += ` pelicula.puntuacion between ${puntMin} and 10`;
        };

        if(req.query.genero || req.query.anio_inicio || req.query.puntuacion){
            sql += filtros;
        }
        
    con.query(sql, function(err, resp, fields){
        if(err){
            console.log('Hubo un error en la consulta', err.message);
            return res.status(404).send('Hubo un error en la consulta');
        }
        var respuesta = {
            'peliculas': resp
        }
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
    buscarPeliculaId,
    recomendarPeliculas,
    buscarGeneros
};