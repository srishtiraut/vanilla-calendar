import { waitUntilAnimationsFinish } from "./animation.js";

export function initDialog(name) {
    const dialogElement = document.querySelector(`[data-dialog=${name}]`);  //name could be "mobile-sidebar". Such a fx call is made in mobile-sidebar.js

    // Pick all buttons from the DOM which can close <dialog>
    const closeButtonElements = document.querySelectorAll("[data-dialog-close-button]");

    function close() {
        // This function runs a closing animation first and then closes the <dialog>

        //Add a "dialog--closing" CSS class that triggers the closing animation.
        dialogElement.classList.add("dialog--closing");

        // waitUntilAnimationsFinish(dialogElement) returns a master Promise
        //Wait for the "master" Promise to settle (means wait for *all* animations on this dialog to finish).
        return waitUntilAnimationsFinish(dialogElement).then(() => {
            //Once animations are done, remove the CSS class and close the dialogElement(like the sidebar).
            dialogElement.classList.remove("dialog--closing");
            dialogElement.close();
        })
            .catch((error) => {
                console.error("Finish dialog animation promise falied", error);
            });

    }

    // When any of the Close buttons is clicked, close the dialog. 
    for (const closeButtonElement of closeButtonElements) {
        closeButtonElement.addEventListener("click", () => {
            close();
        });
    }

    //If the user clicks outside the modal content (on the backdrop), close the dialog.
    dialogElement.addEventListener("click", (event) => {
        if (event.target == dialogElement) {
            close();
        }
    });

    //When the user presses Esc (which triggers the cancel event), close the dialog.
    dialogElement.addEventListener("cancel", (event) => {
        // stop the browser from closing the dialog instantly because we want to run our custom close() fx
        event.preventDefault();
        close();
    });

    /* Return an object that looks like
    {
        dialogElement: <the <dialog> element> for eg. mobile-sidebar,
        open: function() { ... },
        close: function() { ... }
    }
    */

    return {
        dialogElement,
        open() {
            dialogElement.showModal();
        },
        close() {
            return close();
        }
    };
}