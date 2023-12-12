import './style.css';
import MVT from 'ol/format/MVT.js';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileWMSSource from 'ol/source/TileWMS.js';
import OSMSource from 'ol/source/OSM.js';
import Projection from 'ol/proj/Projection.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import Style from 'ol/style/Style.js';
import Stroke from 'ol/style/Stroke.js';
import Fill from 'ol/style/Fill.js';
import Circle from 'ol/style/Circle.js';
import Draw from 'ol/interaction/Draw';
import { never } from 'ol/events/condition.js';
import Select from 'ol/interaction/Select';
import Modify from 'ol/interaction/Modify';
import GeoJSON from 'ol/format/GeoJSON';
import Overlay from 'ol/Overlay';
import FullScreen from 'ol/control/FullScreen';
import {getRenderPixel} from 'ol/render.js';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import { transform as projTransform } from 'ol/proj';

import {Icon,Text} from 'ol/style.js';

const servidorMapas = 'https://ide.icl.gob.pe:8443';
const espacioTrabajo = 'Prueba1:';
const UrlWms = servidorMapas + '/geoserver/Prueba1/wms?service=WMS&version=1.1.0&request=GetMap&layers=Prueba1%3Atg_lote&bbox=-8580628.201371163%2C-1355578.651597874%2C-8577084.584618798%2C-1353252.484884537&width=768&height=504&srs=EPSG%3A3857&styles=&format=application/openlayers'
const UrlWfsLote = servidorMapas + '/geoserver/Prueba1/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Prueba1%3Atg_lote&maxFeatures=1000000&outputFormat=application%2Fjson';


function crearLayerWms(layerwms, layervisible) {
    return new TileLayer({
        visible: layervisible,
        name: layerwms,
        source: new TileWMSSource({
            url: UrlWms,
            serverType: 'geoserver',
            params: { 'LAYERS': layerwms, 'TILED': true }
        }),
    });
}

export var grouplayerLotizacion = crearLayerWms(espacioTrabajo + 'g_layer_pl', true);
const tg_sector = crearLayerWms(espacioTrabajo + 'vw_tg_sector_tematico', false);
const tg_uso = crearLayerWms(espacioTrabajo + 'vw_tg_lote_uso', false);
const tg_alturas = crearLayerWms(espacioTrabajo + 'vw_tg_lote_altura', false);

export var osmLayer = new TileLayer({
    preload: Infinity,
    source: new OSMSource({
        crossOrigin: 'anonymous'
    }),
    visible: true
});
osmLayer.set('name', 'Open Street Map');



var vectorLote = new VectorLayer({
    visible: true,
    name: 'vectorLote',
    source: new VectorSource({

        url: UrlWfsLote,
        format: new GeoJSON(),
        crossOrigin: "Anonymous"
    }),
    style: new Style({
        fill: new Fill({
            color: 'transparent'
        }),
        stroke: new Stroke({
            color: 'transparent',
            width: 1
        })
    })
});

var source = new VectorSource({ wrapX: false });
var colorBorde = '#ff0011';
var colorRelleno = '#ff0011';
var anchoCapa = 2;
var radioCapa = 7;

var vector = new VectorLayer({
    source: source,
    name: 'vector',
    condition: never.click,
    toggleCondition: never.click,
    style: new Style({
        fill: new Fill({
            color: colorRelleno
        }),
        stroke: new Stroke({
            color: colorBorde,
            width: anchoCapa
        }),
        image: new Circle({
            radius: radioCapa,
            fill: new Fill({
                color: '#ffcc33'
            })
        })
    })
});

var vectorMeasure = new VectorLayer({
    source: source,
    name: 'vectorMeasure',
    style: new Style({
        fill: new Fill({
            color: colorRelleno
        }),
        stroke: new Stroke({
            color: colorBorde,
            width: anchoCapa
        }),
        image: new Circle({
            radius: radioCapa,
            fill: new Fill({
                color: '#ffcc33'
            })
        })
    })
});

export var layers = [
    grouplayerLotizacion,//0
    osmLayer,//1
    vectorMeasure,//2
    vectorLote,//3
    tg_sector,//4
    tg_uso,//5
    tg_alturas//6
    //maxboxLayer,//5
    //bingLayer,//0
    //googleLayer,//2
    //vectorLote,//3
    //vectorMeasure,//4

    //Ortofotografia2021,//6
    //pol_sectores,//7
    //pol_zonificacion,//8
    //pol_urbanizaciones,//9
    //pto_licenciafuncionamiento,//10
    //pol_externa,//11
    //pol_lotizacion_urbana, //12
    //vectorVias,//13
    //vectorCuadras,//14
    //vectorAreaRec,//15
    //Ortofotografia2002,//16
    //pto_mobiliario_urbano,//17
    //pto_componente_urbano,//18
    //pto_arbol,//19
];

var projection = new Projection({
    code: 'EPSG:3857',
    units: 'm'
});

var center = [-8578535.19912, -1354284.03806];
var zoom = 15.4;
var rotation = 0;

var view = new View({
    center: center, zoom: zoom, minZoom: 14.8, maxZoom: 22, rotation: rotation, projection: projection,
    // center: center, zoom: zoom, rotation: rotation,
});

/*const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});*/


export var map = new Map({
    target: 'map',
    layers: layers,
    view: view,
    loadTilesWhileInteracting: true,//carga mosaicos mientras dragging/zooming. Hará el zoom entrecortado en dispositivos móviles o lentos.
    // shift +(mouse scroll) para rotar y acercar el mapa alrededor de sus centro
    //interactions: ol.interaction.defaults({}).extend([new ol.interaction.DragRotateAndZoom()])
    //interactions: defaultOL({ doubleClickZoom: false }),
    //interactions: defaultInteractions(),
    //interactions: defaultInteractions() 
});


layers[0].setZIndex(600);//group layer
layers[1].setZIndex(500);//OSM layer
layers[2].setZIndex(1300);//vector Dibujo
layers[3].setZIndex(1300);//vector lote
layers[4].setZIndex(700);//vector Sector
layers[5].setZIndex(700);//vector Sector
layers[6].setZIndex(700);//vector Sector
//layers[4].setZIndex(550);//vector Sector

var arrayCapaImagen = [0,1,4,5,6];
var arrayBotonLeyenda = [4,5,6];
//var arrayCapaImagen = [1,5,6, 7,8,9,11,12,16];
//var arrayBotonLeyenda = [7,8,9,12];

function onOffLayer(idlayer, subgrupo) {
    var navbar = document.getElementById("navbar" + idlayer);
    var btnLeyenda = document.getElementById("mostrarLeyenda" + idlayer)
    var navbarDesbloq;
    //console.log(layers[9]);

    if (layers[idlayer].getVisible() == false) {
        layers[idlayer].setVisible(true);

        //MapasExternos(idlayer);

        //LEYENDA

        //barra de progreso progress bar
        var
            tile_loading = 0,
            tile_loaded = 0,
            tiles_loaded_all = false
            ;
        /*if (idlayer != 0) {
            layers[idlayer].getSource().on('tileloadstart', function (evt) {

                progress.addLoading();
            });
            layers[idlayer].getSource().on('tileloadend', function (evt) {
                progress.addLoaded();
            });

            layers[idlayer].getSource().on('tileloaderror', function (evt) {
                progress.addLoaded();
            });
        }*/

        for(var i = 0; i< arrayCapaImagen.length; i++) {
            if (idlayer == arrayCapaImagen[i]) {
                navbar.style.display = "block";
                break;
            }
        }

        for(var i = 0; i< arrayBotonLeyenda.length; i++) {
            console.log(arrayBotonLeyenda[i]);
            if (idlayer == arrayBotonLeyenda[i]) {
                btnLeyenda.style.display = "block";
                var fatLeyenda = document.getElementById('LeyendaDerecha').classList.contains('control-sidebar-open');
                if (!fatLeyenda) {
                    document.getElementById('MostrarLeyenda').click()
                }
                break;
            }
        }
        
    } else {
        layers[idlayer].setVisible(false);
        for(var i = 0; i< arrayCapaImagen.length; i++) {
            if (idlayer == arrayCapaImagen[i]) {
                navbar.style.display = "none";
                break;
            }
        }

        for(var i = 0; i< arrayBotonLeyenda.length; i++) {
            if (idlayer == arrayBotonLeyenda[i]) {
                btnLeyenda.style.display = "none";
                document.getElementById('MostrarLeyenda').click()
                var fatLeyenda = document.getElementById('LeyendaDerecha').classList.contains('control-sidebar-open');
                if (fatLeyenda) {
                    document.getElementById('MostrarLeyenda').click()
                }
                break;
            }
        }
        

    }

}

var styleFeatureSelected = new Style({
    fill: new Fill({ color: '#FF5B5B' }),//color: '#ADD8E6'
    stroke: new Stroke(
        {
            color: '#FF5B5B',//'rgba(255,91,91,0.5)', // 'transparent', width: 1
            width: 3
        })//color: 'transparent' '#DBD9D8'
});

var styleFeatureNormal = new Style({
    fill: new Fill({ color: 'transparent' }),//color: '#ADD8E6'
    stroke: new Stroke(
        {
            color: 'transparent',
            width: 1
        })//color: 'transparent' '#DBD9D8'
});

var styleFeatureDobleClick = new Style({
    fill: new Fill({ color: 'transparent' }),//color: '#ADD8E6'
    stroke: new Stroke(
        {
            color: '#FF5B5B',
            width: 3
        })//color: 'transparent' '#DBD9D8'
});

const selectedStyle = new Style({
    fill: new Fill({
      color: '#ff0000',
    }),
    stroke: new Stroke({
      color: '#ff0000',
      width: 30,
    }),
  });

var select = new Select({
    layers: function (layer) {
        if ((layer.get('name') == 'vectorLote') || (layer.get('name') == 'vector') || (layer.get('name') == 'vectorVia') || (layer.get('name') == 'vectorParque') || (layer.get('name') == 'vectorLibre')) {
            return true;
        } else
            return false;

    },
    filter: function (feature, layer) {
        if ((layer.get('name') == 'vectorLote') || (layer.get('name') == 'vector') || (layer.get('name') == 'vectorVia') || (layer.get('name') == 'vectorParque') || (layer.get('name') == 'vectorLibre')) {
            return true;
        } else
            return false;
    },
    //style: selectedStyle,
});

//////////////Popup o tooltip//////////////
// when we move the mouse over a feature, we can change its style to
// highlight it temporarily

var container = document.getElementById('popup'),
    content_element = document.getElementById('popup-content'),
    closer = document.getElementById('popup-closer'),
    info = document.getElementById('info');
closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};
var overlay = new Overlay({
    element: container,
    //autoPan: true,//mueve la pantalla para seguir visualizando el popup
    offset: [0, 0],
    //positioning:'center-center'
});
map.addOverlay(overlay);
var fullscreen = new FullScreen();
map.addControl(fullscreen);

function getCenterOfExtent(Extent) {
    var X = Extent[0] + (Extent[2] - Extent[0]) / 2;
    var Y = Extent[1] + (Extent[3] - Extent[1]) / 2;
    return [X, Y];
}


//evento de posicion del mouse sobre el lote
map.on('pointermove', function (evt) {
    console.log('hola');
    var coordinate = evt.coordinate;
    //console.log(coordinate);
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature, layer) {
            //console.log(layer);
            //console.log(vectorLote);
            if (layer == vectorLote) {
                return feature;
            }
        }
    );
    //console.log(feature);
    if (feature) {
        map.getTargetElement().style.cursor = 'pointer';//cambia el puntero del mouse (mano)
        var geometry = feature.getGeometry();
        //console.log('Area3');
        var area = geometry.getArea();
        var areaformat = area.toFixed(3);
        //para lotes
        //var content = '<b>Código: </b>' + feature.get('cod_catastral') + '<br>';
        var content = '<b>Sector: </b>' + feature.get('cod_sector') + '<br>';
        content += '<b>Manzana: </b>' + feature.get('cod_manzan') + '<br>';
        content += '<b>Lote: </b>' + feature.get('cod_lote') + '<br>';
        content_element.innerHTML = content;
        overlay.setPosition(coordinate);
        document.getElementById('area').innerHTML = areaformat + ' m<sup>2<sup>';
    } else {
        document.getElementById('area').innerHTML = '';
        map.getTargetElement().style.cursor = '';//deshabilita el punto del mouse(mano)
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    }
}
);


document.getElementById('btnBuscarLote').addEventListener('click', function () {

    let codigo =  document.getElementById('idBusquedaSector').value + 
                    document.getElementById('idBusquedaManzana').value + 
                    document.getElementById('idBusquedaLote').value;
    console.log('metodo lote')

    //console.log("campo", campo);
    const layerSource = vectorLote.getSource();
    const features = layerSource.getFeatures();

    select.getFeatures().clear();
    measureDraw.setActive(false);
    ExampleDraw.setActive(false);
    ExampleModify.setActive(false);
    seleccionSimpleClick.stop();

    map.addInteraction(select)
    var selectFeatures = select.getFeatures();

    for (const feature of features) {
        console.log(feature.get('cod_sector') + feature.get('cod_manzan') + feature.get('cod_lote'));
        if (feature.get('cod_sector') + feature.get('cod_manzan') + feature.get('cod_lote') == codigo) {
            selectFeatures.push(feature);
            map.getView().fit(feature.getGeometry(), map.getSize())
            map.getView().setZoom(map.getView().getZoom() - 2);

            console.log('proyeccion');
            console.log(map.getView().getProjection());
            console.log('Area1');
            areaAcumulada = feature.getGeometry().getArea();
            document.getElementById('areaTotal').innerHTML = areaAcumulada.toFixed(3) + ' m<sup>2<sup>';
            //PRUEBA
            if (feature) {
                var extent = feature.getGeometry().getExtent();
                overlay.setPosition(getCenterOfExtent(extent));
                var content = '<b>Sector: </b>' + feature.get('cod_sector') + '<br>';
                content += '<b>Manzana: </b>' + feature.get('cod_manzan') + '<br>';
                content += '<b>Lote: </b>' + feature.get('cod_lote') + '<br>';
                content_element.innerHTML = content;
            } else {
                overlay.setPosition(undefined);
            }
        }
    }

    if (selectFeatures.values_.length !== 1) {
        toastr.warning('El código de lote No se existe en la base de datos grafica', 'GeoPortal');
    }
});



/*export function borrarFeature() {
  ExampleModify.setDelete();
  return false;
}*/

var borrarFeature = document.getElementById('borrarFeature');
borrarFeature.onclick = function (e) {
    ExampleModify.setDelete();
    return false;
};

/*export function borrarDibujo() {
  vector.getSource().clear(true);
  // map.removeLayer(vectorMeasure);
  //$(".tooltip ").remove();
  //$(".tooltip-measure ").empty();
  //createMeasureTooltip();
  return false;
}*/

var borrarDibujo = document.getElementById('borrarDibujo');
borrarDibujo.onclick = function (e) {
    vector.getSource().clear(true);
    // map.removeLayer(vectorMeasure);
    //$(".tooltip ").remove();
    //$(".tooltip-measure ").empty();
    //createMeasureTooltip();
    return false;
};


// ExampleModify.setDelete();

//Opcion de Dibujo

var optionsForm = document.getElementById('options-form');
var typeSelect = document.getElementById('medida');

var featureID = 0;
var selectedFeature2 = null;
var ExampleModify = {
    init: function () {
        this.select = new Select({
            layers: function (layer) {
                if (layer.get('name') === 'vector') {
                    return true;
                } else
                    return false;

            },
            filter: function (feature, layer) {
                if (layer.get('name') === 'vector') {
                    return true;
                } else
                    return false;
            },
        });
        map.addInteraction(this.select);
        this.select.on('select', function (event) {
            selectedFeature2 = event.selected[0];
            console.log('-----------: ', this.getLayer(selectedFeature2).get('name'));
            //console.log(selectedFeature.getGeometry().getExtent());
            (selectedFeature2) ? overlay.setPosition(selectedFeature2.getGeometry().getExtent()) : overlay.setPosition(undefined);
        });
        this.modify = new Modify({
            features: this.select.getFeatures()
        });
        map.addInteraction(this.modify);

        this.setEvents();
    },
    setEvents: function () {
        var selectedFeatures = this.select.getFeatures();

        this.select.on('change:active', function () {
            selectedFeatures.forEach(function (each) {
                selectedFeatures.remove(each);
                each.setStyle(vector);
                console.log('/*/-*/-/-/*-/-*/*-/-***** ');
                //selectedFeature2.setStyle(styleFeatureNormal);

            });
        });
    },
    setActive: function (active) {
        /*
        if (active) {
            seleccionSimpleClick.stop();
            map.addInteraction(select);
        } else {
            map.removeInteraction(select);
            map.addInteraction(select);
            seleccionSimpleClick.init();
        }
        */
        this.select.on('select', function (event) {
            selectedFeature2 = event.selected[0];
            //console.log('++++++++ : ', this.getLayer(selectedFeature2).get('name'));
            console.log('/*/*/* Cantidad Deseleccionado: ', event.deselected.length);
            if (event.deselected.length === 1) { // deseleccionado
                console.log('**** Deseleccionado: ')

            }

            if (event.selected.length === 1) { // Seleccionado
                selectedFeature2.setStyle(styleFeatureSelected);
            }

            //console.log(selectedFeature2.getGeometry().getExtent());
            console.log('Area2');
            document.getElementById('areaTotal').innerHTML = selectedFeature2.getGeometry().getArea().toFixed(3) + ' m<sup>2<sup>';
            (selectedFeature2) ? overlay.setPosition(selectedFeature2.getGeometry().getExtent()) : overlay.setPosition(undefined);
        });
        this.select.setActive(active);
        this.modify.setActive(active);
    },
    setDelete: function () {
        console.log(selectedFeature2);
        if (selectedFeature2) {
            console.log('estoy dentro');
            vector.getSource().removeFeature(selectedFeature2);
            overlay.setPosition(undefined);
            this.select.getFeatures().clear();
            selectedFeature2 = null;
        }

    }
};
ExampleModify.init();

var ExampleDraw = {
    init: function () {
        map.addInteraction(this.Point);
        this.Point.setActive(false);
        map.addInteraction(this.LineString);
        this.LineString.setActive(false);
        map.addInteraction(this.Polygon);
        this.Polygon.setActive(false);
        map.addInteraction(this.Circle);
        this.Circle.setActive(false);
    },
    Point: new Draw({
        source: vector.getSource(),
        type: 'Point'
    }),
    LineString: new Draw({
        source: vector.getSource(),
        type: 'LineString'
    }),
    Polygon: new Draw({
        source: vector.getSource(),
        type: 'Polygon'
    }),
    Circle: new Draw({
        source: vector.getSource(),
        type: 'Circle'
    }),
    getActive: function () {
        return this.activeType ? this[this.activeType].getActive() : false;
    },
    setActive: function (active) {
        var type = optionsForm.elements['selectDibujo'].value;
        colorBorde = "" + document.getElementById("favcolorb").value;
        colorRelleno = "" + document.getElementById("favcolorr").value;

        anchoCapa = document.getElementById("grosor").value;
        radioCapa = document.getElementById("grosor").value;
        //map.on('pointermove', pointerMoveHandler);
        // console.log('Color relleno: ', colorRelleno);
        if (active) {
            // Desactivar el Single Click


            // console.log('** ', this.activeType && this[this.activeType].setActive(false));
            console.log('****: ', this.activeType);
            this.activeType && this[this.activeType].setActive(false);
            this[type].setActive(true);
            this[type].on('drawstart', function (event) {
                var s = new Style({
                    fill: new Fill({
                        color: colorRelleno
                    }),
                    stroke: new Stroke({
                        color: colorBorde,
                        width: anchoCapa
                    }),
                    image: new Circle({
                        radius: radioCapa,
                        fill: new Fill({
                            color: colorBorde
                        })
                    })
                });
                event.feature.setStyle(s);

            });
            // Para Aignar ID a Cada Feature Dibujado
            this[type].on('drawend', function (event) {
                featureID = featureID + 1;
                event.feature.setProperties({
                    'id': featureID
                });
                console.log('ID Elemento: ', featureID);
            })

            this.activeType = type;
            map.addInteraction(this[type]);
        } else {
            // Activa el Single Click
            /*
            map.removeInteraction(select);
            map.addInteraction(select);
            seleccionSimpleClick.init();
            */
            //console.log('*** ', this.activeType && this[this.activeType].setActive(false));
            this.activeType && this[this.activeType].setActive(false);
            this.activeType = null;
        }
    }
};
ExampleDraw.init();
ExampleDraw.setActive(false);
ExampleModify.setActive(false);

export function setColorFeature() {
    console.log('cambio de color');
    ExampleDraw.setActive(true);
}

var areaAcumulada = 0;
var seleccionSimpleClick = {
    init: function () {

        select.on('select', function (event) {
            console.log(event.selected[0]);
            let selectedFeature = event.selected[0];
            let areaPol = 0;
            let flgSeleccionado = -1;
            let featureSel = event.selected.length - 1;

            if (event.deselected.length == 1) { // deseleccionado
                flgSeleccionado = 0;
            }

            if (event.selected.length == 1) { // Seleccionado
                flgSeleccionado = 1;
            }
            if (isNaN(areaAcumulada)) {
                areaAcumulada = parseFloat(areaAcumulada);
            }

            if (event.target.getFeatures().getLength() > 0) {
                if (flgSeleccionado == 1) { // si se selecciono un elemento
                    console.log('Area4');
                    areaPol = event.selected[featureSel].getGeometry().getArea();
                    if (event.target.getFeatures().getLength() == 1) {
                        areaAcumulada = areaPol;
                    }
                    if (event.target.getFeatures().getLength() > 1) {
                        areaAcumulada += areaPol;
                    }
                } else if (flgSeleccionado == 0) { // Se ha Deseleccionado Elemento
                    console.log('Area5');
                    areaPol = event.deselected[0].getGeometry().getArea();
                    areaAcumulada = areaAcumulada - areaPol;
                }
            } else {
                areaAcumulada = 0;
            }
            console.log('AreaAcumulada: ', areaAcumulada);
            document.getElementById('areaTotal').innerHTML = areaAcumulada.toFixed(3) + ' m<sup>2<sup>';

            if (selectedFeature) {
                console.log('SELECTED');
                var centroid = selectedFeature.values_;
                var coord4326 = projTransform([centroid.cent_long, centroid.cent_lat], 'EPSG:4326', 'EPSG:3857');
                var extent = selectedFeature.getGeometry().getExtent();
                //overlay.setPosition(getCenterOfExtent( ));
                overlay.setPosition([coord4326[0], coord4326[1]]);
                var content = '<b>Sector: </b>' + selectedFeature.get('cod_sector') + '<br>';
                content += '<b>Manzana: </b>' + selectedFeature.get('cod_manzan') + '<br>';
                content += '<b>Lote: </b>' + selectedFeature.get('cod_lote') + '<br>';
                content_element.innerHTML = content;
                //selectedFeature.setStyle(selectedStyle);
                //console.log(selectedFeature);
            } else {
                overlay.setPosition(undefined);
            }
        });
    },
    stop: function () {
        map.removeInteraction(select);
        console.log('Debe eliminar eso');
    }
};

var featureAnterior = null;



map.on('dblclick',
    function (evt) {
        if (featureAnterior) featureAnterior.setStyle(styleFeatureNormal);
        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function (feature, layer) {
                vectorLote.getSource().clear(true);
                if (!featureAnterior) featureAnterior = feature;
                console.log("featureAnterior");
                console.log(featureAnterior);
                featureAnterior.setStyle(styleFeatureDobleClick);

                //elegir la capa a ser seleccionada (vectorLote)
                // console.log(feature);
                console.log("Vector Lote");
                console.log(vectorLote);
                if (layer == vectorLote) {
                    feature.setStyle(styleFeatureSelected);
                    featureAnterior = feature;
                    // console.log('*+*+**++*',feature);
                    // layer.setStyle();
                    let featureSelected = true;
                    console.log('feature');
                    console.log(feature);
                    console.log('Datos');
                    //mostrarDatos(feature);//llama a la funcion para mostrar informacion lote
                    //addSeleccion();
                }
            }
        );
        // console.log('Desde el Doble Click', featureSelected);
        vectorLote.setStyle(vectorLote.getStyle());
        //feature.setStyle(styleFeatureSelected);s
    }
);

addSeleccion();
seleccionSimpleClick.init();


function addSeleccion() {
    map.addInteraction(select);
}



optionsForm.onchange = function (e) {
    var type = e.target.getAttribute('name');
    var value = e.target.value;
    if (type === 'selectDibujo') {
        ExampleDraw.getActive() && ExampleDraw.setActive(true);
    } else if (type === 'interaction') {
        if (value === 'modify') {
            measureDraw.setActive(false);
            ExampleDraw.setActive(false);
            ExampleModify.setActive(true);
            seleccionSimpleClick.stop();
            map.removeInteraction(select);

            setDraw.style.display = "none";//apagar control de la capa
            borraD.style.display = "block";//prender boton borrar
            popup.style.display = "none";//apagar el Popup
        } else if (value === 'draw') {
            measureDraw.setActive(false);
            // map.removeInteraction(draw); // Interrumpe el MEasure.
            $(".tooltip ").remove();
            $(".tooltip-measure ").empty();
            //createMeasureTooltip();
            document.getElementById('medida').selectedIndex = 0;
            ExampleDraw.setActive(true);
            ExampleModify.setActive(false);
            setDraw.style.display = "block";//prender control de la capa
            borraD.style.display = "none";//apagar control de la capa
            seleccionSimpleClick.stop();
            map.removeInteraction(select);
            popup.style.display = "none";//apagar el Popup
        } else if (value === 'nodraw') {
            document.getElementById('medida').selectedIndex = 0;
            ExampleDraw.setActive(false);
            ExampleModify.setActive(false);
            map.removeInteraction(select);
            map.addInteraction(select);
            //seleccionSimpleClick.init();
            setDraw.style.display = "none";//apagar control de la capa
            borraD.style.display = "none";//apagar control de la capa
            popup.style.display = "block";//prender el Popup
        }
    }
};

var measureDraw = {
    init: function () {
        map.addInteraction(this.Polygon);
        this.Polygon.setActive(false);

        map.addInteraction(this.LineString);
        this.LineString.setActive(false);
    },
    Polygon: new Draw({
        source: source,
        type: 'Polygon',
        style: new Style({
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new Circle({
                radius: 5,
                stroke: new Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                })
            })
        })
    }),
    LineString: new Draw({
        source: source,
        type: 'LineString',
        style: new Style({
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new Circle({
                radius: 5,
                stroke: new Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                })
            })
        })
    }),
    getActive: function () {
        return this.activeType ? this[this.activeType].getActive() : false;
    },
    setActive: function (active) {
        var type = typeSelect.value;
        console.log('Tipo Dibujo: ', type);
        if (active) {
            this.activeType && this[this.activeType].setActive(false);
            this[type].setActive(true);

            createMeasureTooltip();
            createHelpTooltip();

            var listener;

            this[type].on('drawstart', function (evt) {

                // set sketch
                sketch = evt.feature;

                var tooltipCoord = evt.coordinate;

                listener = sketch.getGeometry().on('change', function (evt) {
                    var geom = evt.target;
                    var output;
                    if (geom instanceof Polygon) {
                        output = formatArea(geom);
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    } else if (geom instanceof LineString) {
                        output = formatLength(geom);
                        tooltipCoord = geom.getLastCoordinate();
                    }
                    measureTooltipElement.innerHTML = output;
                    measureTooltip.setPosition(tooltipCoord);
                });
            }, this);

            this[type].on('drawend',
                function (e) {
                    //console.log('+++++++++ ', e.feature.getLayer('name'));
                    measureTooltipElement.className = 'tooltip tooltip-static';
                    measureTooltip.setOffset([0, -7]);
                    // unset sketch
                    sketch = null;
                    // unset tooltip so that a new one can be created
                    measureTooltipElement = null;
                    createMeasureTooltip();
                    unByKey(listener);
                    //ol.Observable.unByKey(listener);
                }, this);

            this.activeType = type;
            map.addInteraction(this[type]);


        } else {
            this.activeType && this[this.activeType].setActive(false);
            select.getFeatures().clear();
            document.getElementById('medida').selectedIndex = 0;
            this.activeType = null;
        }
    }
};

measureDraw.init();

//Cargar Capas del Menu

document.getElementById('lotizacionLink').addEventListener('click', function () {
    onOffLayer(0, -1);
});

document.getElementById('sectorLink').addEventListener('click', function () {
    onOffLayer(4, -1);
});
document.getElementById('usoLink').addEventListener('click', function () {
    onOffLayer(5, -1);
});
document.getElementById('alturaLink').addEventListener('click', function () {
    onOffLayer(6, -1);
});

document.getElementById('osmLayerLink').addEventListener('click', function () {
    onOffLayer(1, -1);
});


// controles deslizantes(slider) ocultar parte del mapa
function precomposeLayer(event, nombreSlider) {
    var ctx = event.context;
    const mapSize = map.getSize();
    const width = ctx.canvas.width * ($(nombreSlider).slider('value') / 100);
    const tl = getRenderPixel(event, [width, 0]);
    const tr = getRenderPixel(event, [mapSize[0], 0]);
    const bl = getRenderPixel(event, [width, mapSize[1]]);
    const br = getRenderPixel(event, mapSize);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(tl[0], tl[1]);
    ctx.lineTo(bl[0], bl[1]);
    ctx.lineTo(br[0], br[1]);
    ctx.lineTo(tr[0], tr[1]);
    ctx.closePath();
    ctx.clip();
}

function postcomposeLayer(event) {
    var ctx = event.context;
    ctx.restore();
}


function accionDeControlesOcultarDeslizar(idSliderDeslizar, idSliderOcultar, layer) {

    $("#" + idSliderDeslizar).slider({ orientation: "vertical", value: 0, slide: function (e, ui) { map.render(); } });
    layer.on('prerender', (event) => precomposeLayer(event, '#' + idSliderDeslizar));// callback
    layer.on('postrender', function (event) {
        postcomposeLayer(event);
    });

    $("#" + idSliderOcultar).slider({ orientation: "vertical", value: 100, slide: function (e, ui) { layer.setOpacity(ui.value / 100); } });
 
}

accionDeControlesOcultarDeslizar('slider_trasp_LayerLotizacion', 'slider_oculta_LayerLotizacion', grouplayerLotizacion);
accionDeControlesOcultarDeslizar('slider_trasp_sector', 'slider_oculta_sector', tg_sector);
accionDeControlesOcultarDeslizar('slider_trasp_uso', 'slider_oculta_uso', tg_uso);
accionDeControlesOcultarDeslizar('slider_trasp_altura', 'slider_oculta_altura', tg_alturas);
accionDeControlesOcultarDeslizar('slider_trasp_osmLayer', 'slider_oculta_osmLayer', osmLayer);

/*$("#slider_oculta_LayerLotizacion").slider({ orientation: "vertical", value: 0, slide: function (e, ui) { map.render(); } });
grouplayerLotizacion.on('precompose', (event) => precomposeLayer(event, '#slider_oculta_LayerLotizacion'));// callback
grouplayerLotizacion.on('postcompose', (event) => postcomposeLayer(event));*/
//$("#slider_trasp_LayerLotizacion").slider({ orientation: "vertical", value: 100, slide: function (e, ui) { grouplayerLotizacion.setOpacity(ui.value / 100); } });