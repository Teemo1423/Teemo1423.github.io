/* Mohyeon Somang Church | GA4 web analytics
   Activated only after a real GA4 Measurement ID is saved in content/site.json.
   The same loader is used by the public site, mobile browser and installed PWA.
*/
(() => {
  "use strict";
  if (window.__mohyeonGa4Init) return;
  if (/\/(?:admin|editor)(?:\.html)?$/i.test(location.pathname)) return;
  if (!/(^|\.)mohyeonsomang\.org$/i.test(location.hostname)) return;
  window.__mohyeonGa4Init = true;

  function isValidId(value) {
    return /^G-[A-Z0-9]{6,20}$/.test(String(value || "").trim());
  }

  async function initialize() {
    let settings;
    try {
      const response = await fetch("/content/site.json?v=" + Date.now(), { cache: "no-store" });
      if (!response.ok) return;
      settings = await response.json();
    } catch (error) {
      console.warn("[Analytics] GA4 configuration unavailable.", error);
      return;
    }

    const measurementId = String(settings.ga4MeasurementId || "").trim().toUpperCase();
    if (!isValidId(measurementId)) return;

    // Avoid duplicate Google tags if another integration is ever introduced.
    if (window.__mohyeonGa4Active) return;
    window.__mohyeonGa4Active = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", measurementId);

    const tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
    tag.setAttribute("data-mohyeon-ga4", measurementId);
    document.head.appendChild(tag);

    function track(name, parameters) {
      try { window.gtag("event", name, parameters || {}); }
      catch (error) { console.warn("[Analytics] Event not sent", error); }
    }

    document.addEventListener("click", function (event) {
      const link = event.target.closest && event.target.closest("a[href]");
      if (link) {
        let url;
        try { url = new URL(link.href, location.href); }
        catch (error) { return; }
        const host = url.hostname.toLowerCase();
        if (host === "youtube.com" || host === "youtu.be" || host.endsWith(".youtube.com") || host.endsWith(".youtu.be") || host === "youtube-nocookie.com" || host.endsWith(".youtube-nocookie.com")) {
          track("youtube_click", { link_url: url.href, page_path: location.pathname });
        } else if (host === "pf.kakao.com" || host.endsWith(".pf.kakao.com")) {
          track("kakao_channel_click", { link_url: url.href, page_path: location.pathname });
        }
      }

      if (/\/(?:sarangbang-sharing|sunday-school-news|news)\.html$/i.test(location.pathname)) {
        const rowButton = event.target.closest && event.target.closest(".news-head");
        if (rowButton) {
          const row = rowButton.closest(".news-row");
          if (row) {
            track("post_select", {
              section: location.pathname.includes("sarangbang") ? "sarangbang" : location.pathname.includes("sunday-school") ? "sunday_school" : "church_news",
              post_action: row.classList.contains("open") ? "open" : "close"
            });
          }
        }
      }
    }, false);
  }

  initialize();
})();
