var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// rutas propias

router.get('/artist', function(req, res) {
  var archivoBase = require('./jsons/kpop1900.json');
  var codigoHTML = archivoBase.parse.text["*"];

  // USAR CHEERIO PARA TRANSFORMAR EL TEXTO HTML EN NODO y LUEGO RESCATAR LOS ELEMENTOS LI




  var elementosLI = objetoBody.getElementsByTagName('li');
  var textoRendereado = " ";
  for (var i = 0; i < elementosLI.length; i++) {
    textoRendereado = elementosLI[i].nodeValue;
  }

  res.render('artist', {'lista': textoRendereado});
});

module.exports = router;
