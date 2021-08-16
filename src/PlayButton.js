function PlayButton({url, title, playSound}) {
  return (
    <button
      className="play-button"
      onClick={() => playSound(url)}
    >
        {title}
    </button>
  );
}

export default PlayButton;
