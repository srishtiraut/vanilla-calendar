const isDesktopMediaQuery = window.matchMedia("(min-width: 768px)");    //create a MediaQueryList object to check if a CSS media query matches the current viewport.
//isDesktopMediaQuery.matches will be true if the screen is at least 768px wide.

export function initResponsive() {

    if (currentDeviceType() === "mobile") {
        document.dispatchEvent(new CustomEvent('view-change', {
            detail: {
                view: "week"
            },
            bubbles: true
        }));
    }

    isDesktopMediaQuery.addEventListener("change", () => {
        const deviceType = currentDeviceType();

        document.dispatchEvent(new CustomEvent("device-type-change", {
            detail: {
                deviceType
            },
            bubbles: true
        }));

        //if device is mobile, switch to the week view instead of a full month view
        if (deviceType === "mobile") {
            document.dispatchEvent(new CustomEvent('view-change', {
                detail: {
                    view: "week"
                },
                bubbles: true
            }));
        }
    });
}

export function currentDeviceType() {
    return isDesktopMediaQuery.matches ? "desktop" : "mobile";
}