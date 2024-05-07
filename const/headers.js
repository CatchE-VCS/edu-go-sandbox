const dotEnvConfig = require('../config/dot_env_config');

const header_with_token = ( userId, orgId, token) => {
    return {
        Authorization:
            token,
        Connection: "keep-alive",
        "X-ContextId": orgId,
        "X-RX": dotEnvConfig.parsed["X_RX"],
        "X-UserId": userId,
        "X-WB": dotEnvConfig.parsed["X_WB"],
    };
}
const default_header_without_token = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Encoding": "gzip, deflate, br",
    "Content-Type": "application/json;charset=UTF-8"
};

const header_without_token_login = {
    Connection: "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
};

module.exports = {header_with_token, default_header_without_token, header_without_token_login};