/**
 * Bind all methods of an object to itself
 * @static
 * @param {Array.<Function>} methodNames
 * @param {Object} instance
 */
export function autobind(methodNames, instance) {
    methodNames.forEach((methodName) => {
        instance[methodName] = instance[methodName].bind(instance);
    });
}
