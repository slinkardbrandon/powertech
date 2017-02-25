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
