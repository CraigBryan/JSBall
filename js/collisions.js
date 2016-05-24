var JSBall = JSBall || {}

JSBall.collisions = (function() {

    var CollisionType = Object.freeze({
        NONE: 0,
        HORIZONTAL: 1,
        VERTICAL: 2,
        CIRCLE: 3
    });

    var detectCollisions = function(moving, stationary) {
        var i, j, mObj;
        for (i = 0; i < moving.length; i++) {
            mObj = moving[i];

            // Moving-moving object collisions
            for (j = i + 1; j < moving.length; j++) {
                collide(mObj, moving[j], determineCollision(mObj, moving[j]));
            }

            // Moving-stationary object collisions
            for (j = 0; j < stationary.length; j++) {
                collision = determineCollision(mObj, stationary[j]);
                if (collision !== CollisionType.NONE) {
                    determineCollision(mObj, stationary[j]);
                    mObj.resolveBounce(collision);
                } 
            }
        }
    };

    var determineCollision = function(first, second) {
        if (
            first.boundType === JSBall.models.BoundType.BOX
            && second.boundType === JSBall.models.BoundType.BOX
        ) {
            return _determineBoxBoxCollision(first, second);
        } else if (
            first.boundType === JSBall.models.BoundType.CIRCLE
            && second.boundType === JSBall.models.BoundType.CIRCLE
        ) {
            return _determineCircleCircleCollision(first, second);
        } else {
            return _determineCircleBoxCollision(first, second);
        }
    };

    function _determineBoxBoxCollision(first, second) {
        var deltaX = first.position.x - second.position.x;
        var deltaY = first.position.y - second.position.y;

        var xOverlap = 0;
        var yOverlap = 0;

        if (deltaX < 0) {
            xOverlap = (
                first.position.x + first.size.width - second.position.x
            );
        } else {
            xOverlap = (
                second.position.x + second.size.width - first.position.x
            );
        }

        if (deltaY < 0) {
            yOverlap = (
                first.position.y + first.size.height - second.position.y
            );
        } else {
            yOverlap = (
                second.position.y + second.size.height - first.position.y
            );
        }
        if (!(xOverlap > 0 && yOverlap > 0)) {
            return CollisionType.NONE;
        } else {
            if (xOverlap >= yOverlap) {
                return CollisionType.HORIZONTAL;
            } else {
                return CollisionType.VERTICAL;
            }
        }
    }

    function _determineCircleCircleCollision(first, second) {
        if (
            JSBall.helpers.cartesianDistance(
                first.position, second.position
            ) < first.radius + second.radius
        ) {
            return CollisionType.CIRCLE;
        }

        return CollisionType.NONE;
    }

    /* Assumes only horizontal or vertical rectangles */
    function _determineCircleBoxCollision(circle, box) {
        var bTopLeft = box.position
        var bTopRight = box.position.translatedPosition(box.size.width, 0);
        var bBottomLeft = box.position.translatedPosition(0, box.size.height);
        var bBottomRight = box.position.translatedPosition(
            box.size.width, box.size.height
        );

        if (
            circle.position.x > bTopLeft.x || circle.position.x < bTopRight.x
        ) {

            var distToTop = JSBall.helpers.linePointDistance(
                bTopLeft, bTopRight, circle.position
            );
            var distToBottom = JSBall.helpers.linePointDistance(
                bBottomLeft, bBottomRight, circle.position
            );

            if (distToTop <= circle.radius || distToBottom <= circle.radius) {
                return CollisionType.HORIZONTAL;
            } 
        } 

        if (
            circle.position.y > bTopLeft.y || circle.position.y < bBottomLeft.y
        ) {
            var distToRight = JSBall.helpers.linePointDistance(
                bTopRight, bBottomRight, circle.position
            );
            
            var distToLeft = JSBall.helpers.linePointDistance(
                bTopLeft, bBottomLeft, circle.position
            );

            if (distToLeft < circle.radius || distToRight <= circle.radius) {
                return CollisionType.VERTICAL;
            } 
        }

        return CollisionType.NONE;
    }

    var collide = function(first, second, collisionType) {
        // TODO move to model?
        if (collisionType === CollisionType.NONE) {
            return;
        }

        var collisionVector = JSBall.helpers.makeVector(
            first.position, second.position
        );

        var firstNormalVelocity = JSBall.helpers.getProjectionVector(
            second.velocity, collisionVector
        );
        var secondNormalVelocity = JSBall.helpers.getProjectionVector(
            first.velocity, collisionVector
        ); 
        first.resolveCollision(firstNormalVelocity);
        second.resolveCollision(secondNormalVelocity);
    };

    return {
        CollisionType: CollisionType,
        detectCollisions: detectCollisions,
        determineCollision: determineCollision
    }
})();