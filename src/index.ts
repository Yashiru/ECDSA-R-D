const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");

import { ELLIPTIC_CURVE } from "./constants";
import { generateKeyPair, signMessage, verifySignature } from "./ECDSA";
import { PublicKey } from "./types/PublicKey";
import { Signature } from "./types/Signature";

const optionDefinitions = [
  {
    name: "help",
    alias: "h",
    type: Boolean,
    description: "Display this usage guide.",
  },
  {
    name: "demo",
    alias: "d",
    type: Boolean,
    description: "Run a demo of the ECDSA implementation",
  },
  {
    name: "generateKeyPair",
    alias: "g",
    type: Boolean,
    description: "Generate a new key pair",
  },
  {
    name: "sign",
    alias: "s",
    type: Boolean,
    multiple: true,
    description: "Sign a message",
  },
  {
    name: "privateKey",
    type: BigInt,
    multiple: true,
    description: "The private key to use for signing",
  },
  {
    name: "message",
    alias: "m",
    type: String,
    multiple: true,
    description: "The message to sign",
  },
  {
    name: "verify",
    alias: "v",
    type: Boolean,
    multiple: true,
    description: "Verify a signed message",
  },
  {
    name: "publicKeyX",
    type: BigInt,
    multiple: true,
    description: "The public key X coordinate to use for verification",
  },
  {
    name: "publicKeyY",
    type: BigInt,
    multiple: true,
    description: "The public key Y coordinate to use for verification",
  },
  {
    name: "signatureR",
    type: String,
    multiple: true,
    description: "The signature R component to use for verification",
  },
  {
    name: "signatureS",
    type: String,
    multiple: true,
    description: "The signature S component to use for verification",
  },
  {
    name: "hex",
    alias: "x",
    type: Boolean,
    description: "Display keys and signatures in hexadecimal format",
  },
];

function execute() {
  const options = commandLineArgs(optionDefinitions);

  if (options.help) {
    const usage = commandLineUsage([
      {
        header: "ECDSA R&D CLI Tool",
        content:
          "A CLI tool for generating key pairs, signing messages, and verifying signatures.",
      },
      {
        header: "Options",
        optionList: optionDefinitions,
      },
      {
        content:
          "Project home: {underline https://github.com/Yashiru/ECDSA-R-D}",
      },
    ]);
    console.log(usage);
  } else {
    if (options.demo) {
      const { privateKey, publicKey } = generateKeyPair(ELLIPTIC_CURVE);
      console.log("Private Key:", privateKey);
      console.log("Public Key:", publicKey);

      const message = "Hello, world!";
      const signature = signMessage(message, privateKey, ELLIPTIC_CURVE);
      console.log("Signature:", signature);

      const isValid = verifySignature(
        message,
        signature,
        publicKey,
        ELLIPTIC_CURVE
      );
      console.log("Signature valid:", isValid);

      return;
    }

    if (options.generateKeyPair) {
      console.log(generateKeyPair(ELLIPTIC_CURVE));
      return;
    }

    if (options.sign) {
      if (!options.privateKey) {
        console.log("\x1b[31mPrivate key is required for signing\x1b[0m");
        return;
      }

      if (!options.message) {
        console.log("\x1b[31mMessage is required for signing\x1b[0m");
        return;
      }

      const privateKey = options.privateKey[0];
      const message = options.message[0];

      console.log("Signing message:", message);
      console.log(signMessage(message, privateKey, ELLIPTIC_CURVE));

      return;
    }

    if (options.verify) {
      if (!options.publicKeyX) {
        console.log(
          "\x1b[31mPublic key X coordinate is required for verification\x1b[0m"
        );
        return;
      }

      if (!options.publicKeyY) {
        console.log(
          "\x1b[31mPublic key Y coordinate is required for verification\x1b[0m"
        );
        return;
      }

      if (!options.signatureR) {
        console.log(
          "\x1b[31mSignature R component is required for verification\x1b[0m"
        );
        return;
      }

      if (!options.signatureS) {
        console.log(
          "\x1b[31mSignature S component is required for verification\x1b[0m"
        );
        return;
      }

      if (!options.message) {
        console.log("\x1b[31mMessage is required for verification\x1b[0m");
        return;
      }

      const publicKeyX: bigint = BigInt(options.publicKeyX[0]);
      const publicKeyY: bigint = BigInt(options.publicKeyY[0]);

      const signatureR: bigint = BigInt(options.signatureR[0]);
      const signatureS: bigint = BigInt(options.signatureS[0]);

      const message: string = options.message[0];

      const publicKey: PublicKey = { x: publicKeyX, y: publicKeyY };
      const signature: Signature = {
        r: BigInt(signatureR),
        s: BigInt(signatureS),
      };

      console.log("Verifying signature for message:", message);

      console.log(
        verifySignature(message, signature, publicKey, ELLIPTIC_CURVE)
      );

      return;
    }
  }
}

execute();
