import { Command, Success } from "./types";

export function extractCmds(argv: string[]): [Command, Command] {
  let pp: number;
  if (argv[0].endsWith("node")) {
    pp = 1;
  } else {
    pp = 1;
  }

  const tickCmd = { command: argv[pp], options: new Array<string>() };
  pp++;
  while (pp < argv.length) {
    const arg = argv[pp];
    if (arg.startsWith("--")) {
      tickCmd.options.push(arg);
    } else {
      break;
    }
    pp++;
  }

  const cmd: Command = { command: argv[pp], options: new Array<string>() };
  pp++;
  cmd.options = argv.slice(pp);

  return [tickCmd, cmd];
}

export function validateCmd(cmd: Command): Success {
  if (cmd.command === undefined) {
    return { ok: false, error: new Error("command is undefined") };
  }
  if (cmd.command.length == 0) {
    return { ok: false, error: new Error("command is empty") };
  }
  return { ok: true, error: null };
}
