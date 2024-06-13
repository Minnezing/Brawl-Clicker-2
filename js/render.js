// Инициализация переменных для рендера
let gemsElement = document.querySelector("#gems");
let expElement = document.querySelector("#exp");

let eventsElement = document.querySelector("#events");

let gadgetsListElement = document.querySelector(".brawlers-gadgets-list");
let gadgetsCount = document.querySelector("#gadgets-count")
let gadgetsAllCount = document.querySelector("#gadgets-all-count")

let brawlersListElement = document.querySelector(".brawlers-list");
let brawlersCount = document.querySelector("#brawlers-count");
let brawlersAllCount = document.querySelector("#brawlers-all-count");

function render() {
    gemsElement.innerHTML = shortNumber(gems);
    expElement.innerHTML = shortNumber(exp);

    brawlersCount.innerHTML = userBrawlersData.length;
    gadgetsCount.innerHTML = userBrawlersData.filter(brw => brw.gadget).length;

    eventsBuffer.forEach(event => {
        let eventDetailsElement = document.querySelector(`[eventName="${event.name}"] .details`)
        if (!eventDetailsElement) {
            eventsElement.innerHTML += `
                <div class="event" eventName="${event.name}">
                    <img src="./assets/${event.icon}" draggable="false" class="event-icon">
                    <p class="details details-top event-details">
                        ${
                            event.brawlerId ?
                            brawlersData[event.brawlerId].name + `<br><br>` : ""
                        }
                        ${event.description}
                        ${
                            event.duration !== 0 ?
                            `<br><br>` + getRemainingTime(event.start + event.duration) : ""
                        }
                    </p>
                </div>\n
            `;
        } else {
            eventDetailsElement.innerHTML = `
                ${
                    event.brawlerId ?
                    brawlersData[event.brawlerId].name + `<br><br>` : ""
                }
                ${event.description}
                ${
                    event.duration !== 0 ?
                    `<br><br>` + getRemainingTime(event.start + event.duration) : ""
                }
            `;
        }
    })

    let eventElements = [...(document.querySelectorAll(".event") ?? [])];
    eventElements.filter(el => !eventsBuffer.find(event => event.name === el.getAttribute("eventName"))).forEach(el => {
        el.parentElement.removeChild(el);
    })

    let expCostElements = document.querySelectorAll(".brawl-level-exp");
    let gemsCostElements = document.querySelectorAll(".brawl-level-cost");

    gemsCostElements.forEach(gemsCostEl => {
        let brawlerId = gemsCostEl.closest(".brawlers-list-item").getAttribute("brawlerId");
        let buttonElement = gemsCostEl.closest(".brawler-upgrade");

        let userData = userBrawlersData.find(brw => brw.id == brawlerId);
        let brawlerData = brawlersData[brawlerId];

        if (userData?.level == brawlerData.gemsPerSecond.length) return;

        let levelCost = getLevelCost(brawlerId, (userData?.level ?? 0) + 1);
        if (gems < levelCost) {
            gemsCostEl.classList.add("number-unavailable");
            if (buttonElement) buttonElement.classList.add("lack");
        } else {
            gemsCostEl.classList.remove("number-unavailable");
            if (buttonElement) buttonElement.classList.remove("lack");
        }
    });

    expCostElements.forEach(expCostEl => {
        let brawlerId = expCostEl.closest(".brawlers-list-item").getAttribute("brawlerId");
        let buttonElement = expCostEl.closest(".brawler-upgrade");

        let expToOpen = getExpToOpen(brawlerId);

        let userData = userBrawlersData.find(brw => brw.id === brawlerId);

        if (userData?.level) return;

        if (exp < expToOpen) {
            if (buttonElement) buttonElement.classList.add("lack");
        } else {
            let parent = expCostEl.parentElement;
            let icon = parent.querySelector(`.brawler-level-curr-icon, .brawler-upgrade-curr-icon`);

            parent.removeChild(expCostEl);
            parent.removeChild(icon);

            let levelCost = getLevelCost(brawlerId, 1);
            parent.innerHTML += `
                <img src="./assets/icons/gem.png" alt="Gems" class="brawler-level-curr-icon">
                <span class="brawler-level-curr-count brawl-level-cost number ${levelCost > gems ? "number-unavailable" : ""}">${shortNumber(levelCost)}</span>
            `;
        }
    });

    userBrawlersData.forEach(brawler => {
        let brawlerData = brawlersData[brawler.id];

        let brawlerElement = document.querySelector(`[brawlerId="${brawler.id}"]`);
        if (brawlerElement.classList.contains(`locked`)) {
            brawlerElement.classList.remove(`locked`);
        }
    
        // Ранги и заработанное
        let earnedElement = brawlerElement.querySelector(`.brawler-rank-curr-count`);
        let rankBackgorundElement = brawlerElement.querySelector(`.brawler-rank-icon-background`);
        let rankNumberElement = brawlerElement.querySelector(`.brawler-rank-icon-text`);

        let { rankNumber, rankColor } = getRank(brawler.earned, brawlerData);

        earnedElement.innerHTML = shortNumber(brawler.earned);
        if (rankNumberElement.innerHTML != rankNumber) {
            rankNumberElement.innerHTML = rankNumber;
        }
        if (!rankBackgorundElement.getAttribute(`src`).includes(rankColor)) {
            rankBackgorundElement.setAttribute(`src`, `./assets/ranks/${rankColor}.svg`);
        }

        // Гаджет
        if (brawler.gadget) {
            let pin;
            let status;
    
            if (brawler.gadget + brawlerData.gadget.cooldownInSeconds * 1000 > Date.now()) {
                if (Date.now() - brawler.gadget < 10 * 1000) {
                    pin = "Phew";
                } else {
                    pin = "Sad";
                }
                status = shortNumber(getRemainingTime(brawler.gadget + brawlerData.gadget.cooldownInSeconds * 1000));
            } else {
                pin = "Thanks";
                status = "Готов к использованию";
            }

            let cardGagetIconElement = brawlerElement.querySelector(`.brawler-gadget-icon`);
            let menuGagetIconElement = document.querySelector(`[gadgetbrawlerid="${brawler.id}"] .brawlers-gadgets-item-icon`);

            if (cardGagetIconElement.classList.contains(`unavailable`)) {
                cardGagetIconElement.classList.remove(`unavailable`);
            }

            if (menuGagetIconElement.classList.contains(`unavailable`)) {
                menuGagetIconElement.classList.remove(`unavailable`);
            }

            let cardGagetDetailsElement = brawlerElement.querySelector(`.brawler-gadget .details`);
            let menuGagetPinElement = document.querySelector(`[gadgetbrawlerid="${brawler.id}"] .brawlers-gadgets-item-status-icon`);
            let menuGagetDetailsElement = document.querySelector(`[gadgetbrawlerid="${brawler.id}"] .details`);

            cardGagetDetailsElement.innerHTML = `
                ${brawlerData.gadget.description}
                <br><br>
                ${status}
            `;

            menuGagetPinElement.setAttribute(`src`, `./assets/pins/${brawlerData.iconName.split(".")[0]}_${pin}.webp`);
            menuGagetDetailsElement.innerHTML = `
                ${brawlerData.name}
                <br><br>
                ${brawlerData.gadget.description}
                <br><br>
                ${status}
            `;
        }

        // Звездная сила
        if (brawler.starpower) {
            let starpowerIconElement = brawlerElement.querySelector(`.brawler-starpower-icon`);
            if (starpowerIconElement.classList.contains("unavailable")) {
                let starpowerDetailsElement = brawlerElement.querySelector(`.brawler-starpower-icon + .details`);
                starpowerIconElement.classList.remove("unavailable");
                starpowerDetailsElement.innerHTML = `
                    ${brawlerData.starpower.description}
                    <br><br>
                    Используется
                `;
            }
        }

        // Уровень и прокачка
        let levelElement = brawlerElement.querySelector(`.brawler-level-icon-text`);
        if (levelElement.innerHTML != brawler.level) {
            levelElement.innerHTML = brawler.level;

            let levelBackgroudElement = brawlerElement.querySelector(`.brawler-level-icon-background`);
            if (!levelBackgroudElement.getAttribute(`src`).includes(`level`)) {
                levelBackgroudElement.setAttribute(`src`, `./assets/icons/level.svg`);
            }

            let expElements = brawlerElement.querySelectorAll(`.brawl-level-exp`);
            expElements.forEach(pe => pe.style.display = "none");
            
            let levelCostElement = brawlerElement.querySelectorAll(`.brawl-level-cost`);

            if (brawler.level == brawlerData.gemsPerSecond.length) {
                levelCostElement.forEach(ce => {
                    ce.innerHTML = "MAX LEVEL"
                    let buttonElement = ce.closest(`.brawler-upgrade`);
                    let levelElement = ce.closest(`.brawler-level`);
                    if (buttonElement) buttonElement.classList.add("max")
                    if (levelElement) levelElement.classList.add("max")
                });
                brawlerElement.querySelectorAll(`.brawler-upgrade-curr-icon`).forEach(e => e.style.display = "none");
                brawlerElement.querySelectorAll(`.brawler-level-curr-icon`).forEach(e => e.style.display = "none");
            } else {
                let addElement = brawlerElement.querySelector(`.gems-per-second-add`);
                addElement.style.display = "inline";
                addElement.innerHTML = "+" + shortNumber(brawlerData.gemsPerSecond[brawler.level] - brawlerData.gemsPerSecond[brawler.level - 1]);

                levelCostElement.forEach(ce => ce.innerHTML = shortNumber(getLevelCost(brawler.id, brawler.level + 1)));
            }
        }
    })
}

function renderAll() {
    gemsElement.innerHTML = shortNumber(gems);
    expElement.innerHTML = shortNumber(exp);

    gadgetsCount.innerHTML = userBrawlersData.filter(brw => brw.gadget).length;
    gadgetsAllCount.innerHTML = Object.keys(brawlersData).length;

    brawlersCount.innerHTML = userBrawlersData.length;
    brawlersAllCount.innerHTML = Object.keys(brawlersData).length;

    eventsElement.innerHTML = eventsBuffer.map(event => {
        if (!isEventActive(event.name)) {
            clearEvent(event.name);
            return "";
        }
        return (`
            <div class="event" eventName="${event.name}">
                <img src="./assets/${event.icon}" draggable="false" class="event-icon">
                <p class="details details-top event-details">
                    ${
                        event.brawlerId ?
                        brawlersData[event.brawlerId].name + `<br><br>` : ""
                    }
                    ${event.description}
                    ${
                        event.duration !== 0 ?
                        `<br><br>` + getRemainingTime(event.start + event.duration) : ""
                    }
                </p>
            </div>
        `);
    }).join("\n");

    gadgetsListElement.innerHTML = Object.keys(brawlersData).map(brawlerId => {
        let brawlerData = brawlersData[brawlerId];
        let userData = userBrawlersData.find(brw => brw.id == brawlerId);
        
        let pin;
        let status;

        if (!userData || !userData?.gadget) {
            pin = "Sad";
            status = `
                <img src="./assets/icons/gem.png" draggable="false" alt="gems" class="details-cost-curr">
                <span class="details-cost-value">${shortNumber(getGadgetCost(brawlerId))}</span>
            `;
        } else if (userData.gadget + brawlerData.gadget.cooldownInSeconds * 1000 > Date.now()) {
            pin = "Phew";
            status = shortNumber(getRemainingTime(userData.gadget + brawlerData.gadget.cooldownInSeconds * 1000));
        } else {
            pin = "Thanks";
            status = "Готов к использованию";
        }


        return (`
            <div class="brawlers-gadgets-item" gadgetBrawlerId="${brawlerId}">
                <img src="./assets/gadgets/${brawlerData.iconName}" draggable="false" alt="" class="brawlers-gadgets-item-icon ${!userData?.gadget ? "unavailable" : ""}">
                <img src="./assets/pins/${brawlerData.iconName.split(".")[0]}_${pin}.webp" draggable="false" alt="" class="brawlers-gadgets-item-status-icon">
                <p class="details brawlers-gadgets-item-details">
                    ${brawlerData.name}
                    <br><br>
                    ${brawlerData.gadget.description}
                    <br><br>
                    ${status}
                </p>
            </div>
        `);
    }).join("\n");

    brawlersListElement.innerHTML = Object.keys(brawlersData).map(brawlerId => {
        let brawlerData = brawlersData[brawlerId];
        let userData = userBrawlersData.find(brw => brw.id == brawlerId);

        let locked = !userData;

        let { rankNumber, rankColor } = getRank(userData?.earned ?? 0, brawlerData);

        let expToOpen = getExpToOpen(brawlerId);
        let levelCost = getLevelCost(brawlerId, (userData?.level ?? 0) + 1);

        let gadgetStatus;
        if (locked || !userData.gadget) {
            gadgetStatus = `
                <img src="./assets/icons/gem.png" draggable="false" alt="gems" class="details-cost-curr">
                <span class="details-cost-value">${shortNumber(getGadgetCost(brawlerId))}</span>
            `;
        } else if (userData.gadget + brawlerData.gadget.cooldownInSeconds * 1000 > Date.now()) {
            gadgetStatus = shortNumber(getRemainingTime(userData.gadget + brawlerData.gadget.cooldownInSeconds * 1000));
        } else {
            gadgetStatus = "Готов к использованию";
        }

        let starpowerStatus;
        if (locked || !userData.starpower) {
            starpowerStatus = `
                <img src="./assets/icons/gem.png" draggable="false" alt="gems" class="details-cost-curr">
                <span class="details-cost-value">${shortNumber(getStarpowerCost(brawlerId))}</span>
            `;
        } else {
            starpowerStatus = "Используется";
        }

        return (`
            <div class="brawlers-list-item ${locked ? "locked" : ""}" brawlerId="${brawlerId}">
                <div class="brawler-main">
                    <div class="brawler-header">
                        <div class="brawler-rank">
                            <div class="brawler-rank-icon">
                                <img src="./assets/ranks/${rankColor}.svg" draggable="false" class="brawler-rank-icon-background">
                                <span class="brawler-rank-icon-text number">${rankNumber}</span>
                            </div>
                            <img src="./assets/icons/gem.png" alt="Gems" class="brawler-rank-curr-icon">
                            <span class="brawler-rank-curr-count number">${shortNumber(userData?.earned ?? 0)}</span>
                        </div>
                        <div class="brawler-introducing ${brawlerData.rarity}">
                            <img src="./assets/portraits/${brawlerData.iconName}" draggable="false" class="brawler-introducing-portrait">
                            <span class="brawler-introducing-name">${brawlerData.name}</span>
                        </div>
                        <div class="brawler-level ${userData?.level == brawlerData.gemsPerSecond.length ? "max" : ""}">
                            <div class="brawler-level-icon">
                                <img src="./assets/icons/${userData?.level ? "level.svg" : "locked.png"}" draggable="false" class="brawler-level-icon-background">
                                <span class="brawler-level-icon-text number">${userData?.level ?? ""}</span>
                            </div>
                            ${
                                userData?.level == brawlerData.gemsPerSecond.length ? `<span class="brawler-level-curr-count brawl-level-cost">MAX LEVEL</span>` :
                                locked ?
                                (exp < expToOpen ? `
                                    <img src="./assets/icons/exp.png" alt="Exp" class="brawler-level-curr-icon">
                                    <span class="brawler-level-curr-count brawl-level-exp number ${expToOpen > exp ? "number-unavailable" : ""}">${shortNumber(expToOpen)}</span>
                                ` : `
                                    <img src="./assets/icons/gem.png" alt="Gems" class="brawler-level-curr-icon">
                                    <span class="brawler-level-curr-count brawl-level-cost number ${levelCost > gems ? "number-unavailable" : ""}">${shortNumber(levelCost)}</span>
                                `) :
                                (`
                                    <img src="./assets/icons/gem.png" alt="Gems" class="brawler-level-curr-icon">
                                    <span class="brawler-level-curr-count brawl-level-cost number ${levelCost > gems ? "number-unavailable" : ""}">${shortNumber(levelCost)}</span>
                                `)
                            }
                        </div>
                    </div>
                    <p class="brawler-description">${brawlerData.description}</p>
                </div>
                <div class="brawler-additional">
                    <div class="brawler-abilities">
                        <div class="brawler-gadget">
                            <img src="./assets/gadgets/${brawlerData.iconName}" draggable="false" alt="Gadget" class="brawler-gadget-icon ${!userData?.gadget ? "unavailable" : ""}">
                            <p class="details abilities-details">
                                ${brawlerData.gadget.description}
                                <br><br>
                                ${gadgetStatus}
                            </p>
                        </div>
                        <div class="brawler-starpower">
                            <img src="./assets/starpowers/${brawlerData.iconName}" draggable="false" alt="Starpower" class="brawler-starpower-icon ${!userData?.starpower ? "unavailable" : ""}">
                            <p class="details abilities-details">
                                ${brawlerData.starpower.description}
                                <br><br>
                                ${starpowerStatus}
                        </div>
                    </div>
                    <div class="brawler-stats">
                        <div class="brawler-stats-item">
                            <p class="brawler-stats-item-title">Кристаллов за клик</p>
                            <p class="brawler-stats-item-value number">${shortNumber(brawlerData.gemsPerClick)}</p>
                        </div>
                        <div class="brawler-stats-item">
                            <p class="brawler-stats-item-title">Кристаллов в секунду</p>
                            <p class="brawler-stats-item-value number">${shortNumber(brawlerData.gemsPerSecond[(userData?.level ?? 1) - 1])}</p>
                            <span class="gems-per-second-add number" ${(!userData?.level || userData?.level == brawlerData.gemsPerSecond.length) ? "style=\"display: none\"" : ""}>+${shortNumber(brawlerData.gemsPerSecond[userData?.level ?? 1] - brawlerData.gemsPerSecond[(userData?.level ?? 2) - 1])}</span>
                        </div>
                    </div>
                    <button class="brawler-upgrade ${levelCost > gems || expToOpen > exp ? "lack" : ""} ${userData?.level == brawlerData.gemsPerSecond.length ? "max" : ""}">
                        ${
                            userData?.level == brawlerData.gemsPerSecond.length ? `<span class="brawler-upgrade-curr-count brawl-level-cost">MAX LEVEL</span>` :
                            locked ?
                            (exp < expToOpen ? `
                                    <img src="./assets/icons/exp.png" alt="Exp" class="brawler-upgrade-curr-icon">
                                    <span class="brawler-upgrade-curr-count brawl-level-exp number ${expToOpen > exp ? "number-unavailable" : ""}">${shortNumber(expToOpen)}</span>
                                ` : `
                                    <img src="./assets/icons/gem.png" alt="Gems" class="brawler-upgrade-curr-icon">
                                    <span class="brawler-upgrade-curr-count brawl-level-cost number ${levelCost > gems ? "number-unavailable" : ""}">${shortNumber(levelCost)}</span>
                                `):
                            (`
                                <img src="./assets/icons/gem.png" alt="Gems" class="brawler-upgrade-curr-icon">
                                <span class="brawler-upgrade-curr-count brawl-level-cost number ${levelCost > gems ? "number-unavailable" : ""}">${shortNumber(levelCost)}</span>
                            `)
                        }
                    </button>
                </div>
            </div>
        `)
    }).join("\n");

    Object.keys(brawlersData).forEach(brawlerId => setBrawlerCardEvent(brawlerId));
}