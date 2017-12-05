// Init UI

var base_div = "jelajah";
var map_div = "jelajah_map";

// Init slider

 var slider_content = "<ul id='slide-out' class='side-nav'><li><h4> Layer</h4></li><li id='layers_item'></li></ul><a href='#' data-activates='slide-out' class='button-collapse' style='display:none';><i class='material-icons'>menu</i></a>";

// Init geocoding UI
var geocoding_content = "<div class='row'><div class='col s12'><div class='row'><div class='col s5'></div><div class='input-field col s6'><input placeholder='Cari lokasi' id='cari_geocoding' type='text' class='validate'></div><a id='caribtn' class='col s1 waves-effect waves-light btn'><i class='material-icons left'>search</i>Cari</a></div></div></div>"

// eksperimen
var fab_button = "<div class='fixed-action-btn vertical click-to-toggle'><a class='btn-floating btn-large cyan darken-4 tooltipped' data-tooltip='Menu Utama'><i class='material-icons'>menu</i></a><ul><li><a class='btn-floating cyan lighten-1 modal-trigger tooltipped' href='#modal_addlayer' data-tooltip='Tambah Layer'><i class='material-icons'>playlist_add</i></a></li><li><a class='btn-floating cyan tooltipped button-collapse' data-tooltip='Layer' href='#' data-activates='slide-out'><i class='material-icons'>layers</i></a></li><li><a class='btn-floating cyan darken-1 tooltipped dropdown-button' data-tooltip='Ukur' href='#' data-activates='ukur'><i class='material-icons'>border_color</i></a></li><li><a class='btn-floating cyan darken-2 tooltipped' data-tooltip='Cetak'><i class='material-icons'>print</i></a></li><li><a class='btn-floating cyan darken-3 modal-trigger tooltipped' href='#modal_basemap' data-tooltip='Basemap'><i class='material-icons'>public</i></a></li></ul></div>"

var modal_addlayer = "<div id='modal_addlayer' class='modal bottom-sheet'><div class='modal-content'><h4>Tambah Layer</h4><ul id='tabs_addlayer' class='tabs'><li class='tab col s3'><a class='active'  href='#add_dataset'>Dataset</a></li><li class='tab col s3'><a href='#add_url'>URL</a></li><li class='tab col s3'><a href='#add_file'>File</a></li><li class='tab col s3'><a href='#add_simpul'>Simpul</a></li></ul><div id='add_dataset' class='col s12 blue'>Test 1</div><div id='add_url' class='col s12 red'>Test 2</div><div id='add_file' class='col s12 green'>Test 3</div><div id='add_simpul' class='col s12 yellow'>Test 3</div></div><div class='modal-footer'><a href='#!' class='modal-action modal-close waves-effect waves-green btn'>Tutup</a></div></div>"

var modal_layer = "<div id='modal_layer' class='modal bottom-sheet'><div class='modal-content'><h4>Layer</h4><p>A bunch of text</p></div><div class='modal-footer'><a href='#!' class='modal-action modal-close waves-effect waves-green btn'>Tutup</a></div></div>"

var modal_basemap = "<div id='modal_basemap' class='modal bottom-sheet'><div class='modal-content'><h4>Basemap</h4><div class='row'><div class='col s12 m6 l3'><div class='card'><div class='card-image'><img src='images/osm.png'><span class='card-title'>RBI</span></div><div class='card-content'><p>Rupa Bumi Indonesia</p></div></div></div><div class='col s12 m6 l3'><div class='card'><div class='card-image'><img src='images/osm.png'><span class='card-title'>RBI</span></div><div class='card-content'><p>Rupa Bumi Indonesia</p></div></div></div><div class='col s12 m6 l3'><div class='card'><div class='card-image'><img src='images/osm.png'><span class='card-title'>RBI</span></div><div class='card-content'><p>Rupa Bumi Indonesia</p></div></div></div><div class='col s12 m6 l3'><div class='card'><div class='card-image'><img src='images/osm.png'><span class='card-title'>RBI</span></div><div class='card-content'><p>Rupa Bumi Indonesia</p></div></div></div></div></div><div class='modal-footer'><a href='#!' class='modal-action modal-close waves-effect waves-green btn'>Tutup</a></div></div>"

var ukur_drop = "<ul id='ukur' class='dropdown-content'><li><a href='#!'>one</a></li><li><a href='#!'>two</a></li><li class='divider'></li><li><a href='#!'>three</a></li><li><a href='#!'><i class='material-icons'>view_module</i>four</a></li><li><a href='#!'><i class='material-icons'>cloud</i>five</a></li></ul>"

var layers = "<ul class='collapsible' data-collapsible='expandable'><li><div class='collapsible-header'><div class='layer_control'><i class='material-icons'>check_circle</i>First</div><i class='material-icons right'>comment</i><i class='material-icons right'>loupe</i><i class='material-icons right'>cancel</i></div></div><div class='collapsible-body'><span>Lorem ipsum dolor sit amet.</span></div></li><li><div class='collapsible-header'><div class='layer_control'><i class='material-icons'>check_circle</i>Second</div><i class='material-icons right'>comment</i><i class='material-icons right'>loupe</i><i class='material-icons right'>cancel</i></div></div><div class='collapsible-body'><span>Lorem ipsum dolor sit amet.</span></div></li><li><div class='collapsible-header'><div class='layer_control'><i class='material-icons'>check_circle</i>Third</div><i class='material-icons right'>comment</i><i class='material-icons right'>loupe</i><i class='material-icons right'>cancel</i></div></div><div class='collapsible-body'><span>Lorem ipsum dolor sit amet.</span></div></li></ul>"

$('#' + base_div).append(slider_content);
$('#' + base_div).append(geocoding_content);
$('#' + base_div).append(modal_addlayer);
$('#' + base_div).append(modal_layer);
$('#' + base_div).append(modal_basemap);
$('#' + base_div).append(ukur_drop);
$('#layers_item').append(layers);
$('#' + base_div).append(fab_button);

$(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    $('.collapsible').collapsible();
    $('ul.collapsible').sortable();
    $('.button-collapse').sideNav({
        menuWidth: 500, // Default is 300
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true, // Choose whether you can drag to open on touch screens,
        onOpen: function(el) { }, // A function to be called when sideNav is opened
        onClose: function(el) { }, // A function to be called when sideNav is closed
      }
    );

    $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrainWidth: true, // Does not change width of dropdown to that of the activator
        hover: false, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: true, // Displays dropdown below the button
        alignment: 'center', // Displays dropdown with edge aligned to the left of button
        stopPropagation: false // Stops event propagation
      }
    );
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

var map = new ol.Map({
  // controls: ol.control.defaults({
  //   attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
  //     collapsible: true
  //   })
  // })
  // .extend([
  //   new app.JelajahBurgerControl()
  // ]),
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  target: map_div,
  view: new ol.View({
    center: [0, 0],
    zoom: 2
  })
});
