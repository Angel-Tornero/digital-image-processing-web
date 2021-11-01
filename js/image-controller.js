function findPos(obj) {
  let curleft = 0, curtop = 0;
  if (obj.offsetParent) {
      do {
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
      return { x: curleft, y: curtop };
  }
  return undefined;
}

/**
 * @class ImageController - For manage all the interaction
 */
class ImageController {
  constructor() {
    this.canvasImage = document.getElementById('image');
    this.canvasHistogram = document.getElementById('histogram');
    let imgView, imgModel;
    const fileInput = document.getElementById('upload'); // input file
    let img = new Image();
    ImageView.drawAxis(this.canvasHistogram.getContext('2d'));
    fileInput.addEventListener('change', function(event) {
      let files = event.target.files; // FileList object
      let file = files[0];
      if (file.type.match('image.*')) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(event) {
          if(event.target.readyState == FileReader.DONE) {
            img.onload = function() {
              this.imgModel = new ImageModel(img.width, img.height, this.canvasImage, file.type);
              this.imgView = new ImageView(img, this.canvasImage, this.canvasHistogram, this.imgModel);
              this.#activateHistogramButtons();
              this.#showPixelInfo();
            }.bind(this);
            img.src = event.target.result;
            
          }
        }.bind(this);
      } else {
        alert("not an image");
      }
    }.bind(this));
  }

  #activateHistogramButtons() {
    const redButton = document.getElementById("red");
    const greenButton = document.getElementById("green");
    const blueButton = document.getElementById("blue");
    const grayButton = document.getElementById("gray");
    redButton.addEventListener("click", function(event) {
      this.imgView.drawHistogram(RED);
    }.bind(this));
    greenButton.addEventListener("click", function(event) {
      this.imgView.drawHistogram(GREEN);
    }.bind(this));
    blueButton.addEventListener("click", function(event) {
      this.imgView.drawHistogram(BLUE);
    }.bind(this));
    grayButton.addEventListener("click", function(event) {
      this.imgView.drawHistogram(GRAY);
    }.bind(this));
  }

  #showPixelInfo() {
    this.canvasImage.addEventListener("mousemove", function(event) {
      const status = document.getElementById('status');
      let pos = findPos(this);
      let x = event.pageX - pos.x;
      let y = event.pageY - pos.y;
      let coord = "x=" + x + ", y=" + y;
      let context = this.getContext('2d');
      let pixel = context.getImageData(x, y, 1, 1).data;
      let rgb = `red=${pixel[RED]}, green=${pixel[GREEN]}, blue=${pixel[BLUE]}, gray=${Math.floor(0.299 * pixel[RED] + 0.587 * pixel[GREEN] + 0.114 * pixel[BLUE])}`;
      status.innerHTML = (coord + ', ' + rgb);
    });
  }
}
