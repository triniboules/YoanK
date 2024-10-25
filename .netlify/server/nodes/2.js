import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.CIRSmPhE.js","_app/immutable/chunks/2.Nc_UTeo9.js","_app/immutable/chunks/preload-helper.C1FmrZbK.js","_app/immutable/chunks/scheduler.a0R-6sdq.js","_app/immutable/chunks/index.DSQAGmCZ.js","_app/immutable/chunks/firebase.CyE7Crvn.js"];
export const stylesheets = ["_app/immutable/assets/2.BfBKDg2P.css","_app/immutable/assets/Header.DD9hUhuh.css","_app/immutable/assets/Background.vju1FoEr.css","_app/immutable/assets/VideoGrid.DN1IEsML.css"];
export const fonts = [];
