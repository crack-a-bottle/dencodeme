import * as fs from "fs";
import * as path from "path";
import { program } from "commander";
import * as dencodeme from ".";
import type { NumberSystem } from ".";

type Options = {
    encoding: BufferEncoding;
    file: boolean;
    out: string;
}

const { version } = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"));
export = function (argv: string[], mode: "encode" | "decode") {
    if (!["encode", "decode"].includes(mode)) return process.exit(1);
    const isEncode = mode.startsWith("e");

    const descStart = `${mode[0].toUpperCase() + mode.slice(1)}s the specified input data ${isEncode ? "with" : "from"}`;
    const encodingOption = program
        .createOption("-e, --encoding <format>", `The encoding to ${isEncode ? "read" : "write"} the input data in`)
        .default("utf8")
        .choices(["ascii", "binary", "latin1", "ucs2", "utf8", "utf16le"]);
    const fileFlag = program
        .createOption("-f, --file", `Interprets the input as a file path and ${mode} the file at the path`);
    const inputArgument = program
        .createArgument("<input>", `The input data to ${mode}`);
    const outOption = program
        .createOption("-o, --out <path>", `The file path to write the output data to.`)
        .default("utf8");

    function actionHandler(radix: number | Exclude<keyof typeof dencodeme, "base">, input: string, options: Options) {
        try {
            const output = (typeof radix == "number" ? dencodeme.base(radix) : dencodeme[radix])[mode](options.file ?
                fs.readFileSync(path.resolve(process.cwd(), input), isEncode ? options.encoding : "utf8") : input);
            options.out ? fs.writeFileSync(path.resolve(process.cwd(), options.out), output, options.encoding) :
                process.stdout.write(output.toString(options.encoding));
        } catch (err) {
            program.error(String(err));
        }
    }

    program.name(`${mode}me`)
        .usage(`[command] [options]`)
        .description(`${mode[0].toUpperCase() + mode.slice(1)}s data using various number systems`)
        .version(version, "-v, --version", "Outputs the current version")
        .helpOption("-h, --help", "Outputs this help menu")
        .addHelpCommand("help [command]", "Outputs help for command");

    program.command("base")
        .description(`${descStart} the specified base/radix`)
        .usage("<radix> [options] <input>")
        .argument("<radix>", `The base/radix to ${mode} ${isEncode ? "with" : "from"}, clamped to range 2-36`, x => {
            const parsed = parseInt(x, 10);
            if (Number.isNaN(parsed)) return program.error("Base/Radix is not a valid base 10 number");
            else return parsed;
        })
        .addArgument(inputArgument)
        .addOption(encodingOption)
        .addOption(fileFlag)
        .addOption(outOption)
        .alias("radix")
        .action(actionHandler);

    for (const [command, base] of Object.entries(dencodeme)
        .filter((x): x is [string, NumberSystem] => typeof x[1] !== "function")
        .map((x): [string, number] => [x[0], x[1].radix])) {
        program.command(command)
            .summary(`${descStart} base ${base}`)
            .description(`${descStart} a base/radix of ${base}`)
            .usage("[options] <input>")
            .addArgument(inputArgument)
            .addOption(encodingOption)
            .addOption(fileFlag)
            .addOption(outOption)
            .aliases(command.startsWith("base") ? [`b${command.slice(4)}`] : [command.slice(0, 3), `base${base}`, `b${base}`])
            .action(actionHandler.bind(null, command as Exclude<keyof typeof dencodeme, "base">));
    }

    program.parse(argv, { from: "user" });
}
