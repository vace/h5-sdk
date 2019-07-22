import createAnalysisMini from './analysis.mini'
import createAnalysisWeb from './analysis.web'

import { IAnalysis } from './interface';

let analysis: IAnalysis
/**
 * @var {string} 这个变量由rollup根据环境替换
 */
let platform = '__PLANTFORM__'

if (platform === 'web') {
  analysis = createAnalysisWeb()
} else if (platform === 'mini') {
  analysis = createAnalysisMini()
}

export { analysis }
