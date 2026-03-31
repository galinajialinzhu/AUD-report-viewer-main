/**
 * Figma 颜色提取脚本
 * 
 * 使用方法：
 * 1. 在 Figma 中，选择要提取颜色的元素
 * 2. 复制颜色值（HEX格式）
 * 3. 运行此脚本生成 CSS 变量格式
 * 
 * 或者使用 Figma API（需要 API token）
 */

// 示例：手动输入的颜色值
const figmaColors = [
  { name: 'primary', value: '#1B3A5C' },
  { name: 'secondary', value: '#15803D' },
  { name: 'background', value: '#FAFAF7' },
  // 添加更多颜色...
];

/**
 * 将 Figma 颜色转换为 CSS 变量格式
 */
function generateCSSVariables(colors) {
  console.log('/* 从 Figma 提取的颜色 - 添加到 app/globals.css */\n');
  console.log('@theme inline {');
  
  colors.forEach(color => {
    const cssVarName = `--color-report-${color.name.replace(/\s+/g, '-').toLowerCase()}`;
    console.log(`  ${cssVarName}: ${color.value};`);
  });
  
  console.log('}\n');
}

/**
 * 生成 Tailwind 类名映射
 */
function generateTailwindMapping(colors) {
  console.log('/* Tailwind 类名映射 - 添加到 lib/report-styles.ts */\n');
  
  colors.forEach(color => {
    const varName = color.name.replace(/\s+/g, '-').toLowerCase();
    console.log(`bg-report-${varName}: "bg-report-${varName}",`);
    console.log(`text-report-${varName}: "text-report-${varName}",`);
  });
}

// 运行
if (require.main === module) {
  console.log('=== Figma 颜色提取工具 ===\n');
  generateCSSVariables(figmaColors);
  console.log('\n=== Tailwind 映射 ===\n');
  generateTailwindMapping(figmaColors);
}

module.exports = { generateCSSVariables, generateTailwindMapping };
