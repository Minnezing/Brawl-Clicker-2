function setBrawlerCardEvent(brawlerId) {
    let brawlerElement = document.querySelector(`[brawlerId="${brawlerId}"]`);

    brawlerElement.addEventListener("click", () => openAndCloseCard(brawlerElement));

    let upgradeButton = brawlerElement.querySelector(`.brawler-upgrade`);
    upgradeButton.addEventListener("click", (e) => upgradeBrawler(brawlerId));

    let gadgetButton = brawlerElement.querySelector(`.brawler-gadget-icon`);
    let menuGadgetButton = document.querySelector(`[gadgetbrawlerid="${brawlerId}"] .brawlers-gadgets-item-icon`);
    gadgetButton.addEventListener("click", (e) => activateGadget(brawlerId));
    menuGadgetButton.addEventListener("click", (e) => activateGadget(brawlerId));

    let starpowerButton = brawlerElement.querySelector(`.brawler-starpower-icon`);
    starpowerButton.addEventListener("click", (e) => activateStarpower(brawlerId));
}

function openAndCloseCard(brawlerElement) {
    if (!brawlerElement.classList.contains("opened")) {
        brawlerElement.classList.add("opened");
    }
    document.addEventListener('click', (event) => outsideClickListener(event, brawlerElement));

    const outsideClickListener = (event, brawlerElement) => {
        if (event.target.closest(`[brawlerid="${brawlerElement.getAttribute("brawlerId")}"]`) === null) {
            brawlerElement.classList.remove("opened");
            removeClickListener();
        }
    }
    const removeClickListener = () => {
        document.removeEventListener('click', outsideClickListener);
    }
}

function upgradeBrawler(brawlerId) {
    let brawlerData = brawlersData[brawlerId];
    let userData = userBrawlersData.find(brw => brw.id === brawlerId);

    if (!userData) {
        let buyCost = getLevelCost(brawlerId, 1);
        if (exp < getExpToOpen(brawlerId) || gems < buyCost) return;
        gems -= buyCost;
        setBrawlerData(brawlerId, {
            id: brawlerId,
            level: 1,
            earned: 0,
            starpower: false,
            gadget: false
        });
    } else {
        if (userData.level == brawlerData.gemsPerSecond.length) return;
        let levelCost = getLevelCost(brawlerId, userData.level + 1);
        if (gems < levelCost) return;

        gems -= levelCost;
        setBrawlerData(brawlerId, { level: userData.level + 1 });
    }
    render();
}

function activateGadget(brawlerId) {
    let brawlerData = brawlersData[brawlerId];
    let userData = userBrawlersData.find(brw => brw.id === brawlerId);

    if (!userData) return;

    if (!userData?.gadget) {
        let gadgetCost = getGadgetCost(brawlerId);
        if (gems < gadgetCost) return;

        gems -= gadgetCost;
        setBrawlerData(brawlerId, { gadget: true });
    } else {
        if ((userData.gadget + brawlerData.gadget.cooldownInSeconds * 1000) > Date.now()) return;
        brawlerData.gadget.execute();
        setBrawlerData(brawlerId, { gadget: Date.now() });
    }
    render();
}

function activateStarpower(brawlerId) {
    let brawlerData = brawlersData[brawlerId];
    let userData = userBrawlersData.find(brw => brw.id === brawlerId);

    if (!userData) return;

    if (!userData?.starpower) {
        let starpowerCost = getStarpowerCost(brawlerId);
        if (gems < starpowerCost) return;

        gems -= starpowerCost;
        setBrawlerData(brawlerId, { starpower: true });

        if (brawlerData.starpower?.execute) {
            brawlerData.starpower.execute();
        }
    }
    render();
}