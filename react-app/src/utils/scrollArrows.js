
export const isOverflown = (parentContainer, childContainer, setState) => {
    if (parentContainer.offsetWidth < childContainer.length * 180 && parentContainer.offsetWidth >= 430) {
        setState(true);
    }
    else {
        setState(false);
    }
}
