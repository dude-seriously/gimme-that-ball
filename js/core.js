window.requestAnimFrame = (function() {
  return window.requestAnimationFrame       ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         function(callback) {
            window.setTimeout(callback, 1000 / 60);
         };
})();



var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

var ruler = document.getElementById('ruler');



function resizeRender() {
  var rect = ruler.getBoundingClientRect();

  if (rect.width !== canvas.width || rect.height !== canvas.height) {
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
}

window.resize = window.onorientationchange = resizeRender();
resizeRender();

setInterval(resizeRender, 200);