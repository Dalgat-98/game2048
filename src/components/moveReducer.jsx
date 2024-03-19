import Cell from "./Cell/Cell";

export default function stateReducer(state, action) {
  switch (action.type) {
    case "START_GAME": {
      // Обнуляем даные в localStorage
      localStorage.setItem(
        "game2048",
        JSON.stringify({ countMove: 0, allScore: 0, cells: [] })
      );

      const newCells = [];
      const countRows = action.countRows;
      const countColumns = action.countColumns;
      const countCels = countRows * countColumns;

      //создаем массив с клетками "пустышками"
      for (let i = 0; i < countCels; i++) {
        newCells.push(
          <Cell
            key={i}
            positionColRow={[Math.floor(i / countRows), i % countColumns]}
            startScore={0}
          />
        );
      }

      state = {
        ...state,
        countMove: 0,
        allScore: 0,
        cells: newCells,
      };

      return state;
    }

    case "ADD_NEW_CELL": {
      const emptyCells = [];

      //Создаем массив пустых клеток из числа всех(16ти) клеток
      for (let i = 0; i < state.cells.length; i++) {
        if (state.cells[i].props.startScore === 0) {
          emptyCells.push(state.cells[i]);
        }
      }

      // если пустых клеток не останется, то игра оконченна
      if (emptyCells.length === 0) {
        console.log("GAME OVER");
        return state;
      }

      //генерация 2 или 4 с вероятностью 90% или 10%
      const randomValueCell = Math.random() > 0.1 ? 2 : 4;

      //выбираем случайную(пустую) клетку и находим ее индекс по кардинатам
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)].props
          .positionColRow;
      const randomIndex = randomCell[0] * 4 + randomCell[1];

      //создаем новый массив клеток, с заполнением
      const newCells = [];
      for (let i = 0; i < state.cells.length; i++) {
        if (i === randomIndex) {
          newCells[i] = (
            <Cell
              key={state.cells[i].props.positionColRow}
              positionColRow={state.cells[i].props.positionColRow}
              startScore={randomValueCell}
              // className={"cell-show cell-full"}
              className={
                randomValueCell === 2 ? "cell-2 cell-show" : "cell-4 cell-show"
              }
            />
          );
        } else {
          newCells[i] = state.cells[i];
        }
      }

      state = {
        ...state,
        cells: newCells,
      };
      return state;
    }

    case "MOVE": {
      const countRows = action.countRows;
      const countColumns = action.countColumns;
      const moveDirection = action.moveDirection;
      let moveFlag = state.countMove;
      let score = 0;

      const newCells = [];

      for (let i = 0; i < countRows; i++) {
        const mas = [];
        for (let j = 0; j < countColumns; j++) {
          if (moveDirection === "ArrowDown" || moveDirection === "ArrowUp") {
            mas.push(state.cells[i * countRows + j].props.startScore);
          } else if (
            moveDirection === "ArrowRight" ||
            moveDirection === "ArrowLeft"
          ) {
            mas.push(state.cells[i + j * countColumns].props.startScore);
          }
        }

        // Флаг нужен чтобы вызывать функцию сортировки дважды при необходимости
        let flag = false;
        columnsSort(mas, flag);

        if (moveDirection === "ArrowDown" || moveDirection === "ArrowUp") {
          for (let j = 0; j < countColumns; j++) {
            newCells[i * countRows + j] = (
              <Cell
                key={[state.countMove, [i, j]]}
                positionColRow={[i, j]}
                startScore={mas[j]}
                // className={mas[j] > 0 ? "cell-full" : "cell"}
                className={mas[j] <= 2024 ? " cell-" + mas[j] : "cell-big"}
              />
            );
          }
        } else if (
          moveDirection === "ArrowRight" ||
          moveDirection === "ArrowLeft"
        ) {
          for (let j = 0; j < countColumns; j++) {
            newCells[i + j * countColumns] = (
              <Cell
                key={[state.countMove, [j, i]]}
                positionColRow={[j, i]}
                startScore={mas[j]}
                // className={mas[j] > 0 ? "cell-full" : "cell"}
                className={mas[j] <= 2024 ? " cell-" + mas[j] : "cell-big"}
              />
            );
          }
        }
      }

      // Сортирует массив, нужно вызывать дважды на каждый ход,
      // перед суммированием и после, ее суммирование возможно
      function columnsSort(mas, flag) {
        if (moveDirection === "ArrowDown" || moveDirection === "ArrowRight") {
          for (let j = countColumns - 1; j >= 0; j--) {
            if (mas[j + 1] === 0) {
              if (mas[j] > 0) {
                mas[j + 1] = mas[j];
                mas[j] = 0;
                j = countColumns - 1;
                moveFlag++;
              }
            }
          }
        } else if (
          moveDirection === "ArrowUp" ||
          moveDirection === "ArrowLeft"
        ) {
          for (let j = 1; j < countColumns; j++) {
            if (mas[j - 1] === 0) {
              if (mas[j] > 0) {
                mas[j - 1] = mas[j];
                mas[j] = 0;
                j = 0;
                moveFlag++;
              }
            }
          }
        }
        if (!flag) {
          summColumns(mas, flag);
        }
      }

      // Сумиирует соседние ячейки
      function summColumns(mas, flag) {
        flag = true;
        if (moveDirection === "ArrowDown" || moveDirection === "ArrowRight") {
          for (let j = countColumns - 1; j >= 0; j--) {
            if (mas[j + 1] === mas[j]) {
              mas[j + 1] += mas[j];
              mas[j] = 0;
              score += mas[j + 1];
              moveFlag++;
            }
          }
        }

        if (moveDirection === "ArrowUp" || moveDirection === "ArrowLeft") {
          for (let j = 1; j < countColumns; j++) {
            if (mas[j - 1] === mas[j]) {
              mas[j - 1] += mas[j];
              mas[j] = 0;
              score += mas[j - 1];
              moveFlag++;
            }
          }
        }
        columnsSort(mas, flag);
      }

      // console.log(state.allScore + score);
      const maxScore = localStorage.getItem("maxScore");
      if (!maxScore || maxScore < state.allScore + score) {
        localStorage.setItem("maxScore", state.allScore + score);
      }

      if (state.countMove < moveFlag) {
        state = {
          ...state,
          countMove: state.countMove++,
          allScore: state.allScore + score,
          cells: newCells,
        };
      }

      return state;
    }

    case "LOCAL_STORAGE_SAVED": {
      const cells = [];

      for (let i = 0; i < state.cells.length; i++) {
        cells.push(state.cells[i].props);
      }

      const localState = {
        countMove: state.countMove,
        allScore: state.allScore,
        cells: cells,
      };

      localStorage.setItem("game2048", JSON.stringify(localState));

      return state;
    }

    case "LOCAL_STORAGE_LOAD": {
      const newCells = [];
      const localState = JSON.parse(localStorage.getItem("game2048"));

      for (let i = 0; i < localState.cells.length; i++) {
        newCells[i] = (
          <Cell
            key={localState.cells[i].positionColRow}
            positionColRow={localState.cells[i].positionColRow}
            startScore={localState.cells[i].startScore}
            className={localState.cells[i].className}
          />
        );
      }

      state = {
        ...state,
        countMove: localState.countMove,
        allScore: localState.allScore,
        cells: newCells,
      };

      return state;
    }

    default: {
      return state;
    }
  }
}
