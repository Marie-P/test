export default class Map {
  constructor() {
    this.name = "map";
    this.tilemap = [];
    this.tilemap2 = [];
    this.numberLayers;
    this.mapHeight;
    this.mapWidth;
    this.numberTiles;
    this.tileset;
    this.tilesHeight;
    this.tilesWidth;
    this.posX;
    this.posY;
    this.sprites = [];
    this.spritesSupport = [];
    this.proceduralGeneration = [];
    this.savedBackground1;
    this.savedBackground2;
  }
}