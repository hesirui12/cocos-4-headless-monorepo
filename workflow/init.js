const utils = require('./utils');

/**
 * 初始化，更新仓库以及同步代码等操作，目前强制更新
 * @returns {Promise<void>}
 */
(async () => {
    console.log('初始化\n');
    const forceFlag = '--force';
    // update repo（engine 已 vendored 进 monorepo，仅拉取 external 原生 SDK）
    await utils.runCommand('node', ['./workflow/update-repo.js', forceFlag].filter(Boolean));

    await utils.runCommand('npm run install:engine');

    // 应用引擎补丁（@types/three 冲突等），幂等
    await utils.runCommand('node', ['./workflow/fix-engine-patches.js']);

    console.log('\n初始化完成\n');
})();
