const audioSrc =
  "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";

function App() {
  const [displayTime, setDisplayTime] = React.useState(25 * 60);
  const [breakTime, setBreakTime] = React.useState(5 * 60);
  const [sessionTime, setSessionTime] = React.useState(25 * 60);
  const [timerOn, setTimerOn] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);
  
  let player = React.useRef(null);

  React.useEffect(() => {
    if (displayTime <= 0) {
      setOnBreak(true);
      breakSound();
    } else if (!timerOn && displayTime === breakTime) {
      setOnBreak(false);
    }
    console.log("test");
  }, [displayTime, onBreak, timerOn, breakTime, sessionTime]);

  const breakSound = () => {
    player.currentTime = 0;
    player.play();
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);

    const secconds = time % 60;

    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (secconds < 10 ? "0" + secconds : secconds)
    );
  };
  

  const changeTime = (amount, type) => {
    if (type == "break") {
      if (breakTime <= 60 && amount < 0 || breakTime >= 60 * 60) {
        return;
      }
      setBreakTime((prev) => prev + amount);
    } else {
      if (type == "session") {
        if (sessionTime <= 60 && amount < 0 || sessionTime >= 60 * 60) {
          return;
        }
        setSessionTime((prev) => prev + amount);
      }
      if (!timerOn) {
        setDisplayTime((sessionTime) + amount);
      }
    }
  };
  
  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;
    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplayTime((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              // breakSound();
              onBreakVariable = true;
              return breakTime;
            } else if (prev <= 0 && onBreakVariable) {
              // breakSound();
              onBreakVariable = false;
              setOnBreak(false);
              return sessionTime;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    
    if(timerOn){
      clearInterval(localStorage.getItem('interval-id'));
    }
    setTimerOn(!timerOn);
    console.log(!timerOn);
  };
  
  const resetTime = () => {
    clearInterval(localStorage.getItem("interval-id"));
    setDisplayTime(25*60);
    setBreakTime(5*60);
    setSessionTime(25*60);
    player.pause();
    player.currentTime = 0;
    setTimerOn(false);
    setOnBreak(false);
  }

  return (
    <div className="center-align">
      <h1>25 + 5 Clock</h1>
      <div className="dual-container">
        <Length
          title={"Break length"}
          changeTime={changeTime}
          type={"break"}
          time={breakTime}
          formatTime={formatTime}
          idLabel={"break-label"}
          idBtnD={"break-decrement"}
          idBtnI={"break-increment"}
          idLength={"break-length"}
        />
        <Length
          title={"Session length"}
          changeTime={changeTime}
          type={"session"}
          time={sessionTime}
          formatTime={formatTime}
          idLabel={"session-label"}
          idBtnD={"session-decrement"}
          idBtnI={"session-increment"}
          idLength={"session-length"}
        />
      </div>
      <h3 id="timer-label">{onBreak ? "Break" : "Session"}</h3>
      <h1 id="time-left">{formatTime(displayTime)}</h1>
      <div class="play-pause-container">
      <button
        className="btn-large waves-effect waves-light btn teal lighten-2"
        id="start_stop"
        onClick={controlTime}
        >
        { timerOn?
        (<i className="material-icons">pause_circle_outline</i>) :
        (<i className="material-icons">play_circle_outline</i>) } 
      </button>
      <button
        className="btn-large waves-effect waves-light btn teal lighten-2"
        id="reset"
        onClick={resetTime}>
        <i className="material-icons">restore</i>
      </button>
      </div>
      <audio ref={(t) => (player = t)} src={audioSrc} id="beep" />
    </div>
  );
}

function Length({ title, changeTime, type, time, formatTime ,idLabel, idBtnD ,idBtnI,idLength}) {
  return (
    <div>
      <h3 id={idLabel}>{title}</h3>
      <div className="time-sets">
        <button
          className="a-btn waves-effect waves-light btn teal lighten-2"
          onClick={() => changeTime(-60, type)}
          id={idBtnD}
        >
          <i className="material-icons">keyboard_arrow_down</i>
        </button>
        <h2 id={idLength}>{time/60}</h2>
        <button
          className="a-btn waves-effect waves-light btn teal lighten-2"
          onClick={() => changeTime(+60, type)}
          id={idBtnI}
        >
          <i className="material-icons">keyboard_arrow_up</i>
        </button>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
