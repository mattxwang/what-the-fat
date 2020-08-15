resize = (game) => {
    const RATIO             = 750.0 / 1000.0;
    const EFFECTIVE_WIDTH   = window.innerWidth * .9;
    const EFFECTIVE_HEIGHT  = window.innerHeight * .9;

    if(EFFECTIVE_WIDTH * RATIO > window.innerHeight) {
        game.resize(EFFECTIVE_HEIGHT / RATIO , EFFECTIVE_HEIGHT)
    }
    else {
        game.resize(EFFECTIVE_WIDTH , EFFECTIVE_WIDTH * RATIO);
    }
}

window.onload = () => {
    let flappy = new Game(document.getElementById("game"));

    window.addEventListener("resize" , resize(flappy));

    resize(flappy);

    // Start coding here!
    // flappy.setBirdImg('http://sohme.com/wp-content/uploads/2015/07/red.png')

    flappy.load();
};
