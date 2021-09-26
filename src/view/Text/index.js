import escapeHtml from "../../util/html-escape";

export default function Text({ children, editable, ...props }) {
  if (typeof children === "string") {
    return (
      <text
        x="0"
        y="0"
        style={
          editable
            ? {
                cursor: "pointer",
              }
            : null
        }
        dominantBaseline="hanging"
        stroke="none"
        fontWeight="bold"
        fill="black"
        dangerouslySetInnerHTML={{ __html: escapeHtml(children) }}
        {...props}
      ></text>
    );
  }
  return (
    <text
      x="0"
      y="0"
      style={
        editable
          ? {
              cursor: "pointer",
            }
          : null
      }
      dominantBaseline="hanging"
      stroke="none"
      fontWeight="bold"
      fill="black"
      {...props}
    >
      {children}
    </text>
  );
}
