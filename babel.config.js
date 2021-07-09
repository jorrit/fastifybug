module.exports = function (api) {
  const dev = process.env.NODE_ENV !== 'production';
  api.cache.using(() => dev);

  return {
    presets: [
      [
        '@babel/preset-typescript',
        {
          isTSX: true,
          jsxPragma: 'h',
          allExtensions: true,
          allowNamespaces: false,
          allowDeclareFields: true,
        },
      ],
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'entry',
        },
      ],
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
          importSource: 'preact',
        },
      ],
    ],
    //plugins: dev ? ['@prefresh/babel-plugin'] : [],
  };
};
