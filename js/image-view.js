/**
 * @class ImageView - se encarga de todas las tarea que tengan que ver con visualizar
 * información o imágenes.
 */
class ImageView {
  #canvasImage;
  #canvasOutput;
  #contextCanvasImage;
  #contextCanvasOutput;
  #contextCanvasHistogram;
  #imgModel;
  /**
   * Constructor de la clase ImageView.
   * @param {Object} contextImageCanvas
   * @param {Object} contextCanvasHistogram 
   * @param {imgModel} imgModel 
   */
  constructor(image, canvasImage, canvasHistogram, imgModel) {
    this.#imgModel = imgModel
    this.#canvasImage = canvasImage;
    this.#canvasOutput = document.getElementById('output');
    this.#contextCanvasOutput = this.#canvasOutput.getContext('2d');
    this.#contextCanvasImage = canvasImage.getContext('2d');
    this.#contextCanvasHistogram = canvasHistogram.getContext('2d');
    canvasImage.width = image.width;
    canvasImage.height = image.height;
    this.#contextCanvasImage.drawImage(image, 0, 0);
    this.#imgModel.calculate();
    
    this.#clearHistogram();
  }
  /**
   * Dibuja el histograma indicado.
   * @param {Number} color 
   */
   drawHistogram(color) {
    const drawingHistogram = this.#imgModel.histogram[color];
    const transformation = 252 / this.#imgModel.mode[color];
    this.#clearHistogram();
    this.#contextCanvasHistogram.fillStyle = color;
    for (let i = 0; i < 256; i++) {
      this.#contextCanvasHistogram.fillRect(2 + i * 2,
        254 - transformation * drawingHistogram[i],
        2,
        transformation * drawingHistogram[i]);
    }
  }

  /**
   * Borra el histograma.
   */
  #clearHistogram() {
    this.#contextCanvasHistogram.fillStyle = "white";
    this.#contextCanvasHistogram.fillRect(2, 2, 512, 252);
  }

  drawOnOutputCanvas(imageData, width, height) {
    this.#canvasOutput.width = width;
    this.#canvasOutput.height = height;
    this.#contextCanvasOutput.putImageData(imageData, 0, 0);
  }

  drawOnInputCanvas(imageData, width, height) {
    this.#canvasImage.width = width;
    this.#canvasImage.height = height;
    this.#contextCanvasImage.putImageData(imageData, 0, 0);
    this.#imgModel.calculate();
  }

  /**
   * Dibuja los bordes del histograma.
   */
  static drawAxis(contextCanvasHistogram) {
    contextCanvasHistogram.strokeStyle = "black";
    contextCanvasHistogram.strokeRect(1, 1, 514, 254);
  }

}