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
    this.monocrome = 'gray';
    this.canvasImage = document.getElementById('image');
    this.canvasHistogram = document.getElementById('histogram');
    this.canvasOutput = document.getElementById('output');
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
              this.#activateControllers();
            }.bind(this);
            img.src = event.target.result;
            
          }
        }.bind(this);
      } else {
        alert("not an image");
      }
    }.bind(this));
  }

  #activateControllers() {
    this.#activateHistogramButtons();
    this.#activateMonocromeGeneration();
    this.#showPixelInfo();
    this.#addLoadOption();
  }

  #activateHistogramButtons() {
    const color = ['red', 'green', 'blue', 'gray'];
    for (let i in color) {
      const button = document.getElementById(color[i] + "Histogram");
      button.addEventListener('click', function(event) {
        this.imgView.drawHistogram(color[i]);
      }.bind(this));
    }
  }

  #activateMonocromeGeneration() {
    const color = ['red', 'green', 'blue', 'gray'];
    const generateButton = document.getElementById('generate');
    for (let i in color) {
      const button = document.getElementById(color[i] + "Mono");
      button.addEventListener('click', function(event) {
        this.monocrome = color[i];
        generateButton.style.borderColor = color[i];
      }.bind(this));
    }
    generateButton.addEventListener('click', function(event) {
      let newImageData;
      if (this.monocrome == 'gray')
        newImageData = this.imgModel.generateShadeOfGrayImage();
      else 
        newImageData = this.imgModel.generateMonocromeImage(this.monocrome);
      this.imgView.drawOnOutputCanvas(newImageData,
        this.imgModel.width,
        this.imgModel.height);
    }.bind(this))
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
      let rgb = `red=${pixel[0]}, green=${pixel[1]}, blue=${pixel[2]}, gray=${Math.floor(0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2])}`;
      status.innerHTML = (coord + ', ' + rgb);
    });
    document.getElementById('output').addEventListener("mousemove", function(event) {
      const status = document.getElementById('status2');
      let pos = findPos(this);
      let x = event.pageX - pos.x;
      let y = event.pageY - pos.y;
      let coord = "x=" + x + ", y=" + y;
      let context = this.getContext('2d');
      let pixel = context.getImageData(x, y, 1, 1).data;
      let rgb = `red=${pixel[0]}, green=${pixel[1]}, blue=${pixel[2]}, gray=${Math.floor(0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2])}`;
      status.innerHTML = (coord + ', ' + rgb);
    })
  }

  #addLoadOption() {
    const setAsInputButton = document.getElementById('load');
    setAsInputButton.addEventListener('click', function(event) {
      const imageData = this.canvasOutput.getContext('2d')
        .getImageData(0, 0, this.canvasOutput.width, this.canvasOutput.height);
      this.imgView.drawOnInputCanvas(imageData, this.canvasOutput.width, this.canvasOutput.height);
      this.#activateControllers();
    }.bind(this));
  }
}
