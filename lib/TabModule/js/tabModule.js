//Tab Module

(function($,window){
	'use-strict';

	var elements = {};

	//View

	var constructTab = function(tabContainer){
		var tabContentEl = $(tabContainer).find('.tab-content > li');
		$.each(tabContentEl,function(){
			hideTabs(this);
		});
        console.log('Active tab')
		console.log($('.tab-legend .active').length);
		var activeTab = ($('.tab-legend .active').length)? $('.tab-legend .active') : $('.tab-legend > li:first-child');
		showTab(activeTab);
	};

	var hideTabs = function(tab,callback){
		$(tab).hide().removeClass('active');
		if(callback){
			callback();
		}
	};
	var contador = 0;

	var showTab = function (tab) {
	    var index = tab.index();
	    var Mostrar = ActivarMenu(tab[0].id);

	    contador = contador + 1;

	    if (Mostrar === true || contador === 1) {
	        hideTabs($('.tab-content .active'));
	        $('.tab-legend .active').removeClass('active').addClass('inactive');
	        $('.tab-legend > li').eq(index).removeClass('inactive').addClass('active');
	        $('.tab-content > li').eq(index).show().addClass('active');
	    }

		
	};

	function ActivarMenu(valor) {
	    var Mostrar = false;
	    switch (valor) {
			case 'MenuDetalleUUCC': Mostrar = (tablaDetalleUUCC.rows().data().length === 0 ? false : true); break;
			case 'MenuLinderos': Mostrar = (tablaLinderos.rows().data().length === 0 ? false : true); break;
	        case 'MenuUnidadCatastral': Mostrar = (tablaUnidadCatastral.rows().data().length === 0 ? false : true); break;
	        case 'MenuNumeracion': Mostrar = (tablaMunicipalAsignado.rows().data().length === 0 ? false : true); break;
	        case 'MenuRetiro': Mostrar = (tablaRetiroMunicipal.rows().data().length === 0 ? false : true); break;
	  //      case 'MenuTramites': Mostrar = (tablatramites.rows().data().length === 0 ? false : true); break;
	  //      case 'MenuAntecedentes': Mostrar = (tablaAntecedentes.rows().data().length === 0 ? false : true); break;
	        case 'MenuObservaciones': Mostrar = (tablaObservaciones.rows().data().length === 0 ? false : true); break;
			case 'MenuRegistrosPublicos': Mostrar = (tablaRegistrosPublicos.rows().data().length === 0 ? false : true); break;
			case 'MenuExpedientesDocSimple': Mostrar = (tablaExpedientesDocSimple.rows().data().length === 0 ? false : true); break;
			case 'MenuObrasPrivadas': Mostrar = (tablaObrasPrivadas.rows().data().length === 0 ? false : true); break;
	  //      case 'MenuDocumentosAdicionales': Mostrar = (tablaDocumentosAdicionales.rows().data().length === 0 ? false : true); break;
	  //      case 'MenuCertNumeracion': Mostrar = (tablaCertNumeracion.rows().data().length === 0 ? false : true); break;
	  //      case 'MenuCertParametros': Mostrar = (tablaCertParametros.rows().data().length === 0 ? false : true); break;
	  //      case 'MenuLicenciaEdificacion': Mostrar = (tablaLicEdificacion.rows().data().length === 0 ? false : true); break;
	        case 'MenuLicenciaFuncionamiento': Mostrar = (tablaLicFuncionamiento.rows().data().length === 0 ? false : true); break;
	  //      case 'MenuDetalleBienComun': Mostrar = (tablaDetalleBienComun.rows().data().length === 0 ? false : true); break;
	  //      case 'MenuCompatibilidad': Mostrar = (tablaCompatibilidadUso.rows().data().length === 0 ? false : true); break;
	    }

	   return Mostrar;
	}


	//Controller
	var tabController = function(tabContainer){
		var tabLegendEl = $(tabContainer).find('.tab-legend li');
		$.each(tabLegendEl,function(){
			$(this).on('click', function(){
				var tabElement = $(this);
				showTab(tabElement);
			});
		});
	};

	var init = function(){
		console.log('Initiating Tab Module');
		var self = this;
		var tabElement = $('.tab');

		$.each(tabElement, function(){
			constructTab(this);
			tabController(this);
		});
	};

	//public
	var tabModule = {
		init: init
	};

	//transport
	if(typeof(define)==='function' && define.amd){
		define(tabModule);
	} else if (typeof(exports)==='object'){
		module.tabModule = tabModule;
	} else {
		window.tabModule = tabModule;
	}


}(jQuery,window));
