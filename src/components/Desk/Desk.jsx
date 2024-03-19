import "./style.scss";

import { useEffect, useReducer } from "react";
import moveReducer from "./../moveReducer";

const Desk = () => {
  const [state, dispatch] = useReducer(moveReducer, {
    countMove: 0,
    allScore: 0,
    cells: [],
  });

  //Отслеживание нажатия клавиш
  useEffect(() => {
    document.addEventListener("keydown", onKeypress);

    return () => {
      document.removeEventListener("keydown", onKeypress);
    };
  });

  //При нажатии стрелки вызываем функцих хода
  const onKeypress = (e) => {
    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight"
    ) {
      move(4, 4, e.key);
    }
  };

  // Создает пустую доскую
  function newGame(countRows, countColumns) {
    dispatch({
      type: "START_GAME",
      countRows: countRows,
      countColumns: countColumns,
    });
    addNewCell();
    addNewCell();
  }

  // Добавляет новую пустую клетку
  function addNewCell() {
    dispatch({
      type: "ADD_NEW_CELL",
    });
  }

  // Обрабатывает ход
  function move(countRows, countColumns, moveDirection) {
    dispatch({
      type: "MOVE",
      countRows: countRows,
      countColumns: countColumns,
      moveDirection: moveDirection,
    });

    addNewCell();
    localStorageSaved();
  }

  // загрзука "доски" из localStorage или начало новой игры
  if (!state.cells.length) {
    const localState = JSON.parse(localStorage.getItem("game2048"));
    if (localState && localState.countMove > 0) {
      localStorageLoad();
    } else {
      newGame(4, 4);
    }
  }

  // получение/сохранение данных из localStorage
  const maxScore = localStorage.getItem("maxScore");

  function localStorageLoad() {
    dispatch({
      type: "LOCAL_STORAGE_LOAD",
    });
  }

  function localStorageSaved() {
    dispatch({
      type: "LOCAL_STORAGE_SAVED",
    });
  }

  return (
    <>
      <section className="game">
        <header>
          <h1>Game 2048</h1>
          <div className="game__info">
            <div className="game__all-score">
              <p>Счет</p>
              <p>{state.allScore}</p>
            </div>
            <div className="game__max-score">
              <p>Рекорд</p>
              <p>{maxScore > 0 ? maxScore : 0}</p>
            </div>

            <button
              className="game__button game__button-new-game"
              onClick={() => {
                newGame(4, 4);
              }}
            >
              Новая игра
            </button>
          </div>
        </header>
        <section className="game__desk">
          {state.cells.length > 0 && state.cells}
        </section>
      </section>
    </>
  );
};

export default Desk;
