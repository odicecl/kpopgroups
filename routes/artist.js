/** Importación de Módulos **/
var express = require('express');
var router = express.Router();
var request = require('sync-request');
var cheerio = require('cheerio');


/**
 * Definición de rutas de artistas
 * @param  {String} '/'           dirección a rutear
 * @param  {function} function(req, res,          next función que maneja requerimientos y respuestas
 * @return {Array String}               devuelve codigo html a mostrar con artistas
 */
router.get('/', function(req, res, next) {
  // Array con nombre de las páginas de la wikipedia a parsear
  var arrNombreArtWiki = [
    'List_of_South_Korean_idol_groups_(1990s)'
    ,'List_of_South_Korean_idol_groups_(2000s)'
    ,'List_of_South_Korean_idol_groups_(2010s)'
    ,'List_of_individual_K-pop_artists'
  ];
  // Array con los artistas recibidos del parseo de la wikipedia
  var arrArtistas = fnObtenerArtistas(arrNombreArtWiki);
  // Envío de Array a la vista
  res.render('artist', {artistas:arrArtistas});

  /***
  * TSUNAMI DE FUNCIONES
  ***/

  /**
   * Obtiene array con nombres de artistas obtenidos desde la wikipedia
   * @param  {array String} arrNombres Array con colección de nombres de las páginas de la Wiki a consultar
   * @return {array String}            Array con nombres de artistas
   */
  function fnObtenerArtistas(arrNombres) {
    var arrUrls = fnFormatearURLWiki(arrNombres);
    var arrWikiParse = fnObtenerWikiParse(arrUrls);
    //var arrWikiHTML = fnObtenerWikiHTMLText(arrWikiParse);
    var arrArtistas = fnObtenerListaArtistas(arrWikiParse);
    return (arrArtistas);
    }
    /**
     * Prepara las URL para las peticiones a la API de wikipedia
     * @param  {array String} arrNombres Array con el nombre de las páginas de wikipedia a consultar
     * @return {array String}            Devuelve array con las url formateadas
     */
  function fnFormatearURLWiki(arrNombres) {
      var pre = 'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=';
      var post= '&prop=text&mobileformat=';
      for (var i = 0; i < arrNombres.length; i++) {
        arrNombres[i]=pre+arrNombres[i]+post;
      }
      return(arrNombres);
    }
    /**
     * Obtiene arreglo con el parse de las páginas de la wikipedia consultadas
     * @param  {array String} arrUrls Array con las urls a consultar a wikipedia
     * @return {array String}         Parse resultado de la consulta a wikipedia
     */
  function fnObtenerWikiParse(arrUrls) {
    var arrWikiParse = [];

    for (var i = 0; i < arrUrls.length; i++) {
        var res = request('GET',arrUrls[i]);
        var jp = JSON.parse(res.getBody());
        arrWikiParse.push(jp.parse.text['*']);
      }
    return(arrWikiParse);
  }
  /**
   * Obtiene cuerpo text html de la página consultada en la wikipedia
   * @param  {array String} arrWikiParse Array con los Json respuesta de la api de la Wiki
   * @return {String}              String con código html de la consulta

  function fnObtenerWikiHTMLText(arrWikiParse) {
    var strHTMLWiki =[];
    for (var i = 0; i < arrWikiParse.length; i++) {
      strHTMLWiki +=arrWikiParse[i];
    }
    return (strHTMLWiki);
  }
     */
  /**
   * Obtiene lista de artistas como una array de texto
   * @param  {String} strHTMLWiki String con todo el codigo html reunido
   * @return {array String}             Array con los nombres de los artistas
   */
  function fnObtenerListaArtistas(arrWikiParse) {

    var arrArtistas = [];
    for (var i = 0; i < arrWikiParse.length; i++) {
      var $ = cheerio.load(arrWikiParse[i]);

      // Quito los elementos sobrantes
      $('h2').remove();
      $('sup').remove();
      $('ol').remove();
      $('#toc').remove();
      $('.reflist').remove();
      $('.navbox').remove();

      // La pagina de artistas individuales (3) es distinta
      if(i!==3){
        $('table').remove();
        $('li').find('a').each(function(){
            arrArtistas.push($(this).text().toUpperCase());
          });
      }
      else {

        $('li').each(function(){
            arrArtistas.push($(this).text().toUpperCase());
          });
      }
    }
    return (arrArtistas.sort());
  }
});

module.exports = router;
