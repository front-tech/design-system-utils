let state = false;

function openCode(event, index, type) {
  if (type !== "variable") {
    code = document.getElementById(`${event}-${index}`);
    codeContent = document
      .getElementById(`${event}-content-${index}`)
      .getBoundingClientRect().height;
    if (state === false) {
      code.classList.remove("opened");
      code.style.height = "56px";
      code.setAttribute("aria-expanded", false);
      state = true;
    } else {
      code.classList.add("opened");
      code.style.height = `${codeContent}px`;
      code.setAttribute("aria-expanded", true);
      state = false;
    }
  }
}
