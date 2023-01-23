export default new Intl.NumberFormat('en-us', {
  currency: 'USD',
  maximumFractionDigits: 2,
  style: 'currency'
}).format;
