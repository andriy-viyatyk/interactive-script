import * as vscode from "vscode";
import { WebView } from "./WebView";
import { Subscription } from "../utils/events";
import { ViewMessage } from "../../shared/ViewMessage";
import { WebViewType } from "../../shared/types";

class Views {
    views: Map<string, WebView> = new Map<string, WebView>();
    output: WebView | undefined = undefined;
    onOutputMessage = new Subscription<ViewMessage<any>>();

    createView = (context: vscode.ExtensionContext, type: WebViewType) => {
        const view = new WebView(context, type);
        view.onPanel.subscribe(this.onPanel);
        return view;
    };

    private readonly onPanel = (view?: WebView) => {
        if (!view) {
            return;
        }
        this.setupView(view);
        this.views.set(view.id, view);
    }

    private readonly setupView = (view: WebView) => {
        if (view.type === "output") {
            this.output = view;
            view.panel?.webview.onDidReceiveMessage((message: ViewMessage<any>) => {
                if (message?.command) {
                    this.onOutputMessage.send(message);
                }
            });
        }

        view.panel?.onDidDispose(() => {
            this.views.delete(view.id);
            if (view === this.output) {
                this.output = undefined;
            }
        });
    }

    messageToOutput = (message: ViewMessage<any>) => {
        if (this.output) {
            this.output.panel?.webview.postMessage(message);
        } else {
            console.error("Output view is not available.");
        }
    }
}

const views = new Views();

export default views;