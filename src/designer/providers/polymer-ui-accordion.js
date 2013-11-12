// Provider to specify what code and markup should be added to a page when an accordion component is added,
// as well as how to initialize the component in the designer.
define (["require", "exports", "module", "./_default", "jquery"], function (require, exports, module, baseCodeProvider, $) {

  var AccordionUICodeProvider = AccordionUICodeProvider || baseCodeProvider.extend({
    init: function (options) {
      this._super(options);
      return this;
    },
    getName: function () {
      return "polymer-ui-accordion";
    },
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
  return AccordionUICodeProvider;
});