document.addEventListener("DOMContentLoaded", function () {
    console.log("Cellestial documentation: soft styling and parameter formatting active.");

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
});
