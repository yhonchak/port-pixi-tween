/**
 * Keeps common types and interfaces.
 */

/**
 * Describes the object (sprite) position.
 */
export interface Position {
    x: number;
    y: number;
}

/**
 * Describes containers with the loading functionality.
 */
export interface Container {
    load(): void;
    unload(): void;
    get empty(): boolean;
}