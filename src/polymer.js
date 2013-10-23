define (["require", "exports", "module", "ide-codeproviderbase", "jquery"], function (require, exports, module, baseCodeProvider, $) {
  // describes the js and css requirements for the ignite ui package
  // implement package API
  // based on metadata, the IDE needs to know what to instantiate
  var PolymerUICodeProvider = PolymerUICodeProvider || baseCodeProvider.extend({
    init: function (options) {
      this._super(options);
      return this;
    },
    getName: function () {
      return "polymer";
    },
    getScriptPath: function () {
      return "packages/polymer/js";
    },
    getStylePath: function () {
      return "packages/polymer/css";
    },
    // these are relative to getScriptPath or absolute (if starting with a /)
    getScriptDependencies: function () {
      return [
        "polymer.min.js",
      ];

    },
    getStyleDependencies: function () {
      return [];
    },
    _ensureComponent: function(id) {
      var head = $('head'), componentTag;
      if (head) {
        componentTag = $('head > #' + id);
        if (componentTag.length == 0) {
          head.append('<link id="' + id + '" rel="import" href="packages/polymer/elements/polymer-ui-elements/' + id + '/' + id + '.html">');
        }
      }
    },
    /* descriptor is an object containing properties like the height, width, id, etc. */
    getMarkupFor: function (descriptor) {
      this._ensureComponent(descriptor.type);
      return "<" + descriptor.type + "></" + descriptor.type + ">"; 
    },
    getCodeEditorMarkupFor: function (descriptor) {
      var extraIndentStr = "", i = 0;
      if (descriptor.extraIndent) {
        for (i = 0; i < descriptor.extraIndent; i++) {
          extraIndentStr += "\t";
        }
      }
      return {codeString: "\t\t" + extraIndentStr + this.getMarkupFor(descriptor) + "\n", lineCount: 1};
    },
    getCodeEditorScriptFor: function (descriptor) {
      return '';
    },
    addExtraMarkers: function (marker, descriptor) {
    },
    requiresInitialization: function () {
      return false;
    },
    // can move the placeholder as part of the descriptor ?
    getPropValue: function (descriptor, placeholder) {
    },
    initComponent: function (descriptor, placeholder) {
    },
    /*
     * update & rerender a component after a property value changes
     * descriptor has two properties: propName and propValue (the new property value)
     */
    updateComponent: function (descriptor, placeholder) {
    },
    isContainer: function (descriptor) {
      return false;
    },
    isDroppableChild: function (descriptor) {
      return false;
    },
    hasDroppableChildren: function (descriptor) {
    },
    getDroppableChildren: function (descriptor) {
      return false;
    },
    /*
     * note that we can additionally improve this by 
     * creating an API around custom property editors
     * so let's say if i want to edit grid features or columns
     * I can implement a property editor class and have a registry around
     * those custom editors
     */
    openEditorFor: function (descriptor) {
    }
  });
  return PolymerUICodeProvider;
});