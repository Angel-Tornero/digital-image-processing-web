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

function drawAxis(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = "black";
  ctx.strokeRect(1, 1, 514, 254);
}

function main(){
	// canvas
	let canvas = document.getElementById('image');
  let canvasHistogram = document.getElementById('histogram');
	let context = canvas.getContext("2d");
	let fileInput = document.getElementById('upload'); // input file
	let img = new Image();
  let imgInfo;
  drawAxis(canvasHistogram);

	fileInput.onchange = function(event) {
    let files = event.target.files; // FileList object
    let file = files[0];
    if (file.type.match('image.*')) {
      let reader = new FileReader();
      // Read in the image file as a data URL.
      reader.readAsDataURL(file);
      reader.onload = function(event) {
        if(event.target.readyState == FileReader.DONE) {
          img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img,0,0);
            imgInfo = new ImageInfo(canvas, file.type);
            activateHistogramButtons(imgInfo, canvasHistogram);
          }
          img.src = event.target.result;
           
        }
      }    
    } else {
      alert("not an image");
    }
  };
}

main();

const acc = document.getElementsByClassName("accordion");
for (let i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    this.nextElementSibling.classList.toggle("show");
  });
}