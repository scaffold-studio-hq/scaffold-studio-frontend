import fs from "node:fs";
import path from "node:path";
import nextConfig from "../next.config";

describe("Next.js ESLint build enforcement (#45)", () => {
  it("disables eslint.ignoreDuringBuilds in next.config.ts so next build fails on lint errors", () => {
    expect(nextConfig.eslint?.ignoreDuringBuilds).toBe(false);
  });

  it("documents narrow rule exemptions with comments in .eslintrc.json", () => {
    const raw = fs.readFileSync(
      path.resolve(process.cwd(), ".eslintrc.json"),
      "utf8"
    );
    expect(raw).toContain('"tailwindcss/no-custom-classname": "off"');
    expect(raw).toContain('"tailwindcss/classnames-order": "off"');
  });

  it("runs non-mutating next lint on pull requests in .github/workflows/lint.yml", () => {
    const workflow = fs.readFileSync(
      path.resolve(process.cwd(), ".github/workflows/lint.yml"),
      "utf8"
    );
    expect(workflow).toContain("pull_request:");
    expect(workflow).toContain("pnpm exec next lint");
  });
});
