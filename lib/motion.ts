import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

// export function registerMotion(): void {
//   if (registered) return;
//   gsap.registerPlugin(ScrollTrigger, CustomEase, MorphSVGPlugin);
//   CustomEase.create("silk", "0.65, 0, 0.35, 1");
//   CustomEase.create("premiumOut", "0.16, 1, 0.3, 1");
//   CustomEase.create("popBack", "0.34, 1.56, 0.64, 1");
//   registered = true;
// }

export const BLOB_A =
  "M45.3,-59.1C58.3,-51.1,68.4,-36.7,72.6,-20.9C76.8,-5.1,75.1,12,68.5,26.6C61.9,41.2,50.4,53.3,36.4,61.5C22.4,69.7,5.9,74,-11.4,73.9C-28.7,73.8,-46.8,69.3,-58.5,58.4C-70.2,47.5,-75.5,30.2,-77.4,12.6C-79.3,-5,-77.8,-22.9,-69.6,-36.8C-61.4,-50.7,-46.5,-60.6,-31.5,-67.6C-16.5,-74.6,-1.4,-78.7,13.6,-76.7C28.6,-74.7,45.3,-66.6,45.3,-59.1Z";
export const BLOB_B =
  "M39.5,-51.7C52.6,-42.9,65.4,-32.4,69.6,-18.9C73.9,-5.4,69.6,11.1,61.2,24.8C52.8,38.5,40.3,49.3,26.1,56.4C11.9,63.5,-4,66.9,-19.2,63.6C-34.4,60.3,-48.9,50.3,-58.6,36.8C-68.3,23.3,-73.2,6.3,-70.9,-9.7C-68.6,-25.7,-59.1,-40.7,-46.1,-49.7C-33.1,-58.7,-16.6,-61.7,-1.2,-60.2C14.2,-58.7,28.4,-52.7,39.5,-51.7Z";
// near-perfect circle — the loader morphs here just before it floods the screen
export const BLOB_C =
  "M75,0C75,41.42,41.42,75,0,75C-41.42,75,-75,41.42,-75,0C-75,-41.42,-41.42,-75,0,-75C41.42,-75,75,-41.42,75,0Z";



  export function registerMotion(): void {
    if (registered) return;
    gsap.registerPlugin(ScrollTrigger, CustomEase, MorphSVGPlugin);
    CustomEase.create("silk", "0.65, 0, 0.35, 1");
    CustomEase.create("premiumOut", "0.16, 1, 0.3, 1");
    CustomEase.create("popBack", "0.34, 1.56, 0.64, 1");

    // symmetric expo — for the full-bleed cover/reveal sweep, deliberately
    // slower than premiumOut since it's moving a much larger mass on screen
    CustomEase.create("flow", "0.83, 0, 0.17, 1");
    // percentage counter — snappier out of the gate, settles instead of
    // decelerating mechanically like stock power2.out
    CustomEase.create("countUp", "0.45, 0, 0.2, 1");

    registered = true;
  }

  // Shared timing so the Loader and Hero never drift out of agreement.
  // All values in seconds.
  export const LOADER_TIMING = {
    countTo90: 1.7,
    countTo100: 0.32,
    labelExit: 0.35,
    morphToCircle: 0.45,
    coverScale: 0.85,
    coverHold: 0.12,
    fadeReveal: 0.5,
  } as const;

  // Fired the instant the blob fully covers the viewport — the one frame
  // where content behind the loader is guaranteed invisible. The hero
  // should treat this as "go", not "loading finished."
  export const LOADER_COVER_EVENT = "loader:cover";
  export const LOADER_DONE_EVENT = "loader:done";