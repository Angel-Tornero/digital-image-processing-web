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

function main(){
	// canvas
	let canvas = document.getElementById('image');
  let canvasHistogram = document.getElementById('histogram');
	let context = canvas.getContext("2d");
  let status = document.getElementById('status');
	let fileInput = document.getElementById('upload'); // input file
	let img = new Image();
  let imgInfo;

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
            imgInfo.drawHistogram(canvasHistogram, 0); 
          }
          img.src = event.target.result;
           
        }
      }    
    } else {
      alert("not an image");
    }
  };
  canvas.addEventListener("mousemove", function(event) {
    let pos = findPos(this);
    let x = event.pageX - pos.x;
    let y = event.pageY - pos.y;
    let coord = "x=" + x + ", y=" + y;
    let context = this.getContext('2d');
    let pixel = context.getImageData(x, y, 1, 1).data;
    let rgb = `red=${pixel[0]}, green=${pixel[1]}, blue=${pixel[2]}`;
    status.innerHTML = (coord + ', ' + rgb);
  });
  
}

main();