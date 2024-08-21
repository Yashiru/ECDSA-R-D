# ECDSA R&D CLI Tool

## Overview

This project is an implementation of Elliptic Curve Digital Signature Algorithm (ECDSA) in TypeScript. The tool allows you to generate key pairs, sign messages, and verify signatures using the ECDSA cryptographic algorithm. It's designed for research and development purposes, providing a simple command-line interface (CLI) to interact with the ECDSA functionality.

## Features

- **Key Pair Generation**: Generate public and private key pairs based on elliptic curve cryptography.
- **Message Signing**: Sign messages using a private key.
- **Signature Verification**: Verify the authenticity of a signed message using the corresponding public key.
- **Hexadecimal Display**: Optionally display keys and signatures in hexadecimal format for easier readability and interoperability.

## Installation

To use this project, you need to have Node.js and `ts-node` installed. If you haven't installed them yet, you can do so by running:

```bash
npm install -g ts-node
```

## Usage

You can interact with the ECDSA tool through the CLI by running the following command:

```bash
ts-node src/index.ts
```

### CLI Options

The following options are available in the CLI:

```bash
ECDSA R&D CLI Tool

  A CLI tool for generating key pairs, signing messages, and verifying
  signatures.

Options

  -h, --help               Display this usage guide.
  -d, --demo               Run a demo of the ECDSA implementation
  -g, --generateKeyPair    Generate a new key pair
  -s, --sign               Sign a message
  --privateKey bigint[]    The private key to use for signing
  -m, --message string[]   The message to sign
  -v, --verify             Verify a signed message
  --publicKeyX bigint[]    The public key X coordinate to use for verification
  --publicKeyY bigint[]    The public key Y coordinate to use for verification
  --signatureR string[]    The signature R component to use for verification
  --signatureS string[]    The signature S component to use for verification
  -x, --hex                Display keys and signatures in hexadecimal format

  Project home: https://github.com/Yashiru/ECDSA-R-D
```

### Examples

- **Generate a New Key Pair**:

  ```bash
  ts-node src/index.ts -g
  ```

- **Sign a Message**:

  ```bash
  ts-node src/index.ts -s -m "Hello, world!" --privateKey <your_private_key>
  ```

- **Verify a Signed Message**:

  ```bash
  ts-node src/index.ts -v -m "Hello, world!" --publicKeyX <public_key_x> --publicKeyY <public_key_y> --signatureR <signature_r> --signatureS <signature_s>
  ```

- **Run a Demo**:

  ```bash
  ts-node src/index.ts -d
  ```

### Displaying in Hexadecimal Format

To display keys and signatures in hexadecimal format, add the `-x` or `--hex` flag to your command.

Example:

```bash
ts-node src/index.ts -g -x
```

## Project Home

For more information, visit the project home on [GitHub](https://github.com/Yashiru/ECDSA-R-D).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
