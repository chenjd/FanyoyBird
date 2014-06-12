/*=============================================================================
#     FileName: begin.js
#         Desc: 
#       Author: chenjd
#        Email: 609828261@qq.com
#     HomePage: http://www.xiaochen-gamer.com
#      Version: 0.0.1
#   LastChange: 2014-06-12 09:58:27
#      History:
=============================================================================*/
//游戏状态
GAME_BEGIN = 1;
GAME_RUN = 2;
GAME_END = 3;
//最高分数
MAX_SCORE = 0;
var MUSIC_FILE = 'res/battle1.mp3';
var FLAP_FILE = 'res/flap.wav';
var HURT_FILE = 'res/hurt.wav';
var audioEngine = cc.audioEngine;
audioEngine.playMusic(MUSIC_FILE, true);

var beginLayer = cc.Layer.extend({
    ctor:function(){
         this._super();
     },
    init:function(){
         this._super();
         this._gameStatus = GAME_BEGIN;
         var bg = cc.Sprite.create('res/map_0.png');
         bg.setScale(2.3);
         bg.setPosition(320, 500);
         this.addChild(bg);
         this.fence = cc.Sprite.create('res/map_2.png');
         this.fence.setScale(2);
         this.fence.setPosition(320, 100);
         this.addChild(this.fence);
         this._times = 320;
         this.scheduleUpdate();
         this.text = cc.LabelTTF.create('泛游小鸟', 'Arial', 100);
         this.text.enableStroke(cc.color(0, 0, 0), 2, 1);
         this.text.setPosition(320, 700);
         this.addChild(this.text);
         //name
         this.name = cc.LabelTTF.create('by @慕容小匹夫', 'Arial', 40);
         this.name.enableStroke(cc.color(0, 0, 0), 2, 1);
         this.name.setPosition(320, 500);
         this.addChild(this.name);
         this.pipMgr = new logic.pipMgr();
         this.addChild(this.pipMgr);
         this.sprite = this.pipMgr.addBird();
         this.addChild(this.sprite);

         this.startBtn = cc.MenuItemImage.create('res/ui_5.png', 'res/ui_5.png', function(){
             cc.log('start');
             this.name.removeFromParent();
             this.text.removeFromParent();
             this.menu.removeFromParent();
             this.sprite.setPosition(200, 480);
             this.tap = cc.Sprite.create('res/ui_0.png');
             this.tap.setPosition(320, 480);
             this.tap.setScale(2);
             this.addChild(this.tap);
             var that = this;
             this._listener = cc.EventListener.create({
                 event: cc.EventListener.TOUCH_ONE_BY_ONE,
                 swallowTouches: false,
                 onTouchBegan : function(touch, event) {
                    audioEngine.playEffect(FLAP_FILE);
                     if(that._gameStatus === GAME_BEGIN){
                         that._gameStatus = GAME_RUN;
                         that.tap.removeFromParent();
                     }
                     return true;
                 },

                 onTouchMoved: function(touch, event){
                     return true;
                 },

                 onTouchEnded: function (touch, event) {
                     that._birdDown = false;
                     cc.director.getActionManager().removeAction(that.act1);
                     that.sprite.runAction(cc.Sequence.create(cc.Spawn.create(cc.MoveBy.create(0.1, cc.p(0, 40)), cc.RotateBy.create(0.1, -5)),cc.RotateBy.create(0, 5)));
                     that.sprite.setRotation(0);
                     that.scheduleOnce(function(){
                         that._birdDown = true;
                     },0.2);
                     return true;
                 }
            });
             this.setUserObject(this._listener);
             cc.eventManager.addListener(this._listener, this);
         },this);
         this.rateBtn = cc.MenuItemImage.create('res/ui_6.png', 'res/ui_6.png', function(){
             cc.log('rate');
         },this);
         this.rateBtn.setPosition(320, 0);
         this.menu = cc.Menu.create(this.startBtn, this.rateBtn);
         this.startBtn.setScale(2);
         this.rateBtn.setScale(2);
         this.menu.setPosition(160, 300);
         this.addChild(this.menu);
         this._birdDown = true;
         this.pipCount = 0;//count 等于60时创建一个管道
     },

    update:function(){
         this._times -= 5;
         if(this._times < 300){
             this._times = 320;
         }
         this.fence.setPosition(this._times, 100);
         cc.log('this._gameStatus' + this._gameStatus);
         switch(this._gameStatus){
             case GAME_BEGIN:
                 cc.log('game begin');
                 break;
             case GAME_RUN:
                 cc.log('game run');
                 if(this._birdDown){
                     this._birdDown = false;
                     var distance = this.sprite.getPosition().y - 230;//鸟掉到地面的距离
                     this.act1 = cc.Sequence.create(cc.Spawn.create(cc.MoveBy.create(2, cc.p(0, -distance)), cc.RotateBy.create(2, 5)), cc.CallFunc.create(function(){
                         this._birdDown = true;
                     }));
                     this.act1.retain();
                     this.sprite.runAction(this.act1);
                     if(this.sprite.getRotation() < -10){
                         this.sprite.setRotation(-10);
                     }
                 };
                 this.pipCount++;
                 if(this.pipCount === 40){
                     var pips = this.pipMgr.addPip();
                     this.addChild(pips[0]);
                     this.addChild(pips[1]);
                     this.pipCount = 0;
                 }
                 break;
             case GAME_END:
                 this.unscheduleUpdate();
                 this.startBtn = cc.MenuItemImage.create('res/ui_5.png', 'res/ui_5.png', function(){
                     var scene = new beginScene();
                     cc.director.runScene(scene);
                 },this);
                 this.rateBtn = cc.MenuItemImage.create('res/ui_6.png', 'res/ui_6.png', function(){
                     cc.log('rate');
                 },this);
                 this.rateBtn.setPosition(320, 0);
                 this.menu = cc.Menu.create(this.startBtn, this.rateBtn);
                 this.startBtn.setScale(2);
                 this.rateBtn.setScale(2);
                 this.menu.setPosition(160, 300);
                 this.addChild(this.menu);
                 break;
         }
    }
});
var beginScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new beginLayer();
        layer.init();
        this.addChild(layer);
    }
});
