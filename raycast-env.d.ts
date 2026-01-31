/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** API Port - Port number for TaskNotes HTTP API */
  "apiPort": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `check-connection` command */
  export type CheckConnection = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `check-connection` command */
  export type CheckConnection = {}
}

