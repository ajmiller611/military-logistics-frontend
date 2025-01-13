module.exports = new Proxy(
  {},
  {
    get: function getter() {
      return () => ({
        className: 'roboto-font-class',
        variable: 'roboto-font-variable',
        style: { fontFamily: 'Roboto' },
      });
    },
  },
);
