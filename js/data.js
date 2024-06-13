function getData(key) {
    return JSON.parse(localStorage.getItem(key));
}

function setData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function setBrawlerData(brawlerId, data) {
    let index = userBrawlersData.findIndex(brw => brw.id === brawlerId);
    let newData = {};

    if (index != -1) newData = userBrawlersData.splice(index, 1)[0];

    Object.keys(data).forEach(key => {
        newData[key] = data[key];
    })

    userBrawlersData.push(newData);
    setData("brawlers", userBrawlersData);
}