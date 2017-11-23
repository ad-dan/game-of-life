const randomizeBoard = size => {
  const cleanBoard = Array(size).fill(Array(size).fill(0));
  const randomBoard = cleanBoard.map(row => {
    const newRow = row.map(cell => {
      return Math.round(Math.random());
    });
    return newRow;
  });
  return randomBoard;
};
const nextGen = cells => {
  const newState = [];
  const totalRows = cells.length;
  const totalColumns = cells.length ? cells[0].length : 0;
  for (let row = 0; row < totalRows; row++) {
    const newRow = [];
    for (let col = 0; col < totalColumns; col++) {
      let currentCell = cells[row][col];
      let sum = currentCell;
      const upExists = row !== 0 ? true : false;
      const downExists = row !== totalRows - 1 ? true : false;
      const leftExists = col !== 0 ? true : false;
      const rightExists = col !== totalColumns - 1 ? true : false;
      if (upExists) {
        sum += cells[row - 1][col];
      }
      if (downExists) {
        sum += cells[row + 1][col];
      }
      if (leftExists) {
        sum += cells[row][col - 1];
      }
      if (rightExists) {
        sum += cells[row][col + 1];
      }
      if (upExists && rightExists) {
        sum += cells[row - 1][col + 1];
      }
      if (upExists && leftExists) {
        sum += cells[row - 1][col - 1];
      }
      if (downExists && rightExists) {
        sum += cells[row + 1][col + 1];
      }
      if (downExists && leftExists) {
        sum += cells[row + 1][col - 1];
      }
      if (sum === 3) {
        currentCell = 1;
      } else if (sum === 4) {
        currentCell = currentCell;
      } else {
        currentCell = 0;
      }
      newRow.push(currentCell);
    }
    newState.push(newRow);
  }
  return newState;
};
const GameTile = ({ status, changeTile }) => {
  const isAlive = status === 1 ? true : false;
  const cssClass = isAlive ? "tile-alive" : "tile-dead";
  return <div className={`tile ${cssClass}`} onClick={changeTile} />;
};
const GameRow = ({ children, size }) => {
  return (
    <div className="game-row" style={{ width: size * 16 }}>
      {children}
    </div>
  );
};
const createGameBoard = (arr, func) => {
  return arr.map((row, rowNumber) => {
    const newRow = row.map((tile, tileNum) => {
      return (
        <GameTile
          status={tile}
          changeTile={() => {
            console.log(rowNumber, tileNum);
            func(rowNumber, tileNum);
          }}
        />
      );
    });
    return <GameRow size={arr.length}>{newRow}</GameRow>;
  });
};
let playing;
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      board: randomizeBoard(30),
      isPlaying: false,
      generation: 0,
      boardSize: 30
    };
    this.handleClick = this.handleClick.bind(this);
    this.getNextGeneration = this.getNextGeneration.bind(this);
    this.resetBoard = this.resetBoard.bind(this);
    this.incrementSize = this.incrementSize.bind(this);
    this.decrementSize = this.decrementSize.bind(this);
    this.changeTile = this.changeTile.bind(this);
    this.pauseGame = this.pauseGame.bind(this);
    this.clear = this.clear.bind(this);
  }
  incrementSize() {
    if (!this.state.isPlaying) {
      this.setState(prevState => {
        return {
          boardSize: prevState.boardSize + 1
        };
      });
      this.resetBoard();
    }
  }
  pauseGame() {
    if (playing) clearInterval(playing);
    this.setState(prevState => {
      isPlaying: !prevState.isPlaying;
    });
  }
  changeTile(row, col) {
    if (!this.state.isPlaying) {
      const newTile = this.state.board[row][col] === 1 ? 0 : 1;
      const newRow = [...this.state.board[row]];
      newRow.splice(col, 1, newTile);
      const newBoard = [...this.state.board];
      newBoard.splice(row, 1, newRow);
      this.setState({
        board: newBoard
      });
    }
  }
  decrementSize() {
    if (!this.state.isPlaying) {
      this.setState(prevState => {
        if (prevState.boardSize === 1) return {};
        return {
          boardSize: prevState.boardSize - 1
        };
      });
    }
    this.resetBoard();
  }
  getNextGeneration() {
    this.setState(prevState => {
      return {
        board: nextGen(prevState.board),
        generation: prevState.generation + 1
      };
    });
  }
  handleClick() {
    if (!this.state.isPlaying) {
      playing = setInterval(this.getNextGeneration, 100);
      this.setState({
        isPlaying: !this.state.isPlaying
      });
    } else {
      clearInterval(playing);
      this.setState({
        isPlaying: false
      });
    }
  }
  resetBoard() {
    if (playing) clearInterval(playing);
    this.setState({
      board: randomizeBoard(this.state.boardSize),
      generation: 0,
      isPlaying: false
    });
  }
  clear() {
    if (playing) clearInterval(playing);
    this.setState({
      board: Array(this.state.boardSize).fill(
        Array(this.state.boardSize).fill(0)
      ),
      generation: 0,
      isPlaying: false
    });
  }
  render() {
    const gameTiles = createGameBoard(this.state.board, this.changeTile);
    const tileText = this.state.isPlaying ? (
      <i className="fa fa-pause" />
    ) : (
      <i className="fa fa-play" />
    );
    return (
      <div id="board">
        <div id="board-container" style={{ width: this.state.boardSize * 25 }}>
          {gameTiles}
        </div>

        <button onClick={this.handleClick} id="control">
          {tileText}
        </button>
        <div id="gen">
          Gen: <span className="info">{this.state.generation}</span>
        </div>
        <div id="rc-container">
          <button id="reset" onClick={this.resetBoard}>
            <i className="fa fa-random" />Randomize board
          </button>
          <button id="clear" onClick={this.clear}>
            <i className="fa fa-trash-o" />Clear board
          </button>
        </div>

        <div id="size-container">
          <button onClick={this.incrementSize}>+</button>
          <h2>
            Size: <span className="info">{this.state.boardSize}</span>
          </h2>
          <button onClick={this.decrementSize} id="dcr">
            -
          </button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
