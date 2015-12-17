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
