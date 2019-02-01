window.onload = init;
function init() {
  var images = document.getElementsByTagName('img');
  for (var i=0; i< images.length; i++) {
    images[i].onmouseover = showAnswer;
    images[i].onmouseout = hideAnswer;
  }
}

function showAnswer(eventObj) {
  var image = eventObj.target;
  image.src = "img/" + image.id + ".jpg";
}

function hideAnswer(eventObj) {
  setTimeout( function() {
    var image = eventObj.target;
    image.src = "img/" + image.id + "blur.jpg";
  }, 1000);
}
