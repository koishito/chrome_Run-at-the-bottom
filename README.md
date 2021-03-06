# Run at the bottom
Register the JavaScript to be executed at the bottom of the page with the URL that matches the registered URL pattern.

### Remarks
- データ項目：呼称名、合致URLパターン、JavaScript CODE 
- 禁止URLのパターンが登録できる
- 正規表現パターンを文字列で運用するには、出力時に**replace(/\\/g, '\\$&')**にて、**\\**を補完しておく。


*

### Version history
- ver 0.2 : Specification change to operation specification method at URL pattern matching.
- ver 0.1 : Single function selection method.




以下、参考
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