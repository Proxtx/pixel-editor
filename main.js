const canvas = document.getElementById("canvas");

canvas.width = 500;
canvas.height = 500;

const ctx = canvas.getContext("2d");

class FrameRenderer {
  constructor (ctx, data) {
    this.ctx = ctx;
    this.data = data;
  }
  
  render () {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    const pixelWidth = canvasWidth / this.data.length;
    const pixelHeight = canvasHeight / this.data[0].length;
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    for(let pixelIndexX in this.data) {
      for(let pixelIndexY in this.data[pixelIndexX]) {
        this.ctx.fillStyle = this.data[pixelIndexX][pixelIndexY];
        this.ctx.fillRect(pixelWidth * pixelIndexX, pixelHeight * pixelIndexY, pixelWidth-2, pixelHeight-2);
      }
    }
  }
}

class Frame {
  constructor (ctx, pixelCountX, pixelCountY) {
    this.ctx = ctx;
    this.pixelCountX = pixelCountX;
    this.pixelCountY = pixelCountY;
    this.genDataArray();
    this.renderer = new FrameRenderer(this.ctx, this.data);
  }
  
  genDataArray () {
    this.data = [];
    for(let x = 0; x< this.pixelCountX;x++) {
      this.data.push([])
      for(let y = 0;y<this.pixelCountY;y++){
        this.data[x].push("#ffffff")
      }
    }
  }
  
  render () {
    this.renderer.render();
  }
  
  updatePixel (x,y,color) {
    this.data[x][y] = color;
  }
}

class FramesHandler {
  currentColor = "red";
  currentFrame = 0
  frames = [];
  
  constructor (ctx, pixelCountX, pixelCountY) {
    this.pixelCountX = pixelCountX;
    this.pixelCountY = pixelCountY;
    this.ctx = ctx;
    this.addFrame();
    this.interaction = new Interaction(this.ctx.canvas, this.pixelCountX, this.pixelCountY);
    this.interaction.listeners.push((x,y) => {
         this.frames[this.currentFrame].updatePixel(x,y,this.currentColor);
         this.render();
    })
  }
  
  addFrame () {
    this.frames.push(new Frame(this.ctx, this.pixelCountX, this.pixelCountY));
    this.currentFrame = this.frames.length - 1
    this.render();
  }
  
  render () {
    this.frames[this.currentFrame].render();
  }
  
}

class Interaction {
  listeners = [];
  
  constructor(canvas, pixelCountX, pixelCountY) {
    this.canvas = canvas;
    this.pixelCountX = pixelCountX;
    this.pixelCountY = pixelCountY;
    
    this.canvas.addEventListener("click", (e) => {
      let boundingRect = this.canvas.getBoundingClientRect();
      let localCanvasX = e.clientX - boundingRect.x;
      let localCanvasY = e.clientY - boundingRect.y;
      let pixelX = Math.floor(localCanvasX / (this.canvas.width / pixelCountX))
      let pixelY = Math.floor(localCanvasY / (this.canvas.height / this.pixelCountY));
      for(let listener of this.listeners) {
        listener(pixelX, pixelY)
      }
    })
  }
}

let pixelCountX = prompt("Pixels X?") || 10
let pixelCountY = prompt("Pixels Y?") || 10

canvas.height = canvas.width * (pixelCountY / pixelCountX);

let framesHandler = new FramesHandler(ctx, pixelCountX,pixelCountY);