import type { ElementType, HTMLAttributes } from "react";

type GlassProps = HTMLAttributes<HTMLElement> & { as?: ElementType };

export function Glass({ as: Tag = "div", className, ...rest }: GlassProps) {
  return <Tag className={className ? `glass ${className}` : "glass"} {...rest} />;
}
