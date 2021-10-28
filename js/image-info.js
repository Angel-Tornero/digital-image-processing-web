const RED = 0;
const GREEN = 1;
const BLUE = 2;
const GRAY = 3;

class ImageInfo {
  /**
   * Constructor de la clase ImagenInfo que almacena datos sobre
   * la imagen, calcula su histograma, entropía, máximos y mínimos,
   * brillo y contraste.
   * @param {Object} canvas 
   * @param {String} fileType 
   */
  constructor(canvas, fileType) {
    const ctx = canvas.getContext('2d');
    this.fileType = fileType;
    this.width = canvas.width;
    this.height = canvas.height;
    this.redHistogram = [];
    this.blueHistogram = [];
    this.greenHistogram = [];
    this.grayHistogram = [];
    this.maxValues = [];
    this.minValues = [];

    for (let i = 0; i < 256; i++) {
      this.redHistogram[i] = 0;
      this.greenHistogram[i] = 0;
      this.blueHistogram[i] = 0;
      this.grayHistogram[i] = 0;
    }
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        let pixel = ctx.getImageData(i, j, 1, 1).data;
        this.redHistogram[pixel[RED]]++;
        this.greenHistogram[pixel[GREEN]]++;
        this.blueHistogram[pixel[BLUE]]++;
        let grayTone = Math.round(0.299 * pixel[RED] + 0.587 * pixel[GREEN] + 0.114 * pixel[BLUE]);
        this.grayHistogram[grayTone]++;
      }
    }
    this.maxValues[RED] = Math.max.apply(null, this.redHistogram.map((value, i) => { return ((value > 0)? i : -1) }));
    this.maxValues[GREEN] = Math.max.apply(null, this.greenHistogram.map((value, i) => { return (value > 0? i : -1) }));
    this.maxValues[BLUE] = Math.max.apply(null, this.blueHistogram.map((value, i) => { return (value > 0? i : -1) }));
    this.maxValues[GRAY] = Math.max.apply(null, this.grayHistogram.map((value, i) => { return (value > 0? i : -1) }));
    
    this.minValues[RED] = Math.min.apply(null, this.redHistogram.map((value, i) => { return (value > 0? i : 256) }));
    this.minValues[GREEN] = Math.min.apply(null, this.greenHistogram.map((value, i) => { return (value > 0? i : 256) }));
    this.minValues[BLUE] = Math.min.apply(null, this.blueHistogram.map((value, i) => { return (value > 0? i : 256) }));
    this.minValues[GRAY] = Math.min.apply(null, this.grayHistogram.map((value, i) => { return (value > 0? i : 256) }));
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
    switch (color) {
      case RED:
        drawingHistogram = this.redHistogram;
        break;
      case BLUE:
        drawingHistogram = this.blueHistogram;
        break;
      case GREEN:
        drawingHistogram = this.greenHistogram;
        break;
      case GRAY:
        drawingHistogram = this.grayHistogram;
    }
    //this.#drawAxis(ctx);//arreglar


  }

  /**
   * Dibuja los ejes del histograma.
   * @param {Object} ctx 
   */
  #drawAxis(ctx) {
    let imageData = ctx.createImageData(this.width, this.height);
    let data = imageData.data;
    for (let i = 10; i < 500; i++) {
      const dataIndex = (100 * this.width + i) * 4;
      data[dataIndex + RED] = 0;
        data[dataIndex + GREEN] = 0;
        data[dataIndex + BLUE] = 0;
        data[dataIndex + GRAY] = 255;
    }
    for (let i = 100; i < 590; i++) {
      const dataIndex = (i * this.width + 500) * 4;
      data[dataIndex + RED] = 0;
        data[dataIndex + GREEN] = 0;
        data[dataIndex + BLUE] = 0;
        data[dataIndex + GRAY] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }
  

}