# Run at the bottom
Register the JavaScript to be executed at the bottom of the page with the URL that matches the registered URL pattern.

### Remarks
- データ項目：呼称名、合致URLパターン、JavaScript CODE 
- 禁止URLのパターンが登録できる
- ~~正規表現パターンを文字列で運用するには、出力時に**replace(/\\/g, '\\$&')**にて、**\\**を補完しておく。~~
- データ格納を個別storageへの格納から、json形式にまとめてstorageへ格納に変更。



### Version history
- ver 1.5 : Save when focus moved.(Delete Save Button) & Coloring the background of focus element.
- ver 1.4 : Used JSON for the in/out file format.
- ver 1.3 : Significantly changed imp/exp function.(read file is yet.)
- ver 1.2 : The implementation of the import function is complete.
- ver 1.1 : Fixed URL consistency check process.
- ver 0.2 : Specification change to operation specification method at URL pattern matching.
- ver 0.1 : Single function selection method.

<br>
<br>
<br>
<br>
<br>
### mermaid sample

```mermaid
graph LR

  classDef default fill: #fff,stroke: #333,stroke-width: 1px;
  style funcA fill: #fff,stroke: #333,stroke-width: 1px;
  style funcB fill: #fff,stroke: #333,stroke-width: 1px;
  style funcC fill: #fff,stroke: #333,stroke-width: 1px;
  style funcD fill: #fff,stroke: #333,stroke-width: 1px;

  ログイン--ID/パスワード認証-->メニュー

  メニュー-->機能A-1
  メニュー-->機能B-1
  メニュー-->機能C-1
  メニュー-->機能D-1

  subgraph funcA [機能A]
    機能A-1
  end

  subgraph funcB [機能B]
    機能B-1-->機能B-2
  end

  subgraph funcC [機能C]
    機能C-1-->機能C-2
    機能C-1-->機能C-3
  end

  subgraph funcD [機能D]
    機能D-1-->機能D-2-->機能D-3
  end

  style header fill: #fff,stroke: #333,stroke-width: 1px;
  subgraph header [ヘッダ]
    設定
    ログアウト
  end
  ```

<!--
# DEMO

You can learn how to making cute physics simulations (looks retro game).

![]()

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
-->