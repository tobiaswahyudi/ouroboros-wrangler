const MOVE_ANIM_DUR = 4;

const SQUARE_SIZE = 64;

class LevelManager {
  constructor(game, levelState) {
    this.game = game;
    this.history = new LevelHistory(levelState);
  }

  get state() {
    return this.history.getCurrent();
  }

  handleInput(keyCode) {
    switch (keyCode) {
      case "ArrowUp":
      case "KeyW":
        this.history.copyTop();
        if (!this.makeMove(Direction.UP)) this.history.pop();
        return true;
        break;
      case "ArrowDown":
      case "KeyS":
        this.history.copyTop();
        if (!this.makeMove(Direction.DOWN)) this.history.pop();
        return true;
        break;
      case "ArrowLeft":
      case "KeyA":
        this.history.copyTop();
        if (!this.makeMove(Direction.LEFT)) this.history.pop();
        return true;
        break;
      case "ArrowRight":
      case "KeyD":
        this.history.copyTop();
        if (!this.makeMove(Direction.RIGHT)) this.history.pop();
        return true;
        break;
      case "Space":
        this.history.copyTop();
        if (!this.makeMove(Direction.SLEEP)) this.history.pop();
        return true;
        break;
      case "KeyR":
        this.restartLevel();
        return true;
      case "KeyZ":
        this.history.pop();
        return true;
      case "Escape":
        this.returnToZone(false);
        return true;
        break;
      default:
        // return false so it's not prevented
        return false;
    }
  }

  renderGame() {
    const { width, height } = this.game;

    // Game area background
    this.game.drawRect(0, 0, width, height, { fill: "#444444" });

    const levelOffsetX = (width - this.state.cols * SQUARE_SIZE) / 2;
    const levelOffsetY = (height - this.state.rows * SQUARE_SIZE) / 2;

    const pos = new Position(levelOffsetX, levelOffsetY);

    this.state.snek.forEach((seg, idx, arr) => {
      this.game.ctx.save();
      this.game.ctx.translate(
        pos.x + (seg.x + 0.5) * SQUARE_SIZE,
        pos.y + (seg.y + 0.5) * SQUARE_SIZE
      );
      this.game.ctx.rotate(rotationFromRight(seg.direction) * Math.PI);

      let bodyPart = ASSETS.SPRITE.SNEK.body;
      if (seg.head) bodyPart = ASSETS.SPRITE.SNEK.head;
      else if (idx === arr.length - 1) bodyPart = ASSETS.SPRITE.SNEK.tail;
      else if (seg.direction !== arr[idx + 1].direction)
        bodyPart = ASSETS.SPRITE.SNEK.curve;

      this.game.drawImage(
        bodyPart.sheet,
        -SQUARE_SIZE / 2,
        -SQUARE_SIZE / 2,
        SQUARE_SIZE,
        SQUARE_SIZE,
        {
          x: bodyPart.x,
          y: bodyPart.y,
          width: bodyPart.width,
          height: bodyPart.height,
        }
      );
      this.game.ctx.restore();
    });

    this.game.drawImage(
      ASSETS.SPRITE.PLAYER.sheet,
      pos.x + this.state.player.x * SQUARE_SIZE,
      pos.y + this.state.player.y * SQUARE_SIZE,
      SQUARE_SIZE,
      SQUARE_SIZE,
      {
        x: ASSETS.SPRITE.PLAYER.x,
        y: ASSETS.SPRITE.PLAYER.y,
        width: ASSETS.SPRITE.PLAYER.width,
        height: ASSETS.SPRITE.PLAYER.height,
      }
    );

    this.state.crates.forEach((crate) => {
      this.game.drawImage(
        ASSETS.SPRITE.CRATE.sheet,
        pos.x + crate.x * SQUARE_SIZE,
        pos.y + crate.y * SQUARE_SIZE,
        SQUARE_SIZE,
        SQUARE_SIZE,
        {
          x: ASSETS.SPRITE.CRATE.x,
          y: ASSETS.SPRITE.CRATE.y,
          width: ASSETS.SPRITE.CRATE.width,
          height: ASSETS.SPRITE.CRATE.height,
        }
      );
    });

    this.state.blocks.forEach((block) => {
      this.game.drawImage(
        ASSETS.SPRITE.BLOCK.sheet,
        pos.x + block.x * SQUARE_SIZE,
        pos.y + block.y * SQUARE_SIZE,
        SQUARE_SIZE,
        SQUARE_SIZE,
        {
          x: ASSETS.SPRITE.BLOCK.x,
          y: ASSETS.SPRITE.BLOCK.y,
          width: ASSETS.SPRITE.BLOCK.width,
          height: ASSETS.SPRITE.BLOCK.height,
        }
      );
    });

    this.state.apples.forEach((apple) => {
      this.game.drawImage(
        ASSETS.SPRITE.APPLE.sheet,
        pos.x + apple.x * SQUARE_SIZE,
        pos.y + apple.y * SQUARE_SIZE,
        SQUARE_SIZE,
        SQUARE_SIZE,
        {
          x: ASSETS.SPRITE.APPLE.x,
          y: ASSETS.SPRITE.APPLE.y,
          width: ASSETS.SPRITE.APPLE.width,
          height: ASSETS.SPRITE.APPLE.height,
        }
      );
    });
  }

  verifyMoveBounds(srcX, srcY, moveX, moveY) {
    const newX = srcX + moveX;
    const newY = srcY + moveY;
    if (
      newX < 0 ||
      newX >= this.state.cols ||
      newY < 0 ||
      newY >= this.state.rows
    ) {
      return false;
    }
    if (
      this.state.blocks.some((block) => block.x === newX && block.y === newY)
    ) {
      return false;
    }
    return true;
  }

  tryMove(src, moveX, moveY) {
    if (!this.verifyMoveBounds(src.x, src.y, moveX, moveY)) return false;
    src.x += moveX;
    src.y += moveY;
    return true;
  }

  makeMove(direction) {
    if (this.levelIsDone) return;
    const dirVec = getDirVec(direction);
    const originalPlayer = this.state.player.clone();
    const ok = this.tryMove(this.state.player, dirVec.x, dirVec.y);
    if (!ok) return false;

    const crate = this.state.crates.find(
      (crate) =>
        crate.x === this.state.player.x && crate.y === this.state.player.y
    );
    if (crate) {
      const ok = this.tryMove(crate, dirVec.x, dirVec.y);
      if (!ok) {
        this.state.player = originalPlayer;
        return false;
      }
    }

    this.checkLevelStatus();
    return true;
  }

  checkAimArea(pos) {
    return this.state.aimArea.lookup.has(pos);
  }

  // Check if level is completed, failed, etc.
  checkLevelStatus() {
    // if (this.state.gobbos.length === 0) {
    // this.levelIsDone = true;
    // }
  }

  checkLevelDone() {
    if (
      this.levelIsDone &&
      !this.levelIsTransitioning &&
      this.animations.length === 0
    ) {
      this.levelIsTransitioning = true;
      this.returnToZone(true);
    }
  }

  restartLevel() {
    this.state.turnCount = 0;
    this.canHandleInput = false;
    this.restartHeldSince = null;
    this.history.reset();
  }
}
