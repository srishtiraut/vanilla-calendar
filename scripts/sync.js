const broadcastChannel = new BroadcastChannel("events-change-channel");
//A BroadcastChannel allows different tabs or windows of the same origin to communicate with each other.

export function initSync() {
    //This function initializes the cross-tab event synchronization s.t when events change in one tab, other tabs get notified and update the UI.
    broadcastChannel.addEventListener("message", () => {
        document.dispatchEvent(new CustomEvent('events-change', {
            detail: {
                source: "broadcast-channel"     //to mark that this event originated from another tab
            },
            bubbles: true
        }));
    });

    document.addEventListener("events-change", (event) => {
        if (event?.detail?.source !== "broadcast-channel") {
            broadcastChannel.postMessage({});       //Send an empty object {} as the message to signal other tabs that something changed.
        }
    });
}