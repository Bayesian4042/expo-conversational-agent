import React from "react";
import Markdown from "react-native-markdown-display";
import {
  H1 as ExpoH1,
  H2 as ExpoH2,
  H3 as ExpoH3,
  H4 as ExpoH4,
  H5 as ExpoH5,
  H6 as ExpoH6,
  Code as ExpoCode,
  Pre as ExpoPre,
  UL as ExpoUl,
  LI as ExpoLI,
  Strong as ExpoStrong,
  A as ExpoA,
  P as ExpoP,
  Div as ExpoDiv,
} from "@expo/html-elements";
import { cssInterop } from "nativewind";

const H1 = cssInterop(ExpoH1, { className: "style" });
const H2 = cssInterop(ExpoH2, { className: "style" });
const H3 = cssInterop(ExpoH3, { className: "style" });
const H4 = cssInterop(ExpoH4, { className: "style" });
const H5 = cssInterop(ExpoH5, { className: "style" });
const H6 = cssInterop(ExpoH6, { className: "style" });
const Code = cssInterop(ExpoCode, { className: "style" });
const Pre = cssInterop(ExpoPre, { className: "style" });
const Ol = cssInterop(ExpoUl, { className: "style" });
const Ul = cssInterop(ExpoUl, { className: "style" });
const Li = cssInterop(ExpoLI, { className: "style" });
const Strong = cssInterop(ExpoStrong, { className: "style" });
const A = cssInterop(ExpoA, { className: "style" });
const P = cssInterop(ExpoP, { className: "style" });
const Div = cssInterop(ExpoDiv, { className: "style" });

const rules = {
  heading1: (node, children) => (
    <H4 key={node.key} className="mb-4 mt-4 font-bold">{children}</H4>
  ),
  heading2: (node, children) => (
    <H4 key={node.key} className="mb-4 mt-4 font-bold">{children}</H4>
  ),
  heading3: (node, children) => (
    <P key={node.key} className="mb-2 mt-2 font-bold">{children}</P>
  ),
  heading4: (node, children) => (
    <P key={node.key} className="mb-2 mt-2 font-bold">{children}</P>
  ),
  heading5: (node, children) => (
    <P key={node.key} className="mb-2 mt-2 font-bold">{children}</P>
  ),
  heading6: (node, children) => (
    <P key={node.key} className="mb-2 mt-2 font-bold">{children}</P>
  ),
  code: (node, children, parent) => {
    return parent.length > 1 ? (
      <Pre key={node.key} className="mt-2 w-[80dvw] overflow-x-scroll rounded-lg bg-zinc-100 p-3 text-sm dark:bg-zinc-800 md:max-w-[500px]">
        <Code>{children}</Code>
      </Pre>
    ) : (
      <Code key={node.key} className="rounded-md bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800">
        {children}
      </Code>
    );
  },
  list_item: (node, children) => <Li key={node.key} className="py-1">{children}</Li>,
  ordered_list: (node, children) => (
    <Ol key={node.key} className="ml-4 list-outside list-decimal">{children}</Ol>
  ),
  unordered_list: (node, children) => (
    <Ul key={node.key} className="ml-4 list-outside list-decimal">{children}</Ul>
  ),
  strong: (node, children) => (
    <Strong key={node.key} className="font-semibold">{children}</Strong>
  ),
  link: (node, children) => (
    <A
      key={node.key}
      className="text-blue-500 hover:underline"
      target="_blank"
      rel="noreferrer"
      href={node.attributes.href}
    >
      {children}
    </A>
  ),
  text: (node) => {
    return node.content;
  },
  body: (node, children) => {
    return <Div key={node.key} className="">{children}</Div>;
  },
};

export const CustomMarkdown = React.memo(({ content }: { content: string }) => {
  return <Markdown rules={rules}>{content}</Markdown>;
});
