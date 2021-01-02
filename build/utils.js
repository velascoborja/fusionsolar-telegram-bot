"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCmd = void 0;
function removeCmd(cmd) {
    return (cmd === null || cmd === void 0 ? void 0 : cmd.replace(/(\/\w+)\s*/, '')) || cmd;
}
exports.removeCmd = removeCmd;
