$.Ai = function() {
	var abs = Math.abs;
	var max = Math.max;
	var pow = Math.pow;
	var sqrt = Math.sqrt;
	var findNeighbours = function(){};

	this.getDistance = function(Point, Goal) {
		return abs(Point.x - Goal.x) + abs(Point.y - Goal.y);
	};

	this.Neighbours = function(x, y, mW, mH) {
		var	N = y - 1,
		S = y + 1,
		E = x + 1,
		W = x - 1,
		myN = N > -1 && !$.lvl.isWall(x, N),
		myS = S < mH && !$.lvl.isWall(x, S),
		myE = E < mW && !$.lvl.isWall(E, y),
		myW = W > -1 && !$.lvl.isWall(W, y),
		result = [];
		if(myN)
		result.push({x:x, y:N});
		if(myE)
		result.push({x:E, y:y});
		if(myS)
		result.push({x:x, y:S});
		if(myW)
		result.push({x:W, y:y});
		findNeighbours(myN, myS, myE, myW, N, S, E, W, result);
		return result;
	};

	this.DiagonalNeighbours = function(myN, myS, myE, myW, N, S, E, W, result) {
		if(myN) {
			if(myE && !$.lvl.isWall(E, N))
			result.push({x:E, y:N});
			if(myW && !$.lvl.isWall(W, N))
			result.push({x:W, y:N});
		}
		if(myS) {
			if(myE && !$.lvl.isWall(E, S))
			result.push({x:E, y:S});
			if(myW && !$.lvl.isWall(W, S))
			result.push({x:W, y:S});
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

	this.calculatePath = function(pathStart, pathEnd){
		var mapW = $.lvl.map[0].length;
		var mapH = $.lvl.map.length;
		var mapS = mapW * mapH;
		var	mypathStart = this.Node(null, {x:pathStart[0], y:pathStart[1]}, mapW);
		var mypathEnd = this.Node(null, {x:pathEnd[0], y:pathEnd[1]}, mapW);
		var AStar = new Array(mapS);
		var Open = [mypathStart];
		var Closed = [];
		var result = [];
		var myNeighbours;
		var myNode;
		var myPath;
		var length, max, min, i, j;
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
			if(myNode.value === mypathEnd.value) {
				myPath = Closed[Closed.push(myNode) - 1];
				do
				{
					result.push([myPath.x, myPath.y]);
				}
				while (myPath = myPath.Parent);
				AStar = Closed = Open = [];
				result.reverse();
			} else {
				myNeighbours = this.Neighbours(myNode.x, myNode.y, mapW, mapH);
				for(i = 0, j = myNeighbours.length; i < j; i++) {
					myPath = this.Node(myNode, myNeighbours[i], mapW);
					if (!AStar[myPath.value]) {
						myPath.g = myNode.g + this.getDistance(myNeighbours[i], myNode);
						myPath.f = myPath.g + this.getDistance(myNeighbours[i], mypathEnd);
						Open.push(myPath);
						AStar[myPath.value] = true;
					}
				}
				Closed.push(myNode);
			}
		} 
		return result;
	};

};
