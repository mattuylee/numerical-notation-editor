import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Styles from "./index.module.css";
import { getContainerOffset, getPopoverContainer } from "./container";

// ENHANCE: smart placement
function PopoverOnSvg({
  children,
  renderContent,
  renderPopover,
  darkMode,
  globalClassName,
  offset,
  placement,
  style,
  title,
  trigger,
  visible,
  autoHide,
  showArrow,
  onVisibilityChange,
}) {
  const triggerBoxRef = useRef({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  const initFlagRef = useRef(false);
  const triggerRef = useRef();
  const popoverRef = useRef();
  // initially, always set innerVisible to false. If the prop *visible* is
  // true, we'll update it after dom mounted, because we cannot calculate
  // correct position of popover before react mounting it.
  const [innerVisible, setInnerVisible] = useState(false);
  const [lastContextCord, setLastContextCord] = useState({ x: 0, y: 0 });
  const [, forceUpdate] = useState();
  const popoverClassNames = [Styles.popover, globalClassName].filter(Boolean);
  const arrowClassNames = [Styles.arrow];
  const headerClassNames = [Styles.header];
  let offsetX = (offset && offset.x) || 0;
  let offsetY = (offset && offset.y) || 0;
  let mergedStyles = {
    transform: "",
  };
  const arrowStyles = {};
  placement = placement.toLowerCase();

  const makeOffset = function (x, y = 0) {
    offsetX += x;
    offsetY += y;
  };
  const changeVisibility = useCallback(
    function (shouldShow) {
      shouldShow = shouldShow ?? !innerVisible;
      let newVisibility = visible === undefined ? shouldShow : visible;
      if (newVisibility) {
        if (!triggerRef.current) {
          setTimeout(changeVisibility, 0);
          return;
        }
        // re-get box of trigger element
        triggerBoxRef.current = triggerRef.current.getBoundingClientRect();
      }
      setInnerVisible(newVisibility);
      // FIXME: visible由false变为true时React Warning: Cannot update a component (`EditableContent`) while rendering a different component (`PopoverOnSvg`).
      onVisibilityChange && onVisibilityChange(shouldShow);
    },
    [visible, innerVisible, onVisibilityChange]
  );
  const handleContextMenu = useCallback(
    (ev) => {
      setLastContextCord({ x: ev.pageX, y: ev.pageY });
      ev.preventDefault();
      changeVisibility(true);
    },
    [changeVisibility]
  );
  useEffect(() => {
    initFlagRef.current = true;
  }, []);
  useEffect(() => {
    if (autoHide === false) {
      return;
    }
    const handler = (ev) => {
      if (ev.type === "keydown" && ev.key === "Escape") {
        changeVisibility(false);
      } else if (ev.type === "mouseup") {
        for (let target = ev.target; target; target = target.parentElement) {
          if (target === popoverRef.current) {
            return;
          } else if (target === triggerRef.current) {
            if (trigger === "context" && ev.button !== 2) {
              continue;
            } else if (trigger === "click" && ev.button !== 0) {
              continue;
            }
            return;
          }
        }
        changeVisibility(false);
      }
    };
    if (innerVisible) {
      document.addEventListener("mouseup", handler);
      document.addEventListener("keydown", handler);
    }
    return () => {
      document.removeEventListener("mouseup", handler);
      document.removeEventListener("keydown", handler);
    };
  }, [innerVisible, autoHide, changeVisibility, trigger]);

  if (visible !== undefined && visible !== innerVisible) {
    if (initFlagRef.current) {
      changeVisibility();
    } else {
      setTimeout(() => {
        // this is the first-time render, trigger dom has not mounted, so we
        // have to delay the rendering
        forceUpdate([]);
      }, 0);
    }
  }
  if (trigger !== "context") {
    const box = triggerBoxRef.current;
    switch (true) {
      case /^(left|right)(top|center|bottom)?$/i.test(placement):
        mergedStyles.minHeight = "32px";
        if (placement.startsWith("right")) {
          mergedStyles.left = box.right + "px";
        } else {
          mergedStyles.left = box.left + "px";
          mergedStyles.transform += " translate(-100%, 0)";
        }
        if (placement.endsWith("top")) {
          mergedStyles.top = box.top + "px";
          mergedStyles.transform += " translate(0, 0)";
          arrowStyles.top = "16px";
        } else if (placement.endsWith("bottom")) {
          mergedStyles.top = box.bottom + "px";
          mergedStyles.transform += " translate(0, -100%)";
          arrowStyles.bottom = "0";
        } else {
          mergedStyles.top = box.y + box.height / 2 + "px";
          mergedStyles.transform += " translate(0, -50%)";
          arrowStyles.top = "50%";
        }
        break;
      case /^(top|bottom)(left|center|right)?$/i.test(placement):
      default:
        if (placement.startsWith("bottom")) {
          mergedStyles.top = box.bottom + "px";
        } else {
          mergedStyles.top = box.y + "px";
          mergedStyles.transform += " translate(0, -100%)";
        }
        if (placement.endsWith("left")) {
          mergedStyles.left = box.left + "px";
          arrowStyles.left = "16px";
        } else if (placement.endsWith("right")) {
          mergedStyles.left = box.right + "px";
          mergedStyles.transform += " translate(-100%, 0)";
          arrowStyles.right = "0";
        } else {
          mergedStyles.left = box.right - box.width / 2 + "px";
          mergedStyles.transform += " translateX(-50%)";
          arrowStyles.left = "50%";
        }
        break;
    }
    switch (true) {
      case !showArrow:
        break;
      case placement.startsWith("left"):
        makeOffset(-8);
        arrowClassNames.push("left");
        break;
      case placement.startsWith("right"):
        makeOffset(8);
        arrowClassNames.push("right");
        break;
      case placement.startsWith("bottom"):
        makeOffset(0, 8);
        arrowClassNames.push("bottom");
        break;
      case placement.startsWith("top"):
      default:
        makeOffset(0, -8);
        arrowClassNames.push("top");
        break;
    }
    makeOffset(getContainerOffset().x, getContainerOffset().y);
    mergedStyles.transform += ` translate(${offsetX}px, ${offsetY}px)`;
  } else {
    mergedStyles.left = lastContextCord.x;
    mergedStyles.top = lastContextCord.y;
    mergedStyles.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }
  if (darkMode) {
    popoverClassNames.push("dark");
    arrowClassNames.push("dark");
    headerClassNames.push("dark");
  }
  mergedStyles = Object.assign(mergedStyles, style);
  return (
    <>
      []
      <g
        type="noop"
        ref={triggerRef}
        onClick={trigger === "click" ? () => changeVisibility() : undefined}
        onMouseEnter={
          trigger === "hover" ? () => changeVisibility(true) : undefined
        }
        onMouseLeave={
          trigger === "hover" ? () => changeVisibility(false) : undefined
        }
        onContextMenu={trigger === "context" ? handleContextMenu : undefined}
      >
        {children}
      </g>
      {innerVisible &&
        createPortal(
          <div
            ref={popoverRef}
            className={popoverClassNames.join(" ")}
            style={mergedStyles}
          >
            {renderPopover ? (
              typeof renderPopover === "function" ? (
                renderPopover()
              ) : (
                renderPopover
              )
            ) : (
              <>
                {showArrow && (
                  <div
                    className={arrowClassNames.join(" ")}
                    style={arrowStyles}
                  ></div>
                )}
                {title && (
                  <header className={headerClassNames.join(" ")}>
                    {title}
                  </header>
                )}
                <div className={title ? Styles.content : null}>
                  {typeof renderContent === "function"
                    ? renderContent()
                    : renderContent ?? null}
                </div>
              </>
            )}
          </div>,
          getPopoverContainer()
        )}
    </>
  );
}

PopoverOnSvg.defaultProps = {
  trigger: "click",
  placement: "top",
  showArrow: true,
};

export default React.memo(PopoverOnSvg);
