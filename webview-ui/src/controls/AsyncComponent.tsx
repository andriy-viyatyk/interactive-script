import { useEffect, useState } from "react";

export interface AsyncComponentProps<T extends React.ComponentType<any>> {
    component: () => Promise<T>;
    props?: React.ComponentProps<T>;
    onMount?: () => void;
}

export default function AsyncComponent<T extends React.ComponentType<any>>({
    component,
    props = {} as React.ComponentProps<T>,
    onMount,
}: AsyncComponentProps<T>) {
    const [Component, setComponent] = useState<T | null>(null);

    useEffect(() => {
        if (Component) {
            onMount?.();
        }
    }, [Component]);

    useEffect(() => {
        let isMounted = true;

        component().then((mod) => {
            if (isMounted) {
                setComponent(() => mod);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [component]);

    return Component ? <Component {...(props)} /> : null;
}
