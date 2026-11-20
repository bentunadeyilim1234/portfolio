import type { ElementType, HTMLAttributes, Ref } from "react";

type GlassProps = HTMLAttributes<HTMLElement> & { as?: ElementType; ref?: Ref<HTMLElement> };

export function Glass({ as: Tag = "div", className, ...rest }: GlassProps) {
  return <Tag className={className ? `glass ${className}` : "glass"} {...rest} />;
}
