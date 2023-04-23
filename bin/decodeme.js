#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const { program } = require("commander");
const dencodeme = require("../dist");

const encodingOption = program
    .createOption("-e, --encoding <format>", "The encoding to write the output data in")
    .default("utf8")
    .choices(["ascii", "binary", "latin1", "ucs2", "utf8", "utf16le"]);
const fileFlag = program
    .createOption("-f, --file", "Interprets the input as a file path and decodes the file at the path");
const inputArgument = program
    .createArgument("<input>", "The input data to decode");
const outOption = program
    .createOption("-o, --out <path>", "The file path to write the output data to");

program.name("decodeme")
    .usage("[command] [options]")
    .description("Decode data using various encoding schemes.")
    .version(require("../package.json").version, "-v, --version", "Outputs the current version")
    .helpOption("-h, --help", "Outputs this help menu")
    .addHelpCommand("help [command]", "Outputs help for command");

program.command("base")
    .description("Decodes the specified input data from the specified base/radix")
    .usage("<radix> [options] <input>")
    .argument("<radix>", "The base/radix to decode from, clamped to range 2-36", x => {
        const parsed = parseInt(x, 10);
        return Number.isNaN(parsed) ? program.error("Base/Radix is not a valid base 10 number") : parsed;
    })
    .addArgument(inputArgument)
    .addOption(encodingOption)
    .addOption(fileFlag)
    .addOption(outOption)
    .alias("radix")
    .action((radix, input, options) => {
        try {
            const output = dencodeme.base(radix).decode(options.file ?
                fs.readFileSync(path.resolve(process.cwd(), input), "utf8") : input);
            options.out ? fs.writeFileSync(path.resolve(process.cwd(), options.out), output, options.encoding) :
                process.stdout.write(output.toString(options.encoding));
        } catch (err) {
            program.error(String(err));
        }
    });

// Create a command for each base/radix in the dencodeme object
for (const [command, base] of Object.entries(dencodeme).map(x => [x[0], typeof x[1] == "function" ? NaN : x[1].radix])
    .filter(x => !Number.isNaN(x[1]))) {
    program.command(command)
        .summary(`Decodes the specified input data from base ${base}`)
        .description(`Decodes the specified input data from a base/radix of ${base}`)
        .usage("[options] <input>")
        .addArgument(inputArgument)
        .addOption(encodingOption)
        .addOption(fileFlag)
        .addOption(outOption)
        .aliases(command.startsWith("base") ? [`b${command.slice(4)}`] : [command.slice(0, 3), `base${base}`, `b${base}`])
        .action((input, options) => {
            try {
                const output = dencodeme[command].decode(options.file ?
                    fs.readFileSync(path.resolve(process.cwd(), input), "utf8") : input);
                options.out ? fs.writeFileSync(path.resolve(process.cwd(), options.out), output, options.encoding) :
                    process.stdout.write(output.toString(options.encoding));
            } catch (err) {
                program.error(String(err));
            }
        });
}

// Parse the given arguments and run the program
program.parse(process.argv.slice(2), { from: "user" });
