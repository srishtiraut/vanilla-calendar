const eventTemplateElement = document.querySelector("[data-template='event']");


export function initStaticEvent(parent, event) {
    const eventElement = initEvent(event);

    if(isEventAllDay(event)){
        eventElement.classList.add("event--filled");
    }

    parent.appendChild(eventElement);

}

export function initDynamicEvent(parent, event, dynamicStyles){
    const eventElement = initEvent(event);

    eventElement.classList.add("event--filled");
    eventElement.classList.add("event--dynamic");

    eventElement.style.top = dynamicStyles.top;
    eventElement.style.left = dynamicStyles.left;
    eventElement.style.bottom = dynamicStyles.bottom;
    eventElement.style.right = dynamicStyles.right;

    parent.appendChild(eventElement);
}

function initEvent(event) {
    
    const eventContent = eventTemplateElement.content.cloneNode(true);
    const eventElement = eventContent.querySelector("[data-event]");
    const eventTitleElement = eventElement.querySelector("[data-event-title]");
    const eventStartTimeElement = eventElement.querySelector("[data-event-start-time]");
    const eventEndTimeElement = eventElement.querySelector("[data-event-end-time]");

    eventElement.style.setProperty("--event-color", event.color);
    eventTitleElement.textContent = event.title;

    return eventElement;

}

export function isEventAllDay(event){
    return event.startTime === 0 && event.endTime === 1440;
}

export function eventStartsBefore(eventA, eventB) {
    return eventA.startTime < eventB.startTime;
}

export function eventEndsBefore(eventA, eventB) {
    return eventA.endTime < eventB.endTime;
}

export function validateEvent(event) {
    if (event.startTime >= event.endTime) {
        return "Event end time must be after start time."
    }
    return null;
}


