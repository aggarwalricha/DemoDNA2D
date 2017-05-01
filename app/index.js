(function(){
  initialize();

  function initialize(){
    $("#btnDisplay").click(invokeDrawDNA);
    var seq = "TTGGGGGGACTGGGGCTCCCATTCGTTGCCTTTATAAATCCTTGCAAGCCAATTAACAGGTTGGTGAGGGGCTTGGGTGAAAAGGTGCTTAAGACTCCGT";
    var dbn = "...(((((.(...).)))))........(((((.....((..(.((((((..(((.((...)).)))..)))))).).)))))))...............";

    $("#seq").val(seq);
    $("#dbn").val(dbn);

  }

  function dnaConfig(seq, dbn, tColor , aColor , cColor , gColor,  baseSize, labelFont , edgeWidth, callback){
    this.sequence = seq;
    this.dbn = dbn;
    this.baseTColor = tColor ;
    this.baseAColor = aColor;
    this.baseCColor = cColor;
    this.baseGColor = gColor;
    this.baseSize =  baseSize;
    this.labelFont = labelFont;
    this.edgeWidth = edgeWidth;
    this.cbMouseOver = callback;
  }

  function invokeDrawDNA(){
    if(validateInput()){
      var config = getConfig();
      var app = new drawDNA(config,  $('#cy'));
      app.render();
    }
  }

  function getConfig(){
    return new dnaConfig($("#seq").val(), $("#dbn").val());
    //var testObj = new dnaConfig($("#seq").val(), $("#dbn").val(), "orange",
    //"pink", "cyan", "brown", "45", "18", "10", highlightSelectedNode);
    //return testObj;
  }

  function highlightSelectedNode(nodeIndex){
    $("#seq").focus();
    var input = $("#seq")[0];

    if (typeof input.selectionStart != "undefined") {
        input.selectionStart = nodeIndex -1 ;
        input.selectionEnd = nodeIndex;
    }
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
