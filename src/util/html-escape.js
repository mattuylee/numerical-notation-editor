// 为了解决svg text不渲染连续空格，对html转义并替换空格为&nbsp;
export default function escapeHtml(text) {
  const span = document.createElement("span");
  span.appendChild(document.createTextNode(text));
  return span.innerHTML.replace(/\s/g, "&nbsp;");
}
