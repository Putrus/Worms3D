var Ball = pc.createScript('ball');

Ball.attributes.add('toDestroy', {
    type: 'boolean',
    default: false
});

Ball.attributes.add('destroyDuration', {
    type: 'number',
    default: 2.0
});

Ball.attributes.add('timeAfterCollision', {
    type: 'number',
    default: 0.0
});

// initialize code called once per entity
Ball.prototype.initialize = function() {
    
};

// update code called every frame
Ball.prototype.update = function(dt) {
    
};
