#!/usr/bin/env node

import { program } from "commander";
import { registerMeasure2Command } from "./measure2Command";
import { debugSnapshotCommand } from "./debugSnapshotCommand";

registerMeasure2Command(program);
debugSnapshotCommand();

program.parse();
