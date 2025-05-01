export default class AsyncRef<T> {
    current: T;
    resolveAsync: ((v: T) => void) | undefined;

    constructor(initialValue: T) {
        this.current = initialValue;
        this.resolveAsync = undefined;
    }

    ref = (value: T | null) => {
        if (value && this.current !== value) {
            this.current = value;
            if (this.resolveAsync) {
                this.resolveAsync(value);
            } else {
                this.async = new Promise<T>((resolve) =>
                    { resolve(value) }
                );
            }
        }
    };

    async = new Promise<T>((resolve) => {
        this.resolveAsync = (value: T) => {
            this.resolveAsync = undefined;
            resolve(value);
        };
    });
}
