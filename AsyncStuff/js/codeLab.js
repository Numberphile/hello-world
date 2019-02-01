window.onload = init;
function init() {
  var image = document.getElementById("picture");
  image.ondragstart = handleDragStart;
  var dropTarget = document.getElementById("dropTarget");
  dropTarget.ondragover = handleDragOver;
  dropTarget.ondrop = handleDrop;
}

function handleDragStart(eventObj) {
  var image = eventObj.target;
  console.log("Picked up picture.");
}

function handleDragOver(eventObj) {
  var dropTarget = eventObj.target;
  console.log("Hovering...");
}

function handleDrop(eventObj) {
  var dropTarget = eventObj.target;
  console.log("Dropped something on me.");
}
