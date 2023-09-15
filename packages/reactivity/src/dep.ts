export const createDep = (effect?) => {
    const dep = new Set(effect);
    return dep;
};
