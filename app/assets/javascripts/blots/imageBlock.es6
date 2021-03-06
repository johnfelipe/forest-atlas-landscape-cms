// IMPORTANT
// Quill is built with ES6 classes and is transpiled with Babel. In order to extend a class
// a Quill's class, we have to write the code using ES6 and transpile it down to ES5

// To edit the block, you should modify this file, and transpile it on Babel's website:
// https://babeljs.io/repl/
// Once this is done, copy the output to the file with the same name, but ending with the
// extension ".js", between the two "eslint-disable" and "eslint-enable" comments

var Embed = Quill.import('blots/block/embed');

class ImageBlot extends Embed {
  /**
   * Creates an instance of ImageBlot.
   *
   * @param {HTMLElement} domNode
   * @param {{ src: string }} value
   *
   * @memberOf ImageBlot
   */
  constructor(domNode, value) {
    super(domNode, value);

    this.image = domNode.querySelector('.js-image');
    this.caption = domNode.querySelector('.js-caption');
    this.editor = window.editor;

    if (!this.editor.options.readOnly) {
      // We render the toolbar
      this._renderToolbar();

      // We make the caption editable
      this.caption.setAttribute('contenteditable', true);

      // We attach the listeners
      this.image.addEventListener('mouseover',() => this._onMouseoverImage());
      this.image.addEventListener('mouseout', e => this._onMouseoutImage(e));
    }
  }

  /**
   * Create the DOM node
   * @param {any} value - URL of the image (or base64)
   * @returns {HTMLElement} node
   */
  static create(value) {
    const node = super.create();

    const container = document.createElement('div');
    node.appendChild(container);

    const image = document.createElement('img');
    image.classList.add('js-image');
    if (typeof value === 'string') image.setAttribute('src', value);

    container.appendChild(image);

    // We don't want the user to be able to add text within the container
    node.setAttribute('contenteditable', false);

    // We add the caption container
    const captionContainer = document.createElement('p');
    captionContainer.classList.add('caption');
    captionContainer.classList.add('js-caption');

    container.appendChild(captionContainer);

    // If we don't disable the "content editable" feature of the editor
    // when the user writes in the caption container, the browsers
    // jump to the top as it considers it as the element we're editing
    captionContainer.addEventListener('focusin', function () {
        window.editor.root.setAttribute('contenteditable', false);
      });

    captionContainer.addEventListener('focusout', function () {
      window.editor.root.setAttribute('contenteditable', true);
    });

    captionContainer.addEventListener('blur', function () {
      // If the user deleted the whole content, we want the default
      // text to appear, nevertheless a br tag is inserted so we delete it
      if (!this.textContent.length && this.innerHTML.length) {
        this.innerHTML = '';
      }
    });

    return node;
  }

  /**
   * Return the URL of the image
   * @static
   * @param {HTMLElement} node
   * @returns {string} URL
   * @memberOf ImageBlot
   */
  static value(node) {
    return node.getAttribute('src');
  }

  /**
   * Return the attributes attached to the node
   * @static
   * @param {HTMLElement} node
   * @returns {{ src: string }}
   * @memberOf ImageBlot
   */
  static formats(node) {
    let format = {};

    const image = node.querySelector('.js-image');
    if (image.hasAttribute('src')) {
      format.src = image.getAttribute('src');
    }

    if (node.classList.contains('-cover')) {
      format.size = 'cover';
    } else if (node.classList.contains('-large')) {
      format.size = 'large';
    } else {
      format.size = 'normal';
    }

    const caption = node.querySelector('.js-caption');
    if (caption.textContent) {
      format.caption = caption.textContent;
    }

    return format;
  }

  /**
   * Set an attribute of the node
   * @param {string} name - attribute name
   * @param {any} value
   * @memberOf ImageBlot
   */
  format(name, value) {
    if (name === 'src') {
      if (value) {
        this.image.setAttribute(name, value);
      } else {
        this.image.removeAttribute(name, value);
      }
    } else if (name === 'caption') {
      if (value) {
        this.caption.textContent = value;
      } else {
        this.caption.parentElement.removeChild(this.caption);
      }
    } else if (name === 'size') {
      if (value === 'cover') {
        this.domNode.classList.add('-cover');
        this.domNode.classList.remove('-large');
      } else if (value == 'large') {
        this.domNode.classList.add('-large');
        this.domNode.classList.remove('-cover');
      } else {
        this.domNode.classList.remove('-cover');
        this.domNode.classList.remove('-large');
      }
    } else {
      super.format(name, value);
    }
  }

  /**
   * Event handler called when the mouse is over an image
   * @memberOf ImageBlot
   */
  _onMouseoverImage() {
    this._showToolbar();
  }


  /**
   * Event handler called when the mouse leaves an image
   * @param {object} e - event object
   * @memberOf ImageBlot
   */
  _onMouseoutImage(e) {
    if ($(e.relatedTarget).closest(this.toolbar).length) return;
    this._hideToolbar();
  }

  /**
   * Event handler called when the mouse leaves the image toolbar
   * @param {object} e - event object
   * @memberOf ImageBlot
   */
  _onMouseoutToolbar(e) {
    if (e.relatedTarget !== this.image && !$(e.relatedTarget).closest(this.toolbar).length) {
      this._hideToolbar();
    }
  }

  /**
   * Event handler called when the user clicks the remove button
   * @memberOf ImageBlot
   */
  _onClickRemove() {
    const offset = this.offset();
    this.editor.deleteText(offset, this.length());
    this.editor.setSelection(offset);
  }

  /**
   * Event handler called when the user clicks the change image button
   * @memberOf ImageBlot
   */
  _onClickChange() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.addEventListener('change', () => {
      var file = input.files[0];
      var reader = new FileReader();
      reader.addEventListener('load', () => {
        this.format('src', reader.result);
      });
      reader.readAsDataURL(file);
    });
  }

  /**
   * Event handler called when the user clicks the toggle size button
   */
  _onClickToggleSize() {
    var formats = ImageBlot.formats(this.domNode);

    switch (formats.size) {
      case 'normal':
        this.format('size', 'large');
        break;

      case 'large':
        this.format('size', 'cover');
        break;

      case 'cover':
        this.format('size', 'normal');
        break;
    }
  }

  /**
   * Hide the image toolbar
   * @memberOf ImageBlot
   */
  _hideToolbar() {
    this.toolbar.classList.add('-hidden');
  }

  /**
   * Show the image toolbar
   * @memberOf ImageBlot
   */
  _showToolbar() {
    this.toolbar.classList.remove('-hidden');
  }

  /**
   * Render the image toolbar
   * @memberOf ImageBlot
   */
  _renderToolbar() {
    // We create the element with the default state
    this.toolbar = document.createElement('div');
    this.domNode.children[0].appendChild(this.toolbar);
    this.toolbar.classList.add('toolbar');
    this._hideToolbar();

    // We append its content
    this.toolbar.innerHTML = HandlebarsTemplates['management/wysiwyg-block-toolbar']({
      showSizeBtn: true
    });

    // We attach the event listeners
    this.toolbar.addEventListener('mouseout', e => this._onMouseoutToolbar(e));
    this.toolbar.querySelector('.js-remove').addEventListener('click', () => this._onClickRemove());
    this.toolbar.querySelector('.js-change').addEventListener('click', () => this._onClickChange());
    this.toolbar.querySelector('.js-toggle-size').addEventListener('click', () => this._onClickToggleSize());
  }
}

ImageBlot.blotName = 'image';
ImageBlot.tagName = 'div';
ImageBlot.className = '-image';
