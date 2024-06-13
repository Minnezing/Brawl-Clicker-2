function createEvent(eventData) {
    eventData.start = Date.now();

    eventsBuffer.push(eventData);

    if (eventData.type === "onStart") {
        eventsExecution.find(evex => evex.name === eventData.name).execute();
    }
    setData("events", eventsBuffer);
}

function clearEvent(name) {
    let eventIndex = eventsBuffer.findIndex(event => event.name == name);
    eventsBuffer.splice(eventIndex, 1);
    setData("events", eventsBuffer);
}

function isEventActive(name) {
    let event = eventsBuffer.find(event => event.name == name);
    if (!event) return false;
    if (event.start + event.duration < Date.now() && event.duration !== 0) return false;
    return true;
}