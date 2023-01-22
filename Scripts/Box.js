var Box = pc.createScript('Box');

Box.attributes.add('score', {
    type: 'number',
    default: 0
});

// initialize code called once per entity
Box.prototype.initialize = function() {
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
};

Box.prototype.getRandom = function(min, max) {
    return Math.random() * (max - min) + min;
};

// update code called every frame
Box.prototype.update = function(dt) {
};

Box.prototype.onTriggerEnter = function(otherEntity) {
    otherEntity.destroy();
    let newX = this.getRandom(-5, 5);
    let newY = this.getRandom(-3, 0.2);
    let newZ = this.getRandom(7, 12);
    let translationX = newX - this.entity.getPosition().x;
    let translationY = newY - this.entity.getPosition().y;
    let translationZ = newZ - this.entity.getPosition().z;
    
    var walls = this.entity.findByTag("Wall");
    this.entity.setPosition(newX, newY, newZ);
    for (var i = 0; i < walls.length; i++) {
        let position = walls[i].getPosition();
        walls[i].rigidbody.teleport(position.x, position.y, position.z);
    }
    this.score += 1;
    this.app.root.findByName("TextScore").element.text = this.score;
};
