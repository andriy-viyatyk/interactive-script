export const forceProperties = {
    center: { x: 0.5, y: 0.5, enabled: true },
    charge: {
        enabled: true,
        strength: -70,
        distanceMin: 1,
        distanceMax: 2000,
    },
    collide: {
        enabled: true,
        strength: 0.7,
        iterations: 1,
        radius: 6,
    },
    forceX: {
        enabled: false,
        strength: 0.1,
        x: 0.5,
    },
    forceY: {
        enabled: false,
        strength: 0.1,
        y: 0.5,
    },
    link: {
        enabled: true,
        distance: 40,
        iterations: 1,
    },
};