const fs = require("fs");
const path = require("path");

function updateFile(filePath, transform) {
  if (!fs.existsSync(filePath)) {
    console.log(`[patch-expo-tunnel] skipped missing file: ${filePath}`);
    return;
  }

  const original = fs.readFileSync(filePath, "utf8");
  const updated = transform(original);

  if (updated !== original) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log(`[patch-expo-tunnel] patched: ${filePath}`);
  } else {
    console.log(`[patch-expo-tunnel] already up to date: ${filePath}`);
  }
}

function replaceRegexOrThrow(source, regex, replacement, label) {
  if (!regex.test(source)) {
    throw new Error(`Could not find ${label}`);
  }
  return source.replace(regex, replacement);
}

const projectRoot = process.cwd();
const asyncNgrokPath = path.join(
  projectRoot,
  "node_modules",
  "expo",
  "node_modules",
  "@expo",
  "cli",
  "build",
  "src",
  "start",
  "server",
  "AsyncNgrok.js"
);
const urlCreatorPath = path.join(
  projectRoot,
  "node_modules",
  "expo",
  "node_modules",
  "@expo",
  "cli",
  "build",
  "src",
  "start",
  "server",
  "UrlCreator.js"
);

updateFile(asyncNgrokPath, (source) => {
  let next = source;

  if (!next.includes('const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));')) {
    next = next.replace(
      'const _UserSettings = require("../../api/user/UserSettings");',
      'const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));\nconst _UserSettings = require("../../api/user/UserSettings");'
    );
  }

  next = next.replace(/LEGACY_(?:LEGACY_)+NGROK_CONFIG/g, "LEGACY_NGROK_CONFIG");
  next = next.replace(/(?<!LEGACY_)NGROK_CONFIG\./g, "LEGACY_NGROK_CONFIG.");

  const constantsBlock = `const debug = require('debug')('expo:start:server:ngrok');
const LEGACY_NGROK_CONFIG = {
    authToken: '5W1bR67GNbWcXqmxZzBG1_56GezNeaX6sSRvn8npeQ8',
    domain: 'exp.direct'
};
const CLOUDFLARED_MODULE_NAME = 'cloudflared';
const MODERN_NGROK_MODULE_NAME = '@ngrok/ngrok';
const TUNNEL_TIMEOUT = 10 * 1000;
function resolveOptionalModule(projectRoot, moduleName) {
    try {
        const modulePath = require.resolve(moduleName, {
            paths: [
                projectRoot
            ]
        });
        return require(modulePath);
    } catch {
        return null;
    }
}
function isExpoSharedToken(token) {
    return token === LEGACY_NGROK_CONFIG.authToken;
}
function resolveCloudflared(projectRoot) {
    return resolveOptionalModule(projectRoot, CLOUDFLARED_MODULE_NAME);
}
function resolveModernNgrok(projectRoot) {
    return resolveOptionalModule(projectRoot, MODERN_NGROK_MODULE_NAME);
}
function getNgrokAuthtoken(configPath) {
    const envToken = process.env.NGROK_AUTHTOKEN;
    if (envToken == null ? void 0 : envToken.trim()) {
        return envToken.trim();
    }
    try {
        const rawConfig = _fs().default.readFileSync(configPath, 'utf8');
        const match = rawConfig.match(/^\\s*authtoken:\\s*(.+)\\s*$/m);
        return (match == null ? void 0 : match[1]) ? match[1].trim() : null;
    } catch {
        return null;
    }
}
class AsyncNgrok {`;

  next = replaceRegexOrThrow(
    next,
    /const debug = require\('debug'\)\('expo:start:server:ngrok'\);\s*[\s\S]*?class AsyncNgrok \{/,
    constantsBlock,
    "AsyncNgrok constants block"
  );

  next = replaceRegexOrThrow(
    next,
    /constructor\(projectRoot, port\)\{[\s\S]*?this\.resolver = new _NgrokResolver\.NgrokResolver\(projectRoot\);\s*\}/,
    `constructor(projectRoot, port){
        this.projectRoot = projectRoot;
        this.port = port;
        this.serverUrl = null;
        this.cloudflaredModule = undefined;
        this.cloudflaredTunnel = null;
        this.ngrokModule = undefined;
        this.listener = null;
        this.resolver = new _NgrokResolver.NgrokResolver(projectRoot);
    }`,
    "AsyncNgrok constructor"
  );

  next = replaceRegexOrThrow(
    next,
    /\/\*\* Start ngrok on the given port for the project\. \*\/ async startAsync\(\{ timeout \} = \{\}\) \{[\s\S]*?this\.serverUrl = await this\._connectToNgrokAsync\(\{\s*timeout\s*\}\);\s*debug\('Tunnel URL:', this\.serverUrl\);\s*_log\.log\('Tunnel ready\.'\);\s*\}/,
    `/** Start ngrok on the given port for the project. */ async startAsync({ timeout } = {}) {
        this.cloudflaredModule = this.cloudflaredModule !== undefined ? this.cloudflaredModule : resolveCloudflared(this.projectRoot);
        this.ngrokModule = this.ngrokModule !== undefined ? this.ngrokModule : resolveModernNgrok(this.projectRoot);
        if (!this.cloudflaredModule && !this.ngrokModule) {
            await this.resolver.resolveAsync({
                prefersGlobalInstall: true
            });
        }
        if ((0, _adbReverse.hasAdbReverseAsync)()) {
            if (!await (0, _adbReverse.startAdbReverseAsync)([
                this.port
            ])) {
                throw new _errors.CommandError('NGROK_ADB', \`Cannot start tunnel URL because \\\`adb reverse\\\` failed for the connected Android device(s).\`);
            }
        }
        this.serverUrl = await this._connectToNgrokAsync({
            timeout
        });
        debug('Tunnel URL:', this.serverUrl);
        _log.log('Tunnel ready.');
    }`,
    "AsyncNgrok startAsync"
  );

  next = replaceRegexOrThrow(
    next,
    /\/\*\* Stop the ngrok process if it's running\. \*\/ async stopAsync\(\) \{[\s\S]*?this\.serverUrl = null;\s*\}/,
    `/** Stop the ngrok process if it's running. */ async stopAsync() {
        var _this_resolver_get_kill, _this_resolver_get;
        debug('Stopping Tunnel');
        if (this.cloudflaredTunnel) {
            try {
                this.cloudflaredTunnel.stop();
            } catch {}
            this.cloudflaredTunnel = null;
        }
        if (this.listener) {
            try {
                await this.listener.close();
            } catch {}
            this.listener = null;
        }
        if (this.ngrokModule) {
            try {
                await this.ngrokModule.kill();
            } catch {}
        }
        await ((_this_resolver_get = this.resolver.get()) == null ? void 0 : (_this_resolver_get_kill = _this_resolver_get.kill) == null ? void 0 : _this_resolver_get_kill.call(_this_resolver_get));
        this.serverUrl = null;
    }`,
    "AsyncNgrok stopAsync"
  );

  next = replaceRegexOrThrow(
    next,
    /\/\*\* Exposed for testing\. \*\/ async _connectToNgrokAsync\(options = \{\}, attempts = 0\) \{[\s\S]*?\n    async _getConnectionPropsAsync\(\) \{/,
    `/** Exposed for testing. */ async _connectToNgrokAsync(options = {}, attempts = 0) {
        await this.stopAsync();
        const configPath = _path().join((0, _UserSettings.getSettingsDirectory)(), 'ngrok.yml');
        const cloudflared = this.cloudflaredModule !== undefined ? this.cloudflaredModule : resolveCloudflared(this.projectRoot);
        this.cloudflaredModule = cloudflared;
        if (cloudflared) {
            try {
                const cloudflareUrl = await (0, _delay.resolveWithTimeout)(()=>new Promise((resolve, reject)=>{
                        const tunnel = cloudflared.Tunnel.quick(\`http://127.0.0.1:\${this.port}\`);
                        let settled = false;
                        const cleanup = ()=>{
                            tunnel.off('url', onUrl);
                            tunnel.off('error', onError);
                            tunnel.off('exit', onExit);
                        };
                        const onUrl = (url)=>{
                            if (settled) return;
                            settled = true;
                            cleanup();
                            this.cloudflaredTunnel = tunnel;
                            tunnel.on('error', (error)=>{
                                debug('cloudflared tunnel error:', error);
                                _log.error(_chalk().default.red('Tunnel connection has been closed.') + _chalk().default.gray(' Check your network or firewall settings and restart the dev server.'));
                            });
                            tunnel.on('exit', (code, signal)=>{
                                debug('cloudflared tunnel exited:', code, signal);
                            });
                            _log.log('Tunnel connected.');
                            resolve(url);
                        };
                        const onError = (error)=>{
                            if (settled) return;
                            settled = true;
                            cleanup();
                            try {
                                tunnel.stop();
                            } catch {}
                            reject(error);
                        };
                        const onExit = (code, signal)=>{
                            if (settled) return;
                            settled = true;
                            cleanup();
                            reject(new _errors.CommandError('TUNNEL_CONNECT', \`cloudflared tunnel exited early (\${code ?? 'null'}\${signal ? \`, \${signal}\` : ''}).\`));
                        };
                        tunnel.once('url', onUrl);
                        tunnel.once('error', onError);
                        tunnel.once('exit', onExit);
                    }), {
                    timeout: options.timeout ?? TUNNEL_TIMEOUT,
                    errorMessage: 'cloudflared tunnel took too long to connect.'
                });
                if (typeof cloudflareUrl === 'string') {
                    return cloudflareUrl;
                }
            } catch (error) {
                debug('cloudflared failed, falling back to ngrok:', error);
            }
        }
        const modernNgrok = this.ngrokModule !== undefined ? this.ngrokModule : resolveModernNgrok(this.projectRoot);
        this.ngrokModule = modernNgrok;
        const modernAuthtoken = getNgrokAuthtoken(configPath);
        if (modernNgrok && modernAuthtoken && !isExpoSharedToken(modernAuthtoken)) {
            const modernResults = await (0, _delay.resolveWithTimeout)(async ()=>{
                const listener = await modernNgrok.forward({
                    addr: this.port,
                    authtoken: modernAuthtoken,
                    force_new_session: true
                });
                const tunnelUrl = listener.url();
                if (!tunnelUrl) {
                    await listener.close();
                    throw new _errors.CommandError('NGROK_CONNECT', 'Modern ngrok listener did not return a public URL.');
                }
                this.listener = listener;
                _log.log('Tunnel connected.');
                return tunnelUrl;
            }, {
                timeout: options.timeout ?? TUNNEL_TIMEOUT,
                errorMessage: 'ngrok tunnel took too long to connect.'
            });
            if (typeof modernResults === 'string') {
                return modernResults;
            }
        }
        const instance = await this.resolver.resolveAsync({
            shouldPrompt: false,
            autoInstall: false
        });
        const results = await (0, _delay.resolveWithTimeout)(()=>this.connectToNgrokInternalAsync(instance, attempts), {
            timeout: options.timeout ?? TUNNEL_TIMEOUT,
            errorMessage: 'ngrok tunnel took too long to connect.'
        });
        if (typeof results === 'string') {
            return results;
        }
        await (0, _delay.delayAsync)(100);
        return this._connectToNgrokAsync(options, attempts + 1);
    }
    async _getConnectionPropsAsync() {`,
    "AsyncNgrok _connectToNgrokAsync"
  );

  next = next.replace(/LEGACY_(?:LEGACY_)+NGROK_CONFIG/g, "LEGACY_NGROK_CONFIG");

  return next;
});

updateFile(urlCreatorPath, (source) => {
  if (source.includes("parsed.protocol.replace(':', '')")) {
    return source;
  }

  return replaceRegexOrThrow(
    source,
    /return \{\s*port: parsed\.port,\s*hostname: parsed\.hostname,\s*protocol: options\.scheme \?\? 'http'\s*\};/,
    `return {
            port: parsed.port,
            hostname: parsed.hostname,
            protocol: options.scheme ?? (parsed.protocol ? parsed.protocol.replace(':', '') : 'http')
        };`,
    "UrlCreator tunnel protocol"
  );
});
