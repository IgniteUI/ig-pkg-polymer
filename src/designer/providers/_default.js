// Default/base provider/service to specify what code and markup should be added to a page when a component is added,
// as well as how to initialize the component in the designer.
// Note: You may provide component-specific providers as needed.
define (["require", "exports", "module", "ide-componentcodeprovider", "jquery"], function (require, exports, module, baseCodeProvider, $) {

  var PolymerUICodeProvider = PolymerUICodeProvider || baseCodeProvider.extend({
    /*******************
     **  Setup/Config **
     *******************/
    init: function (options) {
      this._super(options);
      return this;
    },
    getName: function () {
      return "polymer";
    },
    requiresInitialization: function () {
      return false;
    },
    initComponent: function (descriptor, placeholder) {
    },
    isContainer: function (descriptor) {
      return false;
    },
    isDroppableChild: function (descriptor) {
      return false;
    },
    hasDroppableChildren: function (descriptor) {
      return false;
    },
    // Available to any inheritors that need to know..
    getElementsPath: function() {
      return this.getPackagePath() + "/elements/polymer-ui-elements";
    },
    _getElementLink: function(id) {
      return "<link rel=\"import\" href=\"" + this.getElementsPath() + "/" + id + "/" + id + ".html\">";
    },
    /*******************
     **  Design View  **
     *******************/
    getHeadMarkup: function (descriptor) { // TODO: maybe rename to getDesignerHeadMarkup
      return this._getElementLink(descriptor.type);
    },
    getMarkup: function (descriptor) { // TODO: maybe rename to getDesignerMarkup ?
      return descriptor.type + "-markup.html"; 
    },
    /*******************
     **  Code View    **
     *******************/
    getCodeEditorHeadSnippet: function (descriptor) {
      return {codeString: "\t\t" + this._getElementLink(descriptor.type) + "\n", lineCount: 1};
    },
    getCodeEditorMarkupSnippet: function (descriptor) {
      return descriptor.type + "-markup.html";
    },
    getCodeEditorScriptSnippet: function (descriptor) {
      return null;
    },
    addExtraMarkers: function (marker, descriptor) {
    },
    /*******************
     **  Editing    **
     *******************/
    getPropValue: function (descriptor, placeholder) {
    },
    update: function (descriptor, placeholder) {
    },
    getDroppableChildren: function (descriptor) {
      return [];
    },
    openEditorFor: function (descriptor) {
    }
  });

  return PolymerUICodeProvider;
});