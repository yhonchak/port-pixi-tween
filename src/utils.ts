/**
 * Keeps utility functions and other simple tools.
 */

/**
 * Returns a promise with a delay.
 *
 * @param ms is a time interval in milliseconds
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));