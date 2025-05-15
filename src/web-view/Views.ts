import * as vscode from "vscode";
import { WebView } from "./WebView";
import { Subscription } from "../utils/events";
import { ViewMessage } from "../../shared/ViewMessage";
import { WebViewType } from "../../shared/types";

class Views {
    views: Map<string, WebView> = new Map<string, WebView>();
    output: WebView | undefined = undefined;

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
        if (view.isBottomPanel) {
            this.output = view;
        }

        view.onDispose.subscribe(() => {
            this.views.delete(view.id);
            if (view === this.output) {
                this.output = undefined;
            }
        });
    }
}

const views = new Views();

export default views;