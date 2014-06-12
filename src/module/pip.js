/*=============================================================================
#     FileName: pip.js
#         Desc: 
#       Author: chenjd
#        Email: 609828261@qq.com
#     HomePage: http://www.xiaochen-gamer.com
#      Version: 0.0.1
#   LastChange: 2014-06-12 09:58:15
#      History:
=============================================================================*/

var GetRandomNum = function(Max, Min) {
    var Range = Max - Min; 
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
};

var logic = logic || {};
logic.pipMgr = cc.Layer.extend({
    _pipdowns: [],
    _pipups: [],

    ctor:function(){
        this._super();
        this._pipdowns = new Array();
        this._pipups = new Array();
        this._scoreNum = 0;//分数
        //显示分数
        this._score = cc.LabelTTF.create('', 'Arial', 70);
        this._score.setPosition(320, 800);
        this.addChild(this._score);
        //
        this.scheduleUpdate();
     },
    addBird:function(){
         var spriteFrames = [];
         for(var i = 0; i < 3; i++){
             var texture = cc.textureCache.addImage("res/b_1_" + i + ".png");
             var frame = cc.SpriteFrame.create(texture, cc.rect(0, 0, 34, 24));
             spriteFrames.push(frame);
         }
         this.sprite = cc.Sprite.create('res/b_1_0.png');
         this.sprite.setScale(2);
         this.sprite.setPosition(320, 600);
         var animation1 = cc.Animation.create(spriteFrames, 0.2);
         var animate = cc.Animate.create(animation1);
         this.sprite.runAction(cc.RepeatForever.create(animate));
         return this.sprite;
            },
    addPip:function(){
        var pipdown = cc.Sprite.create('res/finger.png');
        var pipup = cc.Sprite.create('res/finger.png');
        pipdown.setScaleY(-1);
        var posdown = GetRandomNum(750, 960);
        var posup = GetRandomNum(0, 240);
        pipdown.setPosition(640, posdown);
        pipup.setPosition(640, posup);
        var that = this;
        pipdown.runAction(cc.Sequence.create(cc.MoveBy.create(2, cc.p(-640, 0)), cc.CallFunc.create(function(){
            pipdown.removeFromParent();
        })));
        pipup.runAction(cc.Sequence.create(cc.MoveBy.create(2, cc.p(-640, 0)), cc.CallFunc.create(function(){
            pipup.removeFromParent();
        })));
        this._pipdowns.push(pipdown);
        this._pipups.push(pipup);
        var pips = [pipdown, pipup];
        return pips;
     },
    update:function(){
        if(this.sprite.getPosition().y < 240){
            audioEngine.playEffect(HURT_FILE);
            cc.director.getActionManager().pauseAllRunningActions();
            this.unscheduleUpdate();
            this.sprite.removeFromParent();
            this.game_over = cc.Sprite.create('res/ui_2.png');
            this.game_over.setScale(2);
            this.game_over.setPosition(320, 780);
            this.getParent().addChild(this.game_over);

            this.scoreBoard = cc.Sprite.create('res/ui_3.png');
            this.scoreBoard.setScale(2);
            this.scoreBoard.setPosition(320, 600);
            this.getParent().addChild(this.scoreBoard);
            var score = cc.LabelTTF.create(this._scoreNum, 'Arial', 20);
            score.setPosition(190, 80);
            this.scoreBoard.addChild(score);
            this._scoreNum > MAX_SCORE?MAX_SCORE = this._scoreNum:MAX_SCORE = MAX_SCORE;
            var maxScore = cc.LabelTTF.create(MAX_SCORE, 'Arial', 20);
            maxScore.setPosition(190, 40);
            this.scoreBoard.addChild(maxScore);
            this.getParent()._gameStatus = GAME_END;
        };
        if(this._pipdowns[0] !== undefined){
            for(var x in this._pipdowns){
                if(this._pipdowns[x].getPosition().x > 200 - 73/2 && this._pipdowns[x].getPosition().x < 200){
                    this._scoreNum++;
                    this._score.setString(this._scoreNum);
                    if(this.sprite.getPosition().y > this._pipdowns[x].getPosition().y - 490/2 || this.sprite.getPosition().y < this._pipups[x].getPosition().y + 500/2){
                        audioEngine.playEffect(HURT_FILE);
                        this.sprite.removeFromParent();
                        cc.director.getActionManager().pauseAllRunningActions();
                        this.unscheduleUpdate();
                        this.game_over = cc.Sprite.create('res/ui_2.png');
                        this.game_over.setScale(2);
                        this.game_over.setPosition(320, 780);
                        this.getParent().addChild(this.game_over);

                        this.scoreBoard = cc.Sprite.create('res/ui_3.png');
                        this.scoreBoard.setScale(2);
                        this.scoreBoard.setPosition(320, 600);
                        this.getParent().addChild(this.scoreBoard);
                        var score = cc.LabelTTF.create(this._scoreNum, 'Arial', 20);
                        score.setPosition(190, 80);
                        this.scoreBoard.addChild(score);
                        this._scoreNum > MAX_SCORE?MAX_SCORE = this._scoreNum:MAX_SCORE = MAX_SCORE;
                        var maxScore = cc.LabelTTF.create(MAX_SCORE, 'Arial', 20);
                        maxScore.setPosition(190, 40);
                        this.scoreBoard.addChild(maxScore);
                        this.getParent()._gameStatus = GAME_END;
                        /*this.getParent().unscheduleUpdate();*/
                    }
                    this._pipdowns.shift();
                    this._pipups.shift();
                }
            }
        }
    }

});
