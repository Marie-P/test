import Map from "./utils/map.js";
import GameButtons from "./utils/gameButtons.js";

export default class View {
  constructor(nbPlayer) {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    document.body.clientWidth > 500 ? this.canvas.width = window.innerWidth : this.canvas.width = 500;
    nbPlayer == 1 ? this.canvas.height = window.innerHeight : this.canvas.height = 300;
    document.body.clientWidth > 500 ? this.backgroundWidth = window.innerWidth : this.backgroundWidth = 500;
    nbPlayer == 1 ? this.backgroundHeight = window.innerHeight/15 : this.backgroundHeight = 17;
    this.camera1 = 0;

    // Deuxième perso
    if(nbPlayer == 2) {
      this.canvas2 = document.createElement("canvas");
      this.context2 = this.canvas2.getContext("2d");
      this.canvas2.width = window.innerWidth;
      this.canvas2.height = 250;
      this.backgroundWidth2 = window.innerWidth;
      this.backgroundHeight2 = 17;
      this.camera2 = 0;
    }

    // position du joystick

    // this.canvasJoystick = document.createElement("canvas");
    // this.ctxJoystick = this.canvasJoystick.getContext("2d");

    // this.canvasJoystick.width = document.body.clientWidth;
    // this.canvasJoystick.height = 180;
    this._centerX = 200;
    this._centerY = 470;
    this._x = this._centerX ;
    this._y = this._centerY;

    // Les boutons directionnels dans le canvas
    this.directionalButtonsX = 100;
    this.directionalButtonsY = 370;
    this.directionalButtonsH = 10;
    this.buttons = new GameButtons(this.canvas, this.context, this.directionalButtonsX, this.directionalButtonsY, this.directionalButtonsH, "#000000");
  }

  /**
   * dessiner la map
   * @param {Model} model
   * @param canvas
   * @param context
   * @param tilemap
   */
   drawMap(model, canvas, context, tilemap, camera) {
    for (let y = 0; y < this.backgroundHeight; y++) {
      for (let x = 0; x < this.backgroundWidth; x++) {
        context.putImageData(
          model.map.sprites[tilemap[y * this.backgroundWidth + (x + camera)]],
          x * model.map.tilesWidth, y * model.map.tilesHeight
        );
      }
    }
  }

  drawCharacter(context, model, character) {
    let x = character.posX,
        y = character.posY + (character.sprites.get(character.move).posY[character.state]);
    context.drawImage(
      character.sprites.get(character.move).sprites[character.state], 
      x * model.map.tilesWidth, y * model.map.tilesWidth
    );
  }

  drawJoystick(context) {
    // cercle de fond
    context.beginPath();
    context.fillStyle="#CACFD2"
    context.arc(this._centerX, this._centerY, 60, 0, 2 * Math.PI);
    context.fill();
    
    // cercle vide autour
    context.beginPath();
    context.fillStyle="#979A9A"
    context.lineWidth="4";
    context.arc(this._x, this._y, 30, 0, 2 * Math.PI);
    context.stroke();
  
    // cercle dedans
    context.beginPath();
    context.fillStyle="#626567"
    context.arc(this._x, this._y, 30, 0, 2 * Math.PI);
    context.fill();
  }

  draw(model) {
    this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
    this.drawMap(model, this.canvas, this.context, model.map.tilemap, this.camera1);
    this.drawCharacter(this.context, model, model.character1);
    this.context.fillStyle="#FFFFFF"
    this.context.fillRect(0, (this.backgroundHeight - 1)*16, this.canvas.width, this.canvas.height - (this.backgroundHeight - 1)*16);
    if (model.nbPlayers == 1) {this.drawJoystick(this.context);this.buttons.draw();} 

    if(model.nbPlayers == 2) {
      this.context2.clearRect(0,0,this.canvas2.width, this.canvas2.height);
      this.drawMap(model, this.canvas2, this.context2, model.map.tilemap2, this.camera2);
      this.drawCharacter(this.context2, model, model.character2);
    }
  }
}