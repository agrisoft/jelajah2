// Jelajah v2
// 2017. Tejo Damai Santoso
// Agrisoft

// Init UI

var base_div = "jelajah";
var map_div = "jelajah_map";
var layer = [];
var raw_local_wms;
var list_workspace;
var hasil_cari;
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
var info_layer = [];
var layer_source = [];
var layer_index = []

// Functions
function randomNumber() {
    return Math.floor((Math.random() * 1000) + 1);
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function uniqueArray(arr) {
    var a = [];
    for (var i = 0, l = arr.length; i < l; i++)
        if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
            a.push(arr[i]);
    return a;
}

function olAddWMSLayer(serviceUrl, layername, layermark, min_x, min_y, max_x, max_y, layer_nativename) {
    rndlayerid = randomNumber()
    layer_source[rndlayerid] = new ol.source.TileWMS({
        url: serviceUrl,
        params: { LAYERS: layername, TILED: true }
    })
    layer[rndlayerid] = new ol.layer.Tile({
        title: layermark,
        tipe: 'WMS',
        visible: true,
        preload: Infinity,
        extent: [min_x, min_y, max_x, max_y],
        source: layer_source[rndlayerid]
    });
    map.addLayer(layer[rndlayerid]);
    console.log(rndlayerid, layermark, layer[rndlayerid].get('title'))
    setTimeout(() => {
        listappend = "<li id='" + rndlayerid + "'><div class='collapsible-header'><div class='layer_control'><i id='visibility' class='material-icons'>check_box</i>" + layer[rndlayerid].get('title') + "</div><i id='getinfo' class='material-icons right'>comment</i><i id='zextent' class='material-icons right'>loupe</i><i id='remove' class='material-icons right'>cancel</i></div></div><div class='collapsible-body'><div class='row opa'><span class='col s4'><i class='material-icons' style='        padding-right: 15px; position: relative; bottom: -6px;'>opacity</i>Opacity</span><div class='col s8 range-field'><input type='range' id='opacity' min='0' max='100' value='100'/></div></div><span id='wmslegend_" + rndlayerid + "'></span></div></li>";
        $('#sortableul').append(listappend);
        info_layer.push(rndlayerid);
        extent = layer[rndlayerid].getExtent();
        map.getView().fit(extent, map.getSize());
        legend_url = local_gs + '/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&legend_options=fontAntiAliasing:true&LAYER=' + layer_nativename;
        legend_html = "<img src='" + legend_url + "'>";
        $('#wmslegend_' + rndlayerid).append(legend_html);
        layer_index.push(rndlayerid);
    }, 1000);
}

function layerVis(layerid) {
    if (layer[layerid].getVisible() == true) {
        layer[layerid].setVisible(false);
    } else {
        layer[layerid].setVisible(true);
    }
};

function layerRm(layerid) {
    map.removeLayer(layer[layerid]);
    $("#" + layerid + "").remove();
};

function layerZm(layerid) {
    if (layer[layerid].type == 'TILE') {
        layer_extent = layer[layerid].getExtent();
        map.getView().fit(layer_extent, map.getSize());
    }
    if (layer[layerid].type == 'VECTOR') {
        layer_extent = layer[layerid].getSource().getExtent();
        map.getView().fit(layer_extent, map.getSize());
    }
};

function layerOpa(layerid, opacity) {
    opafrac = opacity / 100;
    layer[layerid].setOpacity(opafrac);
};

// Init slider

var slider_content = "<ul id='slide-out' class='side-nav'><li><h4> Layer</h4></li><li id='layers_item'></li></ul><a href='#' data-activates='slide-out' class='button-collapse' style='display:none';><i class='material-icons'>menu</i></a>";

// Init geocoding UI
var geocoding_content = "<div class='row'><div class='col s12'><div class='row'><div class='col s4 l5'></div><div class='input-field col s5 m6'><input placeholder='Cari lokasi' id='cari_geocoding' type='text' class='validate'></div><a id='caribtn' class='col s3 m2 l1 waves-effect waves-light btn'><i class='material-icons left'>search</i>Cari</a></div></div></div>"

// eksperimen
var fab_button = "<div class='fixed-action-btn vertical'><a id='main_menu' class='btn-floating btn-large cyan darken-4 tooltipped' data-position='left' data-tooltip='Menu Utama'><i class='material-icons'>menu</i></a><ul><li><a class='btn-floating cyan lighten-1 modal-trigger tooltipped' href='#modal_addlayer' data-position='left' data-tooltip='Tambah Layer'><i class='material-icons'>playlist_add</i></a></li><li><a class='btn-floating cyan tooltipped button-collapse' data-position='left' data-tooltip='Layer' href='#' data-activates='slide-out'><i class='material-icons'>layers</i></a></li><li><a id='ukur_btn' class='btn-floating cyan darken-1 tooltipped' data-position='left' data-tooltip='Ukur'><i class='material-icons'>border_color</i></a></li><li><a class='btn-floating cyan darken-2 tooltipped' data-position='left' data-tooltip='Cetak'><i class='material-icons'>print</i></a></li><li><a class='btn-floating cyan darken-3 modal-trigger tooltipped' href='#modal_basemap' data-position='left'  data-tooltip='Basemap'><i class='material-icons'>public</i></a></li></ul></div>"

var modal_addlayer = "<div id='modal_addlayer' class='modal bottom-sheet'><div class='modal-content'><h4>Tambah Layer</h4><ul id='tabs_addlayer' class='tabs'><li class='tab col s3'><a class='active' href='#add_dataset'>Dataset</a></li><li class='tab col s3'><a href='#add_url'>URL</a></li><li class='tab col s3'><a href='#add_file'>File</a></li><li class='tab col s3'><a href='#add_simpul'>Simpul</a></li></ul><div id='add_dataset' class='col s12'><div class='row'><div class='col s12'><div class='row'><div class='input-field col s4'><select id='list_workspace'><option value='SEMUA' disable selected>Semua Walidata</option></select></div><div class='input-field col s8'><input id='cari_lokal_layer' type='text' class='validate'><label for='cari_lokal_layer'>Cari Layer</label></div></div></div><div class='col s12'> <ul id='layers_item_list'  class='collection'></div></div></div><div id='add_url' class='col s12 red'>Test 2</div><div id='add_file' class='col s12 green'>Test 3</div><div id='add_simpul' class='col s12 yellow'>Test 3</div></div></div>"

var modal_cari = "<div id='modal_cari' class='modal bottom-sheet'><div class='modal-content'><h4>Hasil pencarian</h4><ul id='list_hasil'></ul></div></div>"

var modal_basemap = "<div id='modal_basemap' class='modal bottom-sheet'><div class='modal-content'><h4>Basemap</h4><div class='row'><div id='base_osm' class='col s6 m3 l2'><div class='card'><div class='card-image'><img src='images/osm.png'><span class='card-title'>OSM</span></div><div class='card-content'><p>Openstreetmap</p></div></div></div><div class='col s6 m3 l2' id='base_rbi'><div class='card'><div class='card-image'><img src='images/osm.png'><span class='card-title'>RBI</span></div><div class='card-content'><p>Rupa Bumi Indonesia</p></div></div></div><div id='base_esri' class='col s6 m3 l2'><div class='card'><div class='card-image'><img src='images/osm.png'><span class='card-title'>ESRI</span></div><div class='card-content'><p>ERSI Imagery</p></div></div></div><div id='base_rbibaru' class='col s6 m3 l2'><div class='card'><div class='card-image'><img src='images/osm.png'><span class='card-title'>RBI OS</span></div><div class='card-content'><p>Rupa Bumi Indonesia (OS)</p></div></div></div></div></div</div>"

var ukur_drop = "<ul id='ukur' class='dropdown-content'><li><a href='#!'>one</a></li><li><a href='#!'>two</a></li><li class='divider'></li><li><a href='#!'>three</a></li><li><a href='#!'><i class='material-icons'>view_module</i>four</a></li><li><a href='#!'><i class='material-icons'>cloud</i>five</a></li></ul>"

var layers = "<ul id='sortableul' class='collapsible' data-collapsible='expandable'></ul>"

var box_ukur = "<div id='box_ukur'><div class='input-field'><select id='select_ukur'><option value='' disabled selected>Pilih pengukuran</option><option value='1'>Panjang</option><option value='2'>Luas</option></select><label>Geometri</label></div><div id='panjang' class='input-field' style='display:none;'><select><option value='' disabled selected>Satuan</option><option value='1'>Meter (m)</option><option value='2'>Kilometer (km)</option><option value='3'>Mil</option></select><label>Satuan</label></div><div id='luas' class='input-field' style='display:none;'><select><option value='' disabled selected>Satuan</option><option value='1'>Meter Persegi (m2)</option><option value='2'>Kilometer Persegi (km2)</option><option value='3'>Mil Persegi</option></select><label>Satuan</label></div></div>"

$('#' + base_div).append(slider_content);
$('#' + base_div).append(geocoding_content);
$('#' + base_div).append(modal_addlayer);
$('#' + base_div).append(modal_cari);
$('#' + base_div).append(modal_basemap);
$('#' + base_div).append(ukur_drop);
$('#' + base_div).append(box_ukur);
$('#layers_item').append(layers);
$('#' + base_div).append(fab_button);

var box_ukur_visible = false;
$('#ukur_btn').on('click', function() {
    if (box_ukur_visible) {
        $('#box_ukur').hide();
        box_ukur_visible = false;
    } else {
        $('#box_ukur').show();
        box_ukur_visible = true;
    }
});

$("#select_ukur").on('change', function() {
    console.log($("#select_ukur").val())
    if ($("#select_ukur").val() == 1) {
        $('#panjang').show();
        $('#luas').hide();
    } else {
        $('#panjang').hide();
        $('#luas').show();
    }
});

$('#main_menu').on('click', function() {
    if (box_ukur_visible) {
        $('#box_ukur').hide();
        box_ukur_visible = false;
    } else {
        $('#box_ukur').hide();
        box_ukur_visible = false;
    }
});

$(document).ready(function() {
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    $('.collapsible').collapsible();
    var sortableel = document.getElementById('sortableul');
    var sortableul = Sortable.create(sortableel, {
        handle: ".collapsible-header"
    });
    // $('ul.collapsible').sortable();
    $('select').material_select();
    $('.button-collapse').sideNav({
        menuWidth: 500, // Default is 300
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true, // Choose whether you can drag to open on touch screens,
        onOpen: function(el) {}, // A function to be called when sideNav is opened
        onClose: function(el) {}, // A function to be called when sideNav is closed
    });

    $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrainWidth: true, // Does not change width of dropdown to that of the activator
        hover: false, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: true, // Displays dropdown below the button
        alignment: 'center', // Displays dropdown with edge aligned to the left of button
        stopPropagation: false // Stops event propagation
    });
});


// Get Data
$.get(palapa_api_url + "getWMSlayers", function(data) {
    window.raw_local_wms = data;
    listw = [];
    for (j = 0; j < data.length; j++) {
        listw.push(data[j].workspace);
    }
    list_workspace = uniqueArray(listw);
    console.log(list_workspace);
    for (i = 0; i < data.length; i++) {
        item_html = "<li id='" + data[i].layer_nativename + "' class='collection-item'><i id='add_check' class='material-icons'>check_box_outline_blank</i> <span class='layermark' id='" + data[i].layer_nativename + "'>" + data[i].workspace + " " + data[i].layer_name + "</span></li>";
        $('#layers_item_list').append(item_html);
    }
    for (k = 0; k < list_workspace.length; k++) {
        w_html = "<option value='" + list_workspace[k] + "'>" + list_workspace[k] + "</option>";
        console.log(w_html)
        $('#list_workspace').append(w_html);
    }
    $('select').material_select();
    $('.modal').modal();
});

// Custom control
window.app = {};
var app = window.app;
/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
app.JelajahBurgerControl = function(opt_options) {

    var options = opt_options || {};

    var button = document.createElement('button');
    button.innerHTML = "<a href='#' data-activates='slide-out' class='button-collapse jelajah_burger'><i class='material-icons'>menu</i></a>";

    var this_ = this;
    var handleJelajahBurger = function() {
        console.log('CLICK');
        $('.button-collapse').sideNav('show');;
    };

    button.addEventListener('click', handleJelajahBurger, false);
    button.addEventListener('touchstart', handleJelajahBurger, false);

    var element = document.createElement('div');
    element.className = 'jelajah_burger ol-unselectable ol-control';
    element.appendChild(button);

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });

};
ol.inherits(app.JelajahBurgerControl, ol.control.Control);

// Init map

// var layers = [];

var layer_osm = new ol.layer.Tile({
    visible: true,
    preload: Infinity,
    source: new ol.source.OSM()
});

var layer_rbi = new ol.layer.Tile({
    visible: false,
    preload: Infinity,
    source: new ol.source.XYZ({
        url: 'http://portal.ina-sdi.or.id/arcgis/rest/services/IGD/RupabumiIndonesia/MapServer/tile/{z}/{y}/{x}'
    })
});

var layer_esri = new ol.layer.Tile({
    visible: false,
    preload: Infinity,
    source: new ol.source.XYZ({
        url: 'http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    })
});

var layer_rbibaru = new ol.layer.Tile({
    visible: false,
    preload: Infinity,
    source: new ol.source.TileWMS({
        url: 'http://dev1.agrisoft-cb.com:8080/geoserver/gwc/service/wms',
        params: { LAYERS: 'rbi', VERSION: '1.1.1' }
    })
});

var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});

closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};

var map = new ol.Map({
    layers: [layer_osm, layer_rbi, layer_esri, layer_rbibaru],
    target: map_div,
    overlays: [overlay],
    view: new ol.View({
        projection: 'EPSG:4326',
        center: [116.5, -4],
        zoom: 5,
        minZoom: 4,
        maxZoom: 22
    })
});

map.on('singleclick', function(evt) {
    var coordinate = evt.coordinate;
    var hdms = ol.coordinate.toStringHDMS(coordinate);



    content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';
    overlay.setPosition(coordinate);
});

// EVENT HANDLING

$('#base_osm').on('click', function() {
    layer_osm.setVisible(true);
    layer_rbi.setVisible(false);
    layer_esri.setVisible(false);
    layer_rbibaru.setVisible(false);
});

$('#base_rbi').on('click', function() {
    layer_osm.setVisible(false);
    layer_rbi.setVisible(true);
    layer_esri.setVisible(false);
    layer_rbibaru.setVisible(false);
});

$('#base_esri').on('click', function() {
    layer_osm.setVisible(false);
    layer_rbi.setVisible(false);
    layer_esri.setVisible(true);
    layer_rbibaru.setVisible(false);
});

$('#base_rbibaru').on('click', function() {
    layer_osm.setVisible(false);
    layer_rbi.setVisible(false);
    layer_esri.setVisible(false);
    layer_rbibaru.setVisible(true);
});

$("#caribtn").click(function() {
    geocaritext = document.getElementById('cari_geocoding').value;
    $.get("http://nominatim.openstreetmap.org/search?format=jsonv2&polygon_geojson=1&q=" + geocaritext, function(data, status) {
        window.hasil_cari = data;
        // console.log(data);
        $('#list_hasil').empty();
        for (i = 0; i < data.length; i++) {
            lihtml = "<li id='" + data[i].place_id + "' class='collection-item avatar'><i id='" + data[i].place_id + "' class='material-icons circle green piccari'>add_location</i><div id='" + data[i].place_id + "' class='title'>" + data[i].display_name + "</div></li>";
            $('#list_hasil').append(lihtml);
            console.log(data[i]);
        }
        $('#modal_cari').modal('open');
    });
});

$('#list_hasil').on('click', function(e) {
    p_id = $(e.target).attr('id');
    console.log($(e.target).attr('id'));
    for (i = 0; i < hasil_cari.length; i++) {
        if (hasil_cari[i].place_id == String(p_id)) {
            feature = new ol.format.GeoJSON().readFeatures(hasil_cari[i].geojson, {
                featureProjection: 'EPSG:4326'
            });

            rndlayerid = randomNumber();
            layer[rndlayerid] = new ol.layer.Vector({
                title: hasil_cari[i].display_name,
                source: new ol.source.Vector({
                    tipe: 'cari',
                    features: feature,
                    params: {
                        'LAYERS': String(hasil_cari[i].display_name)
                    }
                })
            });

            map.addLayer(layer[rndlayerid]);
            extent = layer[rndlayerid].getSource().getExtent();
            map.getView().fit(extent, map.getSize());
            listappend = "<li id='" + rndlayerid + "'><div class='collapsible-header'><div class='layer_control'><i id='visibility' class='material-icons'>check_box</i>" + hasil_cari[i].display_name + "</div><i class='material-icons right'>comment</i><i id='zextent' class='material-icons right'>loupe</i><i id='remove' class='material-icons right'>cancel</i></div></div><div class='collapsible-body'><div class='row opa'><span class='col s4'><i class='material-icons' style='        padding-right: 15px; position: relative; bottom: -6px;'>opacity</i>Opacity</span><div class='col s8 range-field'><input type='range' id='opacity' min='0' max='100' value='100'/></div><span>Lorem ipsum dolor sit amet.</span></div></li>"
            $('#sortableul').append(listappend);
            layer_index.push(rndlayerid);
        }
    }
});

$('#layers_item_list').on('click', function(e) {
    p_id = $(e.target).attr('id');
    if (p_id == '' || typeof(p_id) == 'undefined' || p_id == 'add_check') {
        p_id = $(e.target).closest('li').attr('id');
    }
    console.log(p_id)
        // p_name = $("li [id='" + p_id + "'").text();
    p_name = $(e.target).find('.layermark').first().text();
    p_state = $(e.target).find('#add_check').first().text();
    var min_x, min_y, max_x, max_y, layer_nativename;
    for (i = 0; i < raw_local_wms.length; i++) {
        // console.log(raw_local_wms[i].layer_nativename)
        if (raw_local_wms[i].layer_nativename.indexOf(p_id) >= 0) {
            min_x = raw_local_wms[i].layer_minx;
            min_y = raw_local_wms[i].layer_miny;
            max_x = raw_local_wms[i].layer_maxx;
            max_y = raw_local_wms[i].layer_maxy;
            layer_nativename = raw_local_wms[i].layer_nativename;
        }
    }
    console.log(p_state, p_id, p_name, min_x, min_y, max_x, max_y, layer_nativename);
    if (p_name == '' || typeof(p_name) == 'undefined') {
        p_name = $(e.target).closest('.layermark').first().text();
        if (p_name == '' || typeof(p_name) == 'undefined') {
            p_name = $(e.target).siblings('.layermark').first().text();
        }
    }
    if (p_state == '' || typeof(p_state) == 'undefined') {
        p_state = $(e.target).siblings('#add_check').first().text();
        if (p_state == '' || typeof(p_state) == 'undefined') {
            p_state = $(e.target).text();
            if (p_state == 'check_box') {
                $(e.target).text('check_box_outline_blank');
            } else {
                $(e.target).text('check_box');
            }
        } else {
            if (p_state == 'check_box') {
                $(e.target).siblings('#add_check').first().text('check_box_outline_blank');
            } else {
                $(e.target).siblings('#add_check').first().text('check_box');
            }
        }
    } else {
        if (p_state == 'check_box') {
            $(e.target).find('#add_check').first().text('check_box_outline_blank');
        } else {
            $(e.target).find('#add_check').first().text('check_box');
        }
    }
    if (layer.length > 0) {
        count = 0
        for (j = 0; j < layer.length; j++) {
            if (typeof(layer[j]) != 'undefined') {
                if (layer[j].getSource().i.LAYERS == p_id) {
                    console.log('RM')
                    layerRm(j);
                    delete layer[j];
                } else {
                    console.log('AD')
                    olAddWMSLayer(local_gs, p_id, p_name, min_x, min_y, max_x, max_y, layer_nativename);
                }
            } else {
                count = count + 1;
            }
        }
        console.log(count);
        if (count == layer.length) {
            console.log('AD')
            olAddWMSLayer(local_gs, p_id, p_name, min_x, min_y, max_x, max_y, layer_nativename);
        }
    } else {
        olAddWMSLayer(local_gs, p_id, p_name, min_x, min_y, max_x, max_y, layer_nativename);
    }
})

$("#list_workspace").on('change', function() {
    s_workspace = $("#list_workspace").val();
    $('#layers_item_list').empty();
    for (i = 0; i < raw_local_wms.length; i++) {
        if (raw_local_wms[i].workspace == s_workspace) {
            item_html = "<li id='" + raw_local_wms[i].layer_nativename + "' class='collection-item'><input type='checkbox' id='" + raw_local_wms[i].layer_nativename + "'> <label id='" + raw_local_wms[i].layer_nativename + "' for='" + raw_local_wms[i].layer_nativename + "'><strong>" + raw_local_wms[i].workspace + "</strong> " + raw_local_wms[i].layer_name + "</li>";
            $('#layers_item_list').append(item_html);
        } else if (s_workspace == 'SEMUA') {
            item_html = "<li id='" + raw_local_wms[i].layer_nativename + "' class='collection-item'><input type='checkbox' id='" + raw_local_wms[i].layer_nativename + "'> <label id='" + raw_local_wms[i].layer_nativename + "' for='" + raw_local_wms[i].layer_nativename + "'><strong>" + raw_local_wms[i].workspace + "</strong> " + raw_local_wms[i].layer_name + "</li>";
            $('#layers_item_list').append(item_html);
        }
    }
});

$("#cari_lokal_layer").on('input', function() {
    s_workspace = $("#list_workspace").val();
    carilayer = $("#cari_lokal_layer").val()
    $('#layers_item_list').empty();
    for (i = 0; i < raw_local_wms.length; i++) {
        if (raw_local_wms[i].workspace == s_workspace) {
            if (raw_local_wms[i].layer_name.toLowerCase().indexOf(carilayer) >= 0) {
                item_html = "<li id='" + raw_local_wms[i].layer_nativename + "' class='collection-item'><input type='checkbox' id='" + raw_local_wms[i].layer_nativename + "'> <label id='" + raw_local_wms[i].layer_nativename + "' for='" + raw_local_wms[i].layer_nativename + "'><strong>" + raw_local_wms[i].workspace + "</strong> " + raw_local_wms[i].layer_name + "</li>";
                $('#layers_item_list').append(item_html);
            } else if (carilayer == '') {
                item_html = "<li id='" + raw_local_wms[i].layer_nativename + "' class='collection-item'><input type='checkbox' id='" + raw_local_wms[i].layer_nativename + "'> <label id='" + raw_local_wms[i].layer_nativename + "' for='" + raw_local_wms[i].layer_nativename + "'><strong>" + raw_local_wms[i].workspace + "</strong> " + raw_local_wms[i].layer_name + "</li>";
                $('#layers_item_list').append(item_html);
            }
        } else if (s_workspace == 'SEMUA') {
            if (raw_local_wms[i].layer_name.toLowerCase().indexOf(carilayer) >= 0) {
                item_html = "<li id='" + raw_local_wms[i].layer_nativename + "' class='collection-item'><input type='checkbox' id='" + raw_local_wms[i].layer_nativename + "'> <label id='" + raw_local_wms[i].layer_nativename + "' for='" + raw_local_wms[i].layer_nativename + "'><strong>" + raw_local_wms[i].workspace + "</strong> " + raw_local_wms[i].layer_name + "</li>";
                $('#layers_item_list').append(item_html);
            } else if (carilayer == '') {
                item_html = "<li id='" + raw_local_wms[i].layer_nativename + "' class='collection-item'><input type='checkbox' id='" + raw_local_wms[i].layer_nativename + "'> <label id='" + raw_local_wms[i].layer_nativename + "' for='" + raw_local_wms[i].layer_nativename + "'><strong>" + raw_local_wms[i].workspace + "</strong> " + raw_local_wms[i].layer_name + "</li>";
                $('#layers_item_list').append(item_html);
            }
        }
    }
})

$("#sortableul").on('click', "li .collapsible-header .layer_control i#visibility", function(e) {
    e.stopPropagation();
    p_id = $(e.target).closest('li').attr('id');
    // console.log($(e.target).text());
    p_state = $(e.target).text();
    layerVis(p_id);
    if (p_state == 'check_box') {
        $(e.target).text('check_box_outline_blank');
    } else {
        $(e.target).text('check_box');
    }
    e.preventDefault();
})

$("#sortableul").on('click', "li .collapsible-header i#zextent", function(e) {
    e.stopPropagation();
    p_id = $(e.target).closest('li').attr('id');
    layerZm(p_id);
    e.preventDefault();
})

$("#sortableul").on('click', "li .collapsible-header i#remove", function(e) {
    e.stopPropagation();
    p_id = $(e.target).closest('li').attr('id');
    p_state = $(e.target).text();
    layerRm(p_id);
    e.preventDefault();
})

$("#sortableul").on('mouseup', "li .collapsible-body .row .col #opacity", function(e) {
    // e.preventDefault();
    // e.stopPropagation();
    p_id = $(e.target).closest('li').attr('id');
    p_frac = Number($(e.target).closest('input').val());
    console.log(p_id, p_frac);
    layerOpa(p_id, p_frac);
    p_state = $(e.target).text();
})

$("#sortableul").on('change', function(e) {
    p_id = $(e.target).closest('li').attr('id');
    console.log($(e.target).closest('li').attr('id'), $(e.target).closest('li').index())
})