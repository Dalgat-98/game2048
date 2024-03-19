import Cell from "./Cell/Cell";

export default function stateReducer(state, action) {
  switch (action.type) {
    case "START_GAME": {
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

      state = [];
      return newCells;
    }

    case "ADD_NEW_CELL": {
      const emptyCells = [];

      //Создаем массив пустых клеток из числа всех(16и) клеток
      for (let i = 0; i < state.length; i++) {
        if (state[i].props.startScore === 0) {
          emptyCells.push(state[i]);
        }
      }

      if (emptyCells.length === 0) {
        console.log("qweqweq");
      }

      //генерация 2 или 4 с вероятностью 90% или 10%
      const randomValueCell = Math.random() > 0.1 ? 2 : 4;
      //выбираем случайную(пустую) клеткуи находим ее индекс по кардинатам
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)].props
          .positionColRow;
      const randomIndex = randomCell[0] * 4 + randomCell[1];

      //создаем новый массив клеток, с заполнением
      const newCells = [];
      for (let i = 0; i < state.length; i++) {
        if (i === randomIndex) {
          newCells[i] = (
            <Cell
              key={state[i].props.positionColRow}
              positionColRow={state[i].props.positionColRow}
              startScore={randomValueCell}
              className={randomValueCell === 2 ? "cell-2" : "cell-4"}
            />
          );
        } else {
          newCells[i] = state[i];
        }
      }

      state = [];
      return newCells;
    }

    // Обрабатываем ход "вверх" и "вниз"
    case "MOVE_COLUMNS": {
      const countRows = action.countRows;
      const countColumns = action.countColumns;
      const countMove = action.countMove;
      const moveDirection = action.moveDirection;

      const newCells = [];

      // получаем 4(кол-во столбцов) массива, которые содержат столбцы
      for (let i = 0; i < countRows; i++) {
        const mas = [];
        for (let j = 0; j < countColumns; j++) {
          mas.push(state[i * 4 + j].props.startScore);
        }

        Работа;
        с;
        массивами(столбцами);
        идет;
        в;
        два;
        этапа;
        let flag = false;

        function columnsSort(mas) {
          // Сортируем полученые массивы на движение "вверх" или "вниз"
          if (moveDirection === "ArrowDown") {
            for (let j = countColumns - 1; j >= 0; j--) {
              if (mas[j + 1] === 0) {
                if (mas[j] > 0) {
                  mas[j + 1] = mas[j];
                  mas[j] = 0;
                  j = countColumns - 1;
                }
              }
            }
          } else if (moveDirection === "ArrowUp") {
            for (let j = 1; j < countColumns; j++) {
              if (mas[j - 1] === 0) {
                if (mas[j] > 0) {
                  mas[j - 1] = mas[j];
                  mas[j] = 0;
                  j = 0;
                }
              }
            }
          }
          if (!flag) {
            summColumns(mas);
          }
        }

        function summColumns(mas) {
          flag = true;
          if (moveDirection === "ArrowDown") {
            for (let j = countColumns - 1; j >= 0; j--) {
              if (mas[j + 1] === mas[j]) {
                mas[j + 1] += mas[j];
                mas[j] = 0;
              }
            }
          }

          if (moveDirection === "ArrowUp") {
            for (let j = 1; j < countColumns; j++) {
              if (mas[j - 1] === mas[j]) {
                mas[j - 1] += mas[j];
                mas[j] = 0;
              }
            }
          }
          columnsSort(mas);
        }

        columnsSort(mas);

        // На основе сортировки созадем новое состояние(итоговый полный массив)
        for (let j = 0; j < countColumns; j++) {
          newCells[i * 4 + j] = (
            <Cell
              key={[countMove, [i, j]]}
              positionColRow={[i, j]}
              startScore={mas[j]}
              className={mas[j] > 1 ? "cell-2" : "cell"}
            />
          );
        }
      }

      return newCells;
    }

    default: {
      return state;
    }
  }
}
