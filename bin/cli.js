const fs = require("fs");
const path = require("path");
const { program } = require("commander");
const dencodeme = require("../dist");

const ENCODING_ALIASES = {
    "ascii": "latin1",
    "binary": "latin1",
    "latin1": "latin1",
    "ucs2": "utf16le",
    "ucs-2": "utf16le",
    "utf16le": "utf16le",
    "utf-16le": "utf16le",
    "utf8": "utf8",
    "utf-8": "utf8"
}

const { version } = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"));
module.exports = function (argv, mode) {
    if (!["encode", "decode"].includes(mode)) return process.exit(1);
    const isEncode = mode.startsWith("e");

    const descStart = `${mode[0].toUpperCase() + mode.slice(1)}s the specified input data ${isEncode ? "with" : "from"}`;
    const encodingOption = program
        .createOption("-e, --encoding <format>", `The encoding to ${isEncode ? "write" : "read"} the input data in`)
        .default("utf8")
        .choices(["ascii", "utf8", "utf-8", "utf16le", "ucs2", "ucs-2", "latin1", "binary"])
        .argParser(x => ENCODING_ALIASES[x]);
    const fileFlag = program
        .createOption("-f, --file", `Interprets the input as a file path and ${mode} the file at the path`);
    const inputArgument = program
        .createArgument("<input...>", `The input data to ${mode}`);

    function actionHandler(radix, input, options) {
        try {
            return process.stdout.write((isNaN(radix) ? dencodeme[radix] : dencodeme.base(radix))(opts.file ?
                fs.readFileSync(path.resolve(process.cwd(), input), isEncode ? options.encoding : "utf8") : input, options.encoding));
        } catch (err) {
            return program.error(err.message ?? err);
        }
    }

    program.name(`${mode}me`)
        .usage(`[command] [options]`)
        .description(`${mode[0].toUpperCase() + mode.slice(1)}s data using various methods`)
        .version(version, "-v, --version", "Outputs the current version")
        .helpOption("-h, --help", "Outputs this help menu")
        .addHelpCommand("help [command]", "Outputs help for command")
        .configureHelp({
            subcommandTerm(cmd) {
                return cmd.name() + (cmd.aliases().length > 0 ? "|" + cmd.alias() : "") + " " + cmd.usage();
            }
        });

    program.command("base")
        .description(`${descStart} the specified base/radix`)
        .usage("<radix> [options] -- <input...>")
        .argument("<radix>", `The base/radix to ${mode} ${isEncode ? "with" : "from"}, clamped to range 2-36`, x => {
            const parsed = parseInt(x, 10);
            if (Number.isNaN(parsed)) return program.error("Base/Radix is not a valid base 10 number");
            else return parsed;
        })
        .addArgument(inputArgument)
        .addOption(encodingOption)
        .addOption(fileFlag)
        .alias("radix")
        .action(actionHandler);

    for (const [command, base] of Object.entries(dencodeme).filter(x => typeof x[1] !== "function").map(x => [x[0], x[1].radix])) {
        program.command(command)
            .summary(`${descStart} base ${base}`)
            .description(`${descStart} a base/radix of ${base}`)
            .usage("[options] -- <input...>")
            .addArgument(inputArgument)
            .addOption(encodingOption)
            .addOption(fileFlag)
            .aliases(command.startsWith("base") ? [`b${command.slice(4)}`] : [command.slice(0, 3), `base${base}`, `b${base}`])
            .action(actionHandler.bind(null, command));
    }

    program.parse(argv, { from: "user" });
}
