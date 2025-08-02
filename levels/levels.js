const level_idktesting = LevelState.make({
    id: "idktesting",
    title: "Snek's first meal",
    level: `
Bl|Bl|Bl|Bl|Bl|Bl|Bl|Bl|Bl|Bl
Bl|..|Bl|Bl|..|..|..|..|..|Bl
Bl|..|Bl|..|..|..|Hl|Sl|..|Bl
Bl|..|Yu|..|..|..|..|Su|..|Bl
Bl|..|..|..|Cr|..|..|Su|..|Bl
Bl|..|Bl|..|..|Ap|..|Su|..|Bl
Bl|..|..|..|..|..|..|Su|..|Bl
Bl|Bl|Bl|Bl|Bl|Bl|Bl|Bl|Bl|Bl
`,
    bestMoves: 10,
});

const LEVELS = [level_idktesting];

const CURRENT_LEVEL = level_idktesting;