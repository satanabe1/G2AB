使用方法
---
プラグインの追加　＞　フリープラグインに以下を記述

```
<script src="http://www.google.com/jsapi"></script>
<script>google.load('jquery','1')</script>
<script>(function(j){j(function(){$=jQuery=j})})($)</script>

<script src="g2ab.js"></script>
```

ブログでGistのソースコードを貼り付けたいところに，以下を記述

```
<div class="amebloGist" id="貼り付けたいGistソースコードの番号(urlの数字部分)">
  url@GistのURL
</div>
```

例:

```
<div class="amebloGist">
  url@https://gist.github.com/satanabe1/4683624
</div>
```

### オプションとか
```
<div class="amebloGist">
  size@ローディング画像の大きさ
  imgcolor@ローディング画像の基本色
</div>
```

例:

```
<div class="amebloGist">
  size@128
  imgcolor@255,100,255
</div>

