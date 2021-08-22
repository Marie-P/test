import Model from "./model.js";
import Character from "./utils/character.js";
import View from "./view.js"

export default class Controller {
  constructor() {
    this.model = new Model();
    this.view = new View(this.model.nbPlayers);
  }

  async load() {
    await this.initMap();
    await this.initCharacters();
    document.body.appendChild(this.view.canvas);
    if(this.model.nbPlayers == 2)
      document.body.appendChild(this.view.canvas2);
    this.start();
  }

  async initMap() {
    await this.model.setMap();
    this.proceduralGeneration();
  }

  async initCharacters() {
    let conf = await fetch("./assets/atlas/" + this.model.choosenFirstCharacter + ".json");
    let characterJson = await conf.json();
    let spritesheet = await this.model.pic("./assets/atlas/" + characterJson["meta"]["image"]);
    this.setCharacter(characterJson, spritesheet, 1);

    if(this.model.nbPlayers == 2) {
      conf = await fetch("./assets/atlas/" + this.model.choosenSecondCharacter + ".json");
      characterJson = await conf.json();
      spritesheet = await this.model.pic("./assets/atlas/" + characterJson["meta"]["image"]);
      this.setCharacter(characterJson, spritesheet, 2);
    }
  }

  /**
   * Génération de la map.
   */
   proceduralGeneration() {
    this.initSprite(this.view.context); // voir pour enlever this.view.backgroundWidth
    this.setBackground(Math.floor(Math.random() * 3), this.view.backgroundWidth, this.view.backgroundHeight, this.model.map.tilemap, 1);
    this.setCourse(this.view.canvas, this.model.map.tilemap);
      
    if(this.model.nbPlayers == 2) {
      this.initSprite(this.view.context2);
      this.setBackground(Math.floor(Math.random() * 3), this.view.backgroundWidth2, this.view.backgroundHeight2, this.model.map.tilemap2, 2);
      this.setCourse(this.view.canvas2, this.model.map.tilemap2);
    }
  }

  /**
   * Initialisation des sprites qui vont être utilisé pour la map du jeu.
   */
   initSprite(context) {
    context.drawImage(this.model.map.tileset, 0, 0, this.model.map.tileset.width, this.model.map.tileset.height);
    for (let y = 0; y < this.model.map.tileset.height/this.model.map.tilesHeight; y++) {
      for (let x = 0; x < this.model.map.tileset.width/this.model.map.tilesWidth; x++) {
        this.model.map.sprites.push(
          context.getImageData(
            x * this.model.map.tilesWidth, y * this.model.map.tilesHeight,
            this.model.map.tilesWidth, this.model.map.tilesHeight
          )
        );
      }
    }
  }

  /**
   * Initialisation du fond de la map.
   * @param {Number} randomNumber : nombre associé à un ensemble de sprite pour le décors
   */
  setBackground(randomNumber, backgroundWidth, backgroundHeight, tilemap, nbMap) {
    let tilesBackground = randomNumber == 0 ? [30, 29, 70, 69] : randomNumber == 1 ? [110, 109, 150, 149] : randomNumber == 2 ? [190, 189, 230, 229] : [];
    
    for (let y = 0; y+1 < backgroundHeight ; y+=2) {
      for (let x = 0; x+1 < this.model.map.sizeWidth; x+=2) {
        tilemap[y * backgroundWidth + x] = tilesBackground[0];
        tilemap[y * backgroundWidth + (x+1)] = tilesBackground[1];
        tilemap[(y+1) * backgroundWidth + x] = tilesBackground[2];
        tilemap[(y+1) * backgroundWidth + (x+1)] = tilesBackground[3];
      }
    }
    if(nbMap == 1) {
      this.model.map.savedBackground1 = tilemap[13 * backgroundWidth + 380];
      tilemap[13 * backgroundWidth + 380] = 82;
    } else {
      this.model.map.savedBackground2 = tilemap[13 * backgroundWidth + 380];
      tilemap[13 * backgroundWidth + 380] = 82;
    }
  }

  /**
   * Initialisation du parcours.
   */
   setCourse(canvas, tilemap) {
    let y = 14,
      sprite = this.model.map.spritesSupport[Math.floor(Math.random()*this.model.map.spritesSupport.length)];
    for (let x = 0; x < this.model.map.sizeWidth; x++) {
      let randNumber = Math.floor(Math.random() * 2),
          maxX = x + 5;
      // if(randNumber == 1 || x < 5 || x > 375) {
        for(x -= 1; x < maxX; x++){
          tilemap[y * canvas.width + x] = sprite;
      //   }
      // } else{
        // for(x -= 1; x < maxX; x++){
          // tilemap[(y - 5) * canvas.width + x] = sprite;
        // }
      }
    }
  }

  //  setCourse(canvas, tilemap) {
  //   let y = 14,
  //     sprite = this.model.map.spritesSupport[Math.floor(Math.random()*this.model.map.spritesSupport.length)];
  //   for (let x = 0; x < this.model.map.sizeWidth; x++) {
  //     let randNumber = Math.floor(Math.random() * 2),
  //         maxX = x + 5;
  //     if(randNumber == 1 || x < 5 || x > 375) {
  //       for(x -= 1; x < maxX; x++){
  //         tilemap[y * canvas.width + x] = sprite;
  //       }
  //     } else{
  //       for(x -= 1; x < maxX; x++){
  //         tilemap[(y - 5) * canvas.width + x] = sprite;
  //       }
  //     }
  //   }
  // }

  /**
   * Initialisation des personnages.
   * @param {*} characterJson : fichier json du personnage.
   * @param {*} spritesheet : ensemble des sprites du perso.
   */
   setCharacter(characterJson, spritesheet, player) {
    if(player == 1) {
      this.model.character1 = new Character(characterJson, spritesheet, this.model.choosenFirstCharacter, 0, this.lastSprites(this.model.choosenFirstCharacter));
      this.setSprites(this.model.character1 , this.model.choosenFirstCharacter);
    }

    else if(player == 2) {
      this.model.character2 = new Character(characterJson, spritesheet, this.model.choosenSecondCharacter, 0, this.lastSprites(this.model.choosenSecondCharacter));
      this.setSprites(this.model.character2 , this.model.choosenSecondCharacter);
    }
  }

  setSprites(character) {
    character.posX = 0;
    character.posY = 12;
    this.addSprites(character, character.name, "walk", character.lastSprites.walk);
    this.addSprites(character, character.name, "stand", character.lastSprites.stand);
    this.addSprites(character, character.name, "run", character.lastSprites.run);
    this.addSprites(character, character.name, "fall", character.lastSprites.fall);
    this.addSprites(character, character.name, "jump", character.lastSprites.jump);
    this.addSprites(character, character.name, "win", character.lastSprites.win);
    this.addSprites(character, character.name, "lose", character.lastSprites.lose);
  }

  addSprites(character, nameCharacter, moveType, toGetLastSprites) {
    character.addSprites(
      moveType, 
      toGetLastSprites,
      nameCharacter+"_"+ moveType, 
      this.setPosX(character.name, moveType),
      this.setPosY(character.name, moveType)
    );
  }

  lastSprites(character) {
    if(character == "pikachu") {
      return {walk: 5, stand : 1, fall : 1, run : 10, jump : 13, win : 38, lose : 1};
    } else if(character == "naruto") {
      return {walk: 6, stand : 1, fall : 1, run : 10, jump : 7, win : 15, lose : 1};
    } else if(character == "luffy") {
      return {walk: 5, stand : 1, fall : 1, run : 8, jump :6, win : 8, lose : 1};
    }
  }

  setPosX(character, state) {
    if(character == "pikachu") {
      return state == "walk" ? [0.1, 0.1, 0.1, 0.6, 0.1] : state == "run" ? 0.2 : 1;
    } else if(character == "naruto") {
      return state == "walk" ? [0.6, 0.1, 0.1, 0.2, 0.1, 0.1] : state == "run" ? 0.2 : 1;
    } else if(character == "luffy") {
      return state == "walk" ? [0.1, 1, 0.1, 0.1, 1] : state == "run" ? 0.2 : 1;
    }
  }

  /**
   * Pour adapter l'ordonnée du sprite avec la Map.
   * @param {*} character 
   * @param {*} state : walk, jump, run...
   */
  setPosY(character, state) {
    if(character == "pikachu") {
      return state == "walk" ? [0, -0.1, 0, -0.2, 0] : state == "run" ? 0.3 : state == "jump" ? [-0.0, -0.0, -0.3, -0.3, -0.5, -0.7, -6.5, -6.3, -6.2, -6, -5.5, -5, -5] : state == "win" ? -0.4 : state == "lose" ? 0 : 0;
    } else if(character == "naruto") {
      return state == "walk" ? -1.8 : state == "run" ? -1 : state == "jump" ? [-0.7, -0.7, -6.5, -6.5, -6.5, -6, -5] : state == "win" ? [-3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -1, -1, -1] : state == "lose" ? -1.6 : -1.6;
    } else if(character == "luffy") {
      return state == "walk" ? -2 : state == "run" ? -1.3 : state == "jump" ? [-1.8, -1.8, -7, -7, -7, -10] : state == "lose" ? -1.8: -1.8;
    }
  }

  /**
   * Cette méthode permet de, en fonction des touches enregistrées dans le tableau, bouger les personnages
   */
  moveWithKeys() {
    // if(this.model.nbPlayers == 1)
    //   this.model._isMoving = true;
    this.model.keysArray.forEach(element => {
      switch(element) {
        case "ArrowRight":
          this.arrowRightMovement(this.model.character1);
          this.model.countBeforeRunning1++;
          break;
        case "ArrowUp":
          this.model._direction = 'N';
          this.arrowUpMovement(this.model.character1);
          break;
        case "KeyD":
          this.arrowRightMovement(this.model.character2);
          this.model.countBeforeRunning2++;
          break;
        case "KeyW":
          this.model._direction2 = 'N';
          this.arrowUpMovement(this.model.character2);
          break;
        default:
          this.model._direction = null;
          this.model._direction2 = null;
          break;
      }
    });
  }

  keydownFunction(event) {
    // Ajout dès qu'il y a une nouvelle touche entrée
    if(this.model.keysArray.indexOf(event.code) === -1)
      this.model.keysArray.push(event.code);
    this.moveWithKeys();
    // if(this.model.nbPlayers == 1)
    //   this.model._isMoving = true;
    // switch(event.code) {
    //   case "ArrowRight":
    //     this.arrowRightMovement(this.model.character1);
    //     break;
    //   case "ArrowUp":
    //     this.model._direction = 'N';
    //     this.arrowUpMovement(this.model.character1);
    //     break;
    //   default:
    //     this.model._direction = null;
    //     break;
    // }
  }

  keyupFunction(event) {
    // if(this.model.nbPlayers == 1)
    // this.model._isMoving = false;
    // this.removeKey(this.model.keysArray, event);

    this.model.keysArray.splice(this.model.keysArray.indexOf(event.code), this.model.keysArray.indexOf(event.code) + 1)
    if (event.code == "ArrowUp" || event.code == "ArrowLeft" || event.code == "ArrowDown" || event.code == "ArrowRight")
      this._isMoving = false;
    else if(event.code == "KeyW" || event.code == "KeyA" || event.code == "KeyS" ||  event.code == "KeyD")
      this._isMoving2 = false;
    // this.model._direction = null;
    switch(event.code) {
      case "ArrowRight":
        this.model.countBeforeRunning1 = 0;
        if(this.model.character1.move != "fall" && this.model.character1.move != "jump" && this.model.character1.move != "win" && this.model.character1.move != "lose")
          if(this.model.character1.move != "walk")
            this.model.character1.stand();
        break;
      case "KeyD":
        this.model.countBeforeRunning2 = 0;
        if(this.model.character2.move != "fall" && this.model.character2.move != "jump" && this.model.character2.move != "win" && this.model.character2.move != "lose")
          if(this.model.character2.move != "walk")
            this.model.character2.stand();
        break;
      default:
        break;
    } 
  }
  touchstartFunction(event){
    // joystick
    if((event.touches[0].clientX <= this.view._centerX + 50 && event.touches[0].clientX >= this.view._centerX - 50) && (event.touches[0].clientY <= this.view._centerY + 50 && event.touches[0].clientY >= this.view._centerY - 50)) {
      this.view._x = event.touches[0].clientX;
      this.view._y = event.touches[0].clientY;
      
      this.model._isMoving = true;
    }

    // touches directionnelles
    // up
    if((event.touches[0].clientX < this.view.directionalButtonsX + this.view.directionalButtonsH && event.touches[0].clientX > this.view.directionalButtonsX - (this.view.buttons._wx - 5)) && (event.touches[0].clientY < this.view.directionalButtonsY - (this.view.buttons._wy - 5) - this.view.directionalButtonsH && event.touches[0].clientY > this.view.directionalButtonsY - this.view.buttons._wy * 2)) {
      this.model._direction = 'N';
      this.arrowUpMovement(this.model.character1);
      this.view.buttons._hUp = 0;
      this.view.buttons._xUp = this.view.directionalButtonsX;
      this.view.buttons._yUp = this.view.directionalButtonsY - this.view.directionalButtonsH;
    }

    // right
    else if((event.touches[0].clientY < this.view.directionalButtonsY + this.view.directionalButtonsH && event.touches[0].clientY > this.view.directionalButtonsY - (this.view.buttons._wy - 5)) && (event.touches[0].clientX < this.view.directionalButtonsX + (this.view.buttons._wx + 5) + this.view.directionalButtonsH && event.touches[0].clientX > this.view.directionalButtonsX + this.view.directionalButtonsH)){
      this.arrowRightMovement(this.model.character1);
      this.model.pressed = true;
      this.view.buttons._hRight = 0;
      this.view.buttons._xRight = this.view.directionalButtonsX + this.view.directionalButtonsH;
      this.view.buttons._yRight = this.view.directionalButtonsY;
    }

    // down
    else if((event.touches[0].clientX < this.view.directionalButtonsX + this.view.directionalButtonsH && event.touches[0].clientX > this.view.directionalButtonsX - (this.view.buttons._wx - 5)) && (event.touches[0].clientY < this.view.directionalButtonsY + (this.view.buttons._wy + 5) + this.view.directionalButtonsH && event.touches[0].clientY > this.view.directionalButtonsY + this.view.directionalButtonsH)) {
      this.view.buttons._hDown = 0;
      this.view.buttons._xDown = this.view.directionalButtonsX;
      this.view.buttons._yDown = this.view.directionalButtonsY + this.view.directionalButtonsH;
    }

    // left
    else if((event.touches[0].clientY < this.view.directionalButtonsY + this.view.directionalButtonsH && event.touches[0].clientY > this.view.directionalButtonsY - (this.view.buttons._wy - 5)) && (event.touches[0].clientX < this.view.directionalButtonsX - (this.view.buttons._wx - 5) - this.view.directionalButtonsH && event.touches[0].clientX > this.view.directionalButtonsX - this.view.buttons._wx * 2)){
      this.view.buttons._hLeft = 0;
      this.view.buttons._xLeft = this.view.directionalButtonsX - this.view.directionalButtonsH;
      this.view.buttons._yLeft = this.view.directionalButtonsY;
    }
  }

  touchmoveFunction(event) {
    if(this.model._isMoving) {
      if(event.touches[0].clientX <= this.view._centerX + 50 && event.touches[0].clientX >= this.view._centerX - 50)
        this.view._x = event.touches[0].clientX;
      if(event.touches[0].clientY <= this.view._centerY + 50 && event.touches[0].clientY >= this.view._centerY - 50)
        this.view._y = event.touches[0].clientY;

      if(event.touches[0].clientY <= this.view._centerY - 45) {
          this.arrowUpMovement(this.model.character1);
      }
        
      else if(event.touches[0].clientX >= this.view._centerX + 45){
        this.model.countBeforeRunning1 = 4;
        this.model._direction = 'E';
        this.model.character1.run();
        this.arrowRightMovement(this.model.character1);
      }
      else if(event.touches[0].clientX >= this.view._centerX + 10){
        this.model.countBeforeRunning1 = 0;
        this.arrowRightMovement(this.model.character1);
      }
    }
  }

  touchendFunction(event) {
    if (this.model.character1.move == "run") this.model.character1.stand();
    this.model.countBeforeRunning1 = 0;
    this.view._x = this.view._centerX;
    this.view._y = this.view._centerY;
    this.model._isMoving = false;
    this.model.pressed = false;

    // touches directionnelles
    // up
    this.view.buttons._hUp = this.view.directionalButtonsH;
    this.view.buttons._xUp = this.view.directionalButtonsX;
    this.view.buttons._yUp = this.view.directionalButtonsY;

    // right
    this.view.buttons._hRight = this.view.directionalButtonsH;
    this.view.buttons._xRight = this.view.directionalButtonsX;
    this.view.buttons._yRight = this.view.directionalButtonsY;

    // down
    this.view.buttons._hDown = this.view.directionalButtonsH;
    this.view.buttons._xDown = this.view.directionalButtonsX;
    this.view.buttons._yDown = this.view.directionalButtonsY;    

    // left
    this.view.buttons._hLeft = this.view.directionalButtonsH;
    this.view.buttons._xLeft = this.view.directionalButtonsX;
    this.view.buttons._yLeft = this.view.directionalButtonsY;
  }
  
  /**
   * Méthode liée au click sur le canvas.
   * @param {MouseEvent} event - représente l'événement de click.
   */
   mousedownFunction(event) {
    // joystick
    if((event.clientX <= this.view._centerX + 50 && event.clientX >= this.view._centerX - 50) && (event.clientY <= this.view._centerY + 50 && event.clientY >= this.view._centerY - 50)) {
      this._x = event.clientX;
      this._y = event.clientY;
      this.model._isMoving = true;
    }

    // touches directionnelles
    // up
    if((event.clientX < this.view.directionalButtonsX + this.view.directionalButtonsH && event.clientX > this.view.directionalButtonsX - (this.view.buttons._wx - 5)) && (event.clientY < this.view.directionalButtonsY - (this.view.buttons._wy - 5) - this.view.directionalButtonsH && event.clientY > this.view.directionalButtonsY - this.view.buttons._wy * 2)) {
      this.model._direction = 'N';
      this.arrowUpMovement(this.model.character1);
      this.view.buttons._hUp = 0;
      this.view.buttons._xUp = this.view.directionalButtonsX;
      this.view.buttons._yUp = this.view.directionalButtonsY - this.view.directionalButtonsH;
    }

    // right
    else if((event.clientY < this.view.directionalButtonsY + this.view.directionalButtonsH && event.clientY > this.view.directionalButtonsY - (this.view.buttons._wy - 5)) && (event.clientX < this.view.directionalButtonsX + (this.view.buttons._wx + 5) + this.view.directionalButtonsH && event.clientX > this.view.directionalButtonsX + this.view.directionalButtonsH)){
      this.arrowRightMovement(this.model.character1);
      this.model.pressed = true;
      this.view.buttons._hRight = 0;
      this.view.buttons._xRight = this.view.directionalButtonsX + this.view.directionalButtonsH;
      this.view.buttons._yRight = this.view.directionalButtonsY;
    }

    // down
    else if((event.clientX < this.view.directionalButtonsX + this.view.directionalButtonsH && event.clientX > this.view.directionalButtonsX - (this.view.buttons._wx - 5)) && (event.clientY < this.view.directionalButtonsY + (this.view.buttons._wy + 5) + this.view.directionalButtonsH && event.clientY > this.view.directionalButtonsY + this.view.directionalButtonsH)) {
      this.view.buttons._hDown = 0;
      this.view.buttons._xDown = this.view.directionalButtonsX;
      this.view.buttons._yDown = this.view.directionalButtonsY + this.view.directionalButtonsH;
    }

    // left
    else if((event.clientY < this.view.directionalButtonsY + this.view.directionalButtonsH && event.clientY > this.view.directionalButtonsY - (this.view.buttons._wy - 5)) && (event.clientX < this.view.directionalButtonsX - (this.view.buttons._wx - 5) - this.view.directionalButtonsH && event.clientX > this.view.directionalButtonsX - this.view.buttons._wx * 2)){
      this.view.buttons._hLeft = 0;
      this.view.buttons._xLeft = this.view.directionalButtonsX - this.view.directionalButtonsH;
      this.view.buttons._yLeft = this.view.directionalButtonsY;
    }
   }

   mouseupFunction(event) {
    if (this.model.character1.move == "run") this.model.character1.stand();
    this.model.countBeforeRunning1 = 0;
    // joystick
    this.view._x = this.view._centerX;
    this.view._y = this.view._centerY;
    this.model._isMoving = false;
    this.model.pressed = false;

    // touches directionnelles
    // up
    this.view.buttons._hUp = this.view.directionalButtonsH;
    this.view.buttons._xUp = this.view.directionalButtonsX;
    this.view.buttons._yUp = this.view.directionalButtonsY;

    // right
    this.view.buttons._hRight = this.view.directionalButtonsH;
    this.view.buttons._xRight = this.view.directionalButtonsX;
    this.view.buttons._yRight = this.view.directionalButtonsY;

    // down
    this.view.buttons._hDown = this.view.directionalButtonsH;
    this.view.buttons._xDown = this.view.directionalButtonsX;
    this.view.buttons._yDown = this.view.directionalButtonsY;    

    // left
    this.view.buttons._hLeft = this.view.directionalButtonsH;
    this.view.buttons._xLeft = this.view.directionalButtonsX;
    this.view.buttons._yLeft = this.view.directionalButtonsY;
   }

   mousemoveFunction(event) {
    if (this.model.character1.move != "win" && this.model.character1.move != "lose"){
      if(this.model._isMoving) {
        if(event.clientX <= this.view._centerX + 50 && event.clientX >= this.view._centerX - 50)
          this.view._x = event.clientX;
        if(event.clientY <= this.view._centerY + 50 && event.clientY >= this.view._centerY - 50)
          this.view._y = event.clientY;
        
        if(event.clientY <= this.view._centerY - 45) {
            this.arrowUpMovement(this.model.character1);
        }
          
        else if(event.clientX >= this.view._centerX + 30){
          this.model.countBeforeRunning1 = 4;
          this.model._direction = 'E';
          this.model.character1.run();
          this.arrowRightMovement(this.model.character1);
        }
        else if(event.clientX >= this.view._centerX + 10){
          this.model.countBeforeRunning1 = 0;
          this.arrowRightMovement(this.model.character1);
        }
      }
     }
    }

  arrowRightMovement(character) {
    if(character.move != "fall" && character.move != "jump" && character.move != "win" && character.move != "lose") {
      if(this.model.countBeforeRunning1 > 3 && character == this.model.character1) {
        this.model._direction = 'E';
        character.run();
      } else if(this.model.countBeforeRunning2 > 3 && character == this.model.character2) {
        this.model._direction2 = 'E';
        character.run();
      } else {
        this.model._direction = null;
        character.walk();
      }
    }
  }

  arrowUpMovement(character) {
    character.state = 0;
    character.jump();
  }

  /**
   * Démarrage du programme avec comme pointeur la fonction loop.
   */
   start() {
    this.loopPointer = window.requestAnimationFrame(stamp => this.loop(stamp));
  }

  /**
   * Arrêt de l'appelle en boucle de la fonction loop.
   */
  stop() {
    window.cancelAnimationFrame(this.loopPointer);
  }

  /**
   * Boucle de frame.
   * @param {Number} stamp - garde le pointeur de la fonction.
   */
   loop(stamp) {
    this.loopPointer = window.requestAnimationFrame(stamp => this.loop(stamp));
    if (this.model.pressed){
      if(this.model.countBeforeRunning1 > 10)
        this.arrowRightMovement(this.model.character1);
      this.model.countBeforeRunning1++;
    }
    else if(this.model.countBeforeRunning1 > 3)
      this.arrowRightMovement(this.model.character1)
    if(this.model.countBeforeRunning2 > 3)
      this.arrowRightMovement(this.model.character2)

    this.view.draw(this.model);

    this.view.camera1 = this.checking(this.model.map.tilemap, this.view.canvas, this.model.character1, this.view.camera1, this.model.map.savedBackground1, this.view.backgroundHeight);
    if(this.model.nbPlayers == 2)
      this.view.camera2 = this.checking(this.model.map.tilemap2, this.view.canvas2, this.model.character2, this.view.camera2, this.model.map.savedBackground2, this.view.backgroundHeight2);
    // this.checking1(this.model.map.tilemap, this.view.canvas);
    // this.checking2(this.model.map.tilemap2, this.view.canvas2);

    if(this.model._isMoving) {
      switch(this.model._direction) {
        case 'N':
          this.arrowUpMovement(this.model.character1);
          break;
        case 'E':
          this.arrowRightMovement(this.model.character1);
          break;
        default:
          break;
      }
    }
   }

  // TODO : séparer cette fonction en plusieurs étapes (sous-fonction) et régler le problème pour utiliser la même pour les deux joueurs
  checking(tilemap, canvas, character, camera, savedBackground, backgroundHeight) {
    if (character.move == "win") this._isMoving = false;
    if (document.body.clientWidth > 500){
      if (character.posX > 60) {
        tilemap[13 * canvas.width + 380] = savedBackground;
        character.win();
        if (this.model.nbPlayers == 2) { // L'autre adversaire ne pourra plus avancer
          character == this.model.character2 ? this.model.character1.lose() : this.model.character2.lose()
        }
      }
    } else {
      if(character.posX > 15) {
        tilemap[13 * canvas.width + 380] = savedBackground;
        character.win();
      } 
    }
    if(character.move == "jump"){
      character.jump();
    }
    // Pour faire avancer la caméra de la map
    if(document.body.clientWidth > 500) {
      if(character.posX > 30 && camera < 320){
          camera += 1;
          character.posX -= 1;
      }
    } else {
      if(character.posX > 1 && camera < 365){
        camera += 1;
        character.posX -= 0.5;
      }
    }

    // Si le personnage se trouve sur un sprite empêchant de tomber
    if(!this.model.map.spritesSupport.includes(tilemap[(character.posY + 2) * this.view.canvas.width + Math.round(character.posX + camera) + 1])) {
      character.move = "fall";
      character.fall();
    }
    // Retour case départ quand il tombe
    if (character.posY > backgroundHeight){
      character.posX = 0;
      camera = 0;
      character.posY = 12;
      character.move = "stand";
    }

    if (character.move == "fall" && (character.posY > this.view.backgroundHeight || (this.model.map.spritesSupport.includes(tilemap[(character.posY + 2) * this.view.canvas.width + Math.round(character.posX + camera) + 1])))){
      character.move = "stand";
    }
    return camera;
  }

  /* checking1(tilemap, canvas) {
    if(this.model.character1.posX > 45) {
      tilemap[13 * canvas.width + 380] = this.model.map.savedBackground1;
      this.model.character1.win();
    }
    if(this.model.character1.move == "jump"){
      this.model.character1.jump();
    }
    // Pour faire avancer la caméra de la map
    if(document.body.clientWidth > 500) {
      if(this.model.character1.posX > 20 && this.view.camera1 < 335){
          this.view.camera1 += 1;
          this.model.character1.posX -= 0.5;
      }
    } else {
      if(this.model.character1.posX > 1 && this.view.camera1 < 335){
        this.view.camera1 += 1;
        this.model.character1.posX -= 0.5;
      }
    }

    // Si le personnage se trouve sur un sprite empêchant de tomber
    if(!this.model.map.spritesSupport.includes(this.model.map.tilemap[(this.model.character1.posY + 2) * this.view.canvas.width + Math.round(this.model.character1.posX + this.view.camera1) + 1])) {
      this.model.character1.move = "fall";
      this.model.character1.fall();
    }
    // Retour case départ quand il tombe
    if (this.model.character1.posY > this.model.map.mapHeight){
      this.model.character1.posX = 0;
      this.view.camera1 = 0;
      this.model.character1.posY = 12;
      this.model.character1.move = "stand";
    }

    if (this.model.character1.move == "fall" && (this.model.character1.posY > this.model.map.mapHeight || (this.model.map.spritesSupport.includes(this.model.map.tilemap[(this.model.character1.posY + 2) * this.view.canvas.width + Math.round(this.model.character1.posX + this.view.camera1) + 1])))){
      this.model.character1.move = "stand";
    }
   }

   checking2(tilemap, canvas) {
    if(this.model.character2.posX > 45) {
      tilemap[13 * canvas.width + 380] = this.model.map.savedBackground2;
      this.model.character2.win();
    }

    if(this.model.character2.move == "jump"){
      this.model.character2.jump();
    }
    // Pour faire avancer la caméra de la map
    if(document.body.clientWidth > 500) {
      if(this.model.character2.posX > 20 && this.view.camera2 < 335){
          this.view.camera2 += 1;
          this.model.character2.posX -= 0.5;
      }
    } else {
      if(this.model.character2.posX > 1 && this.view.camera2 < 335){
        this.view.camera2 += 1;
        this.model.character2.posX -= 0.5;
      }
    }
    // Si le personnage se trouve sur un sprite empêchant de tomber
    if(!this.model.map.spritesSupport.includes(this.model.map.tilemap2[(this.model.character2.posY + 2) * this.view.canvas.width + Math.round(this.model.character2.posX + this.view.camera2) + 1])) {
      this.model.character2.move = "fall";
      this.model.character2.fall();
    }
    // Retour case départ quand il tombe
    if (this.model.character2.posY > this.model.map.mapHeight){
      this.model.character2.posX = 0;
      this.view.camera2 = 0;
      this.model.character2.posY = 12;
      this.model.character2.move = "stand";
    }

    if (this.model.character2.move == "fall" && (this.model.character2.posY > this.model.map.mapHeight || (this.model.map.spritesSupport.includes(this.model.map.tilemap2[(this.model.character2.posY + 2) * this.view.canvas.width + Math.round(this.model.character2.posX + this.view.camera2) + 1])))){
      this.model.character2.move = "stand";
    }
  }*/
}