const ADDING_FX_DISAPPEARANCE_TIME_IN_SECONDS = 1.5;

function createAddingFX(value, coords, related) {
    const { x: ADDING_FX_MIN_X, y: ADDING_FX_MIN_Y } = clicker.getBoundingClientRect();
    let fx = document.createElement("p");
    fx.innerHTML = "+" + shortNumber(value).toString();
    fx.classList.add("number");
    fx.style.fontSize = "22px";
    fx.style.pointerEvents = "none";
    fx.style.position = "absolute";
    fx.style.zIndex = 101;

    if (related) {
        fx.style.top = coords.y + ADDING_FX_MIN_Y + "px";
        fx.style.left = coords.x + ADDING_FX_MIN_X + "px";
    } else {
        fx.style.top = coords.y + "px";
        fx.style.left = coords.x + "px";
    }
    fx.style.animation = `adding__fx__animation ${ADDING_FX_DISAPPEARANCE_TIME_IN_SECONDS + 0.1}s`

    document.body.appendChild(fx);
    setTimeout(() => {
        document.body.removeChild(fx);
    }, ADDING_FX_DISAPPEARANCE_TIME_IN_SECONDS * 1000);
}

const BUBBLE_FX_DISAPPEARANCE_TIME_IN_SECONDS = 5;

function spawnBubble(onPop) {
    const { x: ADDING_FX_MIN_X, y: ADDING_FX_MIN_Y } = clicker.getBoundingClientRect();
    let fx = document.createElement("img");
    fx.setAttribute("src", "./assets/icons/bubble.png")
    fx.draggable = false;
    fx.style.width = "200px";
    fx.style.userSelect = "none";
    fx.style.cursor = "pointer";
    fx.style.position = "absolute";
    fx.style.transform = "translate(-50%, -50%)";

    fx.style.top = Math.floor(Math.random() * 350) + ADDING_FX_MIN_Y + "px";
    fx.style.left = Math.floor(Math.random() * 350) + ADDING_FX_MIN_X + "px";

    fx.style.animation = `bubbleAppearing ${BUBBLE_FX_DISAPPEARANCE_TIME_IN_SECONDS}s`
    
    document.body.appendChild(fx);
    
    let deleteTimeout = setTimeout(() => {
        document.body.removeChild(fx);
    }, BUBBLE_FX_DISAPPEARANCE_TIME_IN_SECONDS * 1000);

    fx.addEventListener("click", (e) => {
        onPop(e);
        document.body.removeChild(e.target);
        clearTimeout(deleteTimeout);
    });
}

const GEM_FX_DISAPPEARANCE_TIME_IN_SECONDS = 3;

function spawnGem(onClick) {
    let fx = document.createElement("img");
    fx.setAttribute("src", "./assets/icons/gem.png")
    fx.draggable = false;
    fx.style.width = "75px";
    fx.style.borderRadius = "100%";
    fx.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.5)";
    fx.style.userSelect = "none";
    fx.style.cursor = "pointer";
    fx.style.position = "fixed";
    fx.style.zIndex = "1000";
    fx.style.transform = "translate(-50%, -50%)";

    fx.style.top = Math.floor(Math.random() * (window.innerHeight - 150)) + 50  + "px";
    fx.style.left = Math.floor(Math.random() * (window.innerWidth - 150)) + 50  + "px";

    fx.style.animation = `gemAppearing ${GEM_FX_DISAPPEARANCE_TIME_IN_SECONDS}s`
    
    document.body.appendChild(fx);
    
    let deleteTimeout = setTimeout(() => {
        document.body.removeChild(fx);
    }, GEM_FX_DISAPPEARANCE_TIME_IN_SECONDS * 1000);

    fx.addEventListener("click", (e) => {
        onClick(e);
        document.body.removeChild(e.target);
        clearTimeout(deleteTimeout);
    });
}