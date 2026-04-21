import { Terminal, CheckCircle2, XCircle } from "lucide-react";

function OutputPanel({ output }) {
  return (
    <div className="h-full bg-base-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-base-200/80 border-b border-base-content/10">
        <Terminal className="size-4 text-base-content/60" />
        <span className="font-semibold text-sm">Output</span>
        {output !== null && (
          <span className="ml-auto">
            {output.success ? (
              <CheckCircle2 className="size-4 text-success" />
            ) : (
              <XCircle className="size-4 text-error" />
            )}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {output === null ? (
          <div className="flex flex-col items-center justify-center h-full text-base-content/40">
            <Terminal className="size-8 mb-2" />
            <p className="text-sm">Click "Run Code" to see the output here...</p>
          </div>
        ) : output.success ? (
          <pre className="text-sm font-mono text-success whitespace-pre-wrap">{output.output}</pre>
        ) : (
          <div>
            {output.output && (
              <pre className="text-sm font-mono text-base-content whitespace-pre-wrap mb-3">
                {output.output}
              </pre>
            )}
            <pre className="text-sm font-mono text-error whitespace-pre-wrap">{output.error}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;
