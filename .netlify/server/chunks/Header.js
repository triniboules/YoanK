import { c as create_ssr_component } from "./ssr.js";
import { v4 } from "uuid";
/* empty css                                     */
import "./firebase.js";
/* empty css                                         */
const css = {
  code: ".header.svelte-1eqtui9.svelte-1eqtui9{display:flex;justify-content:space-between;align-items:center;padding:0px 3%;background:rgba(0, 0, 0, 0.29);height:68px;position:relative;z-index:1}.logo-left.svelte-1eqtui9.svelte-1eqtui9{flex:1}.logo-center.svelte-1eqtui9.svelte-1eqtui9{position:absolute;left:50%;transform:translateX(-50%)}.logo-button.svelte-1eqtui9.svelte-1eqtui9,.logo-center-button.svelte-1eqtui9.svelte-1eqtui9,.contact-button.svelte-1eqtui9.svelte-1eqtui9{background:none;border:none;padding:0;cursor:pointer}.contact-button.svelte-1eqtui9 img.svelte-1eqtui9{height:30px}.logo-left.svelte-1eqtui9 img.svelte-1eqtui9,.logo-center.svelte-1eqtui9 img.svelte-1eqtui9{height:60px}@media(max-width: 1200px){.logo-center.svelte-1eqtui9.svelte-1eqtui9{display:none}}@media(max-width: 800px){.contact.svelte-1eqtui9.svelte-1eqtui9,.logo-center.svelte-1eqtui9.svelte-1eqtui9{display:none}.header.svelte-1eqtui9.svelte-1eqtui9{justify-content:space-around}}",
  map: '{"version":3,"file":"Header.svelte","sources":["Header.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { v4 as uuidv4 } from \\"uuid\\";\\nimport Contact from \\"../components/Contact.svelte\\";\\nimport { db, Timestamp, setDoc, doc, arrayUnion } from \\"../components/firebase\\";\\nimport Background from \\"../components/Background.svelte\\";\\nlet showContact = false;\\nconst hasLocalStorage = typeof localStorage !== \\"undefined\\";\\nlet userId = hasLocalStorage ? localStorage.getItem(\\"userId\\") : null;\\nif (!userId) {\\n  userId = uuidv4();\\n  if (hasLocalStorage) {\\n    localStorage.setItem(\\"userId\\", userId);\\n  }\\n}\\nconst openContact = () => showContact = true;\\nconst closeContact = () => showContact = false;\\nconst refreshPage = () => window.location.reload();\\nconst handleLogoClick = async (logoPosition) => {\\n  try {\\n    const logoRef = doc(db, \\"header\\", logoPosition);\\n    const clickTimestamp = Timestamp.now();\\n    await setDoc(logoRef, { clicks: arrayUnion({ userId, timestamp: clickTimestamp }) }, { merge: true });\\n    console.log(`Click recorded for ${logoPosition} logo`);\\n  } catch (error) {\\n    console.error(`Error recording click for ${logoPosition} logo:`, error);\\n  }\\n};\\nconst handleContactClick = async () => {\\n  await handleLogoClick(\\"contact\\");\\n  openContact();\\n};\\nconst handleLeftLogoClick = () => handleContactClick();\\nconst handleCenterLogoClick = async () => {\\n  await handleLogoClick(\\"logoCenter\\");\\n  refreshPage();\\n};\\n<\/script>\\n\\n\\n<header class=\\"header\\">\\n  <div class=\\"logo-left\\">\\n      <button class=\\"logo-button\\" on:click={handleLeftLogoClick} aria-label=\\"Open Contact\\">\\n          <img src=\\"/image/NOM.webp\\" alt=\\"Logo Left\\" />\\n      </button>\\n  </div>\\n  <div class=\\"logo-center\\">\\n      <button class=\\"logo-center-button\\" on:click={handleCenterLogoClick} aria-label=\\"Refresh Page\\">\\n          <img src=\\"/image/logo.webp\\" alt=\\"Logo Center\\" />\\n      </button>\\n  </div>\\n  <div class=\\"contact\\">\\n      <button class=\\"contact-button\\" on:click={handleContactClick} aria-label=\\"Contact\\">\\n          <img src=\\"/image/contact.webp\\" alt=\\"Contact\\" />\\n      </button>\\n  </div>\\n</header>\\n\\n{#if showContact}\\n<Contact close={closeContact} />\\n{/if}\\n\\n<style>\\n.header {\\n  display: flex;\\n  justify-content: space-between;\\n  align-items: center;\\n  padding: 0px 3%;\\n  background: rgba(0, 0, 0, 0.29);\\n  height: 68px;\\n  position: relative;\\n  z-index: 1;\\n}\\n\\n.logo-left {\\n  flex: 1; /* Takes equal space on both sides */\\n}\\n\\n.logo-center {\\n  position: absolute;\\n  left: 50%;\\n  transform: translateX(-50%); /* Ensures the logo stays centered */\\n}\\n\\n.logo-button,\\n.logo-center-button,\\n.contact-button {\\n  background: none;\\n  border: none;\\n  padding: 0;\\n  cursor: pointer;\\n}\\n\\n.contact-button img {\\n  height: 30px;\\n}\\n\\n.logo-left img,\\n.logo-center img {\\n  height: 60px;\\n}\\n\\n@media (max-width: 1200px) {\\n  .logo-center {\\n    display: none; /* Hides center logo on smaller screens */\\n  }\\n}\\n\\n@media (max-width: 800px) {\\n  .contact, \\n  .logo-center {\\n    display: none; /* Hides contact and center logo on small screens */\\n  }\\n  .header {\\n    justify-content: space-around; /* Re-distribute items on small screens */\\n  }\\n}\\n\\n</style>\\n"],"names":[],"mappings":"AA6DA,qCAAQ,CACN,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,aAAa,CAC9B,WAAW,CAAE,MAAM,CACnB,OAAO,CAAE,GAAG,CAAC,EAAE,CACf,UAAU,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAC/B,MAAM,CAAE,IAAI,CACZ,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,CACX,CAEA,wCAAW,CACT,IAAI,CAAE,CACR,CAEA,0CAAa,CACX,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,GAAG,CACT,SAAS,CAAE,WAAW,IAAI,CAC5B,CAEA,0CAAY,CACZ,iDAAmB,CACnB,6CAAgB,CACd,UAAU,CAAE,IAAI,CAChB,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,CAAC,CACV,MAAM,CAAE,OACV,CAEA,8BAAe,CAAC,kBAAI,CAClB,MAAM,CAAE,IACV,CAEA,yBAAU,CAAC,kBAAG,CACd,2BAAY,CAAC,kBAAI,CACf,MAAM,CAAE,IACV,CAEA,MAAO,YAAY,MAAM,CAAE,CACzB,0CAAa,CACX,OAAO,CAAE,IACX,CACF,CAEA,MAAO,YAAY,KAAK,CAAE,CACxB,sCAAQ,CACR,0CAAa,CACX,OAAO,CAAE,IACX,CACA,qCAAQ,CACN,eAAe,CAAE,YACnB,CACF"}'
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const hasLocalStorage = typeof localStorage !== "undefined";
  let userId = hasLocalStorage ? localStorage.getItem("userId") : null;
  if (!userId) {
    userId = v4();
    if (hasLocalStorage) {
      localStorage.setItem("userId", userId);
    }
  }
  $$result.css.add(css);
  return `<header class="header svelte-1eqtui9"><div class="logo-left svelte-1eqtui9"><button class="logo-button svelte-1eqtui9" aria-label="Open Contact" data-svelte-h="svelte-11qiy08"><img src="/image/NOM.webp" alt="Logo Left" class="svelte-1eqtui9"></button></div> <div class="logo-center svelte-1eqtui9"><button class="logo-center-button svelte-1eqtui9" aria-label="Refresh Page" data-svelte-h="svelte-l8hb4z"><img src="/image/logo.webp" alt="Logo Center" class="svelte-1eqtui9"></button></div> <div class="contact svelte-1eqtui9"><button class="contact-button svelte-1eqtui9" aria-label="Contact" data-svelte-h="svelte-3aukil"><img src="/image/contact.webp" alt="Contact" class="svelte-1eqtui9"></button></div></header> ${``}`;
});
export {
  Header as default
};
