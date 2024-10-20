const { data } = require('./data.json');

async function main() {
  const skins = data.slice(0, 10);
  const slimSkins = skins.map((item) => ({
    uuid: item.uuid,
    rarity_name: item.rarity_name,
    item_name: item.item_name,
    wear_name: item.wear_name,
    skin_name: item.skin_name,
    uvType: item.uvType,
    defindex: item.defindex,
    paintindex: item.paintindex,
    texture: `${item.texture}_component1_texture1.png`,
    material: {
      name: item.item.paint_data.paintablematerial0.name,
      uvscale: item.item.paint_data.paintablematerial0.uvscale,
      basetextureoverride: item.item.paint_data.paintablematerial0.basetextureoverride,
    },
    paint: {
      use_legacy_model: item.paint.use_legacy_model,
    },
  }));
}
main();
