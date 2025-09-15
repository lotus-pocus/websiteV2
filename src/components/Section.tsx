import type { ReactNode, CSSProperties } from "react";

type SectionProps = {
  theme?: "light" | "dark";
  paddingClass?: string;
  id?: string;
  children: ReactNode;
  backgroundColor?: string; // from Directus
  textColor?: string;       // from Directus
};

const Section = ({
  theme = "light",
  paddingClass = "py-20",
  id,
  children,
  backgroundColor,
  textColor,
}: SectionProps) => {
  // Only apply default theme classes if no custom colors
  const defaultClass =
    !backgroundColor && !textColor
      ? theme === "dark"
        ? "bg-black text-white"
        : "bg-white text-black"
      : "";

  // Inline styles only for colors
  const style: CSSProperties = {
    ...(backgroundColor ? { backgroundColor } : {}),
    ...(textColor ? { color: textColor } : {}),
  };

  return (
    <section id={id} className={`${defaultClass} ${paddingClass}`} style={style}>
      {children}
    </section>
  );
};

export default Section;
