/*
Defines models used in the game
*/

var JSBall = JSBall || {}

JSBall.models = (function() {

    var BoundType = Object.freeze({
        BOX: 0,
        CIRCLE: 1
    });

    var Size = function(width, height) {
        this.width = width;
        this.height = height;
    };

    var Ball = function(radius, position) {
        this.boundType = BoundType.CIRCLE;
        this.radius = radius;
        this.position = position;

        this.sprite = new PIXI.Sprite(
            PIXI.Texture.fromImage("assets/ball.png")
        );
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.position.x = position.x;
        this.sprite.position.y = position.y;
        this.sprite.width = radius * 2;
        this.sprite.height = radius * 2;
    };


    Ball.prototype.updatePosition = function(numStepsPerTick) {
        if (this.newVelocity) {
            this.velocity.x = this.newVelocity.x;
            this.velocity.y = this.newVelocity.y;
            delete this.newVelocity;
        }

        if (!this.velocity) {
            return;
        }

        this.position.x = this.position.x + (
            this.velocity.x / numStepsPerTick
        );
        this.position.y = this.position.y + (
            this.velocity.y / numStepsPerTick
        );

        this.sprite.position.x = this.position.x;
        this.sprite.position.y = this.position.y;
    }

    Ball.prototype.resolveCollision = function(normalVelocity) {
        var tangentLine = new JSBall.helpers.Position(
            normalVelocity.y, normalVelocity.x * -1
        );
        var tangentVelocity = JSBall.helpers.getProjectionVector(
            this.velocity, tangentLine
        );

        this.newVelocity = new JSBall.helpers.Position(
            tangentVelocity.x + normalVelocity.x,
            tangentVelocity.y + normalVelocity.y
        );
    };

    Ball.prototype.resolveBounce = function(cType) {
        if (cType === JSBall.collisions.CollisionType.HORIZONTAL) {
            this.velocity.y = -this.velocity.y;
        } else {
            this.velocity.x = -this.velocity.x;
        }
    };

    var Wall = function(size, position, color) {
        this.boundType = BoundType.BOX;
        this.size = size;
        this.position = position;
        var graphic = new PIXI.Graphics();
        graphic.beginFill(color);
        graphic.drawRect(position.x, position.y, size.width, size.height);
        graphic.endFill();
        this.sprite = graphic;
    };

    return {
        Size: Size,
        Ball: Ball,
        Wall: Wall,
        BoundType : BoundType
    }
})();