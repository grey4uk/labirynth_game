import React from "react";
import css from "./Game.module.css";
import { v4 as uuidv4 } from "uuid";

let array = [];
let focusIndex;
const size = 3;
let timerId;

const randomizer = (size) => {
  return Math.round((size - 1) * Math.random());
};

const Table = () => {

  const createArray = (size) => {
    for (let i = 0; i < size; i++) {
      array[i] = [];
      for (let j = 0; j < size; j++) {
        array[i][j] = uuidv4();
      }
    }
    return array;
  };

  const startClick = (e) => {
    focusIndex = array[randomizer(size)][randomizer(size)];
    const target = document.getElementById(`${focusIndex}`);
    target.style.backgroundColor = "blue";
    timerId = setTimeout(() => {
      target.style.backgroundColor="red";
     clearTimeout(timerId);
     return alert("you loose");
    }, 3000);
  };

  const handleClick = (e) => {
    if (e.target.id === focusIndex) {
      e.target.style.backgroundColor = "green";
      alert("you win");
      clearTimeout(timerId);
    } 
  };

  return (
    <div style={{textAlign:"center",paddingTop:"10vh"}}>
      <div style={{width:`${size*40+20}px`}} className={css.mainDiv}>
        {createArray(size).map((element) =>
          element.map((el) => (
            <div key={el} id={el} className={css.cube} onClick={handleClick} />
          ))
        )}
      </div>
      <div style={{ textAlign: "center", padding: "40px" }}>
        <form>
        <button type="button" onClick={startClick}>START</button>

          {/* <button type="button" onClick={()=>getResult()}>RESET</button> */}
        </form>
      </div>
    </div>
  );
};

export default Table;
