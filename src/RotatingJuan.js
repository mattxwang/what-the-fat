import img1 from './img/2.png';
import img2 from './img/4.png';
import img3 from './img/8.png';
import img4 from './img/16.png';
import img5 from './img/32.png';
import img6 from './img/64.png';
import img7 from './img/128.png';
import img8 from './img/256.png';
import img9 from './img/512.png';
import img10 from './img/1024.png';

const imgs = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10
];

function RotatingJuan() {
  const img = imgs[Math.floor(Math.random()*imgs.length)];
  return <img src={img} className="App-logo" alt="juan's fat face rotating" />;
}

export default RotatingJuan;
