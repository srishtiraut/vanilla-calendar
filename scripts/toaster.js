import { waitUntilAnimationsFinish } from "./animation.js";

export function initToaster(parent) {
    const toasterElement = document.createElement("div"); //Creates a <div> to hold all toast notifications.
    toasterElement.classList.add("toaster");

    parent.appendChild(toasterElement);

    //Return API for showing toasts
    return {
        success(message) {
            showToast(toasterElement, message, "success");
        },
        error(message) {
            showToast(toasterElement, message, "error");
        }
    };
}

function showToast(toasterElement, message, type) {
    const toastElement = createToast(message, type);
    animateToast(toasterElement, toastElement);
}

function createToast(message, type) {
    const toastElement = document.createElement("div");
    toastElement.textContent = message;
    toastElement.classList.add("toast");
    toastElement.classList.add(`toast--${type}`);

    return toastElement;
}

function animateToast(toasterElement, toastElement) {

    //Measure toaster height before and after adding the toast.

    const heightBefore = toasterElement.offsetHeight;
    toasterElement.appendChild(toastElement);
    const heightAfter = toasterElement.offsetHeight;
    const heightDiff = heightAfter - heightBefore;      //heightDiff is the vertical space the new toast occupies.

    /*
    Animate the toaster container to slide down smoothly when a new toast is added:
    Start at translateY(heightDiff) → moves down by the new toast’s height.
    End at translateY(0) → settles back in place.
    */
    const toasterAnimation = toasterElement.animate([
        { transform: `translate(0, ${heightDiff}px)` },
        { transform: "translate(0,0)" }
    ], {
        duration: 150,
        easing: "ease-out"
    });

    toasterAnimation.startTime = document.timeline.currentTime;

    waitUntilAnimationsFinish(toastElement).then(() => {
        toasterElement.removeChild(toastElement);
    }).catch((error) => {
        console.error("'Finish toast animation' promise failed", error);
    });
}