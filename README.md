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
<div class="g2ab" data-url="https://www.google.co.jp/satanabe1" >
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
data-url="https://www.google.co.jp/satanabe1"
data-type="1"
data-size="240"
data-color="5,30,130">
</div>
```

### スクリーンショット
![Demo](https://raw.github.com/satanabe1/G2AB/master/pic/type.png)

