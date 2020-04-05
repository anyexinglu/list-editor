export const moveCursorToNextLine = () => {};

function setCaretPosition(ctrl: HTMLElement | null, pos: number) {
  if (!ctrl) return;

  let range = document.createRange();
  let sel = window.getSelection() as any;
  range.setStart(ctrl, pos);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  ctrl.focus();
}

export { setCaretPosition };
