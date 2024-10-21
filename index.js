const { data } = require('./data.json');

async function main() {
  const skins = data.slice(0, 10);
  const slimSkins = skins.map((item) => ({
    uuid: item.uuid,
    item_name: item.item_name,
    wear_name: item.wear_name,
    skin_name: item.skin_name,
    rarity_name: item.rarity_name,
    uvType: item.uvType,
    defindex: item.defindex,
    paintindex: item.paintindex,
    texture: item.texture,
    slot: "",
    material: {
      name: item.item.paint_data.paintablematerial0.name,
      uvscale: item.item.paint_data.paintablematerial0.uvscale,
    },
  }));
}
main();
