//DRAW DNA 2D secondory structure library code
var drawDNA = function(config, cy){
  var inpDnaObj = new dnaStruct();
  var cyElem = cy;
  var nodes = [],  links =[], arrOpenParanthsIndexs =[], arrCloseParanthsIndexs =[], graphElements =[];

  prepareNodesArray = function(){
    for(var charIndex =0; charIndex < inpDnaObj.sequence.length; charIndex++){
      var base =inpDnaObj.sequence[charIndex];
      nodes.push({name:base, color:getBaseColor(base) , id: charIndex.toString() });
    }
    //console.info("nodes",nodes);
  };

  prepareLinksArray = function(){
    addLinksForParenthesis();
    addLinksForDots();
  };

  addLinksForDots = function(){
    for(var charIndex = 0; charIndex < inpDnaObj.dbn.length -1 ; charIndex++){
      links.push({source: charIndex.toString(), target: (charIndex + 1).toString(), edgeStyle: 'solid'});
    }
  };

  addLinksForParenthesis = function(){
    populatedIndexesOfOpenNCloseParnths();
    arrCloseParanthsIndexs.forEach(function (closeParanthsIndex, idx){
      var target = _.max(_.filter(arrOpenParanthsIndexs, function(openParanthsIdx){
        return openParanthsIdx < closeParanthsIndex && !_.some(links, function(link){
          return link.target == openParanthsIdx.toString();
        })}
      ));
      links.push({source: closeParanthsIndex.toString(), target: target.toString(), edgeStyle: 'dotted'});
      //console.info(closeParanthsIndex.toString(),target.toString() );
    });

    //console.info('parenthesis link ',links.length);
  };

  populatedIndexesOfOpenNCloseParnths = function(){
    for(var charIndex = 0; charIndex < inpDnaObj.dbn.length  ; charIndex++){
     var dbnChar = inpDnaObj.dbn[charIndex];
     if(dbnChar == "("){
       arrOpenParanthsIndexs.push(charIndex);
     }
     else if(dbnChar == ")"){
       arrCloseParanthsIndexs.push(charIndex);
     }
    }
  }


  prepareGraphElements = function(){
    prepareNodesArray();
    prepareLinksArray();

    nodes.forEach(function(node, index){graphElements.push(
      {
        data:{name:node.name, color: node.color , id: node.id}
      })
    });

    links.forEach(function(link , index){graphElements.push(
     {
        data: {source: link.source , target:link.target, id: (link.source + link.target + index),
               edgeStyle: link.edgeStyle }
     }
    )});
  };

  var getGraphOptions = function(){
    var options = {
      name: 'cose',// Whether to fit the network view after when done
      fit: true,// Padding on fit
      padding: 30,
      boundingBox: undefined,
      randomize: true,
      componentSpacing: 100,
      nodeRepulsion: function( node ){ return 40000; },
      nodeOverlap: 10,
      idealEdgeLength: function( edge ){ return 10; },
      edgeElasticity: function( edge ){ return 100; },
      nestingFactor: 5,
      gravity: -50,
      numIter: 1000,
      initialTemp: 200,
      coolingFactor: 0.95,
      minTemp: 1.0,
      weaver: false
    };

    return options;
  };

  createGraph = function(){
    var cy = cytoscape({
      container: cyElem,
      elements: graphElements,
      style: [
      {
          selector: 'node',
          style: {
              'background-color': 'data(color)',
               label: 'data(name)',
               width: inpDnaObj.baseSize,
              'font-size': inpDnaObj.labelFont
          }
      },
      {
          selector: 'edge',
          style: {
            'line-style': 'data(edgeStyle)',
             width: inpDnaObj.edgeWidth
          }
      }],
      layout: getGraphOptions()
    });

    attachEvents(cy);

  };

  attachEvents = function(cy){
    cy.on('mouseover', 'node', function(event) {
      if(typeof inpDnaObj.cbMouseOver == 'function')
         inpDnaObj.cbMouseOver(event.target.id());
    });

    cy.on('click', 'edge', function(event){
       event.target.remove();
    });
  };

  validateInputConfig = function(){
    return true;
  };

  getBaseColor = function(base){
    switch(base){
      case 'T':
      return inpDnaObj.baseColor.T;
      case 'C' :
      return inpDnaObj.baseColor.C;
      case 'A' :
      return inpDnaObj.baseColor.A;
      case 'G':
      return inpDnaObj.baseColor.G;
    };
  }

  function dnaStruct(config){
    if(config){
      this.sequence = config.sequence;
      this.dbn = config.dbn;
      this.baseColor = new baseColor(config.baseTColor, config.baseAColor, config.baseCColor, config.baseGColor);
      this.cbMouseOver = config.cbMouseOver;
      this.baseSize = config.baseSize || '45';
      this.labelFont = config.labelFont || '18';
      this.edgeWidth = config.edgeWidth || '6';
    }
    else{
    }
    //console.info('this.baseColor', this.baseColor);
  }

  function baseColor(tColor, aColor, cColor , gColor){
    this.T = tColor || 'red';
    this.A = aColor || 'green';
    this.C = cColor || 'blue';
    this.G = gColor || 'black';
  }

  this.renderDNAStructure = function(){
    if(validateInputConfig()){
        inpDnaObj = new dnaStruct(config);
        prepareGraphElements();
        createGraph();
    }
  };

  return{
    render: this.renderDNAStructure
  }

};
