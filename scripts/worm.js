var Worm = pc.createScript('Worm');

//Animations IDs 
const IDLE_STATE = 0;
const WALK_STATE = 1;
const JUMP_STATE = 2;
const TAKE_BAZOOKA_STATE = 3;
const SHOT_STATE = 4;
const ANIM_DURATION = 1.67;
const ANIM_SPEED_TRIPLE = 3.0;
const ANIM_SPEED_DOUBLE = 2.0;

// initialize code called once per entity
Worm.prototype.initialize = function() {
    this.setBazooka(true);
};

Worm.attributes.add('animTime', {
    type: 'number',
    default: 0.0
});

Worm.attributes.add('worm', {
    type: 'entity'
});

Worm.attributes.add('bazooka', {
    type: 'entity'
});

Worm.prototype.setBazooka = function(ok) {
    this.worm.anim.setBoolean("BazoookaIsTaken", ok);
    this.bazooka.anim.setBoolean("BazoookaIsTaken", ok);
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
    return this.worm.anim.getBoolean("BazookaIsTaken");
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
            console.error("IDLE STATE!");
            this.setAnimState(WALK_STATE);
        }
     
        let animDuration = ANIM_DURATION;
        if (this.isCurrentState("Walk") || this.isCurrentState("WalkBazooka")) {
            if (this.isCurrentState("Walk")) {
                animDuration /= ANIM_SPEED_TRIPLE; 
            }
            else {
                animDuration /= ANIM_SPEED_DOUBLE; 
            }
            if (this.animTime > animDuration) {
                this.animTime -= animDuration;
            }
            else if (this.animTime > animDuration / 2.0) {
                this.entity.translateLocal(0, 0, dt);
            } 
        }
    }

    if (this.app.keyboard.wasReleased(pc.KEY_UP) && (this.isCurrentState("Walk") || this.isCurrentState("WalkBazooka"))) {
        this.setAnimState(IDLE_STATE);
        console.error(this.worm.anim.getInteger("ActiveState"));
        console.error("KEY UP WAS RELEASED!");
    }

    if (this.app.keyboard.isPressed(pc.KEY_LEFT)) {
        this.entity.rotate(0, 50 * dt, 0); 
    }

    if (this.app.keyboard.isPressed(pc.KEY_RIGHT)) {
        this.entity.rotate(0, -50 * dt, 0); 
    }

    if (this.app.keyboard.wasReleased(pc.KEY_SPACE) && this.isBazookaTaken()) {
        this.setAnimState(SHOT_STATE);
    }

    if (this.app.keyboard.wasReleased(pc.KEY_1)) {
        console.error("SET BAZOOKA STATE");
        this.setAnimState(TAKE_BAZOOKA_STATE);
    }
};
