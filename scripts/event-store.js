export function initEventStore() {
    document.addEventListener("event-create", (event) => {
        const createdEvent = event.detail.event;
        const events = getEventsFromLocalStorage();
        events.push(createdEvent);

        saveEventIntoLocalStorage(events);

    });
}


function saveEventIntoLocalStorage(events) {
    const safeToStringifyEvents = events.map((event) => ({
        ...event,
        date: event.date.toISOString()
    }));

    let stringifiedEvents;
    try {
        stringifiedEvents = JSON.stringify(safeToStringifyEvents);
    } catch (error) {
        console.error("Failed to stringify events", error);

    }

    localStorage.setItem("events", stringifiedEvents);
}

function getEventsFromLocalStorage() {
    const localStorageEvents = localStorage.getItem("events");
    if (localStorageEvents === null) {
        return [];
    }

    let parsedEvents;
    try {
        parsedEvents = JSON.parse(localStorageEvents);
    } catch (error) {
        console.error("Failed to parse events", error);
        return [];
    }
    const events = parsedEvents.map((event) => ({
        ...event,
        date: new Date(event.date)
    }));

    return events
}