
function printProperties(obj) {
    var properties = '';
    for (var prop in obj){
        properties += prop + "=" + obj[prop] + "\n";
    }
    alert(properties);
}

//$(window).load(function(){
jQuery.event.add(window, "load", function(){

    var g2ab = {
        createLoadingCanvas :
    function(targetDiv, canvasSize){
        var ldcanvas = new g2ab.LoadingCanvas(targetDiv);

        ldcanvas.setSize = function(_size){
            //this.size = _size;
            this.r = _size / 2;
            this.w = Math.round(_size * 0.1);
            this.h = Math.round(_size * 0.25);
            var canvas = this.getCanvas();
            canvas.width=_size;
            canvas.height=_size;
        }

        ldcanvas.setColor = function(r,g,b){
            if(arguments.length == 3){
                this.color[0] = r ;
                this.color[1] = g ;
                this.color[2] = b ;
            }else if(arguments.length == 1){
                var start = arguments[0].indexOf('(') + 1;
                var end = arguments[0].indexOf(')');
                this.color = arguments[0].substr(start , end - start).split(',');
            }else{
                console.error('setColor' + arguments);
                console.dir(arguments);
            }
        }

        ldcanvas.getCanvas = function(){
            return $('canvas.' + this.pddid).get(0);
        }

        ldcanvas.start = function(){
            this.loadingTimer = setInterval(g2ab.drawLoadingImage, 50, this);
        }

        ldcanvas.stop = function(){
            clearInterval(this.loadingTimer);
        }

        ldcanvas.setSize(canvasSize);
        return ldcanvas;
    },
LoadingCanvas :
    function(parentDdid){
        $('<canvas />').addClass(parentDdid).appendTo($('div.' + parentDdid));
        this.color = [0,100,255];
        this.alphas = [];
        this.pddid = parentDdid;
    },
drawLoadingImage :
    function(ldcanvas){
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
            }else if(line.match(/^[ \t]*imgcolor@.+/)){ // imgcolor
                var token = this.split('imgcolor@');
                keyValue.imgcolor = 'rgb(' + token[1].replace(/[ \t]*$/,'') + ')';//)
            }else if(line.match(/^[ \t]*fntcolor@.+/)){ // fntcolor
                var token = this.split('fntcolor@');
                keyValue.fntcolor = 'rgb(' + token[1].replace(/[ \t]*$/,'') + ')';//)
            }
        });
        console.dir(keyValue);

        if(keyValue.url){
            $(this).empty();

            var gisturl = keyValue.url;

            //var ldcanvas = g2ab.createLoadingCanvas($(divname).get(0), 30);
            var ldcanvas = g2ab.createLoadingCanvas(ddid, 30);
            if(keyValue.size){
                ldcanvas.setSize(keyValue.size);
            }
            if(keyValue.imgcolor){
                ldcanvas.setColor(keyValue.imgcolor);
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

