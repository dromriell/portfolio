import tilesBakedTextureURL from "../../static/textures/tilesBaked.jpg";
import floorBakedTextureURL from "../../static/textures/floorBaked.jpg";
import tilesModelURL from "../../static/models/stackTiles.glb?url";

export default [
  {
    name: "tilesBakedTexture",
    type: "texture",
    path: tilesBakedTextureURL,
  },
  {
    name: "floorBakedTexture",
    type: "texture",
    path: floorBakedTextureURL,
  },
  {
    name: "tilesModel",
    type: "gltfModel",
    path: tilesModelURL,
  },
];
