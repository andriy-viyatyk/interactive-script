// looks like VSCode permanently focuses the webviews body element when VSCode regains focus.
// It cause currently focused element to lose focus.

// Global variable to store the last focused element
let lastFocusedElement: HTMLElement | null = null;

// Event listener for 'focusin' to track currently focused element
document.addEventListener('focusin', (event: FocusEvent) => {
    if (event.target instanceof HTMLElement) {
        lastFocusedElement = event.target;
    }
});

// Function to handle window focus events (when the webview itself gains focus)
function onWindowFocus() {
    const currentActiveElement = document.activeElement;

    if ((currentActiveElement === document.body || currentActiveElement === document.documentElement)) {
        if (
            lastFocusedElement &&
            lastFocusedElement.isConnected
        ) {
            // Use a short timeout to allow the browser/VSCode's default focus logic to complete
            setTimeout(() => {
                if (lastFocusedElement && lastFocusedElement.focus) {
                    lastFocusedElement.focus();
                }
            }, 50); // Adjust delay if necessary
        }
    } else if (currentActiveElement instanceof HTMLElement) {
        lastFocusedElement = currentActiveElement;
        console.log('Focused element:', lastFocusedElement.tagName, lastFocusedElement.className);
    }
    
}

window.addEventListener("focus", onWindowFocus);

