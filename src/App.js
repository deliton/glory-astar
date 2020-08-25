import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.optimalPath = [];
    this.state = {
      grid: this.createGridColumns(24),

    }
    this.initializeStartAndFinish()
  }

  mouseDown = false;
  componentDidMount() {
   document.title = "Glory A*"
    document.onmousedown = () => {
      this.mouseDown = true;
    }
    document.onmouseup = () => {
      this.mouseDown = false;
    }
  }

  initializeStartAndFinish = () => {
    let auxGrid = this.state.grid
    auxGrid[1][1].state = "cell-begin"
    auxGrid[22][22].state = "cell-end"
    this.setState({ grid: auxGrid })
  }

  createGridRow = (size, rowNumber) => {
    let row = []
    for (let column = 0; column < size; column++) {
      row.push({ state: "free-cell", column: column, row: rowNumber })
    }
    return row;

  }

  createGridColumns = (size) => {
    let grid = []
    for (let rows = 0; rows < size; rows++) {
      let row = this.createGridRow(size, rows)
      grid.push(row)
    }
    return grid
  }

  drawGridColumns = () => {
    return this.state.grid.map((row, index) => {
      return (<div className="row-container" key={"row-" + index}>
        {this.drawGridRows(row, index)}
      </div>)
    })
  }

  drawGridRows = (rows, rowNumber) => {
    return rows.map((cell, index) => {

      return (
        <button
          className={this.state.grid[rowNumber][index].state}
          onMouseOver={() => this.handleGridUpdate(rowNumber, index)}
          onClick={() => this.updateByClick(rowNumber, index)}
          key={"cell-" + index} />
      )
    })
  }


  handleGridUpdate = (row, column) => {
    if (this.mouseDown) {
      let newGrid = this.state.grid;
      if (newGrid[row][column].state === "free-cell") {
        newGrid[row][column].state = "cell-blocked"
      }
      else if (newGrid[row][column].state === "cell-blocked") {
        newGrid[row][column].state = "free-cell"
      }

      this.setState({ grid: newGrid })
    }


  }

  updateByClick = (row, column) => {

    let newGrid = this.state.grid;
    if (newGrid[row][column].state === "free-cell") {
      newGrid[row][column].state = "cell-blocked"
    }
    else if (newGrid[row][column].state === "cell-blocked") {
      newGrid[row][column].state = "free-cell"
    }

    this.setState({ grid: newGrid })



  }

  resetGrid = () => {
    let auxGrid = this.createGridColumns(24)
    auxGrid[1][1].state = "cell-begin"
    auxGrid[22][22].state = "cell-end"
    this.setState({ grid: auxGrid })

  }

  heuristic = (start, goal) => {
    const result = Math.abs(start.row - goal.row) + Math.abs(start.column - goal.column);
    return result;
  }

  tieBreaker = (start, goal) => {
    return Math.pow((start.row - goal.row), 2) + Math.pow((start.column - goal.column), 2);
  }

  containsCell = (list, cell) => {
    const found = list.find((item) => {
      return (item.row === cell.row && item.column === cell.column)

    });
    if (found) {
      return true;
    }
    else {
      return false;
    }
  }

  expand = (cell, size) => {
    let result = [];

    if (cell.row - 1 >= 0) {
      const northCell = this.state.grid[cell.row - 1][cell.column];
      if (northCell.state !== "cell-blocked") {
        result.push(northCell);
      }
    }
    if (cell.column + 1 < size) {
      const eastCell = this.state.grid[cell.row][cell.column + 1];
      if (eastCell.state !== "cell-blocked") {
        result.push(eastCell);
      }
    }
    if (cell.row + 1 < size) {
      const southCell = this.state.grid[cell.row + 1][cell.column];
      if (southCell.state !== "cell-blocked") {
        result.push(southCell);
      }
    }

    if (cell.column - 1 >= 0) {
      const westCell = this.state.grid[cell.row][cell.column - 1];
      if (westCell.state !== "cell-blocked") {
        result.push(westCell);
      }
    }
    return result;
  }

  // TODO: implement an animation to draw correct path
  colorPath(parents) {
    parents.forEach((item) => {
      if (!this.isStart(item)) {
        //item.state;
        setTimeout(() => {
          let auxGrid = this.state.grid
          auxGrid[item.row][item.column] = item
          auxGrid[item.row][item.column].state = "cell-final-path"
          this.setState({ grid: auxGrid })
        }, 5)


      }
    });
  }

  isGoal = (cell) => {
    if (cell.state === "cell-end") {
      return true;
    }
    else {
      return false;
    }
  }

  isStart = (cell) => {
    if (cell.state === "cell-begin") {
      return true;
    }
    else {
      return false;
    }
  }

  aStar = (start, goal, size) => {
    const startDistance = this.heuristic(start, goal);

    // List of unexplored cells
    let openList = [];
    start.cost = 0;
    start.parents = [];
    start.score = (0 + startDistance);
    start.tie = this.tieBreaker(start, goal)
    openList.push(start);

    // List of explored cells
    let exploredList = [];

    while (openList.length > 0) {
      // Sort nodes by score to find best path
      const sortList = openList.sort((a, b) => {
        if (a.score - b.score < 0) {
          return -1;
        }
        else if (a.score - b.score > 0) {
          return 1;
        }
        else {
          if (a.tie - b.tie < 0) {
            return -1;
          }
          else if (a.tie - b.tie > 0) {
            return 1;
          }
          else {
            return 0;
          }
        }
      });

      // The best cell is the one with the lowest score
      const best = sortList[0];

      // If the best cell is the goal, solution has been found
      if (this.isGoal(best)) {
        this.colorPath(best.parents);
        break;
      }

      else {
        // add best cell to the explored cell list
        if (!this.isStart(best) && best.state !== "cell-blocked") {
          setTimeout(() => {
            let auxGrid = this.state.grid

            auxGrid[best.row][best.column] = best
            auxGrid[best.row][best.column].state = "cell-test"
            this.setState({ grid: auxGrid })
          }, 4)
        }

        exploredList.push(best);

        // remove best from the open list
        openList = openList.filter((item) => { return !(item.row === best.row && item.column === best.column) });

        // expand the best node
        const permissibleNeighbours = this.expand(best, size);

        // eslint-disable-next-line no-loop-func
        permissibleNeighbours.forEach((neighbour) => {

          // but only if they are not in one of the lists of open or explored nodes
          if (!this.containsCell(openList, neighbour) && !this.containsCell(exploredList, neighbour)) {
            neighbour.cost = (best.cost + 1);
            neighbour.parents = best.parents.concat([best]);
            neighbour.score = (best.cost + 1 + this.heuristic(neighbour, goal));
            neighbour.tie = this.tieBreaker(neighbour, goal);
            openList.push(neighbour);
          }
          else {
            const score = (best.cost + 1 + this.heuristic(neighbour, goal));
            if (score < neighbour.score) {
              neighbour.parents = best.parents.concat([best]);
              neighbour.score = (best.cost + 1 + this.heuristic(neighbour, goal));
              neighbour.tie = this.tieBreaker(neighbour, goal);
            }
          }
        });
      }
    }

  }
  render() {
    return (
      <div className="main-page">
        <div className="left-screen-container">

          {this.drawGridColumns()}

        </div>
        <div className="right-screen-container">
          <h1>Glory A*</h1>
          <p>This is a visual representation of the A* algorithm, developed in 1968 by Peter Hart, Nils Nilsson and Bertram Raphael of the Stanford Research Intitute.</p>
          <p>The A* is considered to be the most important pathfinder algorithm, and is widely used in many applications. This implementation was made by Deliton Junior in 2020. </p>
          <button className="push_button blue" onClick={() => this.aStar(this.state.grid[1][1], this.state.grid[22][22], 24)}>Run simulation</button>
          <button className="push_button red" onClick={this.resetGrid}>Reset grid</button>
        </div>

      </div>
    );
  }
}

export default App;
