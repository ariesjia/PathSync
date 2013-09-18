/**
 * Created with IntelliJ IDEA.
 * User: areschen
 * Date: 13-8-14
 * Time: 上午9:46
 * To change this template use File | Settings | File Templates.
 */
define(function(require , exports, module){

        "use strict";

        var $ = require('zepto'),
            Q = require('quark');

        var ns = Q.use('plane'),
            Plane = ns.Plane = function(){
                var props = ns.R.player;
                Plane.superClass.constructor.call(this, props);
                this.oneat = props.oneat;
            }

        Q.inherit(Plane, Q.MovieClip);
        var dex= 0,
            dey = 0,
            start = function(e){

                if(e.clientX){
                    dex = e.eventX - this.x;
                    dey = e.eventY - this.y;
                }else{
                    dex = e.touches[0].eventX - this.x;
                    dey = e.touches[0].eventY - this.y;
                }


                this.addEventListener(ns.game.events[2], function(e){
                    move.call(this,e);
                });

                if(typeof userSelect === "string"){
                    return document.documentElement.style[userSelect] = "none";
                }
                document.unselectable  = "on";
                document.onselectstart = function(){return false;}

            },
            move = function(e){
                var x = 0;
                var y = 0;

                if(e.clientX){
                    x = e.eventX  - dex;
                    y = e.eventY  - dey;
                }else{
                    x = e.touches[0].eventX  - dex;
                    y = e.touches[0].eventY  - dey;
                }

                if(x<this.width/2){
                    x = this.width/2;
                }else if( x >= ns.game.with - this.width/2){
                    x = ns.game.width - this.width/2;
                }

        //if(y<this.height/2){
        //    y = this.height/2;
        //}else if(y>ns.game.height-this.height/2){
        //    y = ns.game.height  - this.height/2;
        //}

        this.x = x;
        this.y = y;
    },
    stop = function(e){

        dex = 0 ;
        dey = 0 ;

        this.removeEventListener(ns.game.events[2]);
        $(document).unbind("mousemove",this._fM).unbind("mouseup",this._fS);
        if(typeof userSelect === "string"){
            return document.documentElement.style[userSelect] = "text";
        }
        document.unselectable  = "off";
        document.onselectstart = null;

    };
Plane.prototype.init = function(){
    var self = this;
    this.addEventListener(ns.game.events[0], function(e){
        start.call(self,e);
    });
    this.addEventListener(ns.game.events[1], function(e){
        stop.call(self,e);
    });
}

Plane.prototype.shoot = function(){


}

Plane.prototype.update = function(){}

module.exports = Plane;

});