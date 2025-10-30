(function AEMComponentScannerUI() {
  // --- Pre-approved list of components ---
  const approvedComponents = new Set([
    "/apps/global/components/globalcomponents/tags/v1/tags",
    "/apps/global/components/globalcomponents/navigation/globallinks/v1/globallinks/link",
    "/apps/global/components/globalcomponents/gdsvideo/v1/gdsvideo",
    "/apps/global/components/globalcomponents/teaser/v4/teasercontentblock",
    "/apps/global/components/globalcomponents/teaser/v5/teaser",
    "/apps/global/components/globalcomponents/section-container/v1/section-container",
    "/apps/global/components/globalcomponents/astellas-registration/change-password/v1/change-password",
    "/apps/global/components/globalcomponents/astellas-registration/email-confirmation/v1/email-confirmation",
    "/apps/global/components/globalcomponents/astellas-registration/login/v1/login",
    "/apps/global/components/globalcomponents/astellas-registration/consent/v1/consent",
    "/apps/global/components/globalcomponents/astellas-registration/forgotpassword/v1/forgotpassword",
    "/apps/global/components/globalcomponents/astellas-registration/selfregister/v2/editprofile",
    "/apps/global/components/globalcomponents/astellas-registration/selfregister/v1/selfregister",
    "/apps/global/components/globalcomponents/code-embed/v2/code-embed",
    "/apps/global/components/globalcomponents/image/v3/image",
    "/apps/global/components/globalcomponents/navigation/global-link/v1/global-link/link",
    "/apps/global/components/globalcomponents/image/v4/image",
    "/apps/global/components/globalcomponents/stayuptodate/v1/stayuptodate",
    "/apps/global/components/globalcomponents/astellas-gating/astellasgating/v1/astellas-gating",
    "/apps/global/components/globalcomponents/astellas-gating/text/v1/text",
    "/apps/global/components/globalcomponents/navigation/global-nav/v1/global-nav/link",
    "/apps/global/components/globalcomponents/global-nav/v1/global-nav/link",
    "/apps/global/components/globalcomponents/text/v1/text",
    "/apps/global/components/globalcomponents/astellas-gating/select/v1/select",
    "/apps/global/components/globalcomponents/astellas-gating/hiddenfield/v1/hiddenfield",
    "/apps/global/components/globalcomponents/card/v1/card",
    "/apps/global/components/globalcomponents/dit-search/v1/dit-search",
    "/apps/global/components/globalcomponents/illustrationset/v1/illustrationset",
    "/apps/global/components/globalcomponents/card-offset/v1/card-offset",
    "/apps/global/components/globalcomponents/illustration-container/v1/illustration-container",
    "/apps/global/components/globalcomponents/heros/hero2/v1/hero2",
    "/apps/global/components/globalcomponents/heros/hero3/v1/hero3",
    "/apps/global/components/globalcomponents/heros/hero1/v1/hero1",
    "/apps/global/components/globalcomponents/accordion/v1.1/accordion",
    "/apps/global/components/globalcomponents/search/v2/sitewide-search",
    "/apps/global/components/globalcomponents/chip/v2/chipset",
    "/apps/global/components/globalcomponents/chip/v1/chip",
    "/apps/global/components/globalcomponents/toggle/v1/toggle",
    "/apps/global/components/globalcomponents/thumbs-up-down/v1/thumbs-up-down",
    "/apps/global/components/globalcomponents/cardset/v1/cardset",
    "/apps/global/components/globalcomponents/languagecontainer/v1/language-Container",
    "/apps/global/components/globalcomponents/buttongraphic-set/v1/buttongraphic-set",
    "/apps/global/components/globalcomponents/search-results-header/v1/search-results-header",
    "/apps/global/components/globalcomponents/gdsmodal/v2/extendedmodal",
    "/apps/global/components/globalcomponents/gdsmodal/v1/gdsmodal",
    "/apps/global/components/globalcomponents/legend/v1/legend",
    "/apps/global/components/globalcomponents/star-ratings/v1/star-ratings",
    "/apps/global/components/globalcomponents/searchResult/v2/searchResult",
    "/apps/global/components/globalcomponents/staingallery",
    "/apps/global/components/globalcomponents/carousel/v3/carousel",
    "/apps/global/components/globalcomponents/custom-form-components/customphonenumberdropdown",
    "/apps/global/components/globalcomponents/custom-form-components/custom-text-area",
    "/apps/global/components/globalcomponents/custom-form-components/astellas-singleselect-dropdown",
    "/apps/global/components/globalcomponents/custom-form-components/guidemultiselectdropdownlist",
    "/apps/global/components/globalcomponents/navigation/jump-links/v1/secondary-jumplinks",
    "/apps/global/components/globalcomponents/navigation/secondary-menu-container/v1/secondary-menu-container",
    "/apps/global/components/globalcomponents/navigation/global-link/v1/global-link",
    "/apps/global/components/globalcomponents/navigation/secondary-nav/v1/secondary-nav",
    "/apps/global/components/globalcomponents/navigation/job-code/v1/job-code",
    "/apps/global/components/globalcomponents/navigation/anchor-links/v2/anchor-links-alphabet",
    "/apps/global/components/globalcomponents/navigation/anchor-links/v1/anchor-links",
    "/apps/global/components/globalcomponents/navigation/global-nav/v3/global-nav",
    "/apps/global/components/globalcomponents/navigation/global-nav/v1/global-nav",
    "/apps/global/components/globalcomponents/panelcontainer/v1/panelcontainer",
    "/apps/global/components/globalcomponents/button-graphic/v1/button-graphic",
    "/apps/global/components/globalcomponents/astellas-isi/v1/astellas-isi",
    "/apps/global/components/globalcomponents/breadcrumb/v3/breadcrumb",
    "/apps/global/components/globalcomponents/oauth-api-config/v1/oauth-api-config",
    "/apps/global/components/globalcomponents/tagcallout/v1/tagcallout",
    "/apps/global/components/globalcomponents/quiz/quiz-question/v1/quiz-question",
    "/apps/global/components/globalcomponents/quiz/quiz-container/v1/quiz-container",
  ]);

  // --- Storage for scanned components ---
  const results = new Map(); // componentName -> { count, exampleEls: [] }

  function normalizeName(name) {
    if (!name) return "";
    name = String(name).trim();

    // Ignore .js and .css files from page body
    if (/\.(js|css)(\?|$)/i.test(name)) return "";

    // ensure it starts with /apps or /libs
    if (!name.startsWith("/")) {
      if (name.startsWith("apps/") || name.startsWith("libs/")) {
        name = "/" + name;
      } else if (name.includes("components/")) {
        name = "/apps/" + name.replace(/^.*?(components\/)/, "global/components/");
      }
    }
    return name;
  }

  function addComponent(name, el) {
    name = normalizeName(name);
    if (!name) return;

    let item = results.get(name);
    if (!item) {
      item = { count: 0, exampleEls: [] };
      results.set(name, item);
    }
    item.count++;
    if (item.exampleEls.length < 3 && el) item.exampleEls.push(el);
  }

  // --- Scan element attributes ---
  function scanElementAttributes(el) {
    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      if (!attr || !attr.value) continue;
      const av = attr.value;

      if (attr.name.toLowerCase() === "data-resource-type") {
        addComponent(av, el);
      }

      const mResource = av.match(/(\/libs\/[^\s"'<>]+|\/apps\/[^\s"'<>]+|[^\s"'<>]*components\/[^\s"'<>]+)/i);
      if (mResource) addComponent(mResource[0], el);

      const mRT = av.match(/resourceType\s*[:=]\s*['"]?([^'"\s>]+)/i);
      if (mRT) addComponent(mRT[1], el);
    }
  }

  // --- Scan DOM elements ---
  const all = document.getElementsByTagName('*');
  for (let i = 0; i < all.length; i++) scanElementAttributes(all[i]);

  // --- Scan scripts ---
  document.querySelectorAll('script').forEach(script => {
    const txt = script.textContent || '';
    let m;
    const reRT = /["'](?:sling:)?resourceType["']\s*[:=]\s*["']([^"']+)["']/ig;
    while ((m = reRT.exec(txt))) addComponent(m[1], script);
  });

  // --- Scan comments ---
  try {
    const walker = document.createTreeWalker(document, NodeFilter.SHOW_COMMENT, null, false);
    while (walker.nextNode()) {
      const c = walker.currentNode.nodeValue || '';
      const mRT = c.match(/resourceType\s*[:=]?\s*['"]?([^'"\s>]+)/i);
      if (mRT) addComponent(mRT[1], walker.currentNode);

      const mPath = c.match(/(\/libs\/[^\s"'<>]+|\/apps\/[^\s"'<>]+|[^\s"'<>]*components\/[^\s"'<>]+)/i);
      if (mPath) addComponent(mPath[1], walker.currentNode);
    }
  } catch (e) { }

  // --- Prepare final list of components used---
  const componentList = Array.from(results.entries())
    .map(([name, data]) => ({
      name,
      count: data.count,
      examples: data.exampleEls
    }))
    .sort((a, b) => b.count - a.count);

  // --- Remove existing popup ---
  const old = document.getElementById("aem-component-list-ui");
  if (old) old.remove();

  // --- Create overlay ---
  const box = document.createElement("div");
  box.id = "aem-component-list-ui";
  box.style.cssText = `
    position:fixed; top:20px; right:20px;
    width:520px; max-height:75vh; overflow:auto;
    background:#fff; border-radius:10px; box-shadow:0 4px 20px rgba(0,0,0,0.25);
    border:1px solid #ccc; font-family:system-ui,Arial,sans-serif;
    z-index:2147483647;`;

  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;
                padding:12px 16px;background:#f5f5f5;border-bottom:1px solid #ddd;
                border-radius:10px 10px 0 0;">
      <strong>AEM Components (${componentList.length})</strong>
      <div>
        <button id="aem-copy-btn" style="border:none;background:#3498db;color:#fff;
               padding:5px 10px;margin-right:6px;border-radius:4px;cursor:pointer;">Copy</button>
        <button id="aem-excel-btn" style="border:none;background:#27ae60;color:#fff;
               padding:5px 10px;margin-right:6px;border-radius:4px;cursor:pointer;">Export Excel</button>
        <button id="aem-close-btn" style="border:none;background:#e74c3c;color:#fff;
               padding:5px 10px;border-radius:4px;cursor:pointer;">✕</button>
      </div>
    </div>
    <div style="padding:12px;">
      <ul id="aem-list" style="margin:0;padding:0;list-style:none;font-size:13px;line-height:1.5;">
        ${componentList.map(cmp => {
    const isApproved = approvedComponents.has(cmp.name);
    return `<li style="padding:6px 8px;border-bottom:1px solid #eee;
                  font-family:monospace;color:${isApproved ? '#000' : 'red'};">
                  ${cmp.name} (${cmp.count})
                  </li>`;
  }).join('')}
      </ul>
    </div>
  `;

  document.body.appendChild(box);

  // --- Close button ---
  document.getElementById("aem-close-btn").addEventListener("click", () => box.remove());
  // --- copy button ---
  document.getElementById("aem-copy-btn").addEventListener("click", () => {
    const text = componentList.map(cmp => cmp.name + ' (' + cmp.count + ')').join("\n");
    navigator.clipboard.writeText(text).then(() => alert("✅ Component list copied!"));
  });

  // --- Export Excel in .csv format---
  document.getElementById("aem-excel-btn").addEventListener("click", () => {
    const rows = [["Component Name", "Count", "Approved"]];
    componentList.forEach(cmp => {
      const approved = approvedComponents.has(cmp.name) ? "Yes" : "No";
      rows.push([cmp.name, cmp.count, approved]);
    });
    // Downloadin Excel sheet 
    const csvContent = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "AEM_Components_List.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // --- Log on console of browser---
  console.log("✅ AEM Components found:");
  componentList.forEach(cmp => {
    const logColor = approvedComponents.has(cmp.name) ? "color:black;" : "color:red;"; // style for component names if unapproved component is used
    console.log("%c" + cmp.name + ` (${cmp.count})`, logColor); // this statement will log data in console same as overlay
  });

  // --- Global exposure ---
  window.__AEM_COMPONENT_LIST = componentList;

})();