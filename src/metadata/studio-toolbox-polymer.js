define(function(require, exports, module) {
  // also describe icons
  // do not make the assumption all components should be visual
  var polymerToolboxMetadata = {
    name: "polymer",
    codeProviderClass: "PolymerCodeProvider",
    toolboxTitle: "Polymer UI",
    iconsPath: "icons",
    jsonMetadataPath: "metadata/components",
    components: {
      "polymer-ui-accordion": {
        id: "polymer-ui-accordion",
        name: "Accordion",
        icon: "",
        dragDropIcon: "",
        category: "elements",
        visual: true,
        framework: false,
        width: "100%",
        height: "auto"
      }
    }
  };
  return polymerToolboxMetadata;
});
