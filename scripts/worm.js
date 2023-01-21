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
