/* global Phaser */
/* global Akutonet */
(function(){

    const $stage = document.getElementById("bg");
    const w = "100%";
    const h = "100%";
    const game = new Phaser.Game(w, h, Phaser.AUTO, $stage, {
      init: function() {
        // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        this.scale.parentIsWindow = true;
        
        // game.stage.disableVisibilityChange = true;
        
        // this.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
        this.stage.backgroundColor = "#81D6A7";
      },
      preload: function() {
        
      },
      create: function() {

        for (var vert=3,vert_max=7; vert<vert_max; vert++) {
          var p = [];
          var angle360 = 360 / vert;
          for (var i=0, i_max=vert; i<i_max; i++) {
            var radian = angle360 * i * Math.PI / 180;
            var cos_A = Math.cos(radian);
            var sin_A = Math.sin(radian);
            var x = cos_A * 10;
            var y = sin_A * 10;
            p.push(new Phaser.Point(x,y));
          }
          p.push(p[0]);
          
          var poly = new Phaser.Polygon();
          poly.setTo(p);
  
          var graphics = game.add.graphics(0, 0);
          
          // graphics.beginFill(0x07B77);
          // graphics.beginFill(0xffffff);
          graphics.lineStyle(2, 0xffffff, 1);
          graphics.drawPolygon(poly.points);
          graphics.endFill();
          
          // var sprite = this.add.sprite(100, 100, graphics.generateTexture());
          // sprite.anchor.set(0.5);
          // this.sprite = sprite;
          
          var emitter = this.add.emitter(this.world.centerX, -32, 20);
          emitter.makeParticles(graphics.generateTexture());
          emitter.setYSpeed(50,60);
          emitter.setXSpeed(-50,-60);
          emitter.width = game.world.width * 2;
          emitter.gravity = 1;
          if (vert === 3) {
            emitter.setRotation(180,180);
          } else {
            emitter.setRotation(360,360);
          }
          
          emitter.start(false, 20*1000, 1000);
          
          graphics.destroy();
        }
        
        var g = this;
        // var resize_first_flag = false;
        const layers = [
          { color: "0x007B77", first: true, sprite:[], resize:false, time:  8 },
          { color: "0x1D9582", first: true, sprite:[], resize:false, time: 16 },
          { color: "0x4DB392", first: true, sprite:[], resize:false, time: 32 },
          { color: "0x68C49C", first: true, sprite:[], resize:false, time: 64 }
        ];
        for (var layer_i=0; layer_i<layers.length; layer_i++) {
          (function(){
            var layer = layers[layers.length - 1 - layer_i];
            layer.index = layer_i;
            (function _L(){
              var p = [];
              const ly = g.world.height;
              const lx = g.world.width;
              const lly = ly/3*2 + ly/3/layers.length * layer.index;
              p.push(new Phaser.Point(lx,lly));
              p.push(new Phaser.Point(lx,ly));
              p.push(new Phaser.Point(0,ly));
              // if (layer.resize) {
              //   p.push(new Phaser.Point(0,ly));
              //   layer.resize = false;
              // }else{
                p.push(new Phaser.Point(0,lly));
              // }
              const wave = ~~(lx/80);
              const aa = ly/3/layers.length;
              for(var wi=1; wi<wave; wi++) {
                const f = g.rnd.integerInRange(-aa/2,aa/2);
                p.push(new Phaser.Point(lx/wave*wi,lly+f));
              }

              const poly = new Phaser.Polygon();
              poly.setTo(p);
              const graphics = game.add.graphics(0,0);
              graphics.beginFill(layer.color);
              graphics.drawPolygon(poly.points);
              graphics.endFill();
              const sprite = game.add.sprite(0,0, graphics.generateTexture());
              sprite.anchor.set(0,1);
              sprite.x = layer.first ? 0 : lx;
              sprite.y = ly;
              
              const tween1 = g.add.tween(sprite).to({x:0},layer.first ? 10 : layer.time*1000);
              tween1.onComplete.add(_L, g);
              const tween2 = g.add.tween(sprite).to({ x: -lx },layer.time*1000);
              tween2.onComplete.add(function(){ sprite.destroy(); },g);
              tween1.chain(tween2);
              tween1.start();
              layer.first = false;
              // layer.sprite.push(sprite);
              graphics.destroy();
            })();
          })();
        }
        
        // this.game.scale.setResizeCallback(function(){
        //   if (!!!resize_first_flag) {
        //     resize_first_flag = true;
        //     return;
        //   }
        //   for (var i=0,i_max=layers.length; i<i_max; i++) {
        //     layers[i].resize = true;
        //     for (var c=0,c_max=layers[i].sprite.length; c<c_max; c++) {
        //       layers[i].sprite[c].y = 0;
        //     }
        //   }
        // }, game);
        
        // var timer = this.time.create(true);
        // timer.loop(2000, function(){
        //   console.log(this.input.mousePointer.x);
        // },this);
        // timer.start();
      },
      update: function() {}
    });

})();