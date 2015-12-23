(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part === '..') {
          results.pop();
        } else if (part !== '.' && part !== '') {
          results.push(part);
        }
      }
      return results.join('/');
    };
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
require.register("application", function(exports, require, module) {
// Application bootstrapper.
Application = {
  initialize: function() {
    //Declare Views
    var HeaderView = require('views/scripts/header_view');
    var FooterView = require('views/scripts/footer_view');

    var HomeView = require('views/scripts/home_view');
    var ContactView = require('views/scripts/contact_view');
    var AboutView = require('views/scripts/about_view');

    var Router = require('lib/router');

    //Initialize Views
    this.headerView = new HeaderView();
    this.footerView = new FooterView();

    this.homeView = new HomeView();
    this.contactView = new ContactView();
    this.aboutView = new AboutView();

    this.router = new Router();

    if (typeof Object.freeze === 'function') Object.freeze(this);
  }
}

module.exports = Application;

});

require.register("initialize", function(exports, require, module) {
var application = require('application');

$(function() {
  application.initialize();
  Backbone.history.start();
});

});

require.register("lib/router", function(exports, require, module) {
var application = require('application');

module.exports = Backbone.Router.extend({
  routes: {
    '': 'home',
    'contact': 'contact',
    'about': 'about'
  },

  home: function() {
    $('#header').html(application.headerView.render().el); //Initialize the header.
    $('#body').html(application.homeView.render().el); //Initialize the home page.
    $('#footer').html(application.footerView.render().el); //Initialize the footer.
  },

  contact: function() {
    $('#header').html(application.headerView.render().el); //Initialize the header.
    $('#body').html(application.contactView.render().el); //Initialize the contact page.
    $('#footer').html(application.footerView.render().el); //Initialize the footer.
  },

  about: function() {
    $('#header').html(application.headerView.render().el); //Initialize the header.
    $('#body').html(application.aboutView.render().el); //Initialize the about page.
    $('#footer').html(application.footerView.render().el); //Initialize the footer.
  }

});

});

require.register("lib/view_helper", function(exports, require, module) {
// Put your handlebars.js helpers here.

});

;require.register("models/collection", function(exports, require, module) {
// Base class for all collections.
module.exports = Backbone.Collection.extend({
  
});

});

require.register("models/model", function(exports, require, module) {
// Base class for all models.
module.exports = Backbone.Model.extend({
  
});

});

require.register("views/scripts/about_view", function(exports, require, module) {
var View = require('./../view');
var template = require('../templates/about');

module.exports = View.extend({
  id: 'about-view',
  template: template
});

});

require.register("views/scripts/contact_view", function(exports, require, module) {
var View = require('./../view');
var template = require('../templates/contact');

module.exports = View.extend({
  id: 'contact-view',
  template: template
});

});

require.register("views/scripts/footer_view", function(exports, require, module) {
var View = require('./../view');
var template = require('../templates/footer');

module.exports = View.extend({
  id: 'footer-view',
  template: template
});

});

require.register("views/scripts/header_view", function(exports, require, module) {
var View = require('./../view');
var template = require('../templates/header');

module.exports = View.extend({
  id: 'header-view',
  template: template
});
});

require.register("views/scripts/home_view", function(exports, require, module) {
var View = require('./../view');
var template = require('../templates/home');

module.exports = View.extend({
  id: 'home-view',
  template: template
});

});

require.register("views/templates/about", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div id=\"about_page\" class=\"container\" style=\"padding-top: 60px;\">\r\n\r\n    <div class=\"row\" style=\"padding-top: 50px;\">\r\n\r\n        <div class=\"col-md-4\">\r\n            <img style=\"height: 200px; padding: 20px;\" src=\"./images/powertech-logo.png\"/>\r\n        </div>\r\n        <div class=\"col-md-8\">\r\n\r\n            <p style=\"text-indent: 50px;\">\r\n                PowerTech is a partnership between Eric Lantz and Richard Henry.\r\n                Eric Lantz has a degree in Agriculture Engineering.  Throughout his career, he has designed and supervised\r\n                the building of numerous machines for manufacturers of various products.\r\n                Machines ranged from assembly systems, welding systems and material handling systems.\r\n                Currently, he designs fabricated assemblies and photovoltaic arrays.\r\n                Also, he is skilled at Solidworks CAD software, welding and machining.\r\n            </p>\r\n\r\n            <br>\r\n\r\n            <p style=\"text-indent: 50px;\">\r\n                Richard Henry founded the original business in 1976 which evolved over the years into PowerTech.\r\n                Throughout his career, he has provided concept designs for equipment modifications,\r\n                machines for manufacturing production and equipment repair.\r\n                Currently, he provides clients with guidance for welding repairs and oversees in-house\r\n                welding plus mobile welding services.  He is skilled at welding steel, aluminum, stainless steel and cast iron.\r\n            </p>\r\n\r\n        </div>\r\n    </div>\r\n\r\n</div>";});
});

require.register("views/templates/contact", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div class=\"container\" style=\"padding-top: 80px;\">\r\n\r\n    <div class=\"row\">\r\n\r\n        <div class=\"col-md-3\" style=\"padding-top: 15px;\">\r\n            <h3 class=\"text-center\">Richard Henry</h3>\r\n            <p class=\"text-center\">402-676-2115</p>\r\n            <p class=\"text-center\"><a href=\"mailto:rhenry@powertechrenewable.com\">rhenry@powertechrenewable.com</a></p>\r\n        </div>\r\n\r\n        <div class=\"col-md-6\">\r\n\r\n            <iframe class=\"center-block\" width=\"100%\" height=\"400\" frameborder=\"0\" style=\"border:0\"\r\n                    src=\"https://www.google.com/maps/embed/v1/place?key=AIzaSyBuj0wcpLe7gtQL7p1JpSlkR0DC9nc4CLk&q=44154+Pioneer+Trail,+Carson,+IA+51525\" allowfullscreen>\r\n            </iframe>\r\n\r\n        </div>\r\n\r\n        <div class=\"col-md-3\" style=\"padding-top: 15px;\">\r\n            <h3 class=\"text-center\">Eric Lantz</h3>\r\n            <p class=\"text-center\">402-676-0255</p>\r\n            <p class=\"text-center\"><a href=\"mailto:elantz@powertechrenewable.com\">elantz@powertechrenewable.com</a></p>\r\n\r\n        </div>\r\n\r\n    </div>\r\n</div>";});
});

require.register("views/templates/footer", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<footer class=\"footer-basic-centered\" style=\"position: relative; bottom: 0; width:100%;\">\r\n\r\n    <p class=\"footer-links\">\r\n        <a href=\"#\">Home</a> |\r\n        <a href=\"#about\">About</a> |\r\n        <a href=\"#contact\">Contact</a>\r\n    </p>\r\n\r\n    <p class=\"footer-company-name\">PowerTech Renewable &copy; 2015</p>\r\n    <p class=\"powered-by\">Powered by <a href=\"http://slinexus.com\">Slinexus</a></p>\r\n</footer>";});
});

require.register("views/templates/header", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div class=\"navbar-wrapper\">\r\n    <div class=\"container\">\r\n        <nav class=\"navbar navbar-inverse navbar-static-top\">\r\n            <div class=\"container\">\r\n                <div class=\"navbar-header\">\r\n                    <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbar\" aria-expanded=\"false\" aria-controls=\"navbar\">\r\n                        <span class=\"sr-only\">Toggle navigation</span>\r\n                        <span class=\"icon-bar\"></span>\r\n                        <span class=\"icon-bar\"></span>\r\n                        <span class=\"icon-bar\"></span>\r\n                    </button>\r\n                    <a class=\"navbar-brand\" href=\"#\">\r\n                        PowerTech Renewable\r\n                    </a>\r\n                </div>\r\n                <div id=\"navbar\" class=\"navbar-collapse collapse\">\r\n                    <ul class=\"nav navbar-nav\">\r\n                        <li class=\"\"><a href=\"#\">Home</a></li>\r\n                        <li><a href=\"#about\">About</a></li>\r\n                        <li><a href=\"#contact\">Contact</a></li>\r\n                    </ul>\r\n                </div>\r\n\r\n            </div>\r\n        </nav>\r\n    </div>\r\n</div>\r\n";});
});

require.register("views/templates/home", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div id=\"\" class=\"carousel slide\" data-ride=\"carousel\">\r\n    <!-- Indicators -->\r\n    <div class=\"carousel-inner\" role=\"listbox\">\r\n        <div class=\"item active\">\r\n            <img class=\"second-slide rotated\" src=\"./images/repairing_excavator_arm.jpg\" alt=\"Second slide\">\r\n            <div class=\"container\">\r\n                <div class=\"carousel-caption\">\r\n\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<div class=\"container marketing\"  style=\"text-align: center\">\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-3\">\r\n            <img class=\"img-circle\" src=\"./images/weld_buildup.jpg\" alt=\"Generic placeholder image\" width=\"190\" height=\"190\" >\r\n\r\n            <h3>Portable Automatic Bore Welding</h3>\r\n            <p>\r\n                Automatic bore welding of oversized bores is a process to add weld onto the bore diameter for\r\n                preparation of the line boring process.  Automatic settings provide circular welds, segment\r\n                welds or skip welds.  Bore welding utilizes the same mounting system as the line boring\r\n                equipment.  Welding can be provided in our shop or on the job site.\r\n            </p>\r\n        </div>\r\n\r\n        <div class=\"col-lg-3\">\r\n            <img class=\"img-circle\" src=\"./images/EquipmentRepair.jpg\" alt=\"Generic placeholder image\" width=\"190\" height=\"190\">\r\n\r\n            <h3>In-house Equipment Repair And Fabrication</h3>\r\n            <p>\r\n                Metal repair of earth-moving equipment, agriculture equipment and fabricated components.\r\n                Repairs include fabrication of new components, machining and welding.\r\n            </p>\r\n        </div>\r\n\r\n        <div class=\"col-lg-3\">\r\n            <img class=\"img-circle\" src=\"./images/line_boring.jpg\" alt=\"Generic placeholder image\" width=\"190\" height=\"190\">\r\n\r\n            <h3>Portable Line Boring</h3>\r\n            <p>\r\n                Line boring is the process of enlarging a hole by means of a single point tool.  Boring is used to\r\n                achieve greater accuracy of the diameter of the hole.  Line boring multiple aligned holes\r\n                provides high accuracy alignment between the holes.  Boring can be provided in our shop or on\r\n                the job site.\r\n            </p>\r\n        </div>\r\n\r\n        <div class=\"col-lg-3\">\r\n            <img class=\"img-circle\" src=\"./images/mobile_welding_repair_equipment.jpg\" alt=\"Generic placeholder image\" width=\"190\" height=\"190\">\r\n\r\n            <h3>Portable Welding Service</h3>\r\n            <p>\r\n                Service capabilities include, MIG Welding; SMAW Welding; Plasma Cutting; Oxygen-Acetylene\r\n                Cutting; Air Carbon Arc Cutting-Gouging and Hard Facing.\r\n            </p>\r\n        </div>\r\n    </div>\r\n\r\n\r\n    \r\n\r\n</div>";});
});

require.register("views/view", function(exports, require, module) {
require('lib/view_helper');

// Base class for all views.
module.exports = Backbone.View.extend({
  initialize: function() {
    this.render = _.bind(this.render, this);
  },

  template: function() {},
  getRenderData: function() {},

  render: function() {
    this.$el.html(this.template(this.getRenderData()));
    this.afterRender();
    return this;
  },

  afterRender: function() {}
});

});


//# sourceMappingURL=app.js.map