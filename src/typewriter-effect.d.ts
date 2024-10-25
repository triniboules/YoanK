declare module 'typewriter-effect' {
    export default class Typewriter {
      constructor(element: HTMLElement, options?: { loop?: boolean; delay?: number });
      typeString(str: string): Typewriter;
      pauseFor(duration: number): Typewriter;
      deleteAll(): Typewriter;
      start(): void;
    }
  }
  