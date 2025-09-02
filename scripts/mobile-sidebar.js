import { initDialog } from "./dialog.js"

// FOR MOBILE VIEW: This module controls the mobile sidebar (a <dialog>).
// - Opens the sidebar when a "mobile-sidebar-open-request" event is fired (e.g. hamburger button clicked).
// - Closes the sidebar automatically when a "date-change" event is fired (e.g. user navigates to another date).

export function initMobileSidebar() {
    const dialog = initDialog("mobile-sidebar");

    /* dialog is an object. Imagine it like:
    const dialog = {
                    dialogElement: <the <dialog> element>,
                    open: function() { ... },
                    close: function() { ... }
                   };
}
    */

    // Whenever there is a 'mobile-sidebar-open-request' event, open the sidebar
    document.addEventListener("mobile-sidebar-open-request", () => {
        dialog.open();
    });

    // Close the sidebar when there is a 'date-change' event
    document.addEventListener("date-change", () => {
        dialog.close();
    });
}