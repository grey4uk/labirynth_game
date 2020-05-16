import React, { useState, useEffect } from "react";
import css from "./Game.module.css";
import { v4 as uuidv4 } from "uuid";
import up from "../assets/icons/up.png";
import down from "../assets/icons/down.png";
import left from "../assets/icons/left.png";
import right from "../assets/icons/right.png";
import stop from "../assets/icons/stop.png";

const size = 3;
const arrows = [up, right, down, left];
const trackArray = [];
let focusIndex = null;
let timerId = "";
let start = "";
let exit = "";
let clickId = "";

const Game = () => {
  const [track, setTrack] = useState([]);
  const [array, setArray] = useState([]);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    setArray(createArray(size));
  }, []);

  const randomizer = (max, min = 0) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const createArray = (size) => {
    let arrayOfCube = [];
    for (let i = 0; i < size; i++) {
      arrayOfCube[i] = [];
      for (let j = 0; j < size; j++) {
        arrayOfCube[i][j] = {
          id: `${i}${j}`,
          coordX: i,
          coordY: j,
        };
      }
    }
    return arrayOfCube;
  };

  const clear = (id) => {
    console.log('id', id);
    const target = document.getElementById(`${id}`);
    target.style.backgroundColor = "lawngreen";
    target.textContent = "";
  };

  const setRandomArrow = (x, y) => {
    let exit = null;
    switch (true) {
      case x === 0 && y === 0:
        exit = [arrows[1], arrows[2]][randomizer(2)];
        break;
      case x === 0 && 0 < y && y < size - 1:
        exit = [arrows[1], arrows[2], arrows[3]][randomizer(3)];
        break;
      case x === 0 && y === size - 1:
        exit = [arrows[2], arrows[3]][randomizer(2)];
        break;
      case 0 < x && x < size - 1 && y === size - 1:
        exit = [arrows[0], arrows[2], arrows[3]][randomizer(3)];
        break;
      case x === size - 1 && y === size - 1:
        exit = [arrows[0], arrows[3]][randomizer(2)];
        break;
      case x === size - 1 && 0 < y && y < size - 1:
        exit = [arrows[0], arrows[1], arrows[3]][randomizer(3)];
        break;
      case x === size - 1 && y === 0:
        exit = [arrows[0], arrows[1]][randomizer(2)];
        break;
      case 0 < x && x < size - 1 && y === 0:
        exit = [arrows[0], arrows[1], arrows[2]][randomizer(3)];
        break;
      case 0 < x && x < size - 1 && 0 < y && y < size - 1:
        exit = arrows[randomizer(4)];
        break;

      default:
        exit = null;
        break;
    }
    return exit;
  };

  const buildTrack = (focusIndex) => {
    // trackArray-array of way
    const { coordX, coordY } = focusIndex;
    trackArray[0] = {
      x: coordX,
      y: coordY,
      step: setRandomArrow(coordX, coordY),
    };
    for (let i = 1; i < 10; i++) {
      switch (arrows.indexOf(trackArray[i - 1].step)) {
        case 0:
          trackArray[i] = {
            x: trackArray[i - 1].x - 1,
            y: trackArray[i - 1].y,
            step: setRandomArrow(trackArray[i - 1].x - 1, trackArray[i - 1].y),
          };
          break;
        case 1:
          trackArray[i] = {
            x: trackArray[i - 1].x,
            y: trackArray[i - 1].y + 1,
            step: setRandomArrow(trackArray[i - 1].x, trackArray[i - 1].y + 1),
          };
          break;
        case 2:
          trackArray[i] = {
            x: trackArray[i - 1].x + 1,
            y: trackArray[i - 1].y,
            step: setRandomArrow(trackArray[i - 1].x + 1, trackArray[i - 1].y),
          };
          break;
        case 3:
          trackArray[i] = {
            x: trackArray[i - 1].x,
            y: trackArray[i - 1].y - 1,
            step: setRandomArrow(trackArray[i - 1].x, trackArray[i - 1].y - 1),
          };
          break;

        default:
          break;
      }
    }
    trackArray[9] = { ...trackArray[9], step: stop };
    // console.log('trackArray', trackArray[9])
  };

  const startClick = async (e) => {
   await setFlag(true)
    alert("15 SECONDS FOR FIND EXIT) GOOD LUCK!");
    // ;
    let target;
    if (!focusIndex) {
      if (start.id) {
        if(clickId) {
          clear(start.id);
           clear(clickId)
          }
        else clear(start.id);
      }
      focusIndex = array[randomizer(size)][randomizer(size)];
      buildTrack(focusIndex);
      target = document.getElementById(`${focusIndex.id}`);
      exit = array[trackArray[9].x][trackArray[9].y];
      start = array[trackArray[0].x][trackArray[0].y];
      target.style.backgroundColor = "blue";
      target.textContent = "START";
      await setArray(createArray(size))
    }
    console.log("exit", exit);
    await setTrack(trackArray);
    timerId = setTimeout(() => {
      target.style.backgroundColor = "red";
      target.textContent = "LOOSE";
      focusIndex = null;
      exit = null;
      clearTimeout(timerId);
      setFlag(false);
    }, 15000);
  };

  const handleClick = (e) => {
    clickId = e.target.id;
    if (focusIndex) {
      if (clickId === exit.id) {
        e.target.style.backgroundColor = "green";
        e.target.textContent = "WIN";
        focusIndex = null;
        exit = null;
        clearTimeout(timerId);
        setFlag(false);
      } else {
        e.target.style.backgroundColor = "red";
        e.target.textContent = "MISS";
        focusIndex = null;
        exit = null;
        clearTimeout(timerId);
        setFlag(false);
      }
    } else alert("Try in next game");
  };

  return (
    <div className={css.Wrapper}>
      <div
        style={{ width: `${size * 60 + 20}px`, height: `${size * 60 + 20}px` }}
        className={css.mainDiv}
      >
        {array.map((element, x) =>
          element.map((el, y) => (
            <div
              key={el.id}
              id={el.id}
              className={css.cube}
              onClick={handleClick}
            />
          ))
        )}
      </div>
      <div className={css.stepsBlock}>
        {track.map((el, index) => (
          <img
            key={index}
            className={css.stepsIcon}
            src={el.step}
            alt="arrow"
            width="32"
            height="32"
          />
        ))}
      </div>
      <div style={{ textAlign: "center", padding: "10px" }}>
        <form>
          <button type="button" onClick={startClick} disabled={flag}>
            START
          </button>
        </form>
      </div>
    </div>
  );
};

export default Game;
