/* ***************************************************************************
 *
 * Copyright (c) 2021, the perspective-studio authors.
 *
 * This file is part of the perspective-studio library, distributed under the terms of
 * the Apache License 2.0.  The full license can be found in the LICENSE file.
 *
 */

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: "70",
          ios: "13",
        },
      },
    ],
    "@babel/preset-react",
  ],
  sourceType: "unambiguous",
  sourceMaps: true,
};
