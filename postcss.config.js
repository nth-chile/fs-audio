module.exports = (ctx) => ({
  plugins: {
    'postcss-nested': {},
    'autoprefixer': {},
    'cssnano': ctx.env === 'production' ? {} : false
  },
})