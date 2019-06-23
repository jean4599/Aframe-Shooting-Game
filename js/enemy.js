/**
 * Enemy
 */
AFRAME.registerComponent('enemy', {
    init: function () {
        this.tweenAppear = null;      // Tween for appearing animation.
        this.target = this.el.sceneEl.querySelector('#shooter');
        this.sleep = 0;
        // Save hidingPos (default position on the Supercraft site).
        this.hidingPos = this.el.object3D.position;
        this.el.addEventListener('die', this.die.bind(this));
        this.el.addEventListener('body-loaded', this.appear.bind(this));
        this.targetVector = new THREE.Vector3( 0, 1, 0 );
    },
    tick: function(t, dt) {
        if(this.isrunning){
            var currentPosition = this.el.object3D.position;
            // this.target.object3D.getWorldPosition(this.targetVector)
            // console.log(this.targetVector)
            // this.targetVector.setZ(this.target.object3D.getWorldPosition.z+4);
            this.targetVector.copy(this.target.object3D.position).setZ(this.target.object3D.position.z+4);
            var distanceToTarget = currentPosition.distanceTo(this.targetVector);
            console.log(distanceToTarget)
            if (distanceToTarget < 1.5) {
                if(this.sleep === 0){
                    this.attack();
                    this.sleep = 150;
                }
                this.sleep-=1;
                return
            };
            // var targetPos = this.el.object3D.worldToLocal(this.target.object3D.getWorldPosition())
            var targetPos = this.el.object3D.worldToLocal(this.target.object3D.position.clone())
            var distance = dt*1/2000*GameManagerUtils.getEnemySpeed();  
            this.el.object3D.translateOnAxis(targetPos, distance);
            this.el.object3D.position.y = 0;
            this.el.object3D.lookAt(0, 0, 0)
            this.el.object3D.rotateY(Math.PI);
            this.el.components['dynamic-body'].syncToPhysics()
        }
    },
    appear: function(){
        // Create tweens if not created yet.
        if (this.tweenAppear === null) {
        // Depending the type of enemy, the further it is, the higher it has to rise.
        lift = 1;
        this.tweenAppear = new TWEEN.Tween(this.el.object3D.position)
            .to({y: 0}, 1000)
            .easing(TWEEN.Easing.Elastic.Out)
            .onComplete(this.endAppear.bind(this));
        }
        setTimeout(() => {
            this.tweenAppear.start();
        }, GameManagerUtils.generateRandomNumber(3000, 6000));
    },
    /**
     * Handle appearance animation finished.
     */
    endAppear: function () {
        this.vulnerable = true;
        // We can start the disappear tween right away because it has a delay and it will hold a
        // sec.
        this.run();
    },
    die:function(){
        this.el.emit("targetDestroyed")
        this.hide();
    },
    hide: function(){
        this.isrunning = false;
        this.el.object3D.position.set(0, -1, 0);
        this.el.components['dynamic-body'].syncToPhysics();
        this.appear();
    },
    run: function(){
        this.isrunning = true;
    },
    attack: function(){
        this.el.emit("attacked");
    }
});