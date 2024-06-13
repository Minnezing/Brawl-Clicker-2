function getRemainingTime(timestamp) {
    let now = Date.now();
    let duration = timestamp - now;
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    return hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
}

function shortNumber(number, round=2) {
    if (number / 10 ** 24 > 1) return (number / 10 ** 24).toFixed(round) + "sep";
    if (number / 10 ** 21 > 1) return (number / 10 ** 21).toFixed(round) + "sx";
    if (number / 10 ** 18 > 1) return (number / 10 ** 18).toFixed(round) + "qu";
    if (number / 10 ** 15 > 1) return (number / 10 ** 15).toFixed(round) + "qa";
    if (number / 10 ** 12 > 1) return (number / 10 ** 12).toFixed(round) + "t";
    if (number / 10 ** 9 > 1) return (number / 10 ** 9).toFixed(round) + "b";
    if (number / 10 ** 6 > 1) return (number / 10 ** 6).toFixed(round) + "m";
    if (number / 10 ** 3 > 1) return (number / 10 ** 3).toFixed(round) + "k";
    return number;
}

const secondsToUpgrade = {
    "start": 900,
    "rare": 1200,
    "superrare": 2400,
    "epic": 3600,
    "mythic": 10800,
    "legendary": 15000
};

let levelsCostCache = [];
function getLevelCost(brawlerId, level) {
    let cacheData = levelsCostCache.find(data => data.brawlerId == brawlerId && data.level == level);
    if (cacheData) return cacheData.cost;

    let brawlerData = brawlersData[brawlerId];
    let index = Object.keys(brawlersData).indexOf(brawlerId);

    if (index == 0 && level == 1) return 10;

    let sp = Object.keys(brawlersData).slice(0, index).reduce((acc, cv) => acc + brawlersData[cv].gemsPerSecond.at(-1), 0);
    if (level == 1) {
        let previousBrawlerId = Object.keys(brawlersData)[index - 1];

        let previousBrawlerLastLevelCost = getLevelCost(previousBrawlerId, brawlerData.gemsPerSecond.length);
        let pd = brawlerData.gemsPerSecond[0];

        let cost = previousBrawlerLastLevelCost + (pd + sp) * secondsToUpgrade[brawlerData.rarity];

        levelsCostCache.push({ brawlerId, level, cost });
        return cost;
    } else {
        let previousLevelCost = getLevelCost(brawlerId, level - 1);
        let pd = brawlerData.gemsPerSecond[level - 2];

        let cost = previousLevelCost + (pd + sp) * secondsToUpgrade[brawlerData.rarity];

        levelsCostCache.push({ brawlerId, level, cost });
        return cost;
    }
}

function getGadgetCost(brawlerId) {
    let index = Object.keys(brawlersData).indexOf(brawlerId);
    let sp = Object.keys(brawlersData).slice(0, index + 1).reduce((acc, cv) => acc + brawlersData[cv].gemsPerSecond.at(-1), 0);

    let cost = sp * 100 * 60;

    return cost;
}

function getStarpowerCost(brawlerId) {
    let index = Object.keys(brawlersData).indexOf(brawlerId);
    let sp = Object.keys(brawlersData).slice(0, index + 1).reduce((acc, cv) => acc + brawlersData[cv].gemsPerSecond.at(-1), 0);

    let cost = sp * 250 * 60;

    return cost;
}

function getExpToOpen(brawlerId) {
    let index = Object.keys(brawlersData).indexOf(brawlerId);

    if (index == 0) return 10;

    let cost = getLevelCost(brawlerId, 2) / 2;

    return cost;
}

function getRank(earned, brawlerData) {
    let earnedSeconds = Number(earned) / brawlerData.gemsPerSecond.at(-1);
    let rankNumber = 1;
    let rankColor = "";
    if (earnedSeconds < 900) {
        rankNumber = Math.floor(earnedSeconds / 300) + 1;
        rankColor = "bronze";
    } else if (earnedSeconds <= 3900) {
        rankNumber = Math.floor((earnedSeconds - 900) / 600) + 4;
        if (earnedSeconds >= 900 && earnedSeconds < 1500) {
            rankColor = "bronze";
        } else {
            rankColor = "silver";
        }
    } else if (earnedSeconds <= 8400) {
        rankNumber = Math.floor((earnedSeconds - 3900) / 900) + 9;
        if (earnedSeconds >= 3900 && earnedSeconds < 4800) {
            rankColor = "silver";
        } else {
            rankColor = "gold";
        }
    } else if (earnedSeconds <= 14400) {
        rankNumber = Math.floor((earnedSeconds - 8400) / 1200 + 14);
        if (earnedSeconds >= 8400 && earnedSeconds < 9600) {
            rankColor = "gold";
        } else {
            rankColor = "diamond";
        }
    } else if (earnedSeconds <= 26400) {
        rankNumber = Math.floor((earnedSeconds - 14400) / 2400) + 19;
        if (earnedSeconds >= 14400 && earnedSeconds < 16800) {
            rankColor = "diamond";
        } else {
            rankColor = "amethyst";
        }
    } else if (earnedSeconds <= 41400) {
        rankNumber = Math.floor((earnedSeconds - 26400) / 3000) + 24;
        if (earnedSeconds >= 26400 && earnedSeconds < 29400) {
            rankColor = "amethyst";
        } else {
            rankColor = "emerald";
        }
    } else if (earnedSeconds <= 59400) {
        rankNumber = Math.floor((earnedSeconds - 41400) / 3600) + 29;
        if (earnedSeconds >= 41400 && earnedSeconds < 45000) {
            rankColor = "emerald";
        } else {
            rankColor = "ruby";
        }
    } else {
        rankNumber = 35;
        if (earnedSeconds >= 59400 && earnedSeconds < 79400) {
            rankNumber = 34;
            rankColor = "ruby";
        } else {
            rankColor = "ebonite";
        }
    }
    
    return { rankNumber, rankColor }
}

function resetAll() {
    clearInterval(gameCycleInterval);
    localStorage.clear();
    loadData();
    renderAll();
    startGameCycle();
    setTimeout(() => window.location.reload(), 0);
}