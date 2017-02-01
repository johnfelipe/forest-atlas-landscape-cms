((function (App) {
  'use strict';

  App.Router.ManagementOpenContentStep = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
    },

    index: function () {
      var serializedContent = document.querySelector('.js-json-content').value;

      // We instantiate the wysiwyg editor
      this.wysiwygView = new App.View.WysiwygView({
        el: '.js-content',
        serializedContent: serializedContent.length ? JSON.parse(serializedContent) : null,
        widgets: window.gon && gon.widgets
      });

      $('.js-form').on('submit', function () {
        if (this.wysiwygView) {
          var content = this.wysiwygView.getSerializedContent();

          // We update the hidden field with the list of widgets
          var widgetIds = content.ops.map(function (op) {
            if (typeof op.insert === 'object' && typeof op.insert.widget === 'object') {
              return op.insert.widget.id;
            }
            return null;
          }).filter(function (id) {
            return id !== null;
          });
          document.querySelector('.js-widget-ids').value = _.uniq(widgetIds).join(',');

          // We save the content of the wysiwyg
          document.querySelector('.js-json-content').value = JSON.stringify(content);
        }
      }.bind(this));
    }

  });
})(this.App));
