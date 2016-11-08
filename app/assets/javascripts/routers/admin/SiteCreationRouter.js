((function (App) {
  'use strict';

  App.Router.AdminSiteCreation = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.step = params[0] || null;
    },

    index: function () {
      // We execute the code specific to the step
      if (this.step && this.step.length) {
        var stepMethod = 'init' + this.step[0].toUpperCase() + this.step.slice(1, this.step.length) + 'Step';
        if (this[stepMethod]) this[stepMethod]();
      }

      if (!this.step || this.step !== 'finish') {
        // We want the hidden continue button of the form clicked when the user clicks the one from the action-bar
        var continueButton = document.querySelector('.js-continue');
        var hiddenContinueButton = document.querySelector('.js-continue-original');

        continueButton.addEventListener('click', function (e) {
          e.preventDefault();
          hiddenContinueButton.click();
        });
      }
    },

    initNameStep: function () {
      var formattedUrls = (window.gon && window.gon.global) ? gon.global.urlArray : [];
      formattedUrls = formattedUrls.map(function (url) {
        return {
          url: url.host,
          id: url.id
        };
      });

      new App.View.UrlsInputView({
        el: '.js-urls',
        collection: new Backbone.Collection(formattedUrls)
      });
    },

    initSettingsStep: function () {
      new App.View.FlagColorsView({ el: '.js-flag-colors' });

      // We "upgrade" the file input
      new App.View.FileInputView({ el: '.js-file-input' });
    }
  });
})(this.App));