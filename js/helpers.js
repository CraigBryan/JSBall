var JSBall = JSBall || {}

JSBall.helpers = (function () {

    var Position = function(x, y) {
        this.x = x;
        this.y = y;
    };

    Position.prototype.translatedPosition = function(x, y) {
        return new Position(this.x + x, this.y + y);
    };
    
    var cartesianDistance = function(pos1, pos2) {
        return Math.sqrt(
            Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
        );
    };

    var dotProduct = function(vec1, vec2) {
        return (vec1.x * vec2.x) + (vec1.y  * vec2.y);
    };

    var vectorMagnitude = function(vec) {
        return cartesianDistance(new Position(0, 0), vec);
    };

    var scaleVector = function(vector, scale) {
        return new Position(vector.x * scale, vector.y * scale);
    };

    var angleBetween = function(vec1, vec2) {
        return Math.acos(
            dotProduct(vec1, vec2) / (
                vectorMagnitude(vec1) * vectorMagnitude(vec2)
            )
        );
    };

    var makeVector = function(origin, point) { 
        return new Position(point.x - origin.x, point.y - origin.y);
    };

    var linePointDistance = function(linep1, linep2, point) {
        return Math.abs(
            ((linep2.y - linep1.y) * point.x) 
            - ((linep2.x - linep1.x) * point.y)
            + (linep2.x * linep1.y)
            - (linep2.y * linep1.x)
        ) / cartesianDistance(linep2, linep1);
    };

    var _getUnitVector = function(vector) {
        return scaleVector(vector, 1 / vectorMagnitude(vector));
    }

    var getProjectionVector = function(toProject, line) {
        line = _getUnitVector(line);
        var angle = angleBetween(toProject, line);
        var projection = vectorMagnitude(toProject) * Math.cos(angle);
        return scaleVector(line, projection);

    };

    return {
        Position: Position,
        cartesianDistance: cartesianDistance,
        dotProduct: dotProduct,
        vectorMagnitude: vectorMagnitude,
        scaleVector: scaleVector,
        angleBetween: angleBetween,
        makeVector: makeVector,
        linePointDistance: linePointDistance,
        getProjectionVector: getProjectionVector
    };
})();