import * as vscode from 'vscode';

class GridContentProvider implements vscode.TextDocumentContentProvider {
    // A simple event emitter to notify VS Code when document content changes.
    // This is crucial if you want to allow edits in the underlying text editor (e.g., "Open to the Side").
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    public readonly onDidChange = this._onDidChange.event;

    private _documents = new Map<string, string>(); // Map: URI string -> content

    public setContent(uri: vscode.Uri, content: string) {
        this._documents.set(uri.toString(), content);
        this._onDidChange.fire(uri); // Notify VS Code that content for this URI has changed

        console.log(`_onDidChange.fire called for URI: ${uri.toString()}, Content Length: ${content.length}`);
    }

    public provideTextDocumentContent(uri: vscode.Uri): string {
        // Return the content associated with this URI
        console.log(`provideTextDocumentContent called for URI: ${uri.toString()}`);
        return this._documents.get(uri.toString()) || '';
    }
}

// Export a singleton instance (or manage its lifecycle in activate)
export const gridContentProvider = new GridContentProvider();