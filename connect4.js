class Game {
  constructor(p1, p2, HEIGHT = 6, WIDTH = 7) {
    this.HEIGHT = HEIGHT;
    this.WIDTH = WIDTH;
    this.currPlayer = p1;
    this.players = [p1, p2];
    // this.gameEnded = false;
    this.makeBoard();
    this.makeHtmlBoard();
  }
  /** Create in-JS board structure:
  *   board = array of rows, each row is array of cells  (board[y][x])
  * @return {void}
  */
  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.HEIGHT; y++)
      this.board.push(Array.from({ length: this.WIDTH }));
  }
  /** Make HTML table and row of column tops.
  * @return {void}
  */
  makeHtmlBoard() {
    document.getElementById("startGame").remove();
    document.getElementById("p1Color").remove();
    document.getElementById("p1ColorLabel").remove();
    document.getElementById("p2Color").remove();
    document.getElementById("p2ColorLabel").remove();
    const board = document.getElementById('board');
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    this.gameClickBind = this.handleClick.bind(this);
    top.addEventListener('click', this.gameClickBind);
    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
    board.append(top);
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');
      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
  }
  /**Make HTML table and row of column tops.
  * @param {Number} x spot on board to locate which spot to place a piece in
  * @return {Number|undefined} returns the available spot or null if not found.
  */
  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--)
      if (!this.board[y][x])
        return y;
    return null;
  }
  /** Update DOM to place piece into HTML board
  * @param {Number} y Vertical (Horizontal) spot on board to locate which spot to place a piece in
  * @param {Number} x Horizontal spot on board to locate which spot to place a piece in
  * @return {void}
  */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  /** Announce game end
  * @param {String} msg Alert to show to user once the game has been completed
  * @return {void}
  */
  endGame(msg) {
    document.querySelector("#column-top").removeEventListener("click", this.gameClickBind);
    // this.gameEnded = true;
    alert(msg);
  }
  /** Handle click of column top to play piece 
  * @param {Event} evt Event Handler object (which was bound to Game Class)
  * @return {void}
  */
  handleClick(evt) {
    // if (this.gameEnded)
    // return;
    const x = +evt.target.id;
    const y = this.findSpotForCol(x);
    if (y === null)
      return;
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    if (this.checkForWin())
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    if (this.board.every(row => row.every(cell => cell)))
      return this.endGame('Tie!');
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }
  /** Check board cell-by-cell for "does a win start here?"
  * @return {true|void}
  */
  checkForWin() {
    const _win = (cells) =>
      cells.every(([y, x]) =>
        y >= 0 &&
        y < this.HEIGHT &&
        x >= 0 &&
        x < this.WIDTH &&
        this.board[y][x] === this.currPlayer);
    for (let y = 0; y < this.HEIGHT; y++)
      for (let x = 0; x < this.WIDTH; x++)
        if (_win([[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]) ||
          _win([[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]) ||
          _win([[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]) ||
          _win([[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]]))
          return true;
  }
}
class Player {
  constructor(color) {
    this.color = color;
  }
}
document.getElementById("startGame").addEventListener('click', () => new Game(
  new Player(document.getElementById("p1Color").value),
  new Player(document.getElementById("p2Color").value)));