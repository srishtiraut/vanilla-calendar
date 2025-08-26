const eventTemplateElement = document.querySelector("[data-template='event']");


export function initStaticEvent(parent, event) {
    const eventElement = initEvent(event);
    parent.appendChild(eventElement);

}

function initEvent(event) {
    const eventContent = eventTemplateElement.content.cloneNode(true);
    const eventElement = eventContent.querySelector("[data-event]");
    const eventTitleElement = eventElement.querySelector("[data-event-title]");
    const eventStartTimeElement = eventElement.querySelector("[data-event-start-time]");
    const eventEndTimeElement = eventElement.querySelector("[data-event-end-time]");

    eventTitleElement.textContent = event.title;

    return eventElement;

}


export function validateEvent(event) {
    if (event.startTime >= event.endTime) {
        return "Event end time must be after start time."
    }
    return null;
}