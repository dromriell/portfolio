import tilesBakedTextureURL from "../../static/textures/tilesBaked.jpg";
import floorBakedTextureURL from "../../static/textures/floorBaked.jpg";
import tilesModelURL from "../../static/models/stackTiles.glb?url";
import bathroomBakedTextureURL from "../../static/textures/bathroomBaked.jpg";
import bathroomParticleTextureURL from "../../static/textures/12.png";
import bathroomModelURL from "../../static/models/bathroom.glb?url";

export const tileSources = [
  {
    name: "tilesBakedTexture",
    type: "texture",
    path: tilesBakedTextureURL,
    parent: "tile",
  },
  {
    name: "floorBakedTexture",
    type: "texture",
    path: floorBakedTextureURL,
    parent: "tile",
  },
  {
    name: "tilesModel",
    type: "gltfModel",
    path: tilesModelURL,
    parent: "tile",
  },
];

export const bathroomSources = [
  {
    name: "bakedTexture",
    type: "texture",
    path: bathroomBakedTextureURL,
    parent: "bathroom",
  },
  {
    name: "particleTexture",
    type: "texture",
    path: bathroomParticleTextureURL,
    parent: "bathroom",
  },
  {
    name: "model",
    type: "gltfModel",
    path: bathroomModelURL,
    parent: "bathroom",
  },
];
