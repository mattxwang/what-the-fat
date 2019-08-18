# what-the-fat

> a website for our favourite fat (except not really bc he eats a million calories a day and is still skinny) dog

This (poorly-coded) website was a birthday gift for our friend Juan! It's pretty simple: it features some typed-out messages (courtesy of typed.js), a poorly retrofitted pure JS/Canvas game, and some calls to a [backend server](https://github.com/malsf21/what-the-fat-server) so Juan can't cheat on certain questions.

You're welcome to play through it, though a lot of it won't make sense - it should work out of the box at [https://whatthefatdog.com](https://whatthefatdog.com).

If you want to develop on this, you'll need an HTTP server (because there are some fetch requests and other little things). You can easily spin one up with python:

```sh
python -m SimpleHTTPServer
```
