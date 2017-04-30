(function(){
  initialize();

  function initialize(){
    $("#btnDisplay").click(invokeDrawDNA);
    var seq = "TTGGGGGGACTGGGGCTCCCATTCGTTGCCTTTATAAATCCTTGCAAGCCAATTAACAGGTTGGTGAGGGGCTTGGGTGAAAAGGTGCTTAAGACTCCGT";
    var dbn = "...(((((.(...).)))))........(((((.....((..(.((((((..(((.((...)).)))..)))))).).)))))))...............";

    $("#seq").val(seq);
    $("#dbn").val(dbn);

  }

  function dnaConfig(seq, dbn, tColor , aColor , cColor , gColor,  baseSize, labelFont , edgeWidth){
    this.sequence = seq;
    this.dbn = dbn;
    this.baseTColor = tColor ;
    this.baseAColor = aColor;
    this.baseCColor = cColor;
    this.baseGColor = gColor;
    this.baseSize =  baseSize;
    this.labelFont = labelFont ;
    this.edgeWidth = edgeWidth ;
  }

  function invokeDrawDNA(){
    var config = (validateInput()) ? getConfig() : null;
    var app = new drawDNA(config);
    app.render();
  }

  function getConfig(){
    return new dnaConfig($("#seq").val(), $("#dbn").val());

    //var testObj = new dnaConfig($("#seq").val(), $("#dbn").val(), "orange",
    //"pink", "cyan", "brown", "45", "18", "10");

    //return testObj;
  }

  function validateInput(){
    return true;
  }
}());
