"use client";

import { useEffect, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark, a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useTheme } from "next-themes";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/src/shared/ui";
import { Loader } from "@/src/widgets/Loader";

import { MarkdownPreview } from "./mark-down-preview";

interface FunctionExplainModalProps {
  code?: string;
}

export default function FunctionExplainModal({ code }: FunctionExplainModalProps) {
  const { resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getExplanationByApi = async (code: string) => {
    setIsLoading(true);
    const result = await fetch("api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: code }),
    });
    const { text } = await result.json();
    setIsLoading(false);
    setExplanation(text);
  };

  useEffect(() => {
    if (!!code) {
      getExplanationByApi(code);
    }
  }, [code]);

  if (!code) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Show code</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] w-[90vw] max-h-[100vh]">
        <DialogHeader>
          <DialogTitle>Function code and explanation</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4 ">
          <div>
            <h3 className="text-lg font-semibold mb-2">Code</h3>
            <pre className="bg-white-800 dark:bg-gray-800 text-white rounded overflow-x-auto">
              <div className="rounded border p-4 max-h-[calc(50vh-92px)] overflow-y-scroll">
                <SyntaxHighlighter
                  language="solidity"
                  wrapLongLines
                  className="text-sm"
                  style={resolvedTheme === "dark" ? a11yDark : a11yLight}
                >
                  {code || ""}
                </SyntaxHighlighter>
              </div>
            </pre>
          </div>
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader size={32} />
            </div>
          ) : (
            <div>
              <TooltipProvider delayDuration={100}>
                <h3 className="text-lg font-semibold mb-2">
                  Explanation
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center text-[#E9D502] ml-2 text-[0.9em] cursor-pointer">
                        &#9888;
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        please note that AI code assistance is a reference tool <br />
                        and may not always provide complete or accurate explanations.
                        <br />
                        It is continuously improving but should not be fully relied upon.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </h3>
              </TooltipProvider>
              <div className="rounded border p-4 max-h-[calc(50vh-92px)] overflow-y-scroll">
                <MarkdownPreview markdown={explanation + explanation} />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
