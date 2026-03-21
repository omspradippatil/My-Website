declare module "gsap-trial/SplitText" {
  export interface SplitTextVars {
    type?: string;
    linesClass?: string;
    wordsClass?: string;
    charsClass?: string;
  }

  export class SplitText {
    chars: Element[];
    words: Element[];
    lines: Element[];

    constructor(
      target:
        | string
        | Element
        | Array<string | Element>
        | NodeListOf<Element>,
      vars?: SplitTextVars
    );

    revert(): void;
  }
}