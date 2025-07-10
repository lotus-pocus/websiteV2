import type { ReactNode } from "react";

type SectionProps = {
  theme?: "light" | "dark";
  paddingClass?: string;
  id?: string;
  children: ReactNode;
};

const Section = ({ theme = "light", paddingClass = "py-20", id, children }: SectionProps) => {
  const bgClass = theme === "dark" ? "bg-black text-white" : "bg-white text-black";

  return (
    <section
      id={id}
      className={`${bgClass} ${paddingClass}`}
      data-theme={theme}
      style={{ marginTop: 0, paddingTop: 0 }}
    >
      {children}
    </section>
  );
};

export default Section;
