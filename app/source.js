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
  };

  prepareLinksArray = function(){
    addLinksForParenthesis();
    addLinksForDots();
  };

  addLinksForDots = function(){
    for(var charIndex = 0; charIndex < inpDnaObj.dbn.length -1 ; charIndex++){
      links.push({source: charIndex.toString(), target: (charIndex + 1).toString(), edgeStyle: 'solid', edgeCurve : 'segments'});
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
      links.push({source: closeParanthsIndex.toString(), target: target.toString(), edgeStyle: 'dotted', edgeCurve: 'haystack'});
    });
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
               edgeStyle: link.edgeStyle, edgeCurve: link.edgeCurve }
     }
    )});
  };

  var getGraphOptions = function(){
    var options = {
      name: 'cose-bilkent',
      ready: function () {
          cy.resize();
      },
      stop: function () {
      },
      fit: true,
      padding: 30,
      randomize: true,
      nodeRepulsion: 65000,
      idealEdgeLength: 300,
      edgeElasticity: 0.8,
      nestingFactor: 0.1,
      gravity: 0.4,
      numIter: 2500,
      tile: true,
      animate: false
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
             'curve-style': 'data(edgeCurve)',
             'segment-distances': '20 -20 20',
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
         inpDnaObj.cbMouseOver(parseInt(event.target.id()));
    });

    cy.on('click', 'edge', function(event){
      var edgeData = event.target.element().data();
      event.target.remove();
      if(typeof inpDnaObj.cbEdgeRemoval == 'function')
        inpDnaObj.cbEdgeRemoval({source: edgeData.source, target: edgeData.target});
    });
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
      this.cbEdgeRemoval = config.cbEdgeRemoval;
      this.baseSize = config.baseSize || '54';
      this.labelFont = config.labelFont || '40';
      this.edgeWidth = config.edgeWidth || '6';
    }
    else{
    }
  }

  function baseColor(tColor, aColor, cColor , gColor){
    this.T = tColor || 'red';
    this.A = aColor || 'green';
    this.C = cColor || 'blue';
    this.G = gColor || 'black';
  }

  this.renderDNAStructure = function(){
    inpDnaObj = new dnaStruct(config);
    prepareGraphElements();
    createGraph();
  };

  return{
    render: this.renderDNAStructure
  }

};
