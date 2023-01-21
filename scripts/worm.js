var Worm = pc.createScript('Worm');

//Animations IDs 
const IDLE_STATE = 0;
const WALK_STATE = 1;
const WALK_BAZOOKA_STATE = 2;
const TAKE_BAZOOKA_STATE = 3;
const SHOT_BAZOOKA_STATE = 4;
const JUMP_STATE = 5;
const FLY_STATE = 6;

const ANIM_DURATION = 1.67;
const ANIM_SPEED_TRIPLE = 3.0;
const ANIM_SPEED_DOUBLE = 2.0;

const NO_WEAPON = 0;
const BAZOOKA_WEAPON = 1;

const SHOT_Y = 10;
const SHOT_POWER = 14;

// initialize code called once per entity
Worm.prototype.initialize = function() {
    this.setBazooka(false);
};

Worm.attributes.add('animTime', {
    type: 'number',
    default: 0.0
});

Worm.attributes.add('weapon', {
    type: 'number',
    default: NO_WEAPON
});

Worm.attributes.add('worm', {
    type: 'entity'
});

Worm.attributes.add('bazooka', {
    type: 'entity'
});

Worm.attributes.add('ball', {
    type: 'entity'
});

Worm.prototype.setBazooka = function(ok) {
    if (ok) {
        this.weapon = BAZOOKA_WEAPON;
    }
    else {
        this.weapon = NO_WEAPON;
    }
    this.entity.findByName("Bazooka").enabled = ok;
    this.entity.findByName("LeftHand").enabled = ok;
    this.entity.findByName("RightHand").enabled = ok;
};

Worm.prototype.setAnimState = function(state) {
    this.animTime = 0.0;
    this.worm.anim.setInteger("ActiveState", state);
    this.bazooka.anim.setInteger("ActiveState", state);
};

Worm.prototype.isCurrentState = function(state) {
    return this.worm.anim.baseLayer.activeState == state;
};

Worm.prototype.isBazookaTaken = function() {
    return this.weapon === BAZOOKA_WEAPON;
};

Worm.prototype.spawnBall = function() {
    var newBall = this.ball.clone();
    
    newBall.enabled = true;

    let bazookaModels = this.entity.findByTag("SpawnBallPosition");   
    if (bazookaModels.length != 1) {
        console.error("Bazooka model is not equal to 1. Failed to spawn ball.");
        return;
    }
    else {
        let wormRotation = this.entity.getRotation();
        newBall.rigidbody.teleport(bazookaModels[0].getPosition(), wormRotation);

        let impulse = new pc.Vec3(0, 0, 0);
        impulse.copy(newBall.forward).scale(SHOT_POWER);
        impulse.y += SHOT_Y;
        impulse.z *= -1;
        impulse.x *= -1;

        //console.error(impulse);
        newBall.rigidbody.applyImpulse(impulse);
        this.app.root.addChild(newBall);
    }
};

// update code called every frame
Worm.prototype.update = function(dt) {
    this.animTime += dt;
    if (this.isCurrentState('Shot') || this.isCurrentState('TakeBazooka')) {
        this.setBazooka(true);
        if (this.animTime > ANIM_DURATION / ANIM_SPEED_DOUBLE) {
            this.setAnimState(IDLE_STATE);
        }  
    }

    if (this.app.keyboard.isPressed(pc.KEY_UP)) {
        if (this.isCurrentState("Idle")) {
            if (this.isBazookaTaken()) {
                this.setAnimState(WALK_BAZOOKA_STATE);
            }
            else {
                this.setAnimState(WALK_STATE);
            }
        }
     
        let animDuration = ANIM_DURATION;
        if (this.isCurrentState("Walk") || this.isCurrentState("WalkBazooka")) {
            let animSpeed = ANIM_SPEED_TRIPLE;
            if (this.isCurrentState("WalkBazooka")) {
                animSpeed = ANIM_SPEED_DOUBLE;
            }

            animDuration /= animSpeed;
            if (this.animTime > animDuration) {
                this.animTime -= animDuration;
            }
            else if (this.animTime > animDuration / 2.0) {
                this.entity.translateLocal(0, 0, dt * animSpeed);
            } 
        }
    }

    if (this.app.keyboard.wasReleased(pc.KEY_UP) && (this.isCurrentState("Walk") || this.isCurrentState("WalkBazooka"))) {
        this.setAnimState(IDLE_STATE);
    }

    if (this.app.keyboard.isPressed(pc.KEY_LEFT)) {
        this.entity.rotate(0, 50 * dt, 0); 
    }

    if (this.app.keyboard.isPressed(pc.KEY_RIGHT)) {
        this.entity.rotate(0, -50 * dt, 0); 
    }

    if (this.app.keyboard.wasReleased(pc.KEY_SPACE) && this.isBazookaTaken()) {
        this.setAnimState(SHOT_BAZOOKA_STATE);
        this.spawnBall();
    }

    if (this.app.keyboard.wasReleased(pc.KEY_1)) {
        if (this.isBazookaTaken()) {
            this.setBazooka(false);
            this.setAnimState(IDLE_STATE);
        }
        else {
            this.setAnimState(TAKE_BAZOOKA_STATE);
        }
    }
};
