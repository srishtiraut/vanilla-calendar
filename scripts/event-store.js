export function initEventStore() {
    document.addEventListener("event-create", (event) => {
        const createdEvent = event.detail.event;
        saveEventIntoLocalStorage([createdEvent]);

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