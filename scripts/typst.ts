import assert from "assert";
import { spawn } from "child_process";

/**
 * Executes a Typst process with the given arguments and optional stdin input.
 *
 * @example
 * ```typescript
 * const result = await typst(["compile", "main.typ"]);
 *
 * const { stdout, stderr } = await typst(
 *   ["compile", "-", "-", "--format=html", "--features=html"],
 *   { stdin: "#sys.version" },
 * );
 * const html = stdout.toString("utf-8");
 * ```
 */
export function typst(
  args: string[],
  { stdin }: { stdin?: string } = {},
): Promise<{ stdout: Buffer; stderr: string }> {
  return new Promise((resolve, reject) => {
    const proc = spawn("typst", args);
    if (stdin) {
      assert(proc.stdin !== null);
      proc.stdin.write(stdin);
      proc.stdin.end();
    }
    assert(proc.stdout !== null);
    assert(proc.stderr !== null);

    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    proc.stdout.on("data", (data) => {
      stdout.push(data);
    });
    proc.stderr.on("data", (data) => {
      stderr.push(data);
    });
    proc.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            [
              `Typst process exited with code ${code}`,
              stdin ? "```typst\n" + stdin + "\n```" : null,
              "```log\n" + Buffer.concat(stderr).toString("utf-8") + "\n```",
              `Args: typst ${args.join(" ")}`,
            ]
              .flatMap((x) => x)
              .join("\n"),
          ),
        );
      } else {
        resolve({
          stdout: Buffer.concat(stdout),
          stderr: Buffer.concat(stderr).toString("utf-8"),
        });
      }
    });
  });
}
