import { initToaster } from "./toaster.js";

export function initNotifications() {
    const toaster = initToaster(document.body);

    //show success toast when event CREATED successfully
    document.addEventListener("event-create", () => {
        toaster.success("Event created successfully");
    });

    //show success toast whenever an event is deleted
    document.addEventListener("event-delete", () => {
        toaster.success("Event deleted ");
    });

    //show success toast when an event IS EDITED
    document.addEventListener("event-edit", () => {
        toaster.success("Event has been edited ");
    });
}

