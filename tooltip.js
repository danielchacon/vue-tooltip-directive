Vue.directive("tooltip", {
    bind: function (el, binding) {
        let newTooltip = null;

        window.allTooltips = [];
        window.allTooltipHandlers = [];

        const removeTooltips = () => {
            window.allTooltips.forEach((item) => {
                item.remove();
            });
            window.allTooltips = [];
            window.allTooltipHandlers.forEach((item) => {
                item.classList.remove("active");
            });
            window.allTooltipHandlers = [];
        };

        const createTooltip = () => {
            removeTooltips();

            newTooltip = document.createElement("div");
            newTooltip.innerHTML = `
        <div class="tooltip-inner">${binding.value.message}</div>
        <div class="tooltip-arrow"></div>
      `;
            const arrow = newTooltip.querySelector(".tooltip-arrow");

            newTooltip.classList.add("tooltip");

            if (binding.value.customClass) {
                newTooltip.classList.add(binding.value.customClass);
            }

            if (!binding.value.position) {
                newTooltip.setAttribute("x-placement", "top");
            }

            newTooltip.style.position = "fixed";
            newTooltip.style.top = 0;
            newTooltip.style.left = 0;

            document.body.appendChild(newTooltip);

            const rect = el.getBoundingClientRect();
            const topPos = (newTooltip.style.top =
                rect.top - newTooltip.clientHeight - 10);
            let leftPos =
                rect.left + rect.width / 2 - newTooltip.clientWidth / 2;

            const leftInBoundaries = leftPos >= 10;
            const rightInBoundaries =
                leftPos + newTooltip.clientWidth <= window.innerWidth - 10;

            if (!leftInBoundaries) {
                leftPos = rect.left;
            }

            if (!rightInBoundaries) {
                leftPos = rect.left - newTooltip.clientWidth + rect.width;
            }

            if (!leftInBoundaries || !rightInBoundaries) {
                arrow.style.left =
                    rect.left -
                    leftPos +
                    rect.width / 2 -
                    arrow.getBoundingClientRect().width / 2 +
                    "px";
            }

            newTooltip.style.top = topPos + "px";
            newTooltip.style.left = leftPos + "px";

            el.classList.add("active");

            window.allTooltips.push(newTooltip);
            window.allTooltipHandlers.push(el);
        };

        if ("ontouchstart" in window === false) {
            el.addEventListener("mouseenter", () => {
                createTooltip();
            });

            el.addEventListener("mouseleave", () => {
                removeTooltips();
            });
        } else {
            el.addEventListener("touchstart", (event) => {
                event.stopPropagation();

                createTooltip();
            });

            document.addEventListener("touchstart", () => {
                removeTooltips();
            });
        }
        window.addEventListener("resize", () => {
            removeTooltips();
        });
    },
});
