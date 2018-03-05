let gameOfLife = {
  height: 15,
  width: 15, // width and height dimensions of the board
  stepInterval: null, // should be used to hold reference to an interval that is "playing" the game

  createAndShowBoard: function () {
    // create <table> element
    let goltable = document.createElement("tbody");

    // build Table HTML
    let tablehtml = '';
    for (let h = 0; h < this.height; h++) {
      tablehtml += `<tr id='row+${h}'>`;

      for (let w = 0; w < this.width; w++) {
        tablehtml += `<td data-status='dead' id='${w}-${h}'></td>`;
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;

    // add table to the #board element
    let board = document.getElementById('board');
    board.appendChild(goltable);

    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
  },


  updateBoard: function () {
    let board = document.getElementById('board');

    let newTableHtml = '';
    for (let h = 0; h < this.height; h++) {
      newTableHtml += `<tr id='row+${h}'>`;

      for (let w = 0; w < this.width; w++) {
        newTableHtml += `<td data-status='dead' id='${w}-${h}'></td>`;
      }
      newTableHtml += "</tr>";
    }

    if (this.height < 5 || this.height > 25 || this.width < 5 || this.width > 50 || isNaN(this.height) || isNaN(this.width)) {
      alert('Please enter valid input!')
    } else {
      board.innerHTML = newTableHtml;
    }

  },

  forEachCell: function (iteratorFunc) {
    /*
      Write forEachCell here. You will have to visit
      each cell on the board, call the "iteratorFunc" function,
      and pass into func, the cell and the cell's x & y
      coordinates. For example: iteratorFunc(cell, x, y)
    */

    //  for (let h = 0; h < this.height; h++) {
    //    for (let w = 0; w < this.width; w++) {
    //      let cell = document.getElementById(`${w}-${h}`);
    //      iteratorFunc(cell, h, w);
    //    }
    //  }

    Array.from(document.getElementsByTagName('td')).forEach(cell => {
      let coords = this.getCoordsOfCell(cell);
      iteratorFunc(cell, coords[0], coords[1]);
    })
  },

  getCoordsOfCell: function (cell) {
    let cellId = cell.id;
    let idSplit = cellId.split('-');

    return idSplit.map(coodStr => +coodStr);
  },

  getCellStatus: function (cell) {
    return cell.getAttribute('data-status');
  },

  setCellStatus: function (cell, status) {
    cell.className = status;
    cell.setAttribute('data-status', status)
  },

  toggleCellStatus: function (cell) {
    if (this.getCellStatus(cell) === 'dead') {
      this.setCellStatus(cell, 'alive');
    } else {
      this.setCellStatus(cell, 'dead');
    }
  },

  selectCell: function (w, h) {
    return document.getElementById(`${w}-${h}`);
  },

  getNeighbors: function (cell) {
    let neighborsArr = [];
    let thisCellCoords = this.getCoordsOfCell(cell);
    let cellW = thisCellCoords[0];
    let cellH = thisCellCoords[1];

    neighborsArr.push(this.selectCell(cellW - 1, cellH - 1));
    neighborsArr.push(this.selectCell(cellW, cellH - 1));
    neighborsArr.push(this.selectCell(cellW + 1, cellH - 1));

    neighborsArr.push(this.selectCell(cellW - 1, cellH));
    neighborsArr.push(this.selectCell(cellW + 1, cellH));

    neighborsArr.push(this.selectCell(cellW - 1, cellH + 1));
    neighborsArr.push(this.selectCell(cellW, cellH + 1));
    neighborsArr.push(this.selectCell(cellW + 1, cellH + 1));

    return neighborsArr.filter(neighbor => {
      return neighbor !== null;
    })
  },

  getAliveNeighbors: function (cell) {
    let neighborsArr = this.getNeighbors(cell);
    let gameOfLifeObj = this;

    return neighborsArr.filter(function (neighbor) {
      return gameOfLifeObj.getCellStatus(neighbor) === 'alive'
    })
  },

  setupBoardEvents: function () {
    // each board cell has an CSS id in the format of: "x-y"
    // where x is the x-coordinate and y the y-coordinate
    // use this fact to loop through all the ids and assign
    // them "click" events that allow a user to click on
    // cells to setup the initial state of the game
    // before clicking "Step" or "Auto-Play"

    // clicking on a cell should toggle the cell between "alive" & "dead"
    // for ex: an "alive" cell be colored "blue", a dead cell could stay white

    // EXAMPLE FOR ONE CELL
    // Here is how we would catch a click event on just the 0-0 cell
    // You need to add the click event on EVERY cell on the board
    let gameOfLifeObj = this;

    let onCellClick = function (e) {

      // QUESTION TO ASK YOURSELF: What is "this" equal to here?

      // how to set the style of the cell when it's clicked
      gameOfLifeObj.toggleCellStatus(this);
    }

    this.forEachCell(cell => {
      cell.onclick = onCellClick;
    });

    document.getElementById('step_btn').addEventListener('click', event => {
      gameOfLifeObj.step();
    });
    document.getElementById('clear_btn').addEventListener('click', event => {
      gameOfLifeObj.clear();
    });
    document.getElementById('reset_btn').addEventListener('click', event => {
      gameOfLifeObj.reset();
    });
    document.getElementById('play_btn').addEventListener('click', event => {
      gameOfLifeObj.play();
    });
    document.getElementById('submit_btn').addEventListener('click', event => {
      this.height = Number(document.getElementById('row-input').value);
      this.width = Number(document.getElementById('column-input').value);
      this.updateBoard();
    });

    document.getElementById('default_btn').addEventListener('click', event => {
      this.height = 15;
      this.width = 15;
      this.updateBoard();
    });

  },

  step: function () {
    // Here is where you want to loop through all the cells
    // on the board and determine, based on it's neighbors,
    // whether the cell should be dead or alive in the next
    // evolution of the game.
    //
    // You need to:
    // 1. Count alive neighbors for all cells
    // 2. Set the next state of all cells based on their alive neighbors

    let gameOfLifeObj = this;
    let cellsToToggle = [];

    this.forEachCell(function (cell, w, h) {
      let countAliveNeighbors = gameOfLifeObj.getAliveNeighbors(cell).length;

      if (gameOfLifeObj.getCellStatus(cell) === 'alive') {
        if (countAliveNeighbors !== 2 && countAliveNeighbors !== 3) {
          cellsToToggle.push(cell);
        }
      } else {
        if (countAliveNeighbors === 3) {
          cellsToToggle.push(cell);
        }
      }
    })

    cellsToToggle.forEach(function (cellToToggle) {
      gameOfLifeObj.toggleCellStatus(cellToToggle);
    })
  },

  clear: function () {
    this.forEachCell(cell => {
      this.setCellStatus(cell, 'dead')
    });
  },

  reset: function () {
    this.forEachCell(cell => {
      let status = Math.random() > 0.5 ? 'alive' : 'dead';
      return this.setCellStatus(cell, status);
    });
  },

  play: function () {
    // Start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval
    if (this.stepInterval) {
      return this.stop();
    }

    this.stepInterval = setInterval(this.step.bind(this), 400);
  },

  stop: function () {
    clearInterval(this.stepInterval);
    this.stepInterval = null;
  },

};

gameOfLife.createAndShowBoard();
