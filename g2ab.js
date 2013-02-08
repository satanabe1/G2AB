
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
        this.alphas = [];
        this.pddid = parentDdid;
        this.loadingType;
        this.size;
        this.color = [];

        this.setType = function(type){
            this.loadingType = 'type' + type;
        }

        this.setSize = function(size){
            this.size = size;
            this.r = size / 2;
            this.w = Math.round(size * 0.1);
            this.h = Math.round(size * 0.25);
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
                         var nodeC = 12;
                         var context = ldcanvas.getCanvas().getContext('2d');
                         context.setTransform(1,0,0,1,ldcanvas.r,ldcanvas.r);
                         context.clearRect(-ldcanvas.r, -ldcanvas.r, (ldcanvas.r*2), (ldcanvas.r*2));

                         for(var i = 0; i < nodeC; i++){
                             if(ldcanvas.alphas.length < nodeC){
                                 ldcanvas.alphas.push(i / nodeC);
                             }

                             context.fillStyle = 'rgba(' + ldcanvas.color[0] + ',' + ldcanvas.color[1] + ',' + ldcanvas.color[2] + ',' + ldcanvas.alphas[i] + ')';//)
                             context.strokeStyle = 'transparent';
                             context.beginPath();

                             context.moveTo((0-ldcanvas.w/4), (ldcanvas.r-ldcanvas.h));
                             context.quadraticCurveTo(0, (ldcanvas.r-ldcanvas.h-ldcanvas.w/2),(0+ldcanvas.w/4),(ldcanvas.r-ldcanvas.h));
                             context.lineTo((0+ldcanvas.w/2), (ldcanvas.r-ldcanvas.w/3));
                             context.quadraticCurveTo(0, (ldcanvas.r+ldcanvas.w/3), (0-ldcanvas.w/2),(ldcanvas.r-ldcanvas.w/3));
                             context.closePath();
                             context.fill();
                             context.stroke();

                             context.rotate((360/nodeC) * Math.PI / 180);
                         }

                         ldcanvas.alphas.splice(0,0,ldcanvas.alphas[nodeC-1]).pop();
                     },
               type2:function(){
                         console.error("unimplemented!");
                     },
           },
    }

    // ここより上は、今のところ意味ない
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

            $('<span />').appendTo($(divname)).text('Loading : ');
            $('<a />').appendTo($(divname)).attr('href',gisturl).attr('target','_blank').text(gisturl);

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

