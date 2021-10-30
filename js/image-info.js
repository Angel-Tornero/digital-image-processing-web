const RED = 0;
const GREEN = 1;
const BLUE = 2;
const GRAY = 3;

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

class ImageInfo {
  /**
   * Constructor de la clase ImagenInfo que almacena datos sobre
   * la imagen, calcula su histograma, entropía, máximos y mínimos,
   * brillo y contraste.
   * @param {Object} canvas 
   * @param {String} fileType 
   */
  constructor(canvas, fileType) {
    this.showPixelInfo(canvas);
    this.ctxHistogram = document.getElementById('histogram').getContext('2d');
    this.#clearHistogram(this.ctxHistogram);

    this.fileType = fileType;
    this.width = canvas.width;
    this.height = canvas.height;
    this.redHistogram = [];
    this.blueHistogram = [];
    this.greenHistogram = [];
    this.grayHistogram = [];
    this.max = [];
    this.min = [];
    this.mode = [];

    this.#generateHistogram(canvas);
    this.#calculateRange();
    this.#calculateMode();
  }

  #generateHistogram(canvas) {
    for (let i = 0; i < 256; i++) {
      this.redHistogram[i] = 0;
      this.greenHistogram[i] = 0;
      this.blueHistogram[i] = 0;
      this.grayHistogram[i] = 0;
    }
    const ctxImg = canvas.getContext('2d');
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        let pixel = ctxImg.getImageData(j, i, 1, 1).data;
        this.redHistogram[pixel[RED]]++;
        this.greenHistogram[pixel[GREEN]]++;
        this.blueHistogram[pixel[BLUE]]++;
        let grayTone = Math.floor(0.299 * pixel[RED] + 0.587 * pixel[GREEN] + 0.114 * pixel[BLUE]);
        this.grayHistogram[grayTone]++;
      }
    }
  }

  #calculateRange() {
    this.max[RED] = Math.max.apply(null, this.redHistogram.map((value, i) => { return ((value > 0)? i : -1) }));
    this.max[GREEN] = Math.max.apply(null, this.greenHistogram.map((value, i) => { return (value > 0? i : -1) }));
    this.max[BLUE] = Math.max.apply(null, this.blueHistogram.map((value, i) => { return (value > 0? i : -1) }));
    this.max[GRAY] = Math.max.apply(null, this.grayHistogram.map((value, i) => { return (value > 0? i : -1) }));
    
    this.min[RED] = Math.min.apply(null, this.redHistogram.map((value, i) => { return (value > 0? i : 256) }));
    this.min[GREEN] = Math.min.apply(null, this.greenHistogram.map((value, i) => { return (value > 0? i : 256) }));
    this.min[BLUE] = Math.min.apply(null, this.blueHistogram.map((value, i) => { return (value > 0? i : 256) }));
    this.min[GRAY] = Math.min.apply(null, this.grayHistogram.map((value, i) => { return (value > 0? i : 256) }));
  }

  #calculateMode() {
    this.mode[RED] = Math.max.apply(null, this.redHistogram.map((value) => {return value;}));
    this.mode[GREEN] = Math.max.apply(null, this.greenHistogram.map((value) => {return value;}));
    this.mode[BLUE] = Math.max.apply(null, this.blueHistogram.map((value) => {return value;}));
    this.mode[GRAY] = Math.max.apply(null, this.grayHistogram.map((value) => {return value;}));
  }
  /**
   * Dibuja el histograma indicado en el elemento Canvas que se
   * indique.
   * @param {Object} canvasHistogram 
   * @param {Number} color 
   */
  drawHistogram(canvasHistogram, color) {
    let ctx = canvasHistogram.getContext('2d');
    let drawingHistogram;
    this.#clearHistogram(ctx);
    switch (color) {
      case RED:
        drawingHistogram = this.redHistogram;
        ctx.fillStyle = "red";
        break;
      case BLUE:
        drawingHistogram = this.blueHistogram;
        ctx.fillStyle = "blue";
        break;
      case GREEN:
        drawingHistogram = this.greenHistogram;
        ctx.fillStyle = "green";
        break;
      case GRAY:
        drawingHistogram = this.grayHistogram;
        ctx.fillStyle = "gray";
        break;
      default:
        return;
    }
    const transformation = 252 / this.mode[color];
    
    for (let i = 0; i < 256; i++) {
      ctx.fillRect(2 + i * 2, 254 - transformation * drawingHistogram[i], 2, transformation * drawingHistogram[i]);
    }
  }

  /**
   * Dibuja los ejes del histograma.
   * @param {Object} ctx 
   */
  #clearHistogram(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(2, 2, 512, 252);
  }

  showPixelInfo(canvas) {
    canvas.addEventListener("mousemove", function(event) {
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