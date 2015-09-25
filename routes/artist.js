/** Importación de Módulos **/
var express = require('express');
var router = express.Router();
var wiki = require('../mods/wikiapicall.js');


/**
 * Definición de rutas de artistas
 **/
router.post('/', function(req, res, next) {
  // Array con nombre de las páginas de la wikipedia a parsear
  var arrNombreArtWiki = [
    'List_of_South_Korean_idol_groups_(1990s)'
    ,'List_of_South_Korean_idol_groups_(2000s)'
    ,'List_of_South_Korean_idol_groups_(2010s)'
    ,'List_of_individual_K-pop_artists'
  ];
  // Obtengo artistas desde la Wiki
  wiki.fnObtenerArtistas(arrNombreArtWiki);
});
/*router.get('/', function (req, res) {

}
*/
module.exports = router;
