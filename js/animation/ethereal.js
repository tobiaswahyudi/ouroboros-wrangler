const ETHEREAL_START = 0.8;
const ETHEREAL_END = 1.4;
const ETHEREAL_OPACITY = 0.6;
const ETHEREAL_OUT_FRAMES = 8;
const ETHEREAL_IN_FRAMES = 4;

const ETHEREAL_RENDER = (img, x, y, originalSize, params) => (game, frame) => {
  const {
    etherealStart = ETHEREAL_START,
    etherealEnd = ETHEREAL_END,
    etherealOpacity = ETHEREAL_OPACITY,
    etherealInFrames = ETHEREAL_IN_FRAMES,
    etherealOutFrames = ETHEREAL_OUT_FRAMES,
  } = params;

  const opacityProgress =
    frame < etherealInFrames
      ? frame / etherealInFrames
      : 1 - (frame - etherealInFrames) / etherealOutFrames;

  const scaleProgress = frame / (etherealInFrames + etherealOutFrames);
  const scale = etherealStart + (etherealEnd - etherealStart) * scaleProgress;

  const size = originalSize * scale;
  const halfSize = size * 0.5;

  game.ctx.save();
  game.ctx.globalAlpha = etherealOpacity * opacityProgress;

  if(img instanceof SheetSprite) {
    game.drawImage(
      img.sheet,
      x - halfSize,
      y - halfSize,
      size,
      size,
      {
        x: img.x,
        y: img.y,
        width: img.width,
        height: img.height,
      }
    )
  } else {
    game.drawImage(img, x - halfSize, y - halfSize, size, size);
  }

  game.ctx.restore();
};

class EtherealAnimation extends GSAnimation {
  constructor(x, y, img, originalSize, params = {}, callback) {
    const {
      etherealInFrames = ETHEREAL_IN_FRAMES,
      etherealOutFrames = ETHEREAL_OUT_FRAMES,
    } = params;

    super({
      frames: etherealInFrames + etherealOutFrames,
      render: ETHEREAL_RENDER(img, x, y, originalSize, params),
      callback: callback,
    });
  }
}
