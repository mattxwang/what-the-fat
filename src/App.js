import { useState, useEffect, useReducer } from 'react';
import logo from './death-192.png';
import './App.css';
import {sounds, beats} from './data';
import PlayButton from './PlayButton';


function App() {

  const [audioContext, setAudioContext] = useState(null);

  const reducer = (state, action) => {
    const newState = {...state};
    newState[action.url] = action.value;
    return newState;
  }

  const [state, dispatch] = useReducer(reducer, {});

  const load = () => {
    if (audioContext !== null) {
      return;
    }
    setAudioContext(new (AudioContext || window.AudioContext)());
  }

  useEffect(() => {
    return () => audioContext !== null ? audioContext.close() : null;
  }, []);

  useEffect(() => {
    if (audioContext === null) {
      return;
    }
    sounds.forEach((file) => {
      getSound(file.url);
    });
    beats.forEach((file) => {
      getSound(file.url);
    });
  }, [audioContext]);

  const getSound = (url) => {
    if (audioContext === null) {
      return;
    }
    fetch(url)
      .then((resp) => resp.arrayBuffer())
      .then((resp) => {
        audioContext.decodeAudioData(resp, (buffer) => {
          dispatch({url: url, value: buffer});
        })
      });
  }

  const playSound = (url) => {
    console.log(state);
    const source = audioContext.createBufferSource();
    source.buffer = state[url];
    source.connect(audioContext.destination);
    source.start(0);
  }

  const Grids = () => {
    return (
      <>
        <h2>juan sounds</h2>
        <div className="button-grid">
          {sounds.map((file) => <PlayButton {...file} playSound={playSound} key={file.url}/>)}
        </div>
        <h2>8-bar beats</h2>
        <div className="button-grid">
          {beats.map((file) => <PlayButton {...file} playSound={playSound} key={file.url}/>)}
        </div>
      </>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="juan's fat face rotating" />
        {audioContext === null ? <button className="play-button" onClick={() => load()}>load</button> : <Grids />}
      </header>
    </div>
  );
}

export default App;
