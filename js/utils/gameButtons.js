export default class GameButtons {
  constructor(canvas, ctx, x, y, h, color) {
    this._canvas = canvas;
    this._ctx = ctx;
    this._x = x;
    this._y = y;
    this._wx = 40;
    this._wy = 40;
    this._h = h;
    this._color = color;

    // up
    this._hUp = this._h;
    this._xUp = this._x;
    this._yUp = this._y;

    // right
    this._hRight = this._h;
    this._xRight = this._x;
    this._yRight = this._y;

    // down
    this._hDown = this._h;
    this._xDown = this._x;
    this._yDown = this._y;

    // left
    this._hLeft = this._h;
    this._xLeft = this._x;
    this._yLeft = this._y;
  }

  shadeColor(color, percent) {
    color = color.substr(1);
    var num = parseInt(color, 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = (num >> 8 & 0x00FF) + amt,
      B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  drawUpButton(x, _y, h) {
    let y = _y - (this._wy + 5);

    // carré du milieu du cube
    this._ctx.beginPath();
    this._ctx.moveTo(x, y);
    this._ctx.lineTo(x - this._wx , y);
    this._ctx.lineTo(x - this._wx , y - this._wy);
    this._ctx.lineTo(x , y - this._wy);
    this._ctx.closePath();
    this._ctx.fillStyle = this.shadeColor(this._color, 20);
    this._ctx.strokeStyle = this.shadeColor(this._color, 60);
    this._ctx.stroke();
    this._ctx.fill();

    // à gauche
    this._ctx.beginPath();
    this._ctx.moveTo(x - this._wx, y);
    this._ctx.lineTo(x - this._wx, y - this._wy);
    this._ctx.lineTo(x - h - this._wx, y - h - this._wy);
    // this._ctx.lineTo(x - h - this._wx, y); // Le bon
    this._ctx.lineTo(x - h - this._wx, y - h); // Ajout spécifique au bouton
    this._ctx.closePath();
    this._ctx.fillStyle = this.shadeColor(this._color, 10);
    this._ctx.strokeStyle = this.shadeColor(this._color, 50);
    this._ctx.stroke();
    this._ctx.fill();

    // En haut
    this._ctx.beginPath();
    this._ctx.moveTo(x - this._wx, y - this._wy);
    this._ctx.lineTo(x, y - this._wy);
    this._ctx.lineTo(x + h, y - h - this._wy);
    this._ctx.lineTo(x - h - this._wx, y - h - this._wy);
    this._ctx.closePath();
    this._ctx.fillStyle = this.shadeColor(this._color, 10);
    this._ctx.strokeStyle = this.shadeColor(this._color, 50);
    this._ctx.stroke();
    this._ctx.fill();

    // à droite
    this._ctx.beginPath();
    this._ctx.moveTo(x, y);
    this._ctx.lineTo(x, y - this._wy);
    this._ctx.lineTo(x + h, y - h - this._wy);
    this._ctx.lineTo(x + h, y - h); // Le bon
    this._ctx.closePath();
    this._ctx.fillStyle = this.shadeColor(this._color, 10);
    this._ctx.strokeStyle = this.shadeColor(this._color, 50);
    this._ctx.stroke();
    this._ctx.fill();

    // Flèche vers le bas
    this._ctx.beginPath();
    this._ctx.moveTo(x, y);
    this._ctx.lineTo(x - this._wx/2, y + this._wy/2); // x, y
    this._ctx.lineTo(x - this._wx, y);
    this._ctx.fillStyle = this.shadeColor(this._color, 20);
    this._ctx.strokeStyle = this.shadeColor(this._color, 60);
    this._ctx.fill();
  }

  drawRightButton(_x, y, h) {
    let x = _x + (this._wx + 5);

    // carré du milieu du cube
    this._ctx.beginPath();
    this._ctx.moveTo(x, y);
    this._ctx.lineTo(x - this._wx , y);
    this._ctx.lineTo(x - this._wx , y - this._wy);
    this._ctx.lineTo(x , y - this._wy);
    this._ctx.closePath();
    this._ctx.fillStyle = this.shadeColor(this._color, 20);
    this._ctx.strokeStyle = this.shadeColor(this._color, 60);
    this._ctx.stroke();
    this._ctx.fill();

    // à droite
    this._ctx.beginPath();
    this._ctx.moveTo(x, y);
    this._ctx.lineTo(x, y - h - this._wy);
    this._ctx.lineTo(x + h, y - h - this._wy);
    // this._ctx.lineTo(x + h, y - h); // Le bon
    this._ctx.lineTo(x + h, y + h); // Ajout spécifique au bouton
    this._ctx.closePath();
    this._ctx.fillStyle = this.shadeColor(this._color, 10);
    this._ctx.strokeStyle = this.shadeColor(this._color, 50);
    this._ctx.stroke();
    this._ctx.fill();

    // En haut
    this._ctx.beginPath();
    this._ctx.moveTo(x - this._wx, y - this._wy);
    this._ctx.lineTo(x, y - this._wy);
    this._ctx.lineTo(x + h, y - h - this._wy);
    this._ctx.lineTo(x + h - this._wx, y - h - this._wy);
    this._ctx.closePath();
    this._ctx.fillStyle = this.shadeColor(this._color, 10);
    this._ctx.strokeStyle = this.shadeColor(this._color, 50);
    this._ctx.stroke();
    this._ctx.fill();

    // En bas
    this._ctx.beginPath();
    this._ctx.moveTo(x, y);
    this._ctx.lineTo(x - this._wx, y);
    this._ctx.lineTo(x + h - this._wx, y + h);
    this._ctx.lineTo(x + h, y + h);
    this._ctx.lineTo(x + h, y + h);
    this._ctx.closePath();
    this._ctx.fillStyle = this.shadeColor(this._color, 10);
    this._ctx.strokeStyle = this.shadeColor(this._color, 50);
    this._ctx.stroke();
    this._ctx.fill();

    // Flèche vers la gauche
    this._ctx.beginPath();
    this._ctx.moveTo(x - this._wx, y);
    this._ctx.lineTo(x - this._wx * 1.5, y - this._wy/2);
    this._ctx.lineTo(x - this._wx, y - this._wy);
    this._ctx.fillStyle = this.shadeColor(this._color, 20);
    this._ctx.strokeStyle = this.shadeColor(this._color, 60);
    this._ctx.fill();
  }

  drawDownButton(x, _y, h) {
    let y = _y + (this._wy + 5);

    // carré du milieu du cube
    this._ctx.beginPath();
    this._ctx.moveTo(x, y);
    this._ctx.lineTo(x - this._wx , y);
    this._ctx.lineTo(x - this._wx , y - this._wy);
    this._ctx.lineTo(x , y - this._wy);
    this._ctx.closePath();
    this._ctx.fillStyle = this.shadeColor(this._color, 20);
    this._ctx.strokeStyle = this.shadeColor(this._color, 60);
    this._ctx.stroke();
    this._ctx.fill();

    // à gauche
    this._ctx.beginPath();
    this._ctx.moveTo(x - this._wx, y);
    this._ctx.lineTo(x - this._wx, y - this._wy);
    this._ctx.lineTo(x - h - this._wx, y + h - this._wy);
    // this._ctx.lineTo(x - h - this._wx, y); // Le bon
    this._ctx.lineTo(x - h - this._wx, y + h); // Ajout spécifique au bouton
    this._ctx.closePath();
    this._ctx.fillStyle = this.shadeColor(this._color, 10);
    this._ctx.strokeStyle = this.shadeColor(this._color, 50);
    this._ctx.stroke();
    this._ctx.fill();

    // En bas
    this._ctx.beginPath();
    this._ctx.moveTo(x, y);
    this._ctx.lineTo(x - this._wx, y);
    this._ctx.lineTo(x - h - this._wx, y + h);
    this._ctx.lineTo(x - h, y + h);
    this._ctx.lineTo(x + h, y + h);
    this._ctx.closePath();
    this._ctx.fillStyle = this.shadeColor(this._color, 10);
    this._ctx.strokeStyle = this.shadeColor(this._color, 50);
    this._ctx.stroke();
    this._ctx.fill();

    // à droite
    this._ctx.beginPath();
    this._ctx.moveTo(x, y);
    this._ctx.lineTo(x, y - this._wy);
    this._ctx.lineTo(x + h, y + h - this._wy);
    this._ctx.lineTo(x + h, y + h); // Le bon
    this._ctx.closePath();
    this._ctx.fillStyle = this.shadeColor(this._color, 10);
    this._ctx.strokeStyle = this.shadeColor(this._color, 50);
    this._ctx.stroke();
    this._ctx.fill();

    // Flèche vers le haut
    this._ctx.beginPath();
    this._ctx.moveTo(x, y - this._wy);
    this._ctx.lineTo(x - this._wx/2, y - this._wy * 1.5);
    this._ctx.lineTo(x - this._wx, y - this._wy);
    this._ctx.fillStyle = this.shadeColor(this._color, 20);
    this._ctx.strokeStyle = this.shadeColor(this._color, 60);
    this._ctx.fill();
  }

  drawLefttButton(_x, y, h) {
    let x = _x - (this._wx + 5)

    // carré du milieu du cube
    this._ctx.beginPath();
    this._ctx.moveTo(x, y);
    this._ctx.lineTo(x - this._wx , y);
    this._ctx.lineTo(x - this._wx , y - this._wy);
    this._ctx.lineTo(x , y - this._wy);
    this._ctx.closePath();
    this._ctx.fillStyle = this.shadeColor(this._color, 20);
    this._ctx.strokeStyle = this.shadeColor(this._color, 60);
    this._ctx.stroke();
    this._ctx.fill();

     // à gauche
    this._ctx.beginPath();
    this._ctx.moveTo(x - this._wx, y);
    this._ctx.lineTo(x - this._wx, y - this._wy);
    this._ctx.lineTo(x - h- this._wx, y - h- this._wy);
    // this._ctx.lineTo(x - h- this._wx, y); // Le bon
    this._ctx.lineTo(x - h- this._wx, y + h); // Ajout spécifique au bouton
    this._ctx.closePath();
    this._ctx.fillStyle = this.shadeColor(this._color, 10);
    this._ctx.strokeStyle = this.shadeColor(this._color, 50);
    this._ctx.stroke();
    this._ctx.fill();

    // En haut
    this._ctx.beginPath();
    this._ctx.moveTo(x - this._wx, y - this._wy);
    this._ctx.lineTo(x, y - this._wy);
    this._ctx.lineTo(x - h, y - h- this._wy);
    this._ctx.lineTo(x - h- this._wx, y - h- this._wy);
    this._ctx.closePath();
    this._ctx.fillStyle = this.shadeColor(this._color, 10);
    this._ctx.strokeStyle = this.shadeColor(this._color, 50);
    this._ctx.stroke();
    this._ctx.fill();

    // En bas
    this._ctx.beginPath();
    this._ctx.moveTo(x, y);
    this._ctx.lineTo(x - this._wx, y);
    this._ctx.lineTo(x - h - this._wx, y + h);
    this._ctx.lineTo(x - h, y + h);
    this._ctx.lineTo(x - h, y + h); // Ajout spécifique au bouton
    this._ctx.closePath();
    this._ctx.fillStyle = this.shadeColor(this._color, 10);
    this._ctx.strokeStyle = this.shadeColor(this._color, 50);
    this._ctx.stroke();
    this._ctx.fill();

    // Flèche vers la droite
    this._ctx.beginPath();
    this._ctx.moveTo(x, y);
    this._ctx.lineTo(x + this._wx/2, y - this._wy/2); // x, y
    this._ctx.lineTo(x, y - this._wy);
    this._ctx.fillStyle = this.shadeColor(this._color, 20);
    this._ctx.strokeStyle = this.shadeColor(this._color, 60);
    this._ctx.fill();
  }

  draw() {
    this.drawUpButton(this._xUp, this._yUp, this._hUp);
    this.drawRightButton(this._xRight, this._yRight, this._hRight);
    this.drawDownButton(this._xDown, this._yDown, this._hDown);
    this.drawLefttButton(this._xLeft, this._yLeft, this._hLeft);
  }
}