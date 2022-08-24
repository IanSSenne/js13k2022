import testImage from "./assets/test.png";
import spriteImage from "./assets/sprite.png";
// const x = new Image();
// x.src = testImage;
// document.body.appendChild(x);
// console.log(x);

function loadImageFromURI(uri:string):HTMLImageElement{
  return Object.assign(new Image,{src:uri});
}
const ian: HTMLImageElement = loadImageFromURI(spriteImage);
const tileSize: number = 8;

let ianX = 2;
let ianY = 2;
let widthInTiles: number;
let heightInTiles: number;
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

function load(){
  canvas = document.querySelector("canvas") as HTMLCanvasElement;
  ctx = canvas.getContext("2d")!;
  ian.src = spriteImage;
  widthInTiles = canvas.width / tileSize;
  heightInTiles = canvas.height / tileSize;
}
let keys: Map<string,boolean> = new Map;
function globalKeyDown(e:KeyboardEvent){
  keys.set(e.key,true);
}
function globalKeyUp(e:KeyboardEvent){
  keys.set(e.key,false);
  console.log(keys);
}
function isKeyPressed(key:string):boolean{
  return keys.has(key) && keys.get(key)!;
}
window.addEventListener("keydown",globalKeyDown);
window.addEventListener("keyup",globalKeyUp);
function tick() {
  // Clear the last frame
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = canvas.width; // hax by Ian

  // Background
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  ctx.drawImage(ian, ianX * tileSize, ianY * tileSize);
  
  // ian hax 2
  ianX -= (+isKeyPressed("a") - +isKeyPressed("d"));
  ianY -= (+isKeyPressed("w") - +isKeyPressed("s"));
  
  requestAnimationFrame(tick);
}

function drawGrid() {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  for (let y = 0; y < heightInTiles; y++) {
    for (let x = 0; x < widthInTiles; x++) {
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
}

load();
tick();