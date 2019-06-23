var GameManagerUtils = (function(){
    var score = 0;
    var life = 5;
    var positions = ['0 0 -5', '5.5, 0, -7', '-4.5, 0, -6']
    return{
        addScore: function(){
            score+=1;
        },
        minusScore: function(){
            score-=1;
        },
        getScore: function(){
            return score;
        },
        addLife: function(){
            life+=1;
        },
        minusLife: function(){
            life-=1;
        },
        getLife: function(){
            return life;
        },
        getEnemySpeed: function(){
            return score/5+1
        },
        generateRandomNumber: function (min, max) {
            return Math.random() * max + min;
        },
        getVelocity: function(){
            v_x = (this.generateRandomNumber(0,1)<0.5? 1:-1)*this.generateRandomNumber(0, this.getScore()+1/2)
            v_y = 0;
            v_z = (this.generateRandomNumber(0,1)<0.5? 1:-1)*this.generateRandomNumber(0, this.getScore()+1/2)
            return{
                'x':v_x,
                'y':v_y,
                'z':v_z
            }
        }
    }
})()
AFRAME.registerComponent('game-manager', {
  init: function () {
    var sceneEl = this.el;
    this.time = 60;
    $("#score").setAttribute('text','value','Score '+GameManagerUtils.getScore())
    $("#life").setAttribute('text','value','Life '+GameManagerUtils.getLife())
    this.timer = setInterval(
        ()=>{
            $("#time").setAttribute('text', 'value', this.time);
            if(this.time>0){
                this.time -= 1;
            }else{
                $("#game-over").setAttribute('value', 'You Survive!');
                $("#game-over").setAttribute('visible', 'true');
                localStorage.setItem("score", GameManagerUtils.getScore());
                sceneEl.pause();
                clearInterval(this.timer);
                // 結束之後跳轉頁面（＠逸群）
                setTimeout(()=>{window.location.assign("gameover.html")},3000);
            }
        },
        1000);
    sceneEl.addEventListener('targetDestroyed', function(e) {
        console.log("targetDestroyed")
        // Add 1 to Score
        GameManagerUtils.addScore();
        $("#score").setAttribute('text','value','Score '+GameManagerUtils.getScore())
    });
    sceneEl.addEventListener('attacked', function(e){
        console.log("attacked");
        GameManagerUtils.minusLife();
        $("#life").setAttribute('text', 'value', 'Life '+ GameManagerUtils.getLife())
        $("#ground").setAttribute('color', 'red');
        setTimeout(
            ()=>{$("#ground").setAttribute('color', '#52430e');},
            1000)
        // Game Over
        if(GameManagerUtils.getLife()<=0){
            $("#game-over").setAttribute('visible', 'true');
            localStorage.setItem("score", 0);
            sceneEl.pause();
            // 結束之後跳轉頁面（＠逸群）
            setTimeout(()=>{window.location.assign("gameover.html")},3000);
            return;
        }
    })
  }
});
