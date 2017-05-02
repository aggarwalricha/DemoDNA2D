'use-strict';

(function(){
  initialize();

  function initialize(){
    $("#btnDisplay").click(invokeDrawDNA);
    var seq = "TTGGGGGGACTGGGGCTCCCATTCGTTGCCTTTATAAATCCTTGCAAGCCAATTAACAGGTTGGTGAGGGGCTTGGGTGAAAAGGTGCTTAAGACTCCGT";
    var dbn = "...(((((.(...).)))))........(((((.....((..(.((((((..(((.((...)).)))..)))))).).)))))))...............";

    $("#seq").val(seq);
    $("#dbn").val(dbn);

  }
  // This is how config object structure expected by library
  function dnaConfig(seq, dbn, tColor , aColor , cColor , gColor,  baseSize, labelFont , edgeWidth, cbMouseOver, cbEdgeRemoval){
    this.sequence = seq;
    this.dbn = dbn;
    this.baseTColor = tColor ;
    this.baseAColor = aColor;
    this.baseCColor = cColor;
    this.baseGColor = gColor;
    this.baseSize =  baseSize;
    this.labelFont = labelFont;
    this.edgeWidth = edgeWidth;
    this.cbMouseOver = cbMouseOver;
    this.cbEdgeRemoval = cbEdgeRemoval;
  }

  // entry point
  function invokeDrawDNA(){
    if(validateInput()){
      var config = getConfig();
      var app = new drawDNA(config,  $('#cy'));
      // entry point of library.
      app.render();
    }
  }

  function getConfig(){
    var config = new dnaConfig($("#seq").val(), $("#dbn").val());
    config.cbMouseOver = highlightSelectedNode;
    config.cbEdgeRemoval = removeEdge;
    //var testObj = new dnaConfig($("#seq").val(), $("#dbn").val(), "orange",
    //"pink", "cyan", "brown", "45", "18", "10", highlightSelectedNode, removeEdge);
    //return testObj;
    return config;
  }

  function highlightSelectedNode(nodeIndex){
    $("#seq").focus();
    var input = $("#seq")[0];

    if (typeof input.selectionStart != "undefined") {
        input.selectionStart = nodeIndex ;
        input.selectionEnd = nodeIndex + 1;
    }
  }

  function removeEdge(data){
    var dbnStr = $("#dbn").val();
    var updatedDbn = replaceAt(replaceAt(dbnStr, parseInt(data.target), "."), parseInt(data.source), ".");

    $("#dbn").val(updatedDbn);
  }

  function replaceAt(str, index, replace) {
    return str.substring(0, index) + replace + str.substring(index + 1);
  }

  function validateInput(){
    var seq = $("#seq").val();
    var dbn = $("#dbn").val();
    hideErrSection();

    //empty test
    if(!seq || !dbn){
      displayErrSection('Sequence and DBN cannot be empty!');
      return false;
    }

    //length test
    if(seq.length != dbn.length){
      displayErrSection('Sequence and DBN length should match!');
      return false;
    }

    return true;
  }

  function hideErrSection(){
    $('#errMsg').text('');
  }

  function displayErrSection(msg){
    $('#errMsg').text(msg);
  }

}());
