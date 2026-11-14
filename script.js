const menuButton = document.getElementById("menuButton");
const navigation = document.getElementById("navigation");


// =========================
// MOBILE MENU
// =========================

if (menuButton && navigation) {

    // Open and close the mobile menu

    menuButton.addEventListener("click", function () {

        navigation.classList.toggle("active");

    });


    // Close the mobile menu when a link is clicked

    const navigationLinks =
        document.querySelectorAll(".navigation a");

    navigationLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navigation.classList.remove("active");

        });

    });

}


// =========================
// ACTIVE PAGE
// =========================

const currentPage =
    window.location.pathname.split("/").pop() || "index";

const navigationLinks =
    document.querySelectorAll(".navigation a");

navigationLinks.forEach(function (link) {

    const linkPage =
        link.getAttribute("href");

    if (linkPage === currentPage) {

        link.classList.add("active");

    }

});

const searchPages = [
    { title: "Home", url: "index" },
    { title: "About Us", url: "about-us" },
    { title: "Services", url: "services" },
    { title: "Bundles", url: "bundles" },
    { title: "Vibroacoustic Sound Bed Therapy", url: "vibroacoustic-sound-bed-therapy" },
    { title: "Red Light Therapy", url: "red-light-therapy" },
    { title: "PEMF BioMat Therapy", url: "pemf-biomat-therapy" },
    { title: "Infrared Sauna", url: "infrared-sauna" },
    { title: "Massage Therapy", url: "massage-therapy" },
    { title: "Acupuncture Therapy", url: "acupuncture-therapy" },
    { title: "Nutritional Therapy", url: "nutritional-therapy" },
    { title: "Reiki & Chakra Balancing", url: "reiki-and-chakra-balancing" },
    { title: "Live Online Meditation and Yoga Classes", url: "https://theartofagingmindfully.com/live-online" },
    { title: "Polyvagal Services & Life Coaching", url: "polyvagal-services-and-life-coaching" },
    { title: "Recovery Coaching", url: "recovery-coaching" },
    { title: "IV Infusion Therapy", url: "iv-infusion-therapy" },

    { title: "Our Team", url: "our-team" },
    { title: "Contact Us", url: "contact-us" }
];

const searchInput = document.getElementById("searchInput");
const searchDropdown = document.getElementById("searchDropdown");
const searchForm = document.getElementById("searchForm");

if (searchInput && searchDropdown) {

    let pageContents = [];

    if (searchForm) {
        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const query = searchInput.value.toLowerCase().trim();

            if (!query) {
                searchDropdown.style.display = "none";
                return;
            }

            const firstMatch = pageContents.find(page =>
                page.text.toLowerCase().includes(query)
            );

            if (firstMatch) {
                window.location.href =
                    firstMatch.url +
                    "?search=" +
                    encodeURIComponent(query);
            } else {
                searchDropdown.innerHTML =
                    '<div class="search-no-results">No results found</div>';

                searchDropdown.style.display = "block";
            }
        });
    }

    Promise.all(
        searchPages.map(page =>
            fetch(page.url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Could not load " + page.url);
                    }

                    return response.text();
                })
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, "text/html");

                    doc.querySelectorAll("script, style").forEach(element => {
                        element.remove();
                    });

                    return {
                        title: page.title,
                        url: page.url,
                        text: doc.body ? doc.body.innerText : page.title
                    };
                })
                .catch(() => {
                    // Keep the page in the search even if its content cannot be fetched
                    return {
                        title: page.title,
                        url: page.url,
                        text: page.title
                    };
                })
        )
    ).then(results => {
        pageContents = results;
    });

    searchInput.addEventListener("input", function () {

        const query = searchInput.value.toLowerCase().trim();

        searchDropdown.innerHTML = "";

        if (!query) {
            searchDropdown.style.display = "none";
            return;
        }

        if (pageContents.length === 0) {
            searchDropdown.style.display = "none";
            return;
        }

        const matches = [];

        pageContents.forEach(page => {

            const pageText = page.text.toLowerCase();
            const position = pageText.indexOf(query);

            if (position !== -1) {

                let start = Math.max(0, position - 50);
                let end = Math.min(
                    page.text.length,
                    position + query.length + 80
                );

                let preview = page.text
                    .substring(start, end)
                    .replace(/\s+/g, " ")
                    .trim();

                if (start > 0) {
                    preview = "..." + preview;
                }

                if (end < page.text.length) {
                    preview += "...";
                }

                matches.push({
                    title: page.title,
                    url: page.url,
                    preview: preview
                });
            }
        });

        if (matches.length === 0) {

            searchDropdown.innerHTML =
                '<div class="search-no-results">No results found</div>';

            searchDropdown.style.display = "block";
            return;
        }

        matches.forEach(match => {

            const result = document.createElement("a");

            result.href =
                match.url +
                "?search=" +
                encodeURIComponent(query);

            result.innerHTML = `
                <strong>${match.title}</strong>
                <small>${match.preview}</small>
            `;

            searchDropdown.appendChild(result);
        });

        searchDropdown.style.display = "block";
    });

    document.addEventListener("click", function (event) {

        if (!searchForm.contains(event.target)) {
            searchDropdown.style.display = "none";
        }

    });
}

const searchParams = new URLSearchParams(window.location.search);
const searchTerm = searchParams.get("search");

if (searchTerm) {

    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
    );

    let node;

    while (node = walker.nextNode()) {

        if (
            node.parentElement.closest(
                "script, style, nav, header, footer, form"
            )
        ) {
            continue;
        }

        const text = node.textContent;
        const position = text.toLowerCase().indexOf(searchTerm.toLowerCase());

        if (position !== -1) {

            const range = document.createRange();

            range.setStart(node, position);
            range.setEnd(
                node,
                position + searchTerm.length
            );

            const highlight = document.createElement("mark");

            range.surroundContents(highlight);

            highlight.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            break;
        }
    }
}

// =========================
// FORMSPREE
// =========================

const form = document.getElementById("my-form");
const formstatus = document.getElementById("form-status");

if (form) {
    form.addEventListener("submit", function(event) {
        event.preventDefault(); 
        
        const data = new FormData(event.target);
        
        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: { 'Accept': 'application/json' }
        })
        .then(function(response) {
            if (response.ok) {
                formstatus.style.color = "#28a745";
                formstatus.textContent = "Thank you! Your message has been sent successfully.";
                formstatus.style.display = "block";
                form.reset(); // This clears out the text boxes
            } else {
                formstatus.style.color = "#dc3545";
                formstatus.textContent = "Oops! There was a problem submitting your form.";
                formstatus.style.display = "block";
            }
        })
        .catch(function(error) {
            formstatus.style.color = "#dc3545";
            formstatus.textContent = "Oops! There was a network error.";
            formstatus.style.display = "block";
        });
    });
}

// =========================
// IV INFUSION READ MORE / CLOSE
// =========================

document.querySelectorAll(
    ".iv-infusion-panel .iv-treatment-details"
).forEach(function (details) {

    const closeButton = details.querySelector(".iv-close-details");

    if (closeButton) {
        closeButton.addEventListener("click", function () {
            details.open = false;
        });
    }

});

//================
//  LINK HOVER 
// ===============

document.addEventListener("DOMContentLoaded", function () {
    const preview = document.getElementById("link-preview");
    const previewFrame = document.getElementById("link-preview-frame");

    if (!preview || !previewFrame) return;

    let hideTimer;

    // Only preview links that point to pages on this website.
    const links = document.querySelectorAll("a.preview-link[href]");

    links.forEach(function (link) {
        const url = new URL(link.href, window.location.href);

        if (url.origin !== window.location.origin) return;
        if (!["http:", "https:"].includes(url.protocol)) return;

        link.addEventListener("mouseenter", function (event) {
            clearTimeout(hideTimer);

            // Use the full destination, including any section ID.
            previewFrame.src = url.href;

            preview.style.left = Math.min(
                event.clientX + 15,
                window.innerWidth - 375
            ) + "px";

            preview.style.top = Math.min(
                event.clientY + 15,
                window.innerHeight - 255
            ) + "px";

            preview.classList.add("visible");
            preview.setAttribute("aria-hidden", "false");
        });

        link.addEventListener("mousemove", function (event) {
            preview.style.left = Math.min(
                event.clientX + 15,
                window.innerWidth - 375
            ) + "px";

            preview.style.top = Math.min(
                event.clientY + 15,
                window.innerHeight - 255
            ) + "px";
        });

        link.addEventListener("mouseleave", function () {
            hideTimer = setTimeout(function () {
                preview.classList.remove("visible");
                preview.setAttribute("aria-hidden", "true");
            }, 200);
        });
    });
});

// PREVENT INITIAL ABOUT PAGE SCROLL
if (window.location.pathname.endsWith("about-us")) {
    window.addEventListener("load", function () {
        if (window.location.hash) return;
        window.scrollTo(0, 0);
    });
}