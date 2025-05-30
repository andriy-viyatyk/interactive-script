import { ViewMessage } from "../../../shared/ViewMessage";

class ResponseHandler {
    private readonly map: Map<string, (message: ViewMessage) => void> = new Map();

    handleResponse(message: ViewMessage): boolean {
        const resolve = this.map.get(message.commandId);
        if (!resolve) {
            return false;
        }
        this.map.delete(message.commandId);
        resolve(message);
        return true;
    }

    async sendRequest<T = any>(message: ViewMessage<T>): Promise<ViewMessage<T>> {
        return new Promise((resolve) => {
            this.map.set(message.commandId, resolve);
            if (window.vscode) {
                window.vscode.postMessage(message);
            } else {
                console.error("No vscode object available to send message");
            }
        });
    }
}

export const responseHandler = new ResponseHandler();