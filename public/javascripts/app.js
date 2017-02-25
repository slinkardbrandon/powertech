(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
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

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("application.js", function(exports, require, module) {
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

require.register("initialize.js", function(exports, require, module) {
var application = require('application');

$(function() {
  application.initialize();
  Backbone.history.start();
});

});

require.register("lib/router.js", function(exports, require, module) {
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

    $('#navbar-home').addClass( 'active' );
  },

  contact: function() {
    $('#header').html(application.headerView.render().el); //Initialize the header.
    $('#body').html(application.contactView.render().el); //Initialize the contact page.
    $('#footer').html(application.footerView.render().el); //Initialize the footer.

    $('#navbar-contact').addClass( 'active' );

  },

  about: function() {
    $('#header').html(application.headerView.render().el); //Initialize the header.
    $('#body').html(application.aboutView.render().el); //Initialize the about page.
    $('#footer').html(application.footerView.render().el); //Initialize the footer.
    $('#navbar-about').addClass( 'active' );

  }

});

});

require.register("lib/view_helper.js", function(exports, require, module) {
// Put your handlebars.js helpers here.

});

;require.register("models/collection.js", function(exports, require, module) {
// Base class for all collections.
module.exports = Backbone.Collection.extend({
  
});

});

require.register("models/model.js", function(exports, require, module) {
// Base class for all models.
module.exports = Backbone.Model.extend({
  
});

});

require.register("views/scripts/about_view.js", function(exports, require, module) {
var View = require('./../view');
var template = require('../templates/about');

module.exports = View.extend({
  id: 'about-view',
  template: template
});

});

require.register("views/scripts/contact_view.js", function(exports, require, module) {
var View = require('./../view');
var template = require('../templates/contact');

module.exports = View.extend({
  id: 'contact-view',
  template: template
});

});

require.register("views/scripts/footer_view.js", function(exports, require, module) {
var View = require('./../view');
var template = require('../templates/footer');

module.exports = View.extend({
  id: 'footer-view',
  template: template
});

});

require.register("views/scripts/header_view.js", function(exports, require, module) {
var View = require('./../view');
var template = require('../templates/header');

module.exports = View.extend({
  id: 'header-view',
  template: template
});
});

require.register("views/scripts/home_view.js", function(exports, require, module) {
var View = require('./../view');
var template = require('../templates/home');

module.exports = View.extend({
  id: 'home-view',
  template: template
});

});

require.register("views/templates/about.hbs", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div id=\"about_page\" class=\"container\" style=\"padding-top: 60px;\">\r\n\r\n    <div class=\"row\" style=\"padding-top: 50px;\">\r\n\r\n        <div class=\"col-md-4\">\r\n            <img src=\"../images/powertech-logo.png\" alt=\"Generic placeholder image\" width=\"350\" height=\"190\">\r\n\r\n            <!--<div class=\"ptr-logo\"></div>-->\r\n        </div>\r\n        <div class=\"col-md-8\">\r\n\r\n            <p style=\"text-indent: 50px;\">\r\n                PowerTech is a partnership between Eric Lantz and Richard Henry.\r\n                Eric Lantz has a degree in Agriculture Engineering.  Throughout his career, he has designed and supervised\r\n                the building of numerous machines for manufacturers of various products.\r\n                Machines ranged from assembly systems, welding systems and material handling systems.\r\n                Currently, he designs fabricated assemblies and photovoltaic arrays.\r\n                Also, he is skilled at Solidworks CAD software, welding and machining.\r\n            </p>\r\n\r\n            <br>\r\n\r\n            <p style=\"text-indent: 50px;\">\r\n                Richard Henry founded the original business in 1976 which evolved over the years into PowerTech.\r\n                Throughout his career, he has provided concept designs for equipment modifications,\r\n                machines for manufacturing production and equipment repair.\r\n                Currently, he provides clients with guidance for welding repairs and oversees in-house\r\n                welding plus mobile welding services.  He is skilled at welding steel, aluminum, stainless steel and cast iron.\r\n            </p>\r\n\r\n        </div>\r\n    </div>\r\n\r\n</div>";});
});

require.register("views/templates/contact.hbs", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div class=\"container\" style=\"padding-top: 80px;\">\r\n\r\n    <div class=\"row\">\r\n\r\n        <div class=\"col-md-3\" style=\"padding-top: 15px;\">\r\n            <h3 class=\"text-center\">Richard Henry</h3>\r\n            <p class=\"text-center\">402-676-2115</p>\r\n            <p class=\"text-center\"><a href=\"mailto:rhenry@powertechrenewable.com\">rhenry@powertechrenewable.com</a></p>\r\n        </div>\r\n\r\n        <div class=\"col-md-6\">\r\n\r\n            <iframe class=\"center-block\" width=\"100%\" height=\"400\" frameborder=\"0\" style=\"border:0\"\r\n                    src=\"https://www.google.com/maps/embed/v1/place?key=AIzaSyBuj0wcpLe7gtQL7p1JpSlkR0DC9nc4CLk&q=44154+Pioneer+Trail,+Carson,+IA+51525\" allowfullscreen>\r\n            </iframe>\r\n\r\n        </div>\r\n\r\n        <div class=\"col-md-3\" style=\"padding-top: 15px;\">\r\n            <h3 class=\"text-center\">Eric Lantz</h3>\r\n            <p class=\"text-center\">402-676-0255</p>\r\n            <p class=\"text-center\"><a href=\"mailto:elantz@powertechrenewable.com\">elantz@powertechrenewable.com</a></p>\r\n\r\n        </div>\r\n\r\n    </div>\r\n</div>";});
});

require.register("views/templates/footer.hbs", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<footer class=\"footer-basic-centered\" style=\"position: relative; bottom: 0; width:100%;\">\r\n\r\n    <p class=\"footer-links\">\r\n        <a href=\"#\">Home</a> |\r\n        <a href=\"#about\">About</a> |\r\n        <a href=\"#contact\">Contact</a>\r\n    </p>\r\n\r\n    <p class=\"footer-company-name\">PowerTech Renewable &copy; 2015</p>\r\n    <!--<p class=\"powered-by\">Powered by <a href=\"http://slinexus.com\">Slinexus</a></p>-->\r\n</footer>";});
});

require.register("views/templates/header.hbs", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div class=\"navbar-wrapper\">\r\n    <div class=\"container\">\r\n        <nav class=\"navbar navbar-inverse navbar-static-top\">\r\n            <div class=\"container\">\r\n                <div class=\"navbar-header\">\r\n                    <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbar\" aria-expanded=\"false\" aria-controls=\"navbar\">\r\n                        <span class=\"sr-only\">Toggle navigation</span>\r\n                        <span class=\"icon-bar\"></span>\r\n                        <span class=\"icon-bar\"></span>\r\n                        <span class=\"icon-bar\"></span>\r\n                    </button>\r\n                    <a class=\"navbar-brand\" href=\"#\">\r\n                        PowerTech Renewable\r\n                    </a>\r\n                </div>\r\n                <div id=\"navbar\" class=\"navbar-collapse collapse\">\r\n                    <ul class=\"nav navbar-nav\">\r\n                        <li id=\"navbar-home\"><a href=\"#\">Home</a></li>\r\n                        <li id=\"navbar-about\"><a href=\"#about\">About</a></li>\r\n                        <li id=\"navbar-contact\"><a href=\"#contact\">Contact</a></li>\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n        </nav>\r\n    </div>\r\n</div>\r\n";});
});

require.register("views/templates/home.hbs", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "\r\n<img id=\"homeimage\" src=\"./images/repairing_excavator_arm.jpg\">\r\n\r\n\r\n<div class=\"container marketing\"  style=\"text-align: center\">\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-3\">\r\n            <img class=\"img-circle\" src=\"./images/weld_buildup.jpg\" alt=\"Generic placeholder image\" width=\"190\" height=\"190\" >\r\n\r\n            <h3>Portable Automatic Bore Welding</h3>\r\n            <p>\r\n                Automatic bore welding of oversized bores is a process to add weld onto the bore diameter for\r\n                preparation of the line boring process.  Automatic settings provide circular welds, segment\r\n                welds or skip welds.  Bore welding utilizes the same mounting system as the line boring\r\n                equipment.  Welding can be provided in our shop or on the job site.\r\n            </p>\r\n        </div>\r\n\r\n        <div class=\"col-lg-3\">\r\n            <img class=\"img-circle\" src=\"./images/EquipmentRepair.jpg\" alt=\"Generic placeholder image\" width=\"190\" height=\"190\">\r\n\r\n            <h3>In-house Equipment Repair And Fabrication</h3>\r\n            <p>\r\n                Metal repair of earth-moving equipment, agriculture equipment and fabricated components.\r\n                Repairs include fabrication of new components, machining and welding.\r\n            </p>\r\n        </div>\r\n\r\n        <div class=\"col-lg-3\">\r\n            <img class=\"img-circle\" src=\"./images/line_boring.jpg\" alt=\"Generic placeholder image\" width=\"190\" height=\"190\">\r\n\r\n            <h3>Portable Line Boring</h3>\r\n            <p>\r\n                Line boring is the process of enlarging a hole by means of a single point tool.  Boring is used to\r\n                achieve greater accuracy of the diameter of the hole.  Line boring multiple aligned holes\r\n                provides high accuracy alignment between the holes.  Boring can be provided in our shop or on\r\n                the job site.\r\n            </p>\r\n        </div>\r\n\r\n        <div class=\"col-lg-3\">\r\n            <img class=\"img-circle\" src=\"./images/mobile_welding_repair_equipment.jpg\" alt=\"Generic placeholder image\" width=\"190\" height=\"190\">\r\n\r\n            <h3>Portable Welding Service</h3>\r\n            <p>\r\n                Service capabilities include, MIG Welding; SMAW Welding; Plasma Cutting; Oxygen-Acetylene\r\n                Cutting; Air Carbon Arc Cutting-Gouging and Hard Facing.\r\n            </p>\r\n        </div>\r\n    </div>\r\n\r\n\r\n    \r\n\r\n</div>";});
});

require.register("views/view.js", function(exports, require, module) {
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

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map