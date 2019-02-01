window.onload = init;
function init() {
  var map = document.getElementById("map");
  map.onmousemove = showCoords;
}

function showCoords(eventObj) {
  var coords = document.getElementById("coords");
  var x = eventObj.pageX;
  var y = eventObj.pageY;
  coords.innerHTML = "Map coordinates: " + x + ", " + y;
}

var tick = false;

function clock() {
  if (tick) {
    console.log("tick");
  } else {
    console.log("tock");
  }
  tick = !tick;
}

setInterval(clock, 1000);
