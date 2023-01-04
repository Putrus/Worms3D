var Worm = pc.createScript('worm');

Worm.attributes.add('counter', {
    type: 'number',
    default: 0.0
});

// initialize code called once per entity
Worm.prototype.initialize = function() {};

// update code called every frame
Worm.prototype.update = function(dt) {
    if (this.app.keyboard.isPressed(pc.KEY_DOWN) && this.entity.anim.baseLayer.activeState !== 'idle') {
        this.entity.anim.setBoolean("walk", false);
    }

    if (this.app.keyboard.isPressed(pc.KEY_UP) && this.entity.anim.baseLayer.activeState === 'idle') {
        this.entity.anim.setBoolean("walk", true);
        this.counter = 0.0;
    }

    if (this.app.keyboard.isPressed(pc.KEY_LEFT)) {
        this.entity.rotate(0, 50 * dt, 0); 
    }

    if (this.app.keyboard.isPressed(pc.KEY_RIGHT)) {
        this.entity.rotate(0, -50 * dt, 0); 
    }

    if (this.entity.anim.baseLayer.activeState === 'walk') {
        this.counter += dt;
        if (this.counter > 0.835) {
            this.counter -= 0.835;
        }
        else if(this.counter > 0.4175)
        {
            this.entity.translateLocal(0, 0, dt);
        } 
    }
};
