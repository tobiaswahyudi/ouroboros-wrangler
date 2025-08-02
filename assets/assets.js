const FONTS = [
    ['Tiny5', ['400']],
  ];
  
const ASSETS = {
    SPRITE: {
        SHEET1: "assets/sprite/sheet1.png",
    },
};

const _flatten = (obj) => {
return Object.values(obj).flatMap((v) =>
    typeof v === "object" ? _flatten(v) : v
);
};

const ALL_ASSETS = _flatten(ASSETS);
