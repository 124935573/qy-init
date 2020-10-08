module.exports = {

  title: '帮助中心',

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false,
  isProduction: (process.env.NODE_ENV === 'production'),
  programmeFlag: '/help-center-front/'
}
