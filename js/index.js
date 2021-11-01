function activateHistogramButtons(imgInfo, canvasHistogram) {
  let redButton = document.getElementById("red");
  let greenButton = document.getElementById("green");
  let blueButton = document.getElementById("blue");
  let grayButton = document.getElementById("gray");
  redButton.addEventListener("click", function(event) {
    imgInfo.drawHistogram(canvasHistogram, RED);
  });
  greenButton.addEventListener("click", function(event) {
    imgInfo.drawHistogram(canvasHistogram, GREEN);
  });
  blueButton.addEventListener("click", function(event) {
    imgInfo.drawHistogram(canvasHistogram, BLUE);
  });
  grayButton.addEventListener("click", function(event) {
    imgInfo.drawHistogram(canvasHistogram, GRAY);
  });
}

function main(){
  const imgController = new ImageController();
}

main();

const acc = document.getElementsByClassName("accordion");
for (let i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    this.nextElementSibling.classList.toggle("show");
  });
}