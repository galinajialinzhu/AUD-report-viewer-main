"use client";

import { useEffect, useState, type ReactNode } from "react";
import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import { useMDXComponents } from "./mdx-components";

interface MDXRendererProps {
  source: string;
}

export function MDXRenderer({ source }: MDXRendererProps) {
  const [content, setContent] = useState<ReactNode>(null);
  const [error, setError] = useState<string | null>(null);
  const components = useMDXComponents({});

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { default: MDXContent } = await evaluate(source, {
          ...runtime,
          Fragment: runtime.Fragment ?? (runtime as Record<string, unknown>).Fragment,
          useMDXComponents: () => components,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
        if (!cancelled) setContent(<MDXContent />);
      } catch (e) {
        if (!cancelled) setError(String(e));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [source]);

  if (error) {
    return (
      <div className="rounded-xl border border-report-red/20 bg-report-red-bg p-6">
        <h2 className="text-[15px] font-bold text-report-red mb-2">
          MDX Compilation Error
        </h2>
        <pre className="text-[12px] text-report-text-secondary whitespace-pre-wrap font-mono">
          {error}
        </pre>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-[13px] text-report-text-tertiary animate-pulse">
          Rendering report&hellip;
        </div>
      </div>
    );
  }

  return <div className="report-content">{content}</div>;
}
