import "./style.scss";

const Cell = ({ positionColRow, score, className }) => {
  const backgroundColor = 100 - Math.log2(+score) * 9;
  const textColor = backgroundColor < 50 ? 90 : 10;

  return (
    <>
      <div
        style={{
          "--x": positionColRow[1],
          "--y": positionColRow[0],
          "--bg-color": backgroundColor + "%",
          "--text-color": textColor + "%",
        }}
        className={"cell " + className}
      >
        {+score !== 0 && +score}
      </div>
    </>
  );
};

export default Cell;
