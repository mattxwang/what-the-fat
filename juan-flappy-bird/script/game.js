class Game {
    constructor(CANVAS) {
        this.canvas = CANVAS;
        this.context = CANVAS.getContext("2d");
        this.context.imageSmoothingEnabled = false;

        this.setConstants();

        this.score = 0;
        this.isGameOver = false;

        // This bindings, thanks to MS Edge
        this.setConstants = this.setConstants.bind(this);
        this.setBirdImg = this.setBirdImg.bind(this);
        this.resize = this.resize.bind(this);
        this.loadImg = this.loadImg.bind(this);
        this.load = this.load.bind(this);
        this.pregame = this.pregame.bind(this);
        this.startOnKeydown = this.startOnKeydown.bind(this);
        this.jumpOnKeydown = this.jumpOnKeydown.bind(this);
        this.restartOnKeydown = this.restartOnKeydown.bind(this);
        this.createSprites = this.createSprites.bind(this);
        this.start = this.start.bind(this);
        this.run = this.run.bind(this);
        this.gameOver = this.gameOver.bind(this);
        this.generatePipeSet = this.generatePipeSet.bind(this);
        this.draw = this.draw.bind(this);
        this.drawBorderedText = this.drawBorderedText.bind(this);
        this.drawScore = this.drawScore.bind(this);
        this.drawIntro = this.drawIntro.bind(this);
    }


    setConstants() {
        // Constants
        this.FPS                = 60;
        this.BIRD_START_X       = this.canvas.height / 5;
        this.BIRD_START_Y       = this.canvas.height / 5;
        this.BIRD_ACCEL         = this.canvas.height / 6200;
        this.BIRD_WIDTH         = this.canvas.height / 10;
        this.BIRD_HEIGHT        = this.canvas.height / 10;
        this.BIRD_JUMP_VEL      = -this.canvas.height / 200;
        this.GROUND_HEIGHT      = 0;
        this.ROOF_HEIGHT        = this.canvas.height / 10;
        this.PIPE_WIDTH         = this.canvas.height / 10;
        this.PIPE_SPEED         = -this.canvas.height / 330;
        this.PIPE_GEN_SPEED     = 1300;                         // This is a time in ms!
        this.PIPE_SEPARATION    = this.BIRD_HEIGHT * 3.5;       // This is between top and bottom
    }


    setBirdImg(src) {
        this.birdImgSrc = src;
    }


    resize(width , height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.setConstants();
    }


    loadImg(src) {
        return new Promise( (resolve , reject) => {
            let img = new Image();
            img.src = src;
            img.onload = () => {
                resolve(img);
            }
            img.onerror = () => {
                reject(new Error("Error loading image resource"));
            }
        } );
    }


    async load() {
        this.context.font = "48px sans-serif";

        this.topPipeImg = await this.loadImg("./assets/img/block-ama.png");
        this.bottomPipeImg = await this.loadImg("./assets/img/standing-block.png");
        this.backgroundImg = await this.loadImg("./assets/img/bplate.jpg");
        this.birdImg = await this.loadImg((this.birdImgSrc) ? this.birdImgSrc : "./assets/img/juan.png");

        this.createSprites();

        this.pregame();
    }


    pregame() {
        this.drawIntro();
        window.addEventListener("keydown" , this.startOnKeydown);
    }


    startOnKeydown(event) {
        if (event.key === " ") {
            this.start();
        }
    }


    jumpOnKeydown(event) {
        if (event.key === " ") {
            this.bird.jump(this.BIRD_JUMP_VEL);
        }
    }


    restartOnKeydown(event) {
        if (event.key === " ") {
            this.createSprites();
            this.score = 0;
            this.isGameOver = false;
            this.start();
        }
    }


    createSprites() {
        this.bird = new Bird(this.context , this.birdImg);
        this.bird.setPosition([this.BIRD_START_X, this.BIRD_START_Y]);
        this.bird.setAcceleration([0, this.BIRD_ACCEL]);
        this.bird.setBoundingBox([this.BIRD_WIDTH, this.BIRD_HEIGHT]);

        this.ground = new Ground(this.context);
        this.ground.setPosition([0, this.canvas.height - this.GROUND_HEIGHT]);
        this.ground.setBoundingBox([this.canvas.width, this.GROUND_HEIGHT]);

        this.roof = new Roof(this.context);
        this.roof.setPosition([0, -this.ROOF_HEIGHT]);
        this.roof.setBoundingBox([this.canvas.width, this.ROOF_HEIGHT])

        this.pipes = [];
    }


    start() {
        // Remove start game event listener
        window.removeEventListener("keydown" , this.startOnKeydown);

        // Remove restart game event listener
        window.removeEventListener("keydown" , this.restartOnKeydown);

        // Make the bird jump on spacebar down
        window.addEventListener("keydown", this.jumpOnKeydown);

        // Looped events
        this.loopRunner = window.setInterval(this.run, 1000.0 / this.FPS);
        this.pipeGenerator = window.setInterval(this.generatePipeSet , this.PIPE_GEN_SPEED);

        // This is so the bird jumps when you start the game instead of just falling
        this.bird.jump(this.BIRD_JUMP_VEL);

        this.run();
    }


    run() {
        // 100.0 is not a typo! this is just a nice number after trial and error
        const DT = 100.0 / this.FPS;

        // Update Physics
        this.bird.updateKinematics(DT);
        this.pipes.forEach(i => {
            i.updateKinematics(DT);
        });


        // Collision Detection
        if (this.ground.collidesWith(this.bird)) {
            this.isGameOver = true;
            this.gameOver();
        }

        if (this.roof.collidesWith(this.bird)) {
            this.bird.setPosition([this.BIRD_START_X, 0]);
            this.bird.setVelocity([0, 0]);
        }

        this.pipes.forEach(i => {
            if (i.collidesWith(this.bird)) {
                if(i instanceof Pipe) {
                    this.isGameOver = true;
                    window.removeEventListener("keydown" , this.jumpOnKeydown);

                    this.pipes.forEach(i => {
                        i.setCollidable(false);
                        i.setVelocity([0 , 0]);
                    });

                    window.clearInterval(this.pipeGenerator);
                }
                else if(i instanceof ScoreBox) {
                    this.score ++;
                    i.setCollidable(false);
                }
            }
        });


        // Garbage Cleanup
        this.pipes = this.pipes.filter(i => i.pos[0] > (0 - this.PIPE_WIDTH));

        this.draw();
    }


    gameOver() {
        window.clearInterval(this.loopRunner);
        window.clearInterval(this.pipeGenerator);
        this.bird.setPosition([this.BIRD_START_X , this.canvas.height - this.BIRD_HEIGHT - this.GROUND_HEIGHT]);

        window.addEventListener("keydown" , this.restartOnKeydown);
    }


    generatePipeSet() {
        const LEFTOVER_HEIGHT = this.canvas.height - this.GROUND_HEIGHT;
        const ASSET_HEIGHT = .65 * this.canvas.height;
        const PIPE_HEIGHTS = [
            LEFTOVER_HEIGHT * .2 ,
            LEFTOVER_HEIGHT * .3 ,
            LEFTOVER_HEIGHT * .4 ,
            LEFTOVER_HEIGHT * .5 ,
        ];

        let topPipeHeight = PIPE_HEIGHTS[Math.floor(Math.random() * PIPE_HEIGHTS.length)];
        let topPipe = new Pipe(this.context , this.topPipeImg);
        let bottomPipe = new Pipe(this.context , this.bottomPipeImg);
        let scoreBox = new ScoreBox(this.context);

        topPipe.setVelocity([this.PIPE_SPEED , 0]);
        topPipe.setPosition([this.canvas.width , topPipeHeight - ASSET_HEIGHT]);
        topPipe.setBoundingBox([this.PIPE_WIDTH , ASSET_HEIGHT]);

        bottomPipe.setVelocity([this.PIPE_SPEED , 0]);
        bottomPipe.setPosition([this.canvas.width , topPipeHeight + this.PIPE_SEPARATION]);
        bottomPipe.setBoundingBox([this.PIPE_WIDTH , ASSET_HEIGHT]);

        scoreBox.setVelocity([this.PIPE_SPEED , 0]);
        scoreBox.setPosition([this.canvas.width + this.PIPE_WIDTH , topPipeHeight + this.PIPE_SEPARATION - this.PIPE_SEPARATION / 2]);
        scoreBox.setBoundingBox([this.BIRD_WIDTH / 2 , this.BIRD_WIDTH / 2]);   // Just needs to be small

        this.pipes.push(topPipe);
        this.pipes.push(bottomPipe);
        this.pipes.push(scoreBox);
    }


    draw() {
        this.context.drawImage(this.backgroundImg , 0 , 0 , this.canvas.width , this.canvas.height);

        this.pipes.forEach(i => {
            i.draw();
        });
        this.bird.draw();
        this.ground.draw();

        this.drawScore();
    }


    drawBorderedText(text , xPos , yPos) {
        this.context.fillStyle = 'white';
        this.context.strokeStyle = 'black';

        this.context.fillText(text , xPos , yPos);
        this.context.strokeText(text , xPos , yPos);
    }


    drawScore() {
        this.context.fillStyle = 'black';

        if (this.score > 25) {
            this.drawBorderedText("Score: " + this.score , 10 , 50);
            this.drawBorderedText("Go to /rip-bplate.txt" , 10 , 100);
        }
        else if(!this.isGameOver) {
            // this.context.strokeText("Score: " + this.score , 10 , 50);
            this.drawBorderedText("Score: " + this.score , 10 , 50);
        }
        else {
            this.drawBorderedText("Game over! Score: " + this.score , 10 , 50);
            this.drawBorderedText("Refresh to retry" , 10 , 100);
        }
    }


    drawIntro() {
        this.context.drawImage(this.backgroundImg , 0 , 0 , this.canvas.width , this.canvas.height);
        this.bird.draw();
        this.ground.draw();
        this.context.fillStyle = 'black';
        this.drawBorderedText("Press space to jump" , 10 , 50);
    }
}


// PhysicalSprite Components


class Pipe extends PhysicalSprite {
    constructor(CONTEXT , IMAGE) {
        super(CONTEXT);

        this.image = IMAGE;
    }


    draw() {
        this.context.drawImage(this.image , this.pos[0] , this.pos[1] , this.boundingBox[0] , this.boundingBox[1]);
    }
}


// This is an invisible scorebox between the pipes that increases the score when hit
class ScoreBox extends PhysicalSprite {
    constructor(CONTEXT) {
        super(CONTEXT);
    }


    draw() {
        // Nothing, since it's invisible
    }
}


class Bird extends PhysicalSprite {
    constructor(CONTEXT , IMAGE) {
        super(CONTEXT);

        this.image = IMAGE;
    }

    draw() {
        this.context.drawImage(this.image , this.pos[0] , this.pos[1] , this.boundingBox[0] , this.boundingBox[1]);
    }


    jump(accel) {
        this.setVelocity([0, accel]);
    }
}


class Ground extends PhysicalSprite {
    constructor(CONTEXT) {
        super(CONTEXT);
    }


    draw() {
        this.context.fillStyle = 'green';
        this.context.fillRect(this.pos[0], this.pos[1], this.boundingBox[0], this.boundingBox[1]);
    }
}


class Roof extends PhysicalSprite {
    constructor(CONTEXT) {
        super(CONTEXT);
    }


    draw() {
        // Don't really have to do anything since it's invisible
    }
}
