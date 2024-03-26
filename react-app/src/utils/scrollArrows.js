
export const isOverflown = (parentContainer, childContainer, setState) => {
    console.log(childContainer.length * 180, parentContainer.offsetWidth)
    if (parentContainer.offsetWidth < childContainer.length * 180 && parentContainer.offsetWidth >= 430) {
        setState(true);
    }
    else {
        setState(false);
    }
}
