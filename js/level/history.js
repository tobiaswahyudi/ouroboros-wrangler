class LevelHistory {
  constructor(initialState) {
    this.current = 0;
    this.initial = initialState;
    const firstState = initialState.clone();
    this.history = [firstState];
  }

  getCurrent() {
    return this.history[this.current];
  }

  copyTop() {
    this.history.push(this.getCurrent().clone());
    this.current++;
    this.history[this.current].turnCount++;
  }

  pop() {
    if (this.current > 0) {
      this.history.pop();
      this.current--;
    }
  }

  reset() {
    this.current = 0;
    this.history = [this.initial.clone()];
  }
}
