import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "../CodeBlock";
import type { Snippet } from "./snippets";

interface Props {
  snippet: Snippet;
}

export const SnippetTabs = ({ snippet }: Props) => {
  const [tab, setTab] = useState<string>("curl");
  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="grid w-full max-w-sm grid-cols-3">
        <TabsTrigger value="curl">curl</TabsTrigger>
        <TabsTrigger value="js">JavaScript</TabsTrigger>
        <TabsTrigger value="python">Python</TabsTrigger>
      </TabsList>
      <TabsContent value="curl" className="mt-2">
        <CodeBlock code={snippet.curl} language="bash" />
      </TabsContent>
      <TabsContent value="js" className="mt-2">
        <CodeBlock code={snippet.js} language="javascript" />
      </TabsContent>
      <TabsContent value="python" className="mt-2">
        <CodeBlock code={snippet.python} language="python" />
      </TabsContent>
    </Tabs>
  );
};
