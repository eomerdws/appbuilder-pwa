import { createHash } from "crypto";
import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "fs";
import { basename, extname, join, posix } from "path";
import { a } from "vitest/dist/chunks/suite.d.FvehnV49";

export type FileSrcDest = {
  dir: boolean;
  src: string;
  dest: string;
};

export function getHashedName(dataDir: string, src: string) {
  const fullPath = join(dataDir, src);
  try {
    if (existsSync(fullPath)) {
      return getHashedNameFromContents(String(readFileSync(fullPath)), src);
    } else {
      console.warn(`Could not locate ${src}`);
      return "";
    }
  } catch (e) {
    console.error(`Error when reading ${fullPath}:\n${e}`);
    return "";
  }
}

export function getFilesRecursively(
  dataDir: string,
  src: string,
  recursiveDir: string = "",
): FileSrcDest[] {
  const fullPath = join(dataDir, src);
  let files: any[] = [];
  const returnFiles: FileSrcDest[] = [];

  const recursive: boolean = recursiveDir !== undefined || recursiveDir !== "";
  if (src === "audio") {
    console.warn(fullPath);
    console.log(recursiveDir);
  }

  try {
    if (existsSync(fullPath)) {
      files = readdirSync(fullPath);
      for (const file of files) {
        const stats = statSync(join(fullPath, file));

        let dest: string;
        if (recursive) {
          dest = stats.isFile() ? getHashedName(fullPath, file) : join(recursiveDir, file);
        } else {
          dest = stats.isFile() ? getHashedName(fullPath, file) : file;
        }

        const f: FileSrcDest = {
          dir: stats.isDirectory(),
          src: recursive ? join(recursiveDir, file) : file,
          dest: dest,
        };

        returnFiles.push(f);

        if (stats.isDirectory()) {
          getFilesRecursively(fullPath, file, file);
        }
      }
      return returnFiles;
    } else {
      console.warn(`Could not locate ${src}, full path: ${fullPath}`);
    }
  } catch (e) {
    console.error(`Error when reading ${fullPath}:\n${e}`);
  }

  return returnFiles;
}

export function getHashedNameFromContents(contents: string, src: string) {
  const hash = createHash("md5");
  hash.update(contents);
  const digest = hash.digest("base64url");

  const ext = extname(src);
  const fname = basename(src, ext);

  return src.replace(`${fname}${ext}`, `${fname}.${digest}${ext}`);
}

export function createHashedFile(dataDir: string, src: string, verbose: number, destPrefix = "") {
  const fullPath = join(dataDir, src);

  const hashedPath = joinUrlPath(destPrefix, getHashedName(dataDir, src));
  const dest = join("static", hashedPath);

  if (hashedPath && !existsSync(dest)) {
    copyFileSync(fullPath, dest);
    // Ensure the file is readable by everyone and not executable
    // We had a project where the icons were executable (0o700) and the web server wouldn't serve them
    chmodSync(dest, 0o644);
    if (verbose) {
      console.log(`converted ${src} to ${dest}`);
    }
  } else if (verbose) {
    console.log(`skipping ${dest}`);
  }

  return hashedPath;
}

export function createHashedFileFromContents(
  contents: string,
  src: string,
  verbose: number,
  destPrefix = "",
) {
  const hashedPath = joinUrlPath(destPrefix, getHashedNameFromContents(contents, src));
  const dest = join("static", hashedPath);

  if (!existsSync(dest)) {
    writeFileSync(dest, contents);
    if (verbose) {
      console.log(`converted ${src} to ${dest}`);
    }
  } else if (verbose) {
    console.log(`skipping ${dest}`);
  }

  return hashedPath;
}

export function createOutputDir(dirPath: string) {
  if (existsSync(dirPath)) {
    rmSync(dirPath, { recursive: true });
  }
  mkdirSync(dirPath, { recursive: true });
}

export function deleteOutputDir(dirPath: string) {
  if (existsSync(dirPath)) {
    rmSync(dirPath, { recursive: true });
  }
}

export function joinUrlPath(...parts: string[]) {
  // Always use posix style paths for URLs
  const normalized = parts.map((part) => part.replace(/\\/g, "/"));
  return posix.join(...normalized);
}
