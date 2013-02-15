使用方法
---
### 基本編
プラグインの追加　＞　フリープラグインに以下を記述

```
<script src="http://www.google.com/jsapi"></script>
<script>google.load('jquery','1')</script>
<script>(function(j){j(function(){$=jQuery=j})})($)</script>

<script src="g2ab.js"></script>
```

ブログでGistのソースコードを貼り付けたいところに，以下を記述

```
<div class="g2ab" data-url="Gistのurl" >
</div>
```

例:

```
<div class="g2ab" data-url="https://gist.github.com/satanabe1/4717276" >
</div>
```

### オプション
色とかローディング画像の形とか、大きさとか
```
<div class="g2ab"
data-url="Gistのurl"
data-type="ローディング画像の番号 1,2,3が存在する"
data-size="ローディング画像の大きさ"
data-color="ローディング画像の色">
</div>
```

例:

```
<div class="g2ab"
data-url="https://gist.github.com/satanabe1/4717276"
data-type="1"
data-size="240"
data-color="5,30,130">
</div>
```

### スクリーンショット
![Demo](https://raw.github.com/satanabe1/G2AB/master/pic/type.png)

ライセンス
--
The MIT License  
  
Copyright (c) 2013 haxahaxa.info  
  
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  
  
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.  
  
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.  
  

