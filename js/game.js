var JSBall = JSBall || {}

JSBall.game = (function() {
    
    var Game = function(stage) {
        this.movingObjects = []
        this.stationaryObjects = []
 
        this.ball = new JSBall.models.Ball(
            15, new JSBall.helpers.Position(40, 150)
        );

        this.ball2 = new JSBall.models.Ball(
            15, new JSBall.helpers.Position(250, 150)
        );

        this.ball3 = new JSBall.models.Ball(
            15, new JSBall.helpers.Position(40, 40)
        );

        this.movingObjects.push(this.ball);
        this.movingObjects.push(this.ball2);
        this.movingObjects.push(this.ball3);

        this.ball.velocity = new JSBall.helpers.Position(1, 2);
        this.ball2.velocity = new JSBall.helpers.Position(-6, 0);
        this.ball3.velocity = new JSBall.helpers.Position(1.5, 4.5);

        this.wallColor = 0xFFFFFF;

        this.walls = [
            new JSBall.models.Wall(
                new JSBall.models.Size(400, 10),
                new JSBall.helpers.Position(0, 0),
                this.wallColor
            ),
            new JSBall.models.Wall(
                new JSBall.models.Size(10, 280),
                new JSBall.helpers.Position(390, 10),
                this.wallColor
            ),
            new JSBall.models.Wall(
                new JSBall.models.Size(400, 10),
                new JSBall.helpers.Position(0, 290),
                this.wallColor
            ),
             new JSBall.models.Wall(
                new JSBall.models.Size(10, 280),
                new JSBall.helpers.Position(0, 10),
                this.wallColor
            ),
        ];

        for (var i = 0; i < this.movingObjects.length; i++) {
            stage.addChild(this.movingObjects[i].sprite);
        };

        for (var i = 0; i < this.walls.length; i++) {
            stage.addChild(this.walls[i].sprite);
            this.stationaryObjects.push(this.walls[i]);
        }
    }

    Game.prototype._findFastestComponent = function() {
        var fastest = 1;

        _.forEach(this.movingObjects, function(mObj) {
            absX = Math.abs(mObj.velocity.x)
            if (absX > fastest) {
                fastest = absX;
            }

            absY = Math.abs(mObj.velocity.y)
            if (absY > fastest) {
                fastest = absY;
            } 
        });

        return fastest;
    }

    Game.prototype._physicsLoop = function(numTimesteps) {
        for (var i = 0; i < numTimesteps; i++) {
            JSBall.collisions.detectCollisions(
               this.movingObjects, this.stationaryObjects
            );

            _.forEach(this.movingObjects, function(mObj) {
                mObj.updatePosition(numTimesteps)
            });
        }
    }

    Game.prototype.loop = function() {
        fastest = this._findFastestComponent();
        this._physicsLoop(fastest*2);
    }

    return {
        Game: Game
    }
})();