class SnakeSegment extends Position {
  constructor(x, y, direction, head = false) {
    super(x, y);
    this.direction = direction;
    this.head = head;
  }

  clone() {
    return new SnakeSegment(this.x, this.y, this.direction, this.head);
  }
}

class LevelState {
  constructor() {
    this.turnCount = 0;
    this.player = new Position(0, 0);
    this.snek = [];
    this.crates = [];
    this.blocks = [];
    this.apples = [];
    this.id = "";
    this.bestMoves = 0;
    this.rows = 0;
    this.cols = 0;
    this.gameOver = false;
    this.gameOverMessage = "";
  }

  static make({ id = "", title = "", level, bestMoves = 0 }) {
    const state = new LevelState();
    state.id = id;
    state.title = title;
    state.levelString = level;
    state.bestMoves = bestMoves;
    state.parse();
    return state;
  }

  clone() {
    const state = new LevelState();
    state.id = this.id;
    state.title = this.title;
    state.levelString = this.levelString;
    state.bestMoves = this.bestMoves;
    state.player = this.player.clone();
    state.snek = this.snek.map((snek) => snek.clone());
    state.crates = this.crates.map((crate) => crate.clone());
    state.blocks = this.blocks.map((block) => block.clone());
    state.apples = this.apples.map((apple) => apple.clone());
    state.rows = this.rows;
    state.cols = this.cols;
    state.turnCount = this.turnCount;
    return state;
  }

  parse(specialTiles = {}) {
    const lines = this.levelString.split("\n").filter((x) => x.length);

    this.rows = lines.length;
    this.cols = lines[0].trim().split("|").length;

    const snakeBefore = {};
    let snakeHead = null;

    for (let y = 0; y < this.rows; y++) {
      const line = lines[y];
      const cells = line.trim().split("|");
      for (let x = 0; x < this.cols; x++) {
        const cell = cells[x];
        if (cell in specialTiles) {
          const [ctor, ...args] = specialTiles[cell];
          this.specialTiles.push(new ctor(x, y, ...args));
          continue;
        }
        switch (cell[0]) {
          case "B":
            this.blocks.push(new Position(x, y));
            break;
          case "C":
            this.crates.push(new Position(x, y));
            break;
          case "H": {
            const direction = cell[1];
            snakeHead = new SnakeSegment(x, y, direction, true);
            break;
          }
          case "S":
            {
              const direction = cell[1];
              const currentSeg = new SnakeSegment(
                x,
                y,
                direction,
                false
              );
              const nextDir = currentSeg.add(getDirVec(direction));
              snakeBefore[nextDir.toString()] = currentSeg;
            }
            break;
          case "Y":
            this.player = new Position(x, y);
            break;
          case "A":
            this.apples.push(new Position(x, y));
            break;
        }
      }
    }

    //trace snake
    this.snek = [snakeHead];
    let currentSeg = snakeHead;
    while (currentSeg) {
      const next = snakeBefore[currentSeg.toString()];
      if (next) {
        currentSeg = next;
        this.snek.push(currentSeg);
      } else {
        currentSeg = null;
      }
    }
  }
}
