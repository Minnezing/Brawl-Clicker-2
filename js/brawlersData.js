let brawlersData = {
    "shelly": { // Done
        name: "Шелли",
        description: "Шелли - начальный помощник. Девушка из дикого запада которая не боиться преград. Её дробовик поможет добывать вам множество поинтов на вашем пути. Она готова биться с вами до самого конца.",
        iconName: "Shelly.webp",
        rarity: "start",
        gadget: {
            description: "Выстреливает дробью из 5 дробинок, у каждой шанс попасть 50%. 1 дробинка даёт 1 минуту П.Д.",
            cooldownInSeconds: 8 * 60 * 60,
            execute: () => {
                let userData = userBrawlersData.find(brw => brw.id === "shelly");

                let pd = userBrawlersData.reduce((acc, brawler) => acc + brawlersData[brawler.id].gemsPerSecond[brawler.level - 1], 0);
                
                let earned = 0;
                let pelletsCount = 5;
                let garantedPelletsCount = 0;

                if (userData?.starpower) {
                    pelletsCount = 15; 
                    garantedPelletsCount = 5;
                }

                for (let i = 1; i <= pelletsCount; i++) {
                    let earnCount = pd * 60;
                    if (i < garantedPelletsCount) {
                        earned += earnCount;
                    } else if (Math.random() > 0.5) {
                        earned += earnCount;
                    }
                    createAddingFX(earnCount, { x: Math.round(Math.random() * 350), y: Math.round(Math.random() * 350) }, true);
                }

                gems += earned;
                setBrawlerData("shelly", { earned: userData.earned + earned });
            }
        },
        starpower: {
            description: "Увеличивает количество дробинок при гаджете до 15. Всегда минимум 5 попадает."
        },
        gemsPerClick: 2,
        gemsPerSecond: [2, 6, 12, 18, 25, 35, 45, 60, 70, 90, 100]
    },
    "colt": { // Done
        name: "Кольт",
        description: "Кольт очень высокомерный, но первоклассный стрелок. Его способности помогут вам в пути, хоть он и надоедливый красавчик.",
        iconName: "Colt.webp",
        rarity: "rare",
        gadget: {
            description: "Перезаряжает все гаджеты на 20%",
            cooldownInSeconds: 1 * 60 * 60,
            execute: () => {
                userBrawlersData.filter(brw => brw.gadget && brw.id !== "colt").forEach(brawler => {
                    let brawlerData = brawlersData[brawler.id];

                    if (brawler.gadget + brawlerData.gadget.cooldownInSeconds * 1000 < Date.now()) return;

                    let newTime = brawler.gadget - brawlerData.gadget.cooldownInSeconds * 1000 * 0.2;

                    setBrawlerData(brawler.id, { gadget: newTime });
                })
            }
        },
        starpower: {
            description: "У каждого гаджета перезарядка на 10% меньше",
            execute: () => {
                if (!isEventActive("colt")) createEvent({
                    brawlerId: "colt",
                    name: "colt",
                    description: "Перезарядка каждого гаджета на 10% быстрее",
                    duration: 0,
                    icon: "/starpowers/Colt.webp",
                    type: "onStart"
                })
            }
        },
        events: [
            {
                name: "colt",
                execute: () => {
                    Object.keys(brawlersData).forEach(brawlerId => {
                        brawlersData[brawlerId].gadget.cooldownInSeconds *= 0.9;
                    })
                }
            }
        ],
        gemsPerClick: 10,
        gemsPerSecond: [200, 220, 240, 265, 280, 300, 340, 380, 400, 420, 450]
    },
    "el_primo": { // Done
        name: "Эль Примо",
        description: "Сильный боец, он очень добрый и готов идти в любое приключение! Ваш мозг и его мускулы явно сделают это приключение незабываемым.",
        iconName: "El_Primo.webp",
        rarity: "rare",
        gadget: {
            description: "100% даёт 20 минут П.Д. но при этом следующие 10 минут ваш пассивный доход уменьшен на 20%",
            cooldownInSeconds: 8 * 60 * 60,
            execute: () => {
                let userData = userBrawlersData.find(brw => brw.id === "el_primo");

                let pd = userBrawlersData.reduce((acc, brawler) => acc + brawlersData[brawler.id].gemsPerSecond[brawler.level - 1], 0);
                let earned = pd * 20 * 60;

                gems += earned;
                setBrawlerData("el_primo", { earned: userData.earned + earned });

                createAddingFX(earned, { x: 350/2, y: 350/2 }, true);

                if (!userData.starpower && !isEventActive("el_primo")) {
                    createEvent({
                        brawlerId: "el_primo",
                        name: "el_primo",
                        description: "Пассивный доход уменьшен на 20%",
                        duration: 10 * 60 * 1000,
                        icon: "/gadgets/El_Primo.webp",
                        type: "onIteration"
                    })
                }
            }
        },
        starpower: {
            description: "Убирает дебаф гаджета"
        },
        events: [
            {
                name: "el_primo",
                execute: (gemsPerSecond) => {
                    for (const brawlerId in gemsPerSecond) {
                        if (Object.hasOwnProperty.call(gemsPerSecond, brawlerId)) {
                            gemsPerSecond[brawlerId] *= 0.8;
                        }
                    }
                }
            }
        ],
        gemsPerClick: 20,
        gemsPerSecond: [500, 540, 590, 640, 690, 750, 800, 850, 900, 950, 10000]
    },
    "brock": { // Done
        name: "Брок",
        description: "",
        iconName: "Brock.webp",
        rarity: "rare",
        gadget: {
            description: "Взрывает кнопку! Вы не можете кликать определённое количество времени ( 5 минут ), но потом клики дают в 5 раз больше ( 5 минут )",
            cooldownInSeconds: 1 * 60 * 60,
            execute: () => {
                if (!isEventActive("brockGagdet")) {
                    createEvent({
                        brawlerId: "brock",
                        name: "brockGagdet",
                        description: "Вы не можете кликать, но потом ваши клики будут умножены в 5 раз",
                        duration: 10 * 60 * 1000,
                        icon: "/gadgets/Brock.webp",
                        type: "onClick"
                    })
                }
            }
        },
        starpower: {
            description: "Ваши клики умножены на 2.",
            execute: () => {
                if (!isEventActive("brockStarpower")) {
                    createEvent({
                        brawlerId: "brock",
                        name: "brockStarpower",
                        description: "Клики умножены в 2 раза",
                        duration: 0,
                        icon: "/starpowers/Brock.webp",
                        type: "onClick"
                    })
                }
            }
        },
        events: [
            {
                name: "brockGagdet",
                execute: (gpc) => {
                    let event = eventsBuffer.find(event => event.name == "brockGagdet");
                    if (event.start + event.duration - Date.now() <= 5 * 60 * 1000) {
                        let gems = Object.values(gpc).reduce((acc, curr) => acc + curr, 0);

                        gpc.brock += gems * 4;
                    } else {
                        for (const brawlerId in gpc) {
                            if (Object.hasOwnProperty.call(gpc, brawlerId)) {
                                gpc[brawlerId] = 0;
                            }
                        }
                    }
                }
            },
            {
                name: "brockStarpower",
                execute: (gpc) => {
                    let gems = Object.values(gpc).reduce((acc, curr) => acc + curr, 0);

                    gpc.brock += gems;
                }
            },
        ],
        gemsPerClick: 50,
        gemsPerSecond: [1100, 1200, 1300, 1400, 1500, 1700, 1900, 2100, 2200, 2400, 2500]
    },
    "barley": {
        name: "Барли",
        description: "",
        iconName: "Barley.webp",
        rarity: "rare",
        gadget: {
            description: "После использования каждый бравлер будет опьянён ( перестаёт давать какое либо П.Д на 1 минуту ) Но потом начинают зверепеть ( Дают в 4 раза больше П.Д. на 20 сек )",
            cooldownInSeconds: 4 * 60 * 60,
            execute: () => {}
        },
        starpower: {
            description: "Барли всегда под воздействием опьянения ( всегда x4 п.д у барли )",
            execute: () => {}
        },
        gemsPerClick: 50,
        gemsPerSecond: [2750, 2900, 3000, 3150, 3300, 3500, 3750, 4000, 4250, 4500, 5000]
    },
    "dynamike": { // Done
        name: "Динамайк",
        description: "Шахтёр, который давно сошёл с ума. В вас он увидел своего бога и теперь он и его динамит, полностью под вашим контролем! ( Аккуратнее ведь он может подумать в будущем иначе )",
        iconName: "Dynamike.webp",
        rarity: "superrare",
        gadget: {
            description: "Cтанет кнопку на 2-10 сек при которой у вас активируется легальный кликер.",
            cooldownInSeconds: 3 * 60 * 60,
            execute: () => {
                const min = 2;
                const max = 10;
                let duration = Math.floor(Math.random() * (max - min + 1) + min);

                if (!isEventActive("dynamikeGadget")) createEvent({
                    brawlerId: "dynamike",
                    name: "dynamikeGadget",
                    description: "Легальный кликер",
                    duration: duration * 1000,
                    icon: "/gadgets/Dynamike.webp",
                    type: "onIteration",
                })
            }
        },
        starpower: {
            description: "x10 к кликам",
            execute: () => {
                if (!isEventActive("dynamikeStarpower")) createEvent({
                    brawlerId: "dynamike",
                    name: "dynamikeStarpower",
                    description: "x10 к кликам",
                    duration: 0,
                    icon: "starpowers/Dynamike.webp",
                    type: "onClick"
                })
            }
        },
        events: [
            {
                name: "dynamikeGadget",
                execute: (gemsPerSecond) => {
                    let gemsPerClick = Object.values(brawlersData).reduce((acc, brawler) => acc + brawler.gemsPerClick, 0);
                    const clicksMuliplyer = 100;

                    for (let i = 0; i < clicksMuliplyer; i++) {
                        
                        createAddingFX(gemsPerClick * clicksMuliplyer, { x: Math.round(Math.random() * 350), y: Math.round(Math.random() * 350) }, true);
                    }

                    gemsPerSecond["dynamike"] += gemsPerClick * clicksMuliplyer;
                }
            },
            {
                name: "dynamikeStarpower",
                execute: (gemsPerClick) => {
                    let gems = Object.values(gemsPerClick).reduce((acc, curr) => acc + curr, 0);

                    gemsPerClick["dynamike"] += gems * 9;
                }
            },
        ],
        gemsPerClick: 100,
        gemsPerSecond: [20000, 22000, 24000, 26000, 28000, 30000, 32000, 35000, 40000, 45000, 50000]
    },
    "rico": { // Done
        name: "Рико",
        description: "Робот, которого вы нашли на своём пути. Каким то образом Диномайк починил его. Он не испытывает эмоций, он просто бесчувственный помощник с бластерем!",
        iconName: "Rico.webp",
        rarity: "superrare",
        gadget: {
            description: "Каждый клик в течении 5 минут будет удвоен/утроен/учетверен.",
            cooldownInSeconds: 5 * 60 * 60,
            execute: () => {
                if (!isEventActive("ricoGadget")) createEvent({
                    brawlerId: "rico",
                    name: "ricoGadget",
                    description: "Каждый клик будет удвоен/утроен/учетверен",
                    duration: 5 * 60 * 1000,
                    icon: "/gadgets/Rico.webp",
                    type: "onClick",
                })
            }
        },
        starpower: {
            description: "Во время игры может сработать способность гаджета.",
            execute: () => {
                if (!isEventActive("ricoStarpower")) createEvent({
                    brawlerId: "rico",
                    name: "ricoStarpower",
                    description: "Клик может быть удвоен/утроен/учетверен",
                    duration: 0,
                    icon: "/starpowers/Rico.webp",
                    type: "onClick",
                })
            }
        },
        events: [
            {
                name: "ricoGadget",
                execute: (gpc) => {
                    let gemsPerClick = Object.values(gpc).reduce((acc, gems) => acc + gems, 0);
                    const min = 2;
                    const max = 4;
                    let clickMuliplyer = Math.floor(Math.random() * (max - min + 1) + min);

                    gpc.rico += gemsPerClick * (clickMuliplyer - 1);
                }
            },
            {
                name: "ricoStarpower",
                execute: (gpc) => {
                    let random = Math.random() < 1/20;
                    if (!random) return;

                    let gemsPerClick = Object.values(gpc).reduce((acc, gems) => acc + gems, 0);
                    const min = 2;
                    const max = 4;
                    let clickMuliplyer = Math.floor(Math.random() * (max - min + 1) + min);

                    gpc.rico += gemsPerClick * (clickMuliplyer - 1);
                }
            }
        ],
        gemsPerClick: 150,
        gemsPerSecond: [55000, 60000, 65000, 70000, 85000, 95000, 100000, 110000, 120000, 130000, 150000]
    },
    "carl": {
        name: "Карл",
        description: "Шахтёр, работующий вместе со своим товарищем Диномайком. Данный персонаж будет вам всячески помогать, но не забывайте обижать его жруга нельзя.",
        iconName: "Carl.webp",
        rarity: "superrare",
        gadget: {
            description: "",
            cooldownInSeconds: 2 * 60 * 60,
            execute: () => {}
        },
        starpower: {
            description: ""
        },
        gemsPerClick: 200,
        gemsPerSecond: [200000, 220000, 250000, 270000, 300000, 325000, 350000, 375000, 400000, 450000, 500000]
    },
    "jacky": {
        name: "Джеки",
        description: "",
        iconName: "Jacky.webp",
        rarity: "superrare",
        gadget: {
            description: "",
            cooldownInSeconds: 2 * 60 * 60,
            execute: () => {}
        },
        starpower: {
            description: ""
        },
        gemsPerClick: 200,
        gemsPerSecond: [520000, 540000, 600000, 650000, 700000, 750000, 800000, 850000, 900000, 950000, 990000]
    },
    "hank": { // Done
        name: "Хэнк",
        description: "Вы нашли этого чудика и он говорит что знает будущее! Но на самом деле это бездомный инженер создавший чудо техники в которой сидит. Вы убедили пойти его с собой.",
        iconName: "Hank.webp",
        rarity: "epic",
        gadget: {
            description: "В течении минуты с шансом 20% при нажатии на иконку будет попадаться пузырь который даёт 10% от П.Д",
            cooldownInSeconds: 10 * 60 * 60,
            execute: () => {
                let brawlerUserData = userBrawlersData.find(brw => brw.id == "hank");
                let durationMinutes = 1;
                if (brawlerUserData) durationMinutes = 2;

                if (!isEventActive("hankGadget")) createEvent({
                    brawlerId: "hank",
                    name: "hankGadget",
                    description: "При нажатии на иконку будет появляться пузырь.",
                    duration: durationMinutes * 60 * 1000,
                    icon: "/gadgets/Hank.webp",
                    type: "onClick",
                })
            }
        },
        starpower: {
            description: "Пузыри могут появлятся во время игры. Гаджет длиться 2 минуты.",
            execute: () => {
                if (!isEventActive("hankStarpower")) createEvent({
                    brawlerId: "hank",
                    name: "hankStarpower",
                    description: "При нажатии на иконку может появляться пузырь.",
                    duration: 0,
                    icon: "/starpowers/Hank.webp",
                    type: "onStart"
                })
            }
        },
        events: [
            {
                name: "hankGadget",
                execute: () => {
                    let random = Math.random() < 1/20;
                    if (!random) return;

                    let gemsPerSecond = userBrawlersData.reduce((acc, brawler) => acc + brawlersData[brawler.id].gemsPerSecond[brawler.level - 1], 0);

                    const popBubble = () => {
                        let userData = userBrawlersData.find(brw => brw.id === "hank");
                        let earned = gemsPerSecond * 60;
                        gems += earned
                        setBrawlerData("hank", { earned: userData.earned + earned });
                        createAddingFX(earned, { x: Math.random() * 350, y: Math.random() * 350 }, true);
                    }

                    spawnBubble(popBubble);
                }
            },
            {
                name: "hankStarpower",
                execute: () => {
                    setInterval(() => {
                        let gemsPerSecond = userBrawlersData.reduce((acc, brawler) => acc + brawlersData[brawler.id].gemsPerSecond[brawler.level - 1], 0);
    
                        const popBubble = () => {
                            let userData = userBrawlersData.find(brw => brw.id === "hank");
                            let earned = gemsPerSecond * 60;
                            gems += earned
                            setBrawlerData("hank", { earned: userData.earned + earned });
                            createAddingFX(earned, { x: Math.random() * 350, y: Math.random() * 350 }, true);
                        }
    
                        spawnBubble(popBubble);
                    }, 5 * 60 * 1000);
                }
            }
        ],
        gemsPerClick: 500,
        gemsPerSecond: [10000000, 11000000, 12000000, 13000000, 14000000, 15000000, 16000000, 17000000, 18000000, 19000000, 20000000]
    },
    "bibi": { // Done
        name: "Биби",
        description: "Идя возле небольшого города, ваша большая команда нашли эту девочку. Шелли нашла с ней общий язык, и теперь её бита и бесконечно жующиеся жвачка тоже! ",
        iconName: "Bibi.webp",
        rarity: "epic",
        gadget: {
            description: "В 4 раза увеличивает П.д КАЖДОГО БРАВЛЕРА на 30 секунд.",
            cooldownInSeconds: 10 * 60 * 60,
            execute: () => {
                if (!isEventActive("bibiGadget")) createEvent({
                    brawlerId: "bibi",
                    name: "bibiGadget",
                    description: "Доход каждого бравлера увеличен в 4 раза",
                    duration: 30 * 1000,
                    icon: "/gadgets/Bibi.webp",
                    type: "onIteration"
                })
            }
        },
        starpower: {
            description: "Увеличивает доход каждого бравлера в 2 раза.",
            execute: () => {
                if (!isEventActive("bibiStarpower")) createEvent({
                    brawlerId: "bibi",
                    name: "bibiStarpower",
                    description: "Доход каждого бравлера увеличен в 2 раза",
                    duration: 0,
                    icon: "/starpowers/Bibi.webp",
                    type: "onIteration"
                })            
            }
        },
        events: [
            {
                name: "bibiGadget",
                execute: (gemsPerSecond) => {
                    for (const brawlerId in gemsPerSecond) {
                        if (Object.hasOwnProperty.call(gemsPerSecond, brawlerId)) {
                            gemsPerSecond[brawlerId] *= 4;
                        }
                    }
                }
            },
            {
                name: "bibiStarpower",
                execute: (gemsPerSecond) => {
                    for (const brawlerId in gemsPerSecond) {
                        if (Object.hasOwnProperty.call(gemsPerSecond, brawlerId)) {
                            gemsPerSecond[brawlerId] *= 2;
                        }
                    }
                }
            }
        ],
        gemsPerClick: 500,
        gemsPerSecond: [22000000, 24000000, 28000000, 32000000, 36000000, 40000000, 45000000, 50000000, 55000000, 60000000, 70000000]
    },
    "piper": { // Done
        name: "Пайпер",
        description: "Девушка вдова, которая решила присоединиться к вам. Её недолюбливают в вашей команде, но её пирожки очень вкусные, поэтому все просто смирились.",
        iconName: "Piper.webp",
        rarity: "epic",
        gadget: {
            description: "Активирует 1 рандомный гаджет",
            cooldownInSeconds: 3 * 60 * 60,
            execute: () => {
                let repeats = 1;
                if (userBrawlersData.find(brw => brw.id === "piper")?.starpower) repeats = 2;

                let brawlersWithGadgets = userBrawlersData.filter(brw => brw.gadget && brw.id !== "piper");
                for (let i = 0; i < repeats; i++) {
                    let brawlerId = brawlersWithGadgets.splice(Math.floor(Math.random()* brawlersWithGadgets.length), 1)[0].id;

                    let brawlerElement = document.querySelector(`[brawlerid="${brawlerId}"] .brawler-introducing`);
                    brawlerElement.classList.add("gadget-activated");
                    console.log(brawlerId)
                    setTimeout(() => brawlerElement.classList.remove("gadget-activated"), 2 * 1000);

                    brawlersData[brawlerId].gadget.execute();
                }
            }
        },
        starpower: {
            description: "Гаджет активирует 2 рандомных гаджета."
        },
        gemsPerClick: 700,
        gemsPerSecond: [100000000, 200000000, 300000000, 400000000, 500000000, 600000000, 700000000, 800000000, 900000000, 1000000000, 1200000000]
    },
    "frank": {
        name: "Фрэнк",
        description: "Монстр Франкенштейн во плоти, но на самом деле под маской чудовища скрывается душа профессионального ди-джея, который просто тратит на музыку большую часть своего времени от чего он недосыпает.",
        iconName: "Frank.webp",
        rarity: "epic",
        gadget: {
            description: "",
            cooldownInSeconds: 30 * 60,
            execute: () => {}
        },
        starpower: {
            description: ""
        },
        gemsPerClick: 1000,
        gemsPerSecond: [1500000000, 2000000000, 2500000000, 3000000000, 3500000000, 4000000000, 5000000000, 7000000000, 9000000000, 11000000000, 15000000000]
    },
    "fang": { //Done
        name: "Фэнг",
        description: "Подросток который увлекается кунг-фу, но вступив однажды в драку с эль Примо он дал ему достойный отпор. Встретив его Эль Примо узнал старого противника и решил взять его с собой в путешествие",
        iconName: "Fang.webp",
        rarity: "mythic",
        gadget: {
            description: "Умножает ваши клики в 2 раза на 12 часов.",
            cooldownInSeconds: 24 * 60 * 60,
            execute: () => {
                if (isEventActive("fangGadget")) clearEvent("fangGadget");
                createEvent({
                    brawlerId: "fang",
                    name: "fangGadget",
                    description: `Ваши клики умножены в 2 раза`,
                    duration: 12 * 60 * 60 * 1000,
                    icon: "/gadgets/Fang.webp",
                    type: "onClick",
                })
            }
        },
        starpower: {
            description: "Ваши клики умножаются на уровень Фэнга",
            execute: () => {
                if (!isEventActive("fangStarpower")) createEvent({
                    brawlerId: "fang",
                    name: "fangStarpower",
                    description: "Ваши клики умножены на уровень Фэнга",
                    duration: 0,
                    icon: "/starpowers/Fang.webp",
                    type: "onClick",
                })
            }
        },
        events: [
            {
                name: "fangGadget",
                execute: (gpc) => {
                    let cgpc = Object.values(gpc).reduce((acc, curr) => acc + curr, 0);

                    gpc.fang += cgpc;
                }
            },
            {
                name: "fangStarpower",
                execute: (gpc) => {
                    let multiplier = userBrawlersData.find(brw => brw.id === "fang").level;
                    let cgpc = Object.values(gpc).reduce((acc, curr) => acc + curr, 0);

                    gpc.fang += cgpc * (multiplier - 1);
                }
            }
        ],
        gemsPerClick: 2000,
        gemsPerSecond: [100000000000, 110000000000, 130000000000, 150000000000, 170000000000, 190000000000, 210000000000, 230000000000, 250000000000, 270000000000, 300000000000]
    },
    "max": { // Done
        name: "Макс",
        description: "Сама скорость. Не каждый олимпийский спринтер может поспеть за ней, она готова вам помочь в любую минуту, главное чтобы она не пробежала мимо вас.",
        iconName: "Max.webp",
        rarity: "mythic",
        gadget: {
            description: "Навсегда увеличивает свой П.Д. на 1%",
            cooldownInSeconds: 2 * 60 * 60,
            execute: () => {
                let multiplier = getData("maxMultiplier") ?? 1;
                setData("maxMultiplier", multiplier + 1);

                if (!isEventActive("maxGadget")) createEvent({
                    brawlerId: "max",
                    name: "maxGadget",
                    description: `П.Д Макс увеличен на ${multiplier}%`,
                    duration: 0,
                    icon: "/gadgets/Max.webp",
                    type: "onIteration",
                })
            }
        },
        starpower: {
            description: "Ваши клики приносят ещё 10% от П.Д",
            execute: () => {
                if (!isEventActive("maxStarpower")) createEvent({
                    brawlerId: "max",
                    name: "maxStarpower",
                    description: "Каждый клик приносит 10% по п.д.",
                    duration: 0,
                    icon: "/starpowers/Max.webp",
                    type: "onClick",
                })
            }
        },
        events: [
            {
                name: "maxGadget",
                execute: (gps) => {
                    let multiplier = getData("maxMultiplier");
                    gps.max *= 1 + (multiplier / 100);
                }
            },
            {
                name: "maxStarpower",
                execute: (gpc) => {
                    let pd = userBrawlersData.reduce((acc, brawler) => acc + brawlersData[brawler.id].gemsPerSecond[brawler.level - 1], 0);
                    gpc.max = pd * 0.1;
                    console.log(pd);
                }
            }
        ],
        gemsPerClick: 2000,
        gemsPerSecond: [500000000000, 600000000000, 700000000000, 800000000000, 900000000000, 1000000000000, 1200000000000, 1400000000000, 1600000000000, 1800000000000, 2000000000000]
    },
    "doug": { // Done
        name: "Даг",
        description: "",
        iconName: "Doug.webp",
        rarity: "mythic",
        gadget: {
            description: "Даёт двойной доход и клики на 20 секунд",
            cooldownInSeconds: 6 * 60 * 60,
            execute: () => {
                let userData = userBrawlersData.find(brw => brw.id === "doug");

                let duration = 20;
                if (userData.starpower) duration = 40;

                if (!isEventActive("dougGadget")) createEvent({
                    brawlerId: "doug",
                    name: "dougGadget",
                    description: `Доход умножен в 2 раза`,
                    duration: duration * 1000,
                    icon: "/gadgets/Doug.webp",
                    type: "onIteration",
                })

                if (!userData.starpower && !isEventActive("dougStarpower")) createEvent({
                    brawlerId: "doug",
                    name: "dougStarpower",
                    description: `Клики умножены в 2 раза`,
                    duration: duration * 1000,
                    icon: "/gadgets/Doug.webp",
                    type: "onClick",
                })

            }
        },
        starpower: {
            description: "Увеличивает время действия гаджета до 40 секунд. Двойные клики остаются навсегда",
            execute: () => {
                if (isEventActive("dougStarpower")) clearEvent("dougStarpower");
                createEvent({
                    brawlerId: "doug",
                    name: "dougStarpower",
                    description: `Клики умножены в 2 раза`,
                    duration: 0,
                    icon: "/starpowers/Doug.webp",
                    type: "onClick",
                });
            }
        },
        events: [
            {
                name: "dougGadget",
                execute: (gps) => {
                    let pd = Object.values(gps).reduce((acc, gems) => acc + gems, 0);

                    gps.doug += pd;
                }
            },
            {
                name: "dougStarpower",
                execute: (gpc) => {
                    let pd = Object.values(gpc).reduce((acc, gems) => acc + gems, 0);

                    gpc.doug += pd;
                }
            }
        ],
        gemsPerClick: 2000,
        gemsPerSecond: [2400000000000, 2800000000000, 3200000000000, 3600000000000, 4000000000000, 4500000000000, 5000000000000, 5500000000000, 6000000000000, 7000000000000, 8000000000000]
    },
    "buzz": { // Done
        name: "Базз",
        description: "Идя со своей командой вы наткнулись на водный аттракцион и вы встретили на его главного спасателя, Базза! Его строгость граничит со среднестатистической вахтершей, но он будет полезным кадром в вашей команде.",
        iconName: "Buzz.webp",
        rarity: "mythic",
        gadget: {
            description: "Увеличивает доход последних двух бойцов, использовавших гаджет на 20% на 2 часа",
            cooldownInSeconds: 10 * 60 * 60,
            execute: () => {
                let userData = userBrawlersData.find(brw => brw.id === "buzz");

                let count = 2;
                if (userData.starpower) count = 4;

                let brawlers = userBrawlersData.filter(brw => brw.gadget && brw.id !== "buzz").sort((a, b) => a.gadget < b.gadget ? 1 : -1).slice(0, count).map(brw => brw.id);

                if (!isEventActive("buzz")) createEvent({
                    brawlerId: "buzz",
                    name: "buzz",
                    description: `Доход ${brawlers.map(brwId => brawlersData[brwId].name).join(", ")} увеличен на 20%`,
                    duration: 2 * 60 * 60 * 1000,
                    icon: "/gadgets/Buzz.webp",
                    type: "onIteration",
                    brawlers
                })
            }
        },
        starpower: {
            description: "Гаджет работает на последних четырех бойцов, использовавших гаджет"
        },
        events: [
            {
                name: "buzz",
                execute: (gps) => {
                    let brawlers = eventsBuffer.find(event => event.name == "buzz").brawlers;
                    brawlers.forEach(brwId => {
                        gps[brwId] *= 1.2;

                        let element = document.querySelector(`[brawlerId="${brwId}"] .brawler-introducing`);
                        if (!isEventActive("buzz")) {
                            element.classList.remove("buffed");
                            return;
                        } 
                        if (!element.classList.contains("buffed")) element.classList.add("buffed");
                    });
                }
            }
        ],
        gemsPerClick: 2000,
        gemsPerSecond: [10000000000000, 15000000000000, 20000000000000, 30000000000000, 40000000000000, 50000000000000, 60000000000000, 70000000000000, 80000000000000, 90000000000000, 100000000000000]
    },
    "amber": { // Done
        name: "Амбер",
        description: "Главный пироман чьи трюки конечно и пренебрегают техникой безопасности, но кого это волнует если она может послужить вам хорошей поддержкой(только приготовьте заранее огнетушитель на случай). ",
        iconName: "Amber.webp",
        rarity: "legendary",
        gadget: {
            description: "Даёт бонус к кликам и трём рандомным бравлерам увелечение пассивного дохода в 15 раз на 8 секунд",
            cooldownInSeconds: 16 * 60 * 60,
            execute: () => {
                let brawlers = userBrawlersData.filter(brw => brw.id !== "amber").sort(() => 0.5 - Math.random()).slice(0, 3).map(brw => brw.id);

                if (!isEventActive("amberGagdet")) createEvent({
                    brawlerId: "amber",
                    name: "amberGagdet",
                    description: `Доход ${brawlers.map(brwId => brawlersData[brwId].name).join(", ")} увеличен в 15 раз.`,
                    duration: 8 * 1000,
                    icon: "/gadgets/Amber.webp",
                    type: "onIteration",
                    brawlers
                })

                if (!isEventActive("amberGagdet2")) createEvent({
                    brawlerId: "amber",
                    name: "amberGagdet2",
                    description: `Клики умножены в два раза`,
                    duration: 8 * 1000,
                    icon: "/gadgets/Amber.webp",
                    type: "onClick"
                })
            }
        },
        starpower: {
            description: "Доход Амбер в два раза больше",
            execute: () => {
                if (!isEventActive("amberStarpower")) createEvent({
                    brawlerId: "amber",
                    name: "amberStarpower",
                    description: `Доход Амбер в два раза больше`,
                    duration: 0,
                    icon: "/starpowers/Amber.webp",
                    type: "onIteration"
                })
            }
        },
        events: [
            {
                name: "amberGagdet",
                execute: (gps) => {
                    let brawlers = eventsBuffer.find(event => event.name == "amberGagdet").brawlers;
                    brawlers.forEach(brwId => {
                        gps[brwId] *= 15;

                        let element = document.querySelector(`[brawlerId="${brwId}"] .brawler-introducing`);
                        if (!isEventActive("amberGagdet")) {
                            element.classList.remove("buffed");
                            return;
                        } 
                        if (!element.classList.contains("buffed")) element.classList.add("buffed");
                    });
                }
            },
            {
                name: "amberGagdet2",
                execute: (gpc) => {
                    for (const brawlerId in gpc) {
                        if (Object.hasOwnProperty.call(gpc, brawlerId)) {
                            gpc[brawlerId] *= 2;
                        }
                    }
                }
            },
            {
                name: "amberStarpower",
                execute: (gemsPerSecond) => {
                    gemsPerSecond.amber *= 2;
                }
            }
        ],
        gemsPerClick: 5000,
        gemsPerSecond: [10000000000000000, 12000000000000000, 14000000000000000, 16000000000000000, 18000000000000000, 20000000000000000, 25000000000000000, 30000000000000000, 35000000000000000, 40000000000000000, 50000000000000000]
    },
    "sandy": {
        name: "Сэнди",
        description: "Главная соня вашей команды. В те редкие моменты когда он бодрствует он будет из-за всех своих не многих сил будет вам помогать(но почти сразу же он пойдёт отсыпаться почти весь день).",
        iconName: "Sandy.webp",
        rarity: "legendary",
        gadget: {
            description: "",
            cooldownInSeconds: 20 * 60 * 60,
            execute: () => {}
        },
        starpower: {
            description: ""
        },
        gemsPerClick: 5000,
        gemsPerSecond: [100000000000000000, 120000000000000000, 140000000000000000, 160000000000000000, 180000000000000000, 200000000000000000, 220000000000000000, 240000000000000000, 260000000000000000, 280000000000000000, 300000000000000000]
    },
    "surge": {
        name: "Вольт",
        description: "Вечно заряженный и бодр сил(Сэнди бы такое не помешало), он будет для вашей команды тем самым другом который может в любой момент, даже в самое неподходящее для этого время начать так зажигать, что от такого у вас глаза на лоб полезут",
        iconName: "Surge.webp",
        rarity: "legendary",
        gadget: {
            description: "",
            cooldownInSeconds: 0,
            execute: () => {}
        },
        starpower: {
            description: ""
        },
        gemsPerClick: 5000,
        gemsPerSecond: [500000000000000000, 520000000000000000, 540000000000000000, 560000000000000000, 580000000000000000, 600000000000000000, 650000000000000000, 700000000000000000, 750000000000000000, 800000000000000000, 900000000000000000]
    },
    "spike": {
        name: "Спайк",
        description: "В бескрайней пустыне где нет ничего кроме песка и перекати-поле живёт он, не пойми как живой кактус, он всегда молчит, но кто знает что скрывается за этой простодушной (если так можно говорить о кактусе)улыбкой.",
        iconName: "Spike.webp",
        rarity: "legendary",
        gadget: {
            description: "",
            cooldownInSeconds: 2 * 60 * 60,
            execute: () => {}
        },
        starpower: {
            description: ""
        },
        gemsPerClick: 5000,
        gemsPerSecond: [1000000000000000000, 2000000000000000000, 3000000000000000000, 4000000000000000000, 5000000000000000000, 6000000000000000000, 7000000000000000000, 8000000000000000000, 9000000000000000000, 10000000000000000000, 11000000000000000000]
    },
}