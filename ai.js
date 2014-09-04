$.Ai = function (start, end) {
	this.s = [start.x, start.y];
	this.e = [end.x, end.y];
	this.result = [];
	var mW = $.map.tiles[0].length;
	var mH = $.map.tiles.length;
	var mS = mW * mH;

	var findNeighbours = function(){};

	this.getDistance = function() {
		return Math.abs(this.s.x - this.e.x) + Math.abs(this.s.y - this.s.y);
	};

	this.locateNeighbours = function(x, y) {
		var	N = y - 1,
		S = y + 1,
		E = x + 1,
		W = x - 1,
		myN = N > -1 && $.map.walkableTile(x, N),
		myS = S < mH && $.map.walkableTile(x, S),
		myE = E < mW && $.map.walkableTile(E, y),
		myW = W > -1 && $.map.walkableTile(W, y),
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

	this.locateDiagonal = function(myN, myS, myE, myW, N, S, E, W, result) {
		if(myN) {
			if(myE && $.map.walkableTile(E, N))
				result.push({x:E, y:N});
			if(myW && $.map.walkableTile(W, N))
				result.push({x:W, y:N});
		}
		if(myS) {
			if(myE && $.map.walkableTile(E, S))
				result.push({x:E, y:S});
			if(myW && $.map.walkableTile(W, S))
				result.push({x:W, y:S});
		}
	};

	this.Node = function(Parent, Point) {
		var newNode = {
			Parent:Parent,
			value:Point.x + (Point.y * mW),
			x:Point.x,
			y:Point.y,
			f:0,
			g:0
		};
		return newNode;
	}

	this.calculatePath = function() {
		var	mypathStart = this.Node(null, {x:this.s[0], y:this.s[1]});
		var mypathEnd = this.Node(null, {x:this.e[0], y:this.e[1]});
		var AStar = new Array(mS);
		var Open = [mypathStart];
		var Closed = [];
		var result = [];
		var myNeighbours;
		var myNode;
		var myPath;
		var length, max, min, i, j;
		while(length = Open.length) {
			max = mS;
			min = -1;
			for(i = 0; i < length; i++) {
				if(Open[i].f < max) {
					max = Open[i].f;
					min = i;
				}
			}
			myNode = Open.splice(min, 1)[0];
			if(myNode.value === mypathEnd.value) {
				myPath = Closed[Closed.push(myNode) - 1];
				do {
					result.push([myPath.x, myPath.y]);
				} while (myPath = myPath.Parent);
				AStar = Closed = Open = [];
				result.reverse();
			}
			else {
				myNeighbours = this.locateNeighbours(myNode.x, myNode.y);
				for(i = 0, j = myNeighbours.length; i < j; i++) {
					myPath = this.Node(myNode, myNeighbours[i]);
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