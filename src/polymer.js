define (function (require, exports, module) {
  var LibraryCodeProvider = require("ide-codeproviderbase");
  // describes the js and css requirements for the ignite ui package
  // implement package API
  // based on metadata, the IDE needs to know what to instantiate
  var PolymerUICodeProvider = PolymerUICodeProvider || LibraryCodeProvider.extend({
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
    /* we aren't including jQuery here */
    getScriptDependencies: function () {
      var path = this.getScriptPath();
      return [
        "<script type=\"text\/javascript\" src=\"" + path + "\/jquery-ui.js\"><\/script>",
        "<script type=\"text\/javascript\" src=\"" + path + "\/infragistics.core.js\"><\/script>",
        "<script type=\"text\/javascript\" src=\"" + path + "\/infragistics.lob.js\"><\/script>",
        "<script type=\"text\/javascript\" src=\"" + path + "\/infragistics.dv.js\"><\/script>"
      ];
    },
    getStyleDependencies: function () {
      var path = this.getStylePath();
      return [
        "<link href=\"" + path + "/jquery-ui.css\" rel=\"stylesheet\">",
        "<link href=\"" + path + "/themes/infragistics/infragistics.theme.css\" rel=\"stylesheet\">",
        "<link href=\"" + path + "/structure/infragistics.css\" rel=\"stylesheet\">"
      ];
    },
    /* descriptor is an object containing properties like the height, width, id, etc. */
    getMarkupFor: function (descriptor) {
      return "<div id=\"" + descriptor.id + "\"></div>";
    },
    getCodeEditorMarkupFor: function (descriptor) {
      var extraIndentStr = "", i = 0;
      if (descriptor.extraIndent) {
        for (i = 0; i < descriptor.extraIndent; i++) {
          extraIndentStr += "\t";
        }
      }
      return {codeString: "\t\t" + extraIndentStr + "<div id=\"" + descriptor.id + "\"></div>\n", lineCount: 1};
    },
    /*
    getScriptFor: function (descriptor) {
      return "";
    },
    */
    getCodeEditorScriptFor: function (descriptor) {
      //TODO: management of tabs (indentation)
      var code = "";
      var opts = descriptor.options;
      var name = this._getWidgetName(descriptor.type);
      var lineCount = descriptor.type === "grid" ? 7 : 5;
      var xtraMarkup = "";
      if (descriptor.type === "grid") {
        xtraMarkup = ",\n\t\t\t\t\tfeatures: [\n" + "\t\t\t\t\t]";
      }
      //A.T. - we can either drop with no features in the code editor
      // or an empty array - empty arr makes it easier to manage with markers
      code = "\t\t\t\t$(\"#" + descriptor.id + "\")." + name + "({\n" +
        "\t\t\t\t\theight: " + opts.height + ",\n" + 
        "\t\t\t\t\twidth: " + opts.width + xtraMarkup;
        if (descriptor.data && window[descriptor.data]) {
          code += ",\n\t\t\t\t\tdataSource: " + descriptor.data;
        }
      for (var key in opts) {
        if (opts.hasOwnProperty(key) && key !== "dataSource" && key !== "height" && key !== "width") {
          code += ",\n\t\t\t\t\t" + key + ": " + opts[key];
          lineCount++;
        }
      }
      code += "\n\t\t\t\t});\n";
      return {codeString: code, lineCount: lineCount};
    },
    addExtraMarkers: function (marker, descriptor) {
      // delegate to component handler
      if (descriptor.type === "grid") {
        // we don't want to hardcode this value but find it in the current range
        // it may well happen that someone adds lots of options and extra code *above* the features or any other object
        //var offset = 4; //default offset
        var featuresRange = this.settings.editor.find("features", {start: marker.range.start});
        featuresRange = new descriptor.rclass(featuresRange.start.row, 0, featuresRange.start.row + 1, 0);
        featuresRange.start = this.settings.editor.getSession().doc.createAnchor(featuresRange.start); 
        featuresRange.end = this.settings.editor.getSession().doc.createAnchor(featuresRange.end);
        //var r = new descriptor.rclass(marker.range.start.row + offset, 0, marker.range.start.row + offset + 1, 0);
        marker.extraMarkers["features"] = {range: featuresRange};
      }
      // what about nested things like feature settings, etc? Probably makes sense to have a code provider per feature 
      // or even per prop; hierarchy of code providers? 
    },
    /*
    getCodeEditorScriptRegExpFor: function (descriptor) {
      var compType = this._getWidgetName(descriptor.type);
      return "(\\t)*\\$\\(\"#" + descriptor.id + "\"\\)\\." + compType + "\\(\\{(.|\\n|\\t)*?\\}\\);\\n";
    },
    getCodeEditorMarkupRegExpFor: function (descriptor) {
      return "(\\t)*<div id=\"" + descriptor.id + "\">.*</div>\n";
    },
    */
    requiresInitialization: function () {
      return true;
    },
    // can move the placeholder as part of the descriptor ?
    getPropValue: function (descriptor, placeholder) {
      var name = this._getWidgetName(descriptor.type);
      if (placeholder.data(name)) {
        return placeholder.data(name).options[descriptor.propName];
      } else {
        return descriptor.iframe.jQuery(placeholder).data(name).options[descriptor.propName];
      }
    },
    initComponent: function (descriptor, placeholder) {
      var name = this._getWidgetName(descriptor.type);
      placeholder[name](descriptor.options);
    },
    /*
     * update & rerender a component after a property value changes
     * descriptor has two properties: propName and propValue (the new property value)
     */
    updateComponent: function (descriptor, placeholder) {
      var name = this._getWidgetName(descriptor.type);
      placeholder[name]("option", descriptor.propName, descriptor.propValue);
      descriptor.codeEditor.find("$(\"#" + descriptor.id + "\")." + name + "({");
      descriptor.codeEditor.find(descriptor.propName + ": " + descriptor.oldPropValue);
      descriptor.codeEditor.replace(descriptor.propName + ": " + descriptor.propValue);
    },
    _getWidgetName: function (type) {
      //return "ig" + type.charAt(0).toUpperCase() + type.slice(1);
      return this.settings.metadata[type].name.replace("ui.", "");
    },
    isContainer: function (descriptor) {
      if (typeof (descriptor) === "undefined" || descriptor === null) {
        return false;
      }
      // return true for splitter (splitterpanes - in the context of getDroppableChildren)
      // also for dialog window, and tile manager tiles
      //returns true for both  columns and rows
      if (descriptor.type === "splitter" || descriptor.type === "dialog") {
        return true;
      }
      return false;
    },
    isDroppableChild: function (descriptor) {
      if (typeof (descriptor) === "undefined" || descriptor === null) {
        return false;
      }
      if (descriptor.type === "splitterPane" || descriptor.type === "tileManagerTile" || descriptor.type === "dialogWindowContent") {
        return true;
      }
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
      // columns, features, dataSource, etc. - also reuse those UIs
      // when something gets changed in this editor, we want to also update the code editor as well as the component itself
      var p = descriptor.propName, meta = this.settings.metadata, session = descriptor.editorSession, $this = this;
      if (descriptor.type === "grid") {
        if (p === "features") {
          // open features editor
          var list;
          var contents = $("<div>features editor</div>").appendTo("body").dialog({
            height: 400,
            width: 300,
            buttons: [ 
              { 
                text: "Save", click: function() {
                  // save features
                  var elem;
                  if (descriptor.iframe.jQuery) {
                    elem = descriptor.iframe.jQuery($("#designer-frame").contents().find("#" + descriptor.element.attr("id")));
                  } else {
                    elem = descriptor.element;
                  }
                  // get list of enabled features
                  var checkboxes = list.find("input:checked");
                  // now iterate through the existing features, if the feature is already there, don't do anything
                  // we need some object model to add/remove features easily
                  // get the features string from the code editor
                  // if there is none, create one
                  // add new features
                  // bring back the features to the code and update (recreate the grid)
                  var gridCode = session.getTextRange(descriptor.codeMarker.range);
                  //var gridObj = $this.toObject(gridCode);
                  // check if there are extra markers associated with this object
                  var fmarker = null;
                  if (descriptor.codeMarker.extraMarkers && (fmarker = descriptor.codeMarker.extraMarkers["features"])) {
                    // find the code inside of the marker and modify it
                  } else {
                    // there are no "features" defined, so we need to insert that
                    // find out what the intentation is
                    fmarker = descriptor.codeMarker.extraMarkers["features"] = {};
                    //just construct the new code and insert it below the fmarker
                    // features: [
                    //  <new code gets here>
                    // ]
                  }
                  var opts = elem.data("igGrid")._originalOptions;
                  // wipe features (TODO)
                  opts.features = [];
                  var featuresCode = "";
                  var tabStr = "\t\t\t\t\t\t";
                  var count = 0, featuresCount = checkboxes.length;
                  checkboxes.each(function () {
                    var name = $(this).closest("li").attr("data-name");
                    opts.features.push({name: name});
                    featuresCode += tabStr + "{ name: \"" + name + "\"}";
                    if (count < featuresCount - 1) {
                      featuresCode += ",\n";
                    } else {
                      featuresCode += "\n";
                    }
                    count++;
                  });
                  elem.igGrid("destroy");
                  elem.igGrid(opts);
                  // update code in the editor. replace features: [ ] with new stuff
                  var newRange = new fmarker.range.constructor(fmarker.range.start.row + 1, 0, fmarker.range.end.row, 0);
                  session.replace(newRange, featuresCode);
                  //var featuresCode = session.getTextRange(fmarker.range);
                  $(this).dialog("close"); 
                }
              },
              {
                text: "Close", click: function() { 
                  $(this).dialog("close"); 
                }
              }           
            ]
          });
          // add features to contents and attach actions
          list = $("<ul></ul>").appendTo(contents).addClass("list-group");
          var features = meta[descriptor.type].properties.features;
          // load the metadata for every feature, if it's not already loaded
          if (typeof (features.meta) === "undefined") {
            features.meta = {};
            for (var i = 0; i < features.components.length; i++) {
              var url = "packages/polymer/metadata/components/" + features.components[i] + ".json";
              // load metadata for every feature
              var json = $.ajax({
                type: "GET",
                url: url,
                cache: true,
                dataType: "json",
                async: false
              });
              features.meta[features.components[i]] = json.responseJSON;
            }
          }
          for (var feature in features.meta) {
            if (features.meta.hasOwnProperty(feature)) {
              var fname;
              fname = features.meta[feature].name;
              fname = fname.substring(9, fname.length);
              var item = $("<li></li>").appendTo(list).addClass("list-group-item")
                .text(features.meta[feature].title).attr("data-name", fname);
              $("<input type=\"checkbox\">").prependTo(item).css("margin-right", 20).attr("id", feature);
              //$("<i></i>").addClass("icon-cog").appendTo(item);
            }
          }
          // set default values
          var enabledFeatures;
          if (descriptor.iframe.jQuery && descriptor.iframe.jQuery(descriptor.element.data("igGrid"))) {
            enabledFeatures = descriptor.iframe.jQuery($("#designer-frame").contents().find("#" + descriptor.element.attr("id"))).data("igGrid").options.features;
          } else {
            enabledFeatures = descriptor.element.data("igGrid").options.features;
          }
          for (var i = 0; enabledFeatures && i < enabledFeatures.length; i++) {
            list.find("input[id=grid" + enabledFeatures[i].name.toLowerCase() + "]").attr("checked", true);
          }
          // add Ok and Cancel buttons
          /*
            // enable/disable a feature in the grid
            // this also means editing the markup in the editor
            // need to recreate the grid to enable / disable features?
            if ($(this).is(":checked")) {
              
            } else {
              
            }
          */
          /*
            var buttonGroup = $("<div></div>").css("padding-left", 30).appendTo(contents);
            $("<div></div>").addClass("btn").addClass("btn-primary").addClass("ok-button-features").text("Save").appendTo(buttonGroup);
            $("<div></div>").addClass("btn").addClass("cancel-button-features").text("Cancel").appendTo(buttonGroup);
          */
        } else if (p === "columns") {
        
        } else if (p === "dataSource") {
        
        }
      } else {
        //...
      }
    }
    /* probably not a good idea to override this, can be in the base Library class */
    //createRenderer: function (renderStr) {
    //  return new window[renderStr]();
    //}
  });
  return PolymerUICodeProvider;
});