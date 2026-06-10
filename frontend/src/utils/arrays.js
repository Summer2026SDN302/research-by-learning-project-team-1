export const splitTags = (value) => {
    return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
};

export const joinTags = (items = []) => {
    return items.join(', ');
};
