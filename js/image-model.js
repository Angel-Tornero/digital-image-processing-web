const RED = 0;
const GREEN = 1;
const BLUE = 2;
const GRAY = 3;

class ImageModel {
  /**
   * Constructor de la clase ImageModel que almacena datos sobre
   * la imagen, calcula su histograma, entropía, máximos y mínimos,
   * brillo y contraste.
   * @param {Object} canvas 
   * @param {String} fileType 
   */
  constructor(width, height, canvas, fileType) {
    this.ctxImg = canvas.getContext('2d');
    this.fileType = fileType;
    this.width = width;
    this.height = height;
    this.redHistogram = [];
    this.blueHistogram = [];
    this.greenHistogram = [];
    this.grayHistogram = [];
    this.max = [];
    this.min = [];
    this.mode = [];
  }

  calculate() {
    this.generateHistogram();
    this.calculateMode();
    this.calculateRange();
  }

  generateHistogram() {
    for (let i = 0; i < 256; i++) {
      this.redHistogram[i] = 0;
      this.greenHistogram[i] = 0;
      this.blueHistogram[i] = 0;
      this.grayHistogram[i] = 0;
    }
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        let pixel = this.ctxImg.getImageData(j, i, 1, 1).data;
        this.redHistogram[pixel[RED]]++;
        this.greenHistogram[pixel[GREEN]]++;
        this.blueHistogram[pixel[BLUE]]++;
        let grayTone = Math.floor(0.299 * pixel[RED] + 0.587 * pixel[GREEN] + 0.114 * pixel[BLUE]);
        this.grayHistogram[grayTone]++;
      }
    }
  }

  calculateRange() {
    this.max[RED] = Math.max.apply(null, this.redHistogram.map((value, i) => { return ((value > 0)? i : -1) }));
    this.max[GREEN] = Math.max.apply(null, this.greenHistogram.map((value, i) => { return (value > 0? i : -1) }));
    this.max[BLUE] = Math.max.apply(null, this.blueHistogram.map((value, i) => { return (value > 0? i : -1) }));
    this.max[GRAY] = Math.max.apply(null, this.grayHistogram.map((value, i) => { return (value > 0? i : -1) }));
    
    this.min[RED] = Math.min.apply(null, this.redHistogram.map((value, i) => { return (value > 0? i : 256) }));
    this.min[GREEN] = Math.min.apply(null, this.greenHistogram.map((value, i) => { return (value > 0? i : 256) }));
    this.min[BLUE] = Math.min.apply(null, this.blueHistogram.map((value, i) => { return (value > 0? i : 256) }));
    this.min[GRAY] = Math.min.apply(null, this.grayHistogram.map((value, i) => { return (value > 0? i : 256) }));
  }

  calculateMode() {
    this.mode[RED] = Math.max.apply(null, this.redHistogram.map((value) => {return value;}));
    this.mode[GREEN] = Math.max.apply(null, this.greenHistogram.map((value) => {return value;}));
    this.mode[BLUE] = Math.max.apply(null, this.blueHistogram.map((value) => {return value;}));
    this.mode[GRAY] = Math.max.apply(null, this.grayHistogram.map((value) => {return value;}));
  }
}