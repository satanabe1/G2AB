
function printProperties(obj) {
    var properties = '';
    for (var prop in obj){
        properties += prop + " = " + obj[prop] + "\n";
    }
    alert(properties);
}

//$(window).load(function(){
jQuery.event.add(window, "load", function(){

    var g2ab = {
        dump:function(){ console.dir(this); },

LoadingCanvas :
    function(parentDdid){
        this.pddid = parentDdid;
        this.loadingType;
        this.size;
        this.color = [];

        this.setType = function(type){
            this.loadingType = 'type' + type;
        }

        this.setSize = function(size){
            this.size = size;
            var canvas = this.getCanvas();
            canvas.width = size;
            canvas.height = size;
        }

        this.setColor = function(){
            if(arguments.length == 3){
                this.color[0] = arguments[0] ;
                this.color[1] = arguments[1] ;
                this.color[2] = arguments[2] ;
            }else if(arguments.length == 1){
                var start = arguments[0].indexOf('(') + 1;
                var end = arguments[0].indexOf(')');
                this.color = arguments[0].substr(start , end - start).split(',');
            }else{
                console.error('setColor : ' + arguments);
                console.dir(arguments);
            }
        }

        this.getType = function(){
            return this.loadingType;
        }

        this.getCanvas = function(){
            return $('canvas.' + this.pddid).get(0);
        }

        this.start = function(){
            var ldcanvas = this;
            var type = this.getType();
            if(g2ab.animation[type.toString()]){
                this.loadingTimer = setInterval(function(){ g2ab.animation[type.toString()](ldcanvas) }, 50);
            }else{
                console.error("unimplemented:" + type.toString());
            }
        }

        this.stop = function(){
            clearInterval(this.loadingTimer);
        }

        $('<canvas />').addClass(parentDdid).appendTo($('div.' + parentDdid));
        this.setType(1);
        this.setSize(30);
        this.setColor(0,100,255);
    },
animation: {
               type1:function(ldcanvas){
                         var r = ldcanvas.size / 2;
                         var w = Math.round(ldcanvas.size * 0.1);
                         var h = Math.round(ldcanvas.size * 0.25);
                         var color = ldcanvas.color;
                         var count = 12;
                         var context = ldcanvas.getCanvas().getContext('2d');

                         if(!ldcanvas.alphas){
                             ldcanvas.alphas = [];
                         }

                         context.setTransform(1,0,0,1,r,r);
                         context.clearRect(-r, -r, (r*2), (r*2));

                         for(var i = 0; i < count; i++){
                             if(ldcanvas.alphas.length < count){
                                 ldcanvas.alphas.push(i / count);
                             }

                             context.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + ldcanvas.alphas[i] + ')';//)
                             context.strokeStyle = 'transparent';
                             context.beginPath();

                             context.moveTo((0-w/4), (r-h));
                             context.quadraticCurveTo(0, (r-h-w/2),(0+w/4),(r-h));
                             context.lineTo((0+w/2), (r-w/3));
                             context.quadraticCurveTo(0, (r+w/3), (0-w/2),(r-w/3));
                             context.closePath();
                             context.fill();
                             context.stroke();

                             context.rotate((360/count) * Math.PI / 180);
                         }

                         ldcanvas.alphas.splice(0,0,ldcanvas.alphas[count-1]).pop();
                     },
               type2:function(ldcanvas){
                         var canvas = ldcanvas.getCanvas();
                         var context = canvas.getContext('2d');
                         var color = ldcanvas.color;
                         var count = 12;

                         canvas.width = ldcanvas.size;
                         canvas.height = ldcanvas.size / 2;

                         var ty = canvas.height * 0.45;
                         var by = canvas.height * 0.55;
                         var dx = canvas.width / count;
                         var xposit = 0;

                         if(!ldcanvas.alphas){
                             ldcanvas.alphas = [];
                         }

                         context.clearRect(0, 0, canvas.width, canvas.height);

                         for(var i=0; i<count;i++){
                             if(ldcanvas.alphas.length < count){
                                 ldcanvas.alphas.push(i/count/2);
                             }

                             context.fillStyle = 'rgba('+color[0]+','+color[1]+','+color[2]+','+ldcanvas.alphas[i]+')';//)
                             context.strokeStyle = 'transparent';

                             context.beginPath();

                             context.moveTo(xposit,canvas.height);//左下
                             context.lineTo(xposit,0);//左上
                             context.lineTo(xposit + dx * 4 , ty);//右上
                             context.lineTo(xposit + dx * 4, by);//右下

                             context.closePath();
                             context.fill();
                             context.stroke();

                             xposit += dx;
                         }
                         ldcanvas.alphas.splice(0,0,ldcanvas.alphas[count-1]).pop();
                     },
           },
    }

    $('div' + '.g2ab').each(function(){
        var keyValue = {};

        var ddid = Math.floor(Math.random() * 10000) + "_" + new Date().getTime();//
        var divname = 'div.' + ddid;
        $(this).addClass(ddid);

        $($(this).html().replace(/<br[ \t\/]*?>/g,'\n').split("\n")).each(function(){
            var nbsp = String.fromCharCode(160);
            line = this.toString().replace(eval("/" + nbsp + "/g"),'');// &nbsp;を削除

            if(line.match(/^[ \t]*url@.+/)){ // url
                var token = this.split('url@');
                keyValue.url = token[1].replace(/[ \t]*$/,'');
            }else if(line.match(/^[ \t]*type@.+/)){ // type
                var token = this.split('type@');
                keyValue.type = token[1].replace(/[ \t]*$/,'');
            }else if(line.match(/^[ \t]*size@.+/)){ // size
                var token = this.split('size@');
                keyValue.size = token[1].replace(/[ \t]*$/,'');
            }else if(line.match(/^[ \t]*color@.+/)){ // color
                var token = this.split('color@');
                keyValue.color = 'rgb(' + token[1].replace(/[ \t]*$/,'') + ')';//)
            }
        });
        console.dir(keyValue);

        if(keyValue.url){
            $(this).empty();

            var gisturl = keyValue.url;

            var ldcanvas = new g2ab.LoadingCanvas(ddid);
            if(keyValue.type){
                ldcanvas.setType(keyValue.type);
            }
            if(keyValue.size){
                ldcanvas.setSize(keyValue.size);
            }
            if(keyValue.color){
                ldcanvas.setColor(keyValue.color);
            }
            ldcanvas.start();

            var span = $('<span />').css({
            }).appendTo($(divname)).text('Loading : ');
            $('<a />').appendTo(span).attr('href',gisturl).attr('target','_blank').text(gisturl);
            //$('<a />').appendTo($(divname)).attr('href',gisturl).attr('target','_blank').text(gisturl);

            $.ajax({
                url: gisturl + '.json',
                type: 'GET',
                dataType: 'jsonp',
                cache: false
            }).success(function(gistdata) {
                // link要素の追加
                $('<link />',{
                    'media':'screen',
                    'rel':'stylesheet',
                    'href':gistdata.stylesheet
                }).appendTo('head');

                ldcanvas.stop();

                // gistコードの追加
                $(divname).html(gistdata.div);
            }).error(function(ex) {
                console.log(ex);
            });
        }else{
            console.error("Illigal parameter.");
            console.dir(keyValue);
        }
    });
});

