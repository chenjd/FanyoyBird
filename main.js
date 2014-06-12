cc.game.onStart = function(){
    cc.view.setDesignResolutionSize(640, 960, cc.ResolutionPolicy.SHOW_ALL);
	cc.view.resizeWithBrowserSize(true);
    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        /*cc.director.runScene(new HelloWorldScene());*/
        cc.director.runScene(new beginScene());
    }, this);
};
cc.game.run();
