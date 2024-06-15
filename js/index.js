// Инициализация переменных
let gems = 0;
let exp = 0;
let renderBuffer = [];
let eventsBuffer = [];
let eventsExecution = [];
let userBrawlersData = [];
const clicker = document.getElementById(`click`);

// Загрузка данных
function loadData() {
    gems = getData("gems") ?? 0;
    exp = getData("exp") ?? 0;
    userBrawlersData = getData("brawlers") ?? [];
    eventsBuffer = getData("events") ?? [];
    eventsExecution = Object.values(brawlersData).filter(brw => brw.events).flatMap(brw => brw.events);

    userBrawlersData.filter(brw => brw.starpower).forEach(brawler => {
        let brawlerData = brawlersData[brawler.id];
        if (brawlerData.starpower?.execute) {
            brawlerData.starpower.execute();
        }
    })

    eventsBuffer.filter(event => event.type == "onStart").forEach(event => {
        eventsExecution.find(evex => evex.name === event.name).execute();
    })
}

// Игровой цикл
function gameCycle() {
    let gemsPerSecond = {};
    
    userBrawlersData.forEach(brawler => {
        let brawlerData = brawlersData[brawler.id];
        gemsPerSecond[brawler.id] = brawlerData.gemsPerSecond[brawler.level - 1];
    })

    eventsBuffer.filter(event => event.type == "onIteration").forEach(event => {
        eventsExecution.find(evex => evex.name === event.name).execute(gemsPerSecond);
    })

    Object.keys(gemsPerSecond).forEach(brawlerId => {
        let userData = userBrawlersData.find(brw => brw.id === brawlerId);
        setBrawlerData(brawlerId, {
            earned: userData.earned + gemsPerSecond[brawlerId]
        });
    })

    let earned = Object.values(gemsPerSecond).reduce((acc, curr) => acc + curr, 0);
    
    gems += earned;
    exp += earned;

    setData("gems", gems);
    setData("exp", exp);

    eventsBuffer.forEach(event => {
        if (!isEventActive(event.name)) clearEvent(event.name);
    })

    render();
}

let gameCycleInterval;
function startGameCycle() {
    gameCycleInterval = setInterval(gameCycle, 1000);
}

// Клик
function click(e) {
    let gemsPerClick = { user: 1 };

    userBrawlersData.forEach(brawler => {
        let brawlerData = brawlersData[brawler.id];
        gemsPerClick[brawler.id] = brawlerData.gemsPerClick;
    });

    eventsBuffer.filter(event => event.type == "onClick").forEach(event => {
        eventsExecution.find(evex => evex.name === event.name).execute(gemsPerClick);
    });

    Object.keys(gemsPerClick).forEach(brawlerId => {
        let userData = userBrawlersData.find(brw => brw.id === brawlerId);
        if (!userData) return;
        setBrawlerData(brawlerId, {
            earned: userData.earned + gemsPerClick[brawlerId]
        });
    });

    let earned = Object.values(gemsPerClick).reduce((acc, curr) => acc + curr, 0);

    createAddingFX(earned, { x: e.clientX, y: e.clientY });

    gems += earned;
    exp += earned;
    render();
}

// Начало работы
loadData();
renderAll();
clicker.addEventListener("click", click);
startGameCycle();