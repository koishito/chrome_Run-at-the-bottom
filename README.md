# Run at the bottom
When you reach the bottom of the page by scrolling, the preset JavaScript is executed.  

# Remarks
Chrome拡張機能の作成の記録。  
- バックグラウンドページは機能拡張のロードとともに読み込まれ、常に裏で実行されている。(＝常にメモリに駐在し続ける。)  
- バックグラウンドページは、現在表示しているページのDOM要素やコンテンツスクリプトとは隔絶されています。  
- イベントページはバックグラウンドページと同じようにインストールや起動時に読み込まれますが、一定の時間が経過すると無効になり、メモリを開放します。  
- getBackgroundPageでバックグラウンドページのwindowオブジェクトを取得して、backgroundFunctionメソッドを実行。  
- バックグラウンドページが無効の場合の対処方法として、runtime.getBackgroundPageを用いる。  
- バックグラウンドページにて、機能拡張のインストール時に実行されるruntime.onInstalledと、起動時に実行されるruntime.onStartupを利用する。  
- Message Passing（メッセージパッシング）という仕組みで、データを送受信する。  
- メッセージパッシングでの送受信にはJSON形式を用い、データの型は「null, boolean, number, string, array, object」を渡すことができる。  
- メッセージの送信にはchrome.runtime.sendMessageか、chrome.tabs.sendMessageを使い、メッセージの受信は共にchrome.runtime.onMessage.addListenerを使う。という仕組み。  
- コンテンツスクリプトに送信するときだけchrome.tabs.sendMessageを使います。  
- chrome.storage APIなら保存したデータを相互にやり取りできます。  
- コンテンツスクリプトを利用して、現在表示中のページを構成しているDOM要素を読み込んだり、変更したりできます。  

以下、参考
# DEMO

You can learn how to making cute physics simulations (looks retro game).

![](https://cpp-learning.com/wp-content/uploads/2019/05/pyxel-190505-161951.gif)

This animation is a "Cat playing on trampoline"!
You can get basic skills for making physics simulations.

# Features

Physics_Sim_Py used [pyxel](https://github.com/kitao/pyxel) only.

```python
import pyxel
```
[Pyxel](https://github.com/kitao/pyxel) is a retro game engine for Python.
You can feel free to enjoy making pixel art style physics simulations.

# Requirement

* Python 3.6.5
* pyxel 1.0.2

Environments under [Anaconda for Windows](https://www.anaconda.com/distribution/) is tested.

```bash
conda create -n pyxel pip python=3.6 Anaconda
activate pyxel
```

# Installation

Install Pyxel with pip command.

```bash
pip install pyxel
```

# Usage

Please create python code named "demo.py".
And copy &amp; paste [Day4 tutorial code](https://cpp-learning.com/pyxel_physical_sim4/).

Run "demo.py"

```bash
python demo.py
```

# Note

I don't test environments under Linux and Mac.

# Author

* Hayabusa
* R&D Center
* Twitter : https://twitter.com/Cpp_Learning

# License

"Physics_Sim_Py" is under [MIT license](https://en.wikipedia.org/wiki/MIT_License).

Enjoy making cute physics simulations!

Thank you!