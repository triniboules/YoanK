import { c as create_ssr_component, d as each, e as escape } from "./ssr.js";
/* empty css                                         */
const css = {
  code: ".bg.svelte-hxyf82{background-color:black;height:100%;width:100%;position:absolute;top:0;left:0;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:10px;overflow:hidden;z-index:-1}.star.svelte-hxyf82{border-radius:50%;background:white;position:absolute;opacity:var(--star-opacity);animation:svelte-hxyf82-fly-by linear infinite;transform-origin:center}@keyframes svelte-hxyf82-fly-by{0%{transform:translate(0, 0) scale(1);opacity:0.8}100%{transform:translate(var(--translateX), var(--translateY)) scale(2);opacity:0.2}}",
  map: '{"version":3,"file":"Background.svelte","sources":["Background.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { onMount } from \\"svelte\\";\\nlet baseStarsPerLayer = [];\\nlet speedFactors = [];\\nlet sizeRanges = [];\\nfunction calculateStarParameters() {\\n  const baseWidth = 1920;\\n  const baseHeight = 1080;\\n  const vw = window.innerWidth;\\n  const vh = window.innerHeight;\\n  const widthFactor = vw / baseWidth;\\n  const heightFactor = vh / baseHeight;\\n  const minFactor = Math.min(widthFactor, heightFactor);\\n  baseStarsPerLayer = baseStarsPerLayer.map((count) => Math.round(count * minFactor));\\n  speedFactors = [1, 1.5, 2, 0.5, 2.5, 3, 0].map((factor) => factor * minFactor);\\n  sizeRanges = [\\n    [0.5 * minFactor, 1.5 * minFactor],\\n    [1 * minFactor, 2 * minFactor],\\n    [1.5 * minFactor, 3 * minFactor],\\n    [0.5 * minFactor, 1 * minFactor],\\n    [0.5 * minFactor, 1.5 * minFactor],\\n    [0.5 * minFactor, 2 * minFactor],\\n    [1 * minFactor, 3 * minFactor]\\n  ];\\n}\\nfunction generateStars(count, speedFactor, sizeRange, opacityRange) {\\n  const stars = [];\\n  for (let i = 0; i < count; i++) {\\n    const left = Math.random() * 100;\\n    const top = Math.random() * 100;\\n    const directionX = (left - 50) * speedFactor;\\n    const directionY = (top - 50) * speedFactor;\\n    const initialSize = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];\\n    stars.push({\\n      left,\\n      top,\\n      size: `${initialSize}px`,\\n      animationDuration: `${(Math.random() * 2 + 2) / speedFactor}s`,\\n      translateX: `${directionX}vw`,\\n      translateY: `${directionY}vh`,\\n      opacity: `${Math.random() * (opacityRange[1] - opacityRange[0]) + opacityRange[0]}`\\n    });\\n  }\\n  return stars;\\n}\\nlet layers = [];\\nonMount(() => {\\n  baseStarsPerLayer = [100, 50, 30, 70, 20, 10, 5];\\n  calculateStarParameters();\\n  layers = baseStarsPerLayer.map((count, index) => {\\n    return generateStars(count, speedFactors[index], sizeRanges[index], [0.5, 1]);\\n  });\\n});\\n<\/script>\\r\\n\\r\\n<style>\\r\\n    .bg {\\r\\n        background-color: black; /* Solid black background */\\r\\n        height: 100%; /* Use parent\'s height */\\r\\n        width: 100%; /* Use parent\'s width */\\r\\n        position: absolute; /* Position absolute to fit parent */\\r\\n        top: 0;\\r\\n        left: 0;\\r\\n        display: flex; /* Flexbox to align stars */\\r\\n        flex-wrap: wrap; /* Allow stars to wrap */\\r\\n        justify-content: center; /* Center the stars */\\r\\n        align-items: center; /* Center the stars vertically */\\r\\n        gap: 10px; /* 10px gap between stars */\\r\\n        overflow: hidden; /* Prevent overflow */\\r\\n        z-index: -1; /* Behind everything */\\r\\n    }\\r\\n\\r\\n    .star {\\r\\n        border-radius: 50%;\\r\\n        background: white; /* White stars */\\r\\n        position: absolute;\\r\\n        opacity: var(--star-opacity);\\r\\n        animation: fly-by linear infinite; /* Apply animation */\\r\\n        transform-origin: center; /* For scaling effect */\\r\\n    }\\r\\n\\r\\n    @keyframes fly-by {\\r\\n        0% {\\r\\n            transform: translate(0, 0) scale(1);\\r\\n            opacity: 0.8;\\r\\n        }\\r\\n        100% {\\r\\n            transform: translate(var(--translateX), var(--translateY)) scale(2);\\r\\n            opacity: 0.2;\\r\\n        }\\r\\n    }\\r\\n</style>\\r\\n\\r\\n<div class=\\"bg\\">\\r\\n    {#each layers as layer}\\r\\n        {#each layer as star}\\r\\n            <div \\r\\n                class=\\"star\\" \\r\\n                style=\\"left: {star.left}vw; top: {star.top}vh; \\r\\n                       height: {star.size}; width: {star.size}; \\r\\n                       animation-duration: {star.animationDuration}; \\r\\n                       --translateX: {star.translateX}; \\r\\n                       --translateY: {star.translateY}; \\r\\n                       --star-opacity: {star.opacity};\\">\\r\\n            </div>\\r\\n        {/each}\\r\\n    {/each}\\r\\n</div>\\r\\n"],"names":[],"mappings":"AAuDI,iBAAI,CACA,gBAAgB,CAAE,KAAK,CACvB,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,IAAI,CACf,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,GAAG,CAAE,IAAI,CACT,QAAQ,CAAE,MAAM,CAChB,OAAO,CAAE,EACb,CAEA,mBAAM,CACF,aAAa,CAAE,GAAG,CAClB,UAAU,CAAE,KAAK,CACjB,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,IAAI,cAAc,CAAC,CAC5B,SAAS,CAAE,oBAAM,CAAC,MAAM,CAAC,QAAQ,CACjC,gBAAgB,CAAE,MACtB,CAEA,WAAW,oBAAO,CACd,EAAG,CACC,SAAS,CAAE,UAAU,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CACnC,OAAO,CAAE,GACb,CACA,IAAK,CACD,SAAS,CAAE,UAAU,IAAI,YAAY,CAAC,CAAC,CAAC,IAAI,YAAY,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CACnE,OAAO,CAAE,GACb,CACJ"}'
};
const Background = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let layers = [];
  $$result.css.add(css);
  return `<div class="bg svelte-hxyf82">${each(layers, (layer) => {
    return `${each(layer, (star) => {
      return `<div class="star svelte-hxyf82" style="${"left: " + escape(star.left, true) + "vw; top: " + escape(star.top, true) + "vh; height: " + escape(star.size, true) + "; width: " + escape(star.size, true) + "; animation-duration: " + escape(star.animationDuration, true) + "; --translateX: " + escape(star.translateX, true) + "; --translateY: " + escape(star.translateY, true) + "; --star-opacity: " + escape(star.opacity, true) + ";"}"></div>`;
    })}`;
  })}</div>`;
});
export {
  Background as B
};
