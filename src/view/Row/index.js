export default function Row({
  children,
  type,
  editable,
  offset,
  offsetX,
  offsetY,
  ...props
}) {
  offsetX = (offset?.x ?? offsetX) | 0;
  offsetY = (offset?.y ?? offsetY) | 0;
  return (
    <g
      type={type}
      transform={`translate(${offsetX},${offsetY})`}
      style={
        editable
          ? {
              cursor: "pointer",
            }
          : null
      }
      {...props}
    >
      {children}
    </g>
  );
}
