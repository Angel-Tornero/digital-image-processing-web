const COLOR = ['red', 'green', 'blue', 'gray'];

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
    this.histogram = {};
    for (let i in COLOR) {
      let newHistogram = [];
      for (let i = 0; i < 256; i++) {
        newHistogram[i] = 0;
      }
      this.histogram[COLOR[i]] = newHistogram;
    }
    this.max = {};
    this.min = {};
    this.mode = {};
    this.brightness = {};
    this.contrast = {}
  }

  /**
   * Call all the calculation methods.
   */
  calculate() {
    this.generateHistogram();
    this.calculateMode();
    this.calculateRange();
    this.calculateBrightnessAndContrast();
  }

  /**
   * Generate the image histograms of components RGB and luminosity (gray)
   */
  generateHistogram() {
    for (let i in COLOR) {
      let newHistogram = [];
      for (let i = 0; i < 256; i++) {
        newHistogram[i] = 0;
      }
      this.histogram[COLOR[i]] = newHistogram;
    }
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        let pixel = this.ctxImg.getImageData(j, i, 1, 1).data;
        for (let i = 0; i < 3; i++) {
          this.histogram[COLOR[i]][pixel[i]]++;
        }
        this.histogram.gray[this.getGrayComponent(pixel[0], pixel[1], pixel[2])]++;
      }
    }
  }

  /**
   * Calculate the max and min value of components RGB and luminosity (gray)
   */
  calculateRange() {
    for (let i in COLOR) {
      this.max[COLOR[i]] = Math.max
        .apply(null, this.histogram[COLOR[i]]
        .map((value, i) => { return ((value > 0)? i : -1) }));
      this.min[COLOR[i]] = Math.min
        .apply(null, this.histogram[COLOR[i]]
        .map((value, i) => { return (value > 0? i : 256) }));
    }
  }

  /**
   * Calculate the most repeated value of components RGB and luminosity (gray)
   */
  calculateMode() {
    for (let i in COLOR) {
      this.mode[COLOR[i]] = Math.max.apply(null, this.histogram[COLOR[i]].map((value) => {return value;}));
    }
  }
  
  /**
   * Calculate the average of components RGB and luminosity (gray)
   */
  calculateBrightness() {
    for (let i in COLOR) {
      this.brightness[COLOR[i]] = this.histogram[COLOR[i]]
        .reduce((acc, value, index) => {return acc + (value * index)}, 0) / (this.width * this.height);
    }
  }

  /**
   * Calculate the contrast (typical desviation) of components RGB and luminosity (gray)
   */
  calculateBrightnessAndContrast() {
    this.calculateBrightness();
    for (let i in COLOR) {
      this.contrast[COLOR[i]] = Math.sqrt(this.histogram[COLOR[i]]
        .map((value) => Math.pow(value - this.brightness[COLOR[i]], 2))
        .reduce((a, b) => a + b, 0) / (this.width * this.height));
    }
  }

  generateMonocromeImage(color) {
    const imageData = this.ctxImg.getImageData(0, 0, this.width, this.height);
    let data = imageData.data;
    const indexOfColor = COLOR.indexOf(color);
    let component = [0,1,2];
    component.splice(COLOR.indexOf(color), 1);
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const dataIndex = (j * this.width + i) * 4;
        for (let k in component) {
          data[dataIndex + component[k]] = 0;
        }
      }
    }
    return imageData;
  }

  generateShadeOfGrayImage() {
    const imageData = this.ctxImg.getImageData(0, 0, this.width, this.height);
    let data = imageData.data;
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const dataIndex = (j * this.width + i) * 4;
        const gray = this.getGrayComponent(data[dataIndex], data[dataIndex + 1], data[dataIndex + 2]);
        for (let k = 0; k < 3; k++) {
          data[dataIndex + k] = gray;
        }
      }
    }
    return imageData;
  }

  getGrayComponent(red, green, blue) {
    return Math.floor(0.299 * red + 0.587 * green + 0.114 * blue);
  }
}