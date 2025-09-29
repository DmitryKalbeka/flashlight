#!/usr/bin/env node

import { program } from "commander";
import fs from "fs";
import path from "path";

export function debugSnapshotCommand() {
  program
    .command("debug-snapshot")
    .description("List contents of the pkg snapshot (for debugging included assets)")
    .action(() => {
      function walk(dir: string, depth = 0): string[] {
        let results: string[] = [];
        try {
          const list = fs.readdirSync(dir);
          list.forEach((file) => {
            const filePath = path.join(dir, file);
            let stat;
            try {
              stat = fs.statSync(filePath);
            } catch {
              return;
            }
            if (stat && stat.isDirectory()) {
              results.push(`${" ".repeat(depth * 2)}📂 ${filePath}`);
              results = results.concat(walk(filePath, depth + 1));
            } else {
              results.push(`${" ".repeat(depth * 2)}📄 ${filePath}`);
            }
          });
        } catch {
          results.push(`(нет доступа к ${dir})`);
        }
        return results;
      }

      const root = "/snapshot"; // В pkg это корень snapshot
      console.log("📦 Snapshot content:\n");
      console.log(walk(root).join("\n"));
    });
}
