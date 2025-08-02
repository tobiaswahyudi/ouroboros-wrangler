const FONTS = [["Tiny5", ["400"]]];

const SPRITESHEETS = {
  one: "assets/sprite/sheet1.png",
};

const ASSETS = {
  SPRITE: {
    SNEK: {
      tail: new SheetSprite(SPRITESHEETS.one, 0, 0, 16, 16),
      body: new SheetSprite(SPRITESHEETS.one, 16, 0, 16, 16),
      curve: new SheetSprite(SPRITESHEETS.one, 32, 0, 16, 16),
      head: new SheetSprite(SPRITESHEETS.one, 48, 0, 16, 16),
    },
    APPLE: new SheetSprite(SPRITESHEETS.one, 0, 16, 16, 16),
    CRATE: new SheetSprite(SPRITESHEETS.one, 16, 16, 16, 16),
    PLAYER: new SheetSprite(SPRITESHEETS.one, 32, 16, 16, 16),
    BLOCK: new SheetSprite(SPRITESHEETS.one, 48, 16, 16, 16),
  },
};

const _flatten = (obj) => {
  return Object.values(obj).flatMap((v) =>
    typeof v === "object" ? _flatten(v) : v
  );
};

const ALL_ASSETS = _flatten(ASSETS);
