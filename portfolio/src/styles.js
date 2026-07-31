// Shared Tailwind class strings.
//
// Rule: exactly one colour utility per string. The previous version composed
// several (text-secondary + text-teal-300 + an invalid text-[91feff]) and let
// stylesheet source order pick the winner, which is how light mode silently
// broke. Colour now comes from a single token class.

const styles = {
  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-16 py-6",
  padding: "sm:px-16 px-6 sm:py-16 py-10",

  // Display face, large sizes only.
  heroHeadText:
    "font-display font-bold text-ink tracking-tightest lg:text-[86px] sm:text-[68px] xs:text-[52px] text-[40px] lg:leading-[0.94] leading-[1.02]",
  heroSubText:
    "font-sans text-muted lg:text-[19px] sm:text-[18px] text-[16px] leading-[1.65]",

  sectionHeadText:
    "font-display font-bold text-ink tracking-tightest md:text-[48px] sm:text-[40px] xs:text-[34px] text-[28px] leading-[1.05]",

  // Mono readout above every section head.
  sectionSubText: "readout",
};

export { styles };
