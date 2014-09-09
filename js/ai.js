$.Ai = function() {
  var findNeighbours = function(){};

  this.getd = function(Point, Goal) {
    return abs(Point.x - Goal.x) + abs(Point.y - Goal.y);
  };

  this.Neighbours = function(x, y, mW, mH) {
    var  N = y - 1,
         S = y + 1,
         E = x + 1,
         W = x - 1,
         myN = N > -1 && !$.lvl.isWall(x, N),
         myS = S < mH && !$.lvl.isWall(x, S),
         myE = E < mW && !$.lvl.isWall(E, y),
         myW = W > -1 && !$.lvl.isWall(W, y),
         r = [];
    if(myN)
    r.push({x:x, y:N});
    if(myE)
    r.push({x:E, y:y});
    if(myS)
    r.push({x:x, y:S});
    if(myW)
    r.push({x:W, y:y});
    findNeighbours(myN, myS, myE, myW, N, S, E, W, r);
    return r;
  };

  this.DiagonalNeighbours = function(myN, myS, myE, myW, N, S, E, W, r) {
    if(myN) {
      if(myE && !$.lvl.isWall(E, N))
      r.push({x:E, y:N});
      if(myW && !$.lvl.isWall(W, N))
      r.push({x:W, y:N});
    }
    if(myS) {
      if(myE && !$.lvl.isWall(E, S))
      r.push({x:E, y:S});
      if(myW && !$.lvl.isWall(W, S))
      r.push({x:W, y:S});
    }
  };

  this.Node = function(Parent, Point, mW) {
    var newNode = {
      Parent:Parent,
      value:Point.x + (Point.y * mW),
      x:Point.x,
      y:Point.y,
      f:0,
      g:0
    };

    return newNode;
  };

  this.calculatePath = function(pstart, pend){
    var mapW = $.lvl.map[0].length,
        mapH = $.lvl.map.length,
        mapS = mapW * mapH,
        myPs = this.Node(null, {x:pstart[0], y:pstart[1]}, mapW),
        myPe = this.Node(null, {x:pend[0], y:pend[1]}, mapW),
        AStar = new Array(mapS),
        Open = [myPs],
        Closed = [],
        r = [],
        myNeighbours,
        myNode,
        myPath,
        length, max, min, i, j;
    while(length = Open.length) {
      max = mapS;
      min = -1;
      for(i = 0; i < length; i++) {
        if(Open[i].f < max)
        {
          max = Open[i].f;
          min = i;
        }
      }
      myNode = Open.splice(min, 1)[0];
      if(myNode.value === myPe.value) {
        myPath = Closed[Closed.push(myNode) - 1];
        do
        {
          r.push([myPath.x, myPath.y]);
        }
        while (myPath = myPath.Parent);
        AStar = Closed = Open = [];
        r.reverse();
      } else {
        myNeighbours = this.Neighbours(myNode.x, myNode.y, mapW, mapH);
        for(i = 0, j = myNeighbours.length; i < j; i++) {
          myPath = this.Node(myNode, myNeighbours[i], mapW);
          if (!AStar[myPath.value]) {
            myPath.g = myNode.g + this.getd(myNeighbours[i], myNode);
            myPath.f = myPath.g + this.getd(myNeighbours[i], myPe);
            Open.push(myPath);
            AStar[myPath.value] = true;
          }
        }
        Closed.push(myNode);
      }
    }
    return r;
  };

};
