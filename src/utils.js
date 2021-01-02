exports.removeCmd = (cmd) => {
    return (undefined !== cmd && 'string' === typeof cmd) ? (cmd.replace(/(\/\w+)\s*/, '')) : undefined;
};