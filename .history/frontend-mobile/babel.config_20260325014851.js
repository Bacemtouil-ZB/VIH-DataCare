//Babel = JavaScript compiler : controls how your JavaScript code is transformed before running on the device.
//converte Modern JS (ES6+, new syntax) into
export default function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          unstable_transformImportMeta: true,
        },
      ],
    ],
  };
}
