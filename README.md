# dencodeme
Encode/Decode data using various encoding schemes.

## Installation
### Package
```bash
$ npm install dencodeme
```
### CLI
```bash
$ npm install -g dencodeme
```

## Command line usage
```
$ encodeme --help
Usage: encodeme [options] [command]

Encodes data using various encoding schemes.
```
```
$ decodeme --help
Usage: decodeme [options] [command]

Decodes data using various encoding schemes.
```
### Options
```
  -v, --version  Outputs the current version
  -h, --help     Outputs this help menu
```
### Commands
```
  base|radix [options] <radix> <input>  Decodes the specified input data from the specified base/radix
  base32|b32 [options] <input>          Decodes the specified input data from base 32
  base36|b36 [options] <input>          Decodes the specified input data from base 36
  base64|b64 [options] <input>          Decodes the specified input data from base 64
  binary|bin [options] <input>          Decodes the specified input data from base 2
  decimal|dec [options] <input>         Decodes the specified input data from base 10
  hexadecimal|hex [options] <input>     Decodes the specified input data from base 16
  octal|oct [options] <input>           Decodes the specified input data from base 8
  help [command]                        Outputs help for command
```

## API usage
### Importing
The package can be imported using CJS or ESM syntax.
```javascript
const dencodeme = require("dencodeme");
```
```javascript
import * as dencodeme from "dencodeme";
```

### Encoding
```javascript
const dencodeme = require("dencodeme");
dencodeme.binary.encode("hello yall"); // 01101000011001010110110001101100011011110010000001111001011000010110110001101100
dencodeme.decimal.encode("hello yall"); // 104101108108111032121097108108
dencodeme.hexadecimal.encode("hello yall"); // 68656c6c6f2079616c6c
dencodeme.base(5).encode("hello yall"); // 0404040104130413042101120441034204130413
```

### Decoding
```javascript
const dencodeme = require("dencodeme");
dencodeme.binary.decode("01101000011001010110110001101100011011110010000001111001011000010110110001101100"); // hello yall
dencodeme.decimal.decode("104101108108111032121097108108"); // hello yall
dencodeme.hexadecimal.decode("68656c6c6f2079616c6c"); // hello yall
dencodeme.base(5).decode("0404040104130413042101120441034204130413"); // hello yall
```

## Documentation
The documentation can be found [here](https://crackabottle.js.org/dencodeme).

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
