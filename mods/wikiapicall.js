var express = require('express');
var request = require('sync-request');
var cheerio = require('cheerio');
var fs = require('fs');
var exports = module.exports = {};

/** Obtiene array con nombres de artistas obtenidos desde la wikipedia **/
exports.fnObtenerArtistas = function (arrNombres) {
	var arrUrls = fnFormatearURLWiki(arrNombres);
	var arrWikiParse = fnObtenerWikiParse(arrUrls);
	var arrArtistas = fnObtenerListaArtistas(arrWikiParse);
	// Guardo archivo
	fnGuardarArtistas(arrArtistas);
}

/** Prepara las URL para las peticiones a la API de wikipedia **/
function fnFormatearURLWiki(arrNombres) {
	var pre = 'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=';
	var post = '&prop=text&mobileformat=';
	for (var i = 0; i < arrNombres.length; i++) {
		arrNombres[i] = pre + arrNombres[i] + post;
	}
	return (arrNombres);
}

/** Obtiene arreglo con el parse de las páginas de la wikipedia consultadas **/
function fnObtenerWikiParse(arrUrls) {
	var arrWikiParse = [];

	for (var i = 0; i < arrUrls.length; i++) {
		var res = request('GET', arrUrls[i]);
		var jp = JSON.parse(res.getBody());
		arrWikiParse.push(jp.parse.text['*']);
	}
	return (arrWikiParse);
}

/** Obtiene lista de artistas como una array de texto **/
function fnObtenerListaArtistas(arrWikiParse) {
	var arrArtistas = [];
	for (var i = 0; i < arrWikiParse.length; i++) {
		var $ = cheerio.load(arrWikiParse[i]);
		fnLimpiaParse($,i);
		// Quito los elementos sobrantes para todas las consultas
		$('h2').remove();
		$('sup').remove();
		$('ol').remove();
		$('#toc').remove();
		$('.reflist').remove();
		$('.navbox').remove();

		// Para la página de artistas obtengo todos los elementos LI (Algunos Li tienen dentro el nombre del grupo como anchor por eso los distingo)
		if (i == 3) {
			$('li').each(function () {
				arrArtistas.push($(this).text().toUpperCase());
			});
		}
		else {
			// Para todos los demás grupos borro las tablas (cosa que en el de idols no se puede o pierdo todo) y los links dentro de los li (para no agregar referencias adicionales)
			$('table').remove();
			$('li').find('a').each(function () {
				arrArtistas.push($(this).text().toUpperCase());
			});
		}
	}
	return (arrArtistas.sort());
}
/**** TRABAJANDO AQUI **********/
function fnLimpiaParse($,intParse) {
	// intParse corresponde al número de consulta y sirve de indice
	// Array con tags a eliminar y seleccionar (# para IDS . Para clases)
	// Limpieza y selección por defecto
	arrLimpieza = {
		indice:-1
		,limpiar:["h2","sup","ol","#toc",".reflist",".navbox"]
		,seleccionar:["li","a"]
	};
	// Limpieza y selección espec;ifica
	arrLimpieza = {
		indice:3
		,seleccionar:["li"]};

	// Ciclo de Limpieza
	if (arrLimpieza.indice === undefined) {
		for (var i = 0; i < array.length; i++) {
			array[i]
		}
	}
}
function fnGuardarArtistas(arrArtistas) {
	var arrObjJSON = [];
	for (var i = 0; i < arrArtistas.length; i++) {
		var objTmp = new Object();
		objTmp.nombre=arrArtistas[i];
		arrObjJSON.push(objTmp);
	}
	var objJSON =JSON.stringify({artistas:arrObjJSON});
	var strRutaArchivo = "bd/artistas.json";
	var strMensajeGuardado = "";
	fs.writeFile(strRutaArchivo, objJSON, function (err) {
	(err)?console.log(err):console.log("Se guardó el archivo");
	});
	return (objJSON);
}
