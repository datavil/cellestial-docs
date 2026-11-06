const isApiFigurePreview = new URLSearchParams(window.location.search).has("figure-preview");

if (isApiFigurePreview) {
    let letsPlotCallDelegate = () => {};
    let previewPlotAccepted = false;

    Object.defineProperty(window, "letsPlotCall", {
        configurable: true,
        get() {
            return callback => {
                if (!previewPlotAccepted) {
                    previewPlotAccepted = true;
                    letsPlotCallDelegate(callback);
                }
            };
        },
        set(delegate) {
            letsPlotCallDelegate = delegate;
        },
    });
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("Cellestial documentation: soft styling and parameter formatting active.");

    if (isApiFigurePreview) {
        const figureOutput = Array.from(document.querySelectorAll(".cell_output")).find(
            output => output.querySelector('[data-lets-plot-script="plot"]')
        );

        if (figureOutput) {
            document.documentElement.classList.add("api-figure-preview-document");
            figureOutput.classList.add("api-figure-preview-content");
            document.body.replaceChildren(figureOutput);

            const plotScript = figureOutput.querySelector('[data-lets-plot-script="plot"]');
            const plotContainer = plotScript.previousElementSibling;
            let observedFigure = null;
            let previousWidth = 0;
            let previousHeight = 0;

            function announcePreview(renderedFigure) {
                const bounds = renderedFigure.getBoundingClientRect();
                const width = Math.ceil(bounds.width);
                const height = Math.ceil(bounds.height);

                if (!width || !height || (width === previousWidth && height === previousHeight)) {
                    return;
                }

                previousWidth = width;
                previousHeight = height;
                window.parent.postMessage({
                    type: "cellestial-api-figure-preview",
                    available: true,
                    url: window.location.href,
                    width,
                    height,
                }, "*");
            }

            function observeRenderedFigure() {
                const visualElements = new Set([
                    plotContainer.firstElementChild,
                    ...plotContainer.querySelectorAll("svg, canvas, img"),
                ]);
                visualElements.delete(null);

                const renderedFigure = Array.from(visualElements).reduce((largest, element) => {
                    const bounds = element.getBoundingClientRect();
                    const area = bounds.width * bounds.height;
                    return !largest || area > largest.area ? { element, area, bounds } : largest;
                }, null);

                if (
                    !renderedFigure
                    || renderedFigure.bounds.width < 80
                    || renderedFigure.bounds.height < 80
                ) {
                    return false;
                }

                if (observedFigure !== renderedFigure.element) {
                    sizeObserver.disconnect();
                    observedFigure = renderedFigure.element;
                    sizeObserver.observe(observedFigure);
                }
                announcePreview(observedFigure);
                return true;
            }

            const sizeObserver = new ResizeObserver(observeRenderedFigure);
            const plotObserver = new MutationObserver(observeRenderedFigure);
            plotObserver.observe(plotContainer, { childList: true, subtree: true });
            observeRenderedFigure();
        } else {
            window.parent.postMessage({
                type: "cellestial-api-figure-preview",
                available: false,
                url: window.location.href,
            }, "*");
        }
        return;
    }

    // Replace the annoying en-dash (\u2013) with a newline and indentation in parameter lists
    const paramDescriptions = document.querySelectorAll('.field-list dd li p, .field-list dd p');
    paramDescriptions.forEach(p => {
        // Use regex for en-dash (\u2013) with surrounding spaces
        const enDashRegex = / \u2013 /g;
        if (p.innerHTML.match(enDashRegex)) {
            p.innerHTML = p.innerHTML.replace(enDashRegex, '<br>&nbsp;&nbsp;&nbsp;&nbsp;');
        }
    });

    // Type hint toggle — only on pages that have a function signature
    const pageH1 = document.querySelector('article.bd-article h1');
    if (pageH1 && document.querySelector('dt.sig')) {
        const hidden = localStorage.getItem('cellestial-hide-types') === 'true';
        if (hidden) document.body.classList.add('hide-types');

        const btn = document.createElement('button');
        btn.className = 'type-toggle';
        btn.textContent = hidden ? 'show types' : 'hide types';

        btn.addEventListener('click', () => {
            const nowHidden = document.body.classList.toggle('hide-types');
            btn.textContent = nowHidden ? 'show types' : 'hide types';
            localStorage.setItem('cellestial-hide-types', nowHidden);
        });

        pageH1.appendChild(btn);
    }

    // Mark interactive examples that have mobile SVG companions.
    const mobilePlots = document.querySelectorAll(".mobile-plot");
    mobilePlots.forEach(plot => {
        const desktopPlot = plot.previousElementSibling;
        if (desktopPlot && desktopPlot.classList.contains("jupyter_cell")) {
            desktopPlot.classList.add("desktop-plot");
        }
    });

    const apiLinks = document.querySelectorAll("table.autosummary a.reference.internal");
    if (!apiLinks.length || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        return;
    }

    const tooltip = document.createElement("div");
    tooltip.className = "api-figure-tooltip";
    tooltip.setAttribute("role", "tooltip");
    tooltip.setAttribute("aria-hidden", "true");

    const previewFrame = document.createElement("iframe");
    previewFrame.className = "api-figure-tooltip-frame";
    previewFrame.tabIndex = -1;
    previewFrame.setAttribute("aria-hidden", "true");
    tooltip.appendChild(previewFrame);
    document.body.appendChild(tooltip);

    let activeLink = null;
    let showTimer = null;
    let previewDimensions = { width: 240, height: 140 };

    function positionTooltip(link) {
        const linkBounds = link.getBoundingClientRect();
        const gap = 12;
        const viewportPadding = 12;
        const maximumWidth = Math.min(600, window.innerWidth - 2 * viewportPadding);
        const maximumHeight = Math.min(500, window.innerHeight - 2 * viewportPadding);
        const scale = Math.min(
            1,
            maximumWidth / previewDimensions.width,
            maximumHeight / previewDimensions.height
        );
        const width = previewDimensions.width * scale;
        const height = previewDimensions.height * scale;

        tooltip.style.width = `${width}px`;
        tooltip.style.height = `${height}px`;
        tooltip.style.setProperty("--api-figure-preview-scale", scale);
        tooltip.style.setProperty(
            "--api-figure-frame-height",
            `${previewDimensions.height}px`
        );

        let left = linkBounds.right + gap;
        if (left + width > window.innerWidth - viewportPadding) {
            left = linkBounds.left - gap - width;
        }
        left = Math.max(viewportPadding, Math.min(left, window.innerWidth - width - viewportPadding));

        const centeredTop = linkBounds.top + linkBounds.height / 2 - height / 2;
        const top = Math.max(
            viewportPadding,
            Math.min(centeredTop, window.innerHeight - height - viewportPadding)
        );

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

    function hideTooltip() {
        window.clearTimeout(showTimer);
        activeLink = null;
        tooltip.classList.remove("is-visible", "is-ready");
        tooltip.setAttribute("aria-hidden", "true");
    }

    function showTooltip(link) {
        if (link.dataset.figurePreview === "unavailable") {
            return;
        }

        activeLink = link;
        showTimer = window.setTimeout(() => {
            if (activeLink !== link) {
                return;
            }

            const previewUrl = new URL(link.href);
            previewUrl.searchParams.set("figure-preview", "true");
            previewUrl.hash = "";

            previewDimensions = { width: 240, height: 140 };
            positionTooltip(link);
            tooltip.classList.add("is-visible");
            tooltip.classList.remove("is-ready");
            tooltip.setAttribute("aria-hidden", "false");
            previewFrame.title = `First figure from ${link.textContent.trim()}`;
            previewFrame.src = previewUrl.href;
        }, 300);
    }

    apiLinks.forEach(link => {
        link.removeAttribute("title");
        link.addEventListener("mouseenter", () => showTooltip(link));
        link.addEventListener("mouseleave", hideTooltip);
        link.addEventListener("focus", () => showTooltip(link));
        link.addEventListener("blur", hideTooltip);
    });

    window.addEventListener("message", event => {
        if (
            (window.location.origin !== "null" && event.origin !== window.location.origin)
            || event.source !== previewFrame.contentWindow
            || event.data?.type !== "cellestial-api-figure-preview"
            || event.data.url !== previewFrame.src
        ) {
            return;
        }

        if (!event.data.available) {
            if (activeLink) {
                activeLink.dataset.figurePreview = "unavailable";
            }
            hideTooltip();
            return;
        }

        previewDimensions = {
            width: event.data.width,
            height: event.data.height,
        };
        if (activeLink) {
            positionTooltip(activeLink);
        }
        tooltip.classList.add("is-ready");
    });

    window.addEventListener("resize", () => {
        if (activeLink) {
            positionTooltip(activeLink);
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            hideTooltip();
        }
    });
});
