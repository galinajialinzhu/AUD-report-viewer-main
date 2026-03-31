/**
 * Figma 代码转换助手
 * 
 * 将 Figma 插件导出的代码转换为使用项目样式系统
 */

/**
 * 样式映射表
 * 将常见的 Figma 导出样式映射到项目样式系统
 */
const styleMapping = {
  // 容器
  'rounded-xl': 'cardContainer.base',
  'bg-white': 'bg-report-surface',
  'bg-gray-50': 'bg-report-surface-alt',
  'border border-gray-200': 'border border-report-border-light',
  
  // 文本
  'text-sm font-bold': 'textStyles.componentTitle',
  'text-base': 'textStyles.body',
  'text-xs text-gray-600': 'textStyles.bodySecondary',
  'text-xs font-semibold uppercase': 'textStyles.label',
  
  // 间距
  'p-5': 'cardContent.base',
  'px-5 py-3': 'cardHeader.base',
  
  // 颜色
  'text-gray-900': 'text-report-text',
  'text-gray-600': 'text-report-text-secondary',
  'text-gray-500': 'text-report-text-tertiary',
  'bg-blue-600': 'bg-report-accent',
  'text-blue-600': 'text-report-accent',
};

/**
 * 转换单个类名字符串
 */
function convertClassName(className) {
  // 检查是否有直接映射
  if (styleMapping[className]) {
    return styleMapping[className];
  }
  
  // 尝试部分匹配
  for (const [figmaStyle, projectStyle] of Object.entries(styleMapping)) {
    if (className.includes(figmaStyle)) {
      return projectStyle;
    }
  }
  
  // 如果没有匹配，返回原样（可能需要手动检查）
  return className;
}

/**
 * 转换完整的 JSX 代码
 */
function convertJSXCode(jsxCode) {
  // 这是一个简化的示例
  // 实际使用中可能需要更复杂的解析
  
  let converted = jsxCode;
  
  // 替换常见的硬编码样式
  converted = converted.replace(
    /className="([^"]+)"/g,
    (match, classes) => {
      const convertedClasses = classes
        .split(' ')
        .map(cls => convertClassName(cls))
        .filter(Boolean)
        .join(' ');
      
      return `className={cn(${convertedClasses.split(' ').map(c => `"${c}"`).join(', ')})}`;
    }
  );
  
  // 添加导入语句（如果还没有）
  if (!converted.includes("from '@/lib/report-styles'")) {
    converted = `import { cn } from '@/lib/report-styles';\n\n${converted}`;
  }
  
  return converted;
}

/**
 * 使用示例
 */
const exampleFigmaCode = `
<div className="flex flex-col p-5 bg-white rounded-xl border border-gray-200">
  <h3 className="text-sm font-bold text-gray-900">标题</h3>
  <p className="text-xs text-gray-600">内容</p>
</div>
`;

console.log('=== 原始 Figma 代码 ===');
console.log(exampleFigmaCode);
console.log('\n=== 转换后的代码 ===');
console.log(convertJSXCode(exampleFigmaCode));

module.exports = { convertClassName, convertJSXCode };
