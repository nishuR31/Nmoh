import appRepository from "../repo/appRepository.js";
const appService = {
  changeRole: handler(async (args) => appRepository.changeRole(args)),
  disable2fa: handler(async (id) => appRepository.disable2fa(id)),
  ping: handler(async () => appRepository.ping()),
  edit: handler(async (id, payload) => appRepository.edit(id, payload)),
  register: handler(async (data) => appRepository.register(data)),
  verifyRegister: handler(async (data) => appRepository.verifyRegister(data)),
  approveAdminRegistration: handler(async (data) => appRepository.approveAdminRegistration(data)),
  me: handler(async (id) => appRepository.me(id)),
  delete: handler(async (id) => appRepository.delete(id)),
  deleteAll: handler(async () => appRepository.deleteAll()),
  login: handler(async (data) => appRepository.login(data)),
  loginWithTotp: handler(async (data) => appRepository.loginWithTotp(data)),
  loginWithPasskey: handler(async (data) => appRepository.loginWithPasskey(data)),
  setupPasskey: handler(async (data) => appRepository.setupPasskey(data)),
  forgot: handler(async (email) => appRepository.forgot(email)),
  checkOtp: handler(async (email, otp) => appRepository.checkOtp(email, otp)),
  resetPassword: handler(async (email, password) => appRepository.resetPassword(email, password)),
  mail: handler(async (args) => appRepository.mail(args)),
  verify2fa: handler(async (token, id) => appRepository.verify2fa(token, id)),
  setup2fa: handler(async (id) => appRepository.setup2fa(id)),
  sendPasslessLink: handler(async (user) => appRepository.sendPasslessLink(user)),
  verifyPasslessToken: handler(async (token) => appRepository.verifyPasslessToken(token)),
  updateRefreshToken: handler(async (userId, refreshToken) =>
    appRepository.updateRefreshToken(userId, refreshToken),
  ),
};

export default appService;
