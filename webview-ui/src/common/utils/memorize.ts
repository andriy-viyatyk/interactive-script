// Memorise function results based on arguments
// If arguments are the same, the result is returned from the cache
// first parameter is the function to memorize
// second parameter is a function that checks if result successfull. Should return true to memorize the result.
// if function is async then result of function is a promise and check function need to return Promise<boolean>.

export const memorize = <F extends (...args: any) => any>(
    f: F,
    memorizeResult?: (result: ReturnType<F>) => boolean | Promise<boolean>
) => {
    const resultMap = new Map<string, any | undefined>();

    const func = ((...args: any[]) => {
        const newArgs = JSON.stringify(args);
        if (resultMap.has(newArgs)) {
            return resultMap.get(newArgs);
        }

        resultMap.delete(newArgs);
        const newResult = f(...args);
        const canMemorize = !memorizeResult || memorizeResult(newResult);
        if (canMemorize) {
            if (canMemorize instanceof Promise) {
                canMemorize.then((can) => {
                    if (can) {
                        resultMap.set(newArgs, newResult);
                    }
                });
            } else {
                resultMap.set(newArgs, newResult);
            }
        }
        return newResult;
    }) as any as F;

    Object.defineProperty(func, 'length', {get: () => f.length})

    return func;
};