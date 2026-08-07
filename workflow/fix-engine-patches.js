const fs = require('fs');
const path = require('path');

/**
 * 引擎补丁脚本（幂等）
 *
 * 修复已知坑位：
 *  1. @types/three 语法错误：全局 npm 目录（如 C:\Users\<user>\node_modules\@types\three）
 *     若存在新版 @types/three，其 d.ts 使用 TS5 新语法，会被 TS4.9 的 native-pack-tool
 *     自动拾取（typeRoots 向上搜索），导致 TS1005 构建失败。
 *     修复：在 native-pack-tool/tsconfig.json 显式声明 "types"，阻止向上搜索。
 */
const ENGINE_DIR = path.join(__dirname, '..', 'packages', 'engine');

function patchNativePackToolTsconfig() {
    const tsconfigPath = path.join(ENGINE_DIR, 'scripts', 'native-pack-tool', 'tsconfig.json');
    if (!fs.existsSync(tsconfigPath)) {
        console.log('[patch] 跳过 native-pack-tool tsconfig（不存在）');
        return;
    }
    const raw = fs.readFileSync(tsconfigPath, 'utf8');
    // tsconfig 允许尾随逗号（JSON5），JSON.parse 前先清理
    const clean = raw.replace(/,(?=\s*[}\]])/g, '');
    const config = JSON.parse(clean);
    if (!config.compilerOptions) config.compilerOptions = {};
    const current = config.compilerOptions.types;
    if (Array.isArray(current) && current.includes('node') && current.includes('xml2js')) {
        console.log('[patch] native-pack-tool tsconfig 已包含 types 白名单，跳过');
        return;
    }
    config.compilerOptions.types = ['node', 'xml2js'];
    fs.writeFileSync(tsconfigPath, JSON.stringify(config, null, 4) + '\n', 'utf8');
    console.log('[patch] 已应用 native-pack-tool tsconfig types 白名单（修复 @types/three 冲突）');
}

patchNativePackToolTsconfig();
console.log('引擎补丁应用完成');
