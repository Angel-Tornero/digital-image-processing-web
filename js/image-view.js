/**
 * @class ImageView - se encarga de todas las tarea que tengan que ver con visualizar
 * información o imágenes.
 */
class ImageView {
  #canvasImage;
  #contextCanvasImage;
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
    this.#clearHistogram();
    let drawingHistogram;
    switch (color) {
      case RED:
        drawingHistogram = this.#imgModel.redHistogram;
        this.#contextCanvasHistogram.fillStyle = "red";
        break;
      case BLUE:
        drawingHistogram = this.#imgModel.blueHistogram;
        this.#contextCanvasHistogram.fillStyle = "blue";
        break;
      case GREEN:
        drawingHistogram = this.#imgModel.greenHistogram;
        this.#contextCanvasHistogram.fillStyle = "green";
        break;
      case GRAY:
        drawingHistogram = this.#imgModel.grayHistogram;
        this.#contextCanvasHistogram.fillStyle = "gray";
        break;
      default:
        return;
    }
    const transformation = 252 / this.#imgModel.mode[color];
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

  /**
   * Dibuja los bordes del histograma.
   */
  static drawAxis(contextCanvasHistogram) {
    contextCanvasHistogram.strokeStyle = "black";
    contextCanvasHistogram.strokeRect(1, 1, 514, 254);
  }

}