import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const srcRoot = path.join(projectRoot, "src");

const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]);
const RESOLVE_EXTENSIONS = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
  ".json",
  ".css",
  ".scss",
  ".sass",
  ".less",
];

function walkFiles(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, out);
      continue;
    }
    if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      out.push(fullPath);
    }
  }
  return out;
}

function extractSpecifiers(code) {
  const specs = [];
  const staticRe = /\b(?:import|export)\s+(?:[^"'`]*?\s+from\s+)?["']([^"']+)["']/g;
  const dynamicRe = /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;

  let match;
  while ((match = staticRe.exec(code)) !== null) {
    specs.push(match[1]);
  }
  while ((match = dynamicRe.exec(code)) !== null) {
    specs.push(match[1]);
  }
  return specs;
}

function checkPathCase(candidatePath) {
  const parsed = path.parse(candidatePath);
  const parts = candidatePath
    .slice(parsed.root.length)
    .split(/[\\/]+/)
    .filter(Boolean);

  let currentDir = parsed.root;
  const mismatches = [];

  for (const requestedPart of parts) {
    let entries;
    try {
      entries = fs.readdirSync(currentDir);
    } catch {
      return { exists: false, mismatches: [], resolvedPath: null };
    }

    const exact = entries.find((entry) => entry === requestedPart);
    if (exact) {
      currentDir = path.join(currentDir, exact);
      continue;
    }

    const caseInsensitive = entries.find(
      (entry) => entry.toLowerCase() === requestedPart.toLowerCase(),
    );
    if (!caseInsensitive) {
      return { exists: false, mismatches: [], resolvedPath: null };
    }

    mismatches.push({
      directory: currentDir,
      requested: requestedPart,
      actual: caseInsensitive,
    });
    currentDir = path.join(currentDir, caseInsensitive);
  }

  return { exists: true, mismatches, resolvedPath: currentDir };
}

function resolveImport(importerFile, specifier) {
  const base = path.resolve(path.dirname(importerFile), specifier);
  const candidates = [];
  const hasExt = path.extname(specifier).length > 0;

  if (hasExt) {
    candidates.push(base);
  } else {
    candidates.push(base);
    for (const ext of RESOLVE_EXTENSIONS) {
      candidates.push(base + ext);
    }
    for (const ext of RESOLVE_EXTENSIONS) {
      candidates.push(path.join(base, `index${ext}`));
    }
  }

  for (const candidate of candidates) {
    const check = checkPathCase(candidate);
    if (check.exists) {
      return { ...check, candidatePath: candidate };
    }
  }
  return null;
}

function toPosixRelative(filePath) {
  return path.relative(projectRoot, filePath).split(path.sep).join("/");
}

function run() {
  if (!fs.existsSync(srcRoot)) {
    console.error(`Folder not found: ${srcRoot}`);
    process.exit(1);
  }

  const files = walkFiles(srcRoot);
  const caseIssues = [];
  const unresolvedImports = [];

  for (const file of files) {
    const code = fs.readFileSync(file, "utf8");
    const specifiers = extractSpecifiers(code);

    for (const specifier of specifiers) {
      if (!specifier.startsWith(".")) continue;

      const resolved = resolveImport(file, specifier);
      if (!resolved) {
        unresolvedImports.push({
          importer: toPosixRelative(file),
          specifier,
        });
        continue;
      }

      if (resolved.mismatches.length > 0) {
        caseIssues.push({
          importer: toPosixRelative(file),
          specifier,
          resolvedPath: toPosixRelative(resolved.resolvedPath),
          mismatches: resolved.mismatches.map((m) => ({
            directory: toPosixRelative(m.directory),
            requested: m.requested,
            actual: m.actual,
          })),
        });
      }
    }
  }

  if (caseIssues.length === 0 && unresolvedImports.length === 0) {
    console.log("OK: no case-sensitive import issue found.");
    return;
  }

  if (caseIssues.length > 0) {
    console.error("\nCase mismatch detected in relative imports:");
    for (const issue of caseIssues) {
      console.error(`- ${issue.importer} -> "${issue.specifier}"`);
      for (const mismatch of issue.mismatches) {
        console.error(
          `  ${mismatch.directory}: requested "${mismatch.requested}", actual "${mismatch.actual}"`,
        );
      }
      console.error(`  resolves to: ${issue.resolvedPath}`);
    }
  }

  if (unresolvedImports.length > 0) {
    console.warn(
      "\nWarning: unresolved relative imports detected (not treated as case errors):",
    );
    for (const issue of unresolvedImports) {
      console.warn(`- ${issue.importer} -> "${issue.specifier}"`);
    }
  }

  if (caseIssues.length > 0) {
    process.exit(1);
  }

  console.log("\nOK: no case-sensitive import issue found.");
}

run();
