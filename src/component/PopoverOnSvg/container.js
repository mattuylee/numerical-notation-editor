let dirty = false;
let memoizedRect = { x: 0, y: 0 };
let container;

function getPopoverContainer() {
  if (!container) {
    container = document.createElement("div");
    container.id = "svg-popover-container";
    container.style = `
      position: absolute;
      left: 0;
      top: 0;
    `;
    document.body.appendChild(container);
    document.addEventListener("scroll", () => void (dirty = true));
  }
  return container;
}

function getContainerOffset() {
  if (dirty) {
    const rect = getPopoverContainer().getBoundingClientRect();
    memoizedRect = {
      x: -rect.x,
      y: -rect.y,
    };
    dirty = false;
  }
  return memoizedRect;
}

export { getPopoverContainer, getContainerOffset };
