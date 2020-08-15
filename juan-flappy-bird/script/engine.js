/* -------------------------
 * PhysicalSprite Class
 * -------------------------
 *
 * Manages a single entity called a "sprite"
 * "Physical" because you can set physical properties, such as acceleration or velocity.
 * Sprites are smaller images/entities that are integrated into a larger context.
 * 
 * These sprites can move and detect collisions between them.
 * 
 * -------------------------
 * Creating your own PhysicalSprite
 * -------------------------
 * 
 * You MUST define draw() in your subclass. In general, PhysicalSprite takes care of 
 * everything else so it's not recommended to overload anything.
 */
class PhysicalSprite {
    /* 
     * CONTEXT- a 2d context from an HTML Canvas element
     */
    constructor(CONTEXT) {
        this.context = CONTEXT;
        
        this.pos = [0 , 0];
        this.vel = [0 , 0];
        this.accel = [0 , 0];
        this.isCollidable = true;
    }


    /*
     * IS_COLLIDABLE- boolean that determines if the Sprite object can collide with anything
     */
    setCollidable(IS_COLLIDABLE) {
        this.isCollidable = IS_COLLIDABLE;
    }


    /*
     * POS- an integer array [xCoordinate , yCoordinate] that is the new position of the PhysicalSprite
     * 
     * Note: 
     *      The position of the sprite is its upper left corner.
     *      (0 , 0) is the upper left corner of the Canvas.
     */
    setPosition(POS) {
        this.pos = POS;
    }


    /*
     * VEL- an array [xVelocity , yVelocity] that is the new velocity of the PhysicalSprite
     */
    setVelocity(VEL) {
        this.vel = VEL;
    }


    /*
     * ACCEL- an array [xAcceleration , yAcceleration] that is the new velocity of the PhysicalSprite
     */
    setAcceleration(ACCEL) {
        this.accel = ACCEL;
    }


    /*
     * Updates velocity and acceleration in both axes using kinematics
     */
    updateKinematics(dt) {
        this.pos[0] += (this.accel[0] / 2) * Math.pow(dt , 2) + this.vel[0] * dt;
        this.vel[0] += this.accel[0] * dt;

        this.pos[1] += (this.accel[1] / 2) * Math.pow(dt , 2) + this.vel[1] * dt;
        this.vel[1] += this.accel[1] * dt;
    }


    /*
     * BOUNDING_BOX- an integer array [width , height] that serves as the dimensions of the bounding box
     */
    setBoundingBox(BOUNDING_BOX) {
        this.boundingBox = BOUNDING_BOX;
    }


    /*
     * Helper function for collision detection
     */
    collisionCheck(SPRITE) {
        // Check for collidability 
        if(!this.isCollidable || !SPRITE.isCollidable) {
            return false;
        }


        // Check each corner of SPRITE.boundingBox and see if they're within our bounding box
        let spriteCorners = [ 
            [SPRITE.pos[0] , SPRITE.pos[1]] ,
            [SPRITE.pos[0] + SPRITE.boundingBox[0] , SPRITE.pos[1]] ,
            [SPRITE.pos[0] , SPRITE.pos[1] + SPRITE.boundingBox[1]] ,
            [SPRITE.pos[0] + SPRITE.boundingBox[0] , SPRITE.pos[1] + SPRITE.boundingBox[1]]
        ];

        let collides = false;

        spriteCorners.forEach(coordinate => {
            if(coordinate[0] >= this.pos[0] && coordinate[0] <= this.pos[0] + this.boundingBox[0] &&
               coordinate[1] >= this.pos[1] && coordinate[1] <= this.pos[1] + this.boundingBox[1]) {

                collides = true;
            }
        });

        return collides;
    }


    /*
     * Determines if this Sprite object collides with another Sprite object
     *
     * returns True if they collide, False otherwise
     */
    collidesWith(SPRITE) {
        return this.collisionCheck(SPRITE) || SPRITE.collisionCheck(this);
    }
}