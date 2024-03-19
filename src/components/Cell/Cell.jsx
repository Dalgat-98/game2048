import { useState } from "react";
import "./style.scss";

const Cell = ({ id, positionColRow, startScore, className }) => {
  const [cell, setCell] = useState({
    id: id,
    positionColRow: positionColRow,
    score: 0 + startScore,
    className: "cell " + className,
  });

  const backgroundColor = 100 - Math.log2(cell.score) * 9;
  const textColor = backgroundColor < 50 ? 90 : 10;

  return (
    <>
      <div
        style={{
          "--x": cell.positionColRow[1],
          "--y": cell.positionColRow[0],
          "--bg-color": backgroundColor + "%",
          "--text-color": textColor + "%",
        }}
        className={cell.className}
      >
        {cell.score !== 0 && cell.score}
      </div>
    </>
  );
};

export default Cell;
