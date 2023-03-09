const fs = require("fs");
const path = require("path");
const { program, Option } = require("commander");
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
module.exports = function(argv, mode) {
    if (!["encode", "decode"].includes(mode)) return process.exit(1);

    const prepos = mode.startsWith("d") ? "from" : "with";
    program.command(`base <radix> <input> [options]`)
        .description(`${mode[0].toUpperCase() + mode.slice(1)}s the specified input data ${prepos} the specified base/radix.`)
        .argument("<radix>", `The base/radix to ${mode} ${prepos} (Clamped to range 2-36)`, x => {
            const parsed = parseInt(x, 10);
            if (Number.isNaN(parsed)) program.error("Base/Radix is not a valid base-10 number");
            else return parsed;
        })
        .argument("<input>", `The input data to ${mode} ${prepos}`)
        .addOption(
            new Option("-e, --encoding <format>", `The encoding to ${mode.startsWith("d") ? "write" : "read"} the input data in`)
            .default("utf8")
            .choices(["ascii", "utf8", "utf-8", "utf16le", "ucs2", "ucs-2", "latin1", "binary"])
            .argParser(x => ENCODING_ALIASES[x])
        )
        .option("-f, --file", `Interpret the input as a file path and ${mode} the file at the path`, false)
        .aliases(["radix", "rdx", "r", "b"])
        .action((rdx, inp, opts) => {
            let input = inp;
            try {
                input = opts.file ? fs.readFileSync(path.resolve(process.cwd(), inp)) : inp;
            } catch (err) {
                if ("errno" in err) switch (err.errno) {
                    case -4058:
                        return program.error("File does not exist at path");
                    case -4068:
                        return program.error("Directory already exists at path");
                    default:
                        return program.error(err.message);
                } else return program.error(err.message ?? err);
            }

            console.log(dencodeme.base(rdx)[mode](input, opts.encoding));
        });

    program.version(version, "-v, --version", "Output the current version");
    program.parse(argv);
}
