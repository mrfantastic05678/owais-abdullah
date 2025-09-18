import {
  PortableTextBlock,
  PortableTextMarkDefinition,
  PortableTextSpan,
} from "@portabletext/types";
import { ReactNode } from "react";

export interface PortableTextComponentProps<T = PortableTextBlock> {
  value: T;
  children: ReactNode;
  isInline?: boolean;
  renderNode?: (node: T) => ReactNode;
}

export type CustomBlockComponentProps = PortableTextComponentProps<
  PortableTextBlock<PortableTextMarkDefinition, PortableTextSpan>
>;