var Worm = pc.createScript('worm');

// initialize code called once per entity
Worm.prototype.initialize = function() {};

// update code called every frame
Worm.prototype.update = function(dt) {
    if (this.entity.findByName("Worm").anim.baseLayer.activeState !== 'Take') {
        this.entity.findByName("DupaSalata").anim.setBoolean("take", false);
        this.entity.findByName("Worm").anim.setBoolean("take", false);
    }
    if (this.app.keyboard.isPressed(pc.KEY_LEFT)) {
        this.entity.rotate(0, 50 * dt, 0); 
    }

    if (this.app.keyboard.isPressed(pc.KEY_RIGHT)) {
        this.entity.rotate(0, -50 * dt, 0); 
    }

    if (this.app.keyboard.isPressed(pc.KEY_UP)) {
        if (this.entity.findByName("Worm").anim.baseLayer.activeState === 'Idle') {
            this.entity.findByName("Worm").anim.setBoolean("walk", true);
            this.entity.findByName("DupaSalata").anim.setBoolean("walk", true);
            this.counter = 0.0;
        }
        if (this.entity.findByName("Worm").anim.baseLayer.activeState === 'Walk') {
            this.counter += dt;
            if (this.counter > 0.835) {
                this.counter -= 0.835;
            }
            else if(this.counter > 0.4175) {
                this.entity.translateLocal(0, 0, dt);
            } 
        }
        return;
    }

    if (this.app.keyboard.wasReleased(pc.KEY_UP) && this.entity.findByName("Worm").anim.baseLayer.activeState === 'Walk') {
        this.entity.findByName("Worm").anim.setBoolean("walk", false);
        this.entity.findByName("DupaSalata").anim.setBoolean("walk", false);
    }

    if (this.app.keyboard.wasReleased(pc.KEY_SPACE)) {
        this.entity.findByName("DupaSalata").anim.setBoolean("take", true);
        this.entity.findByName("Worm").anim.setBoolean("take", true);
        this.entity.findByName("DupaSalata").enabled = 1;
        this.entity.findByName("LeftHand").enabled = 1;
        this.entity.findByName("RightHand").enabled = 1;
    }  
};
