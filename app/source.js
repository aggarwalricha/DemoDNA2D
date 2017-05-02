/**
  @purpose Function constructor to draw DNA molecule structure using input config object and DOM placeholder.
  @param config: input configuration of a dna molecule structure
         cy: DOM placeholder for graph
*/
var drawDNA = function(config, cy){

  // all private variables initialization
  var inpDnaObj = new dnaStruct();
  var cyElem = cy;
  var nodes = [],  links =[], arrOpenParanthsIndexs =[], arrCloseParanthsIndexs =[], graphElements =[];

  /**
    @purpose Function constructor to create a internal config structure out of the input configuartion.
    @param config: input configuration of a dna molecule structure
  */
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

  /**
    @purpose Function constructor to create a base color object which will hold all four nodes color codes.
    @param tColor: base T color , aColor: base A color, cColor: base C color , gColor: base G color.
  */
  function baseColor(tColor, aColor, cColor , gColor){
    this.T = tColor || 'red';
    this.A = aColor || 'green';
    this.C = cColor || 'blue';
    this.G = gColor || 'black';
  }

  /**
    @purpose Public function of this library which will be exposed to the user for creating a graph.
            This will create a internal config structure and will initialize all graph elements accordingly.
            Finally sketch a graph in the passed DOM placeholder using the graph elements.
  */
  this.renderDNAStructure = function(){
    inpDnaObj = new dnaStruct(config);
    prepareGraphElements();
    createGraph();
  };

  /**
    @purpose This will create alll graph elemnts corresponding to nodes and edges and will push them to graph elements array.
  */
  prepareGraphElements = function(){
    prepareNodesArray();
    prepareLinksArray();
    pushNodesToGraphElements();
    pushLinksToGraphElements();
  };

  /**
    @purpose This will loop through the entire sequence and will push each node for each character in sequence.
              It will assign name, color and unique id(sequence index) for each node.
  */
  prepareNodesArray = function(){
    for(var charIndex =0; charIndex < inpDnaObj.sequence.length; charIndex++){
      var base =inpDnaObj.sequence[charIndex];
      nodes.push({name:base, color:getBaseColor(base) , id: charIndex.toString() });
    }
  };

  /**
    @purpose This will loop through the entire dbn and will push links for each character('.',')','(').
             plus will determine link between associated parenthesis and will push the same in the links array.
  */
  prepareLinksArray = function(){
    addLinksForParenthesis();
    addLinksForDots();
  };

  /**
  @purpose Determine indexes for associated parenthesis and push the corresponding link.
  1-prepare a array of indexs corresponding to all open paranthesis and closed parenthesis.
  2-loop over closed paranthesis array and get the 'maximum' index of open parenthesis which is smaller than closed
    parenthesis index + is not yet assigned to link array.
    eg: openparenthesisIndexArray = [3, 4, 5 , 6 ,7, 9], closeParanthsIndexArray = [13, 15, 16, 17, 18, 19]
        resultant parenthesis grouping for links = [(13, 9), (15, 7), (16, 6), (17, 5),(18, 4), (19, 3)]
  3- finally add a link corresponding to the above associated parenthesis.

  */
  addLinksForParenthesis = function(){
    try{
      populateIndexesOfOpenNCloseParnths();
      arrCloseParanthsIndexs.forEach(function (closeParanthsIndex, idx){
        var target = _.max(_.filter(arrOpenParanthsIndexs, function(openParanthsIdx){
          return openParanthsIdx < closeParanthsIndex && !_.some(links, function(link){
            return link.target == openParanthsIdx.toString();
          })}
        ));
        links.push({source: closeParanthsIndex.toString(), target: target.toString(), edgeStyle: 'dotted', edgeCurve: 'haystack'});
      });
    }
    catch(e){
      console.info('Error in addLinksForParenthesis', e);
    }
  };

  /**
    @purpose This will loop through the entire dbn and will push links for each character('.',')','(').
  */
  addLinksForDots = function(){
    for(var charIndex = 0; charIndex < inpDnaObj.dbn.length -1 ; charIndex++){
      links.push({source: charIndex.toString(), target: (charIndex + 1).toString(), edgeStyle: 'solid', edgeCurve : 'segments'});
    }
  };

  /**
    @purpose populate index of each open and closed parenthesis into corresponding array.
  */
  populateIndexesOfOpenNCloseParnths = function(){
    for(var charIndex = 0; charIndex < inpDnaObj.dbn.length  ; charIndex++){
      var dbnChar = inpDnaObj.dbn[charIndex];
      if(dbnChar == "("){
        arrOpenParanthsIndexs.push(charIndex);
      }
      else if(dbnChar == ")"){
        arrCloseParanthsIndexs.push(charIndex);
      }
    }
  };

  /**
    @purpose Loop over nodes array and push a element correspondingly.
  */
  pushNodesToGraphElements= function(){
    nodes.forEach(function(node, index){graphElements.push(
      {
        data:{name:node.name, color: node.color , id: node.id}
      })
    });
  };

  /**
    @purpose Loop over links array and push a element correspondingly.
  */
  pushLinksToGraphElements = function(){
    links.forEach(function(link , index){graphElements.push(
     {
        data: {source: link.source , target:link.target, id: (link.source + link.target + index),
               edgeStyle: link.edgeStyle, edgeCurve: link.edgeCurve }
     }
    )});
  };

  /**
    @purpose Using cytoscape libray , create graph object , assign layout options , attach events and assign graph elements.
  */
  createGraph = function(){
    try{
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
    }
    catch(e){
      console.info('Error in createGraph', e);
    }
  };

  /**
    @purpose Assign Layout options and return
  */
  getGraphOptions = function(){
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

  /**
    @purpose attach two events: 1- Mousee over and call a callback to highlight base in sequence
    2- click on edge to remove link and to call a callback to update DBN ..
  */
  attachEvents = function(cy){
    try{
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
    }
    catch(e){
      console.info('Error in attachEvents', e);
    }
  };

  /**
    @purpose Get node color based on the sequence base.
  */
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
  };

  return{
    render: this.renderDNAStructure
  }

};
