/**
 * @file Design System Test Runner
 * @description Test orchestration and reporting for comprehensive design system validation
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface TestResult {
  category: string;
  passed: boolean;
  coverage?: number;
  errors?: string[];
  duration?: number;
}

interface TestReport {
  timestamp: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  coverage: number;
  results: TestResult[];
  summary: {
    cssGlobals: TestResult;
    visualValidation: TestResult;
    performance: TestResult;
    accessibility: TestResult;
    integration: TestResult;
    e2eVisual: TestResult;
  };
}

class DesignSystemTestRunner {
  private results: TestResult[] = [];
  private startTime: number = Date.now();

  async runAllTests(): Promise<TestReport> {
    console.log('🚀 Starting FlickPick Design System Test Suite...\n');

    // Run each test category
    await this.runTestCategory('CSS Globals & Design Tokens', 'design-system/css-globals.test.ts');
    await this.runTestCategory('Visual Design Validation', 'design-system/visual-validation.test.ts');
    await this.runTestCategory('Performance & Optimization', 'design-system/performance.test.ts');
    await this.runTestCategory('Accessibility Compliance', 'design-system/accessibility.test.ts');
    await this.runTestCategory('Integration Tests', 'design-system/integration.test.ts');
    await this.runTestCategory('E2E Visual Tests', '../tests/e2e/design-system-visual.spec.ts');

    return this.generateReport();
  }

  private async runTestCategory(category: string, testPath: string): Promise<void> {
    console.log(`📋 Running ${category} tests...`);
    const startTime = Date.now();

    try {
      let command: string;
      
      if (testPath.includes('e2e')) {
        command = `npx playwright test ${testPath} --reporter=json`;
      } else {
        command = `npx jest __tests__/${testPath} --coverage --json`;
      }

      const output = execSync(command, {
        encoding: 'utf8',
        stdio: 'pipe'
      });

      const duration = Date.now() - startTime;
      const result = this.parseTestOutput(output, category, duration);
      this.results.push(result);

      if (result.passed) {
        console.log(`✅ ${category}: PASSED (${duration}ms)\n`);
      } else {
        console.log(`❌ ${category}: FAILED (${duration}ms)`);
        if (result.errors) {
          result.errors.forEach(error => console.log(`   - ${error}`));
        }
        console.log();
      }
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      this.results.push({
        category,
        passed: false,
        duration,
        errors: [error.message]
      });

      console.log(`❌ ${category}: FAILED (${duration}ms)`);
      console.log(`   - ${error.message}\n`);
    }
  }

  private parseTestOutput(output: string, category: string, duration: number): TestResult {
    try {
      const result: TestResult = {
        category,
        passed: false,
        duration
      };

      // Try to parse Jest JSON output
      if (output.includes('"success"')) {
        const jsonMatch = output.match(/\{.*\}/s);
        if (jsonMatch) {
          const jestResult = JSON.parse(jsonMatch[0]);
          result.passed = jestResult.success;
          result.coverage = jestResult.coverageMap ? 
            this.calculateCoverage(jestResult.coverageMap) : undefined;
        }
      }
      
      // Try to parse Playwright output
      else if (output.includes('passed') || output.includes('failed')) {
        result.passed = !output.includes('failed');
      }

      // Fallback - check for common success indicators
      else {
        result.passed = !output.toLowerCase().includes('error') && 
                       !output.toLowerCase().includes('failed');
      }

      return result;
    } catch (error) {
      return {
        category,
        passed: false,
        duration,
        errors: ['Failed to parse test output']
      };
    }
  }

  private calculateCoverage(coverageMap: any): number {
    try {
      const files = Object.values(coverageMap);
      let totalLines = 0;
      let coveredLines = 0;

      files.forEach((file: any) => {
        if (file.s) { // Statement coverage
          totalLines += Object.keys(file.s).length;
          coveredLines += Object.values(file.s).filter(s => s > 0).length;
        }
      });

      return totalLines > 0 ? Math.round((coveredLines / totalLines) * 100) : 0;
    } catch {
      return 0;
    }
  }

  private generateReport(): TestReport {
    const totalDuration = Date.now() - this.startTime;
    const passedTests = this.results.filter(r => r.passed).length;
    const totalTests = this.results.length;
    const failedTests = totalTests - passedTests;

    const overallCoverage = this.results
      .filter(r => r.coverage !== undefined)
      .reduce((acc, r) => acc + (r.coverage || 0), 0) / 
      this.results.filter(r => r.coverage !== undefined).length || 0;

    const report: TestReport = {
      timestamp: new Date().toISOString(),
      totalTests,
      passedTests,
      failedTests,
      coverage: Math.round(overallCoverage),
      results: this.results,
      summary: {
        cssGlobals: this.results.find(r => r.category.includes('CSS')) || { category: 'CSS Globals', passed: false },
        visualValidation: this.results.find(r => r.category.includes('Visual Design')) || { category: 'Visual Validation', passed: false },
        performance: this.results.find(r => r.category.includes('Performance')) || { category: 'Performance', passed: false },
        accessibility: this.results.find(r => r.category.includes('Accessibility')) || { category: 'Accessibility', passed: false },
        integration: this.results.find(r => r.category.includes('Integration')) || { category: 'Integration', passed: false },
        e2eVisual: this.results.find(r => r.category.includes('E2E')) || { category: 'E2E Visual', passed: false }
      }
    };

    this.printReport(report, totalDuration);
    this.saveReport(report);

    return report;
  }

  private printReport(report: TestReport, duration: number): void {
    console.log('\n' + '='.repeat(80));
    console.log('🎯 FLICKPICK DESIGN SYSTEM TEST REPORT');
    console.log('='.repeat(80));
    console.log(`📅 Timestamp: ${report.timestamp}`);
    console.log(`⏱️  Total Duration: ${duration}ms`);
    console.log(`📊 Test Results: ${report.passedTests}/${report.totalTests} passed`);
    console.log(`📈 Overall Coverage: ${report.coverage}%`);
    console.log();

    // Category Results
    console.log('📋 Test Categories:');
    Object.entries(report.summary).forEach(([key, result]) => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      const coverage = result.coverage ? ` (${result.coverage}% coverage)` : '';
      console.log(`   ${status} ${result.category}${coverage}`);
    });
    console.log();

    // Performance Metrics
    console.log('⚡ Performance Metrics:');
    const performanceResult = report.summary.performance;
    if (performanceResult.passed) {
      console.log('   ✅ 60fps target animations: PASS');
      console.log('   ✅ CSS bundle optimization: PASS');
      console.log('   ✅ Hardware acceleration: PASS');
    } else {
      console.log('   ❌ Performance targets not met');
    }
    console.log();

    // Accessibility Compliance
    console.log('♿ Accessibility Compliance:');
    const a11yResult = report.summary.accessibility;
    if (a11yResult.passed) {
      console.log('   ✅ WCAG 2.1 AA compliance: PASS');
      console.log('   ✅ Color contrast ratios: PASS');
      console.log('   ✅ Touch target sizes: PASS');
      console.log('   ✅ Reduced motion support: PASS');
    } else {
      console.log('   ❌ Accessibility requirements not met');
    }
    console.log();

    // Overall Result
    if (report.passedTests === report.totalTests) {
      console.log('🎉 ALL TESTS PASSED - Design System Ready for Production!');
    } else {
      console.log(`⚠️  ${report.failedTests} test(s) failed - Review and fix issues before deployment`);
    }
    console.log('='.repeat(80) + '\n');
  }

  private saveReport(report: TestReport): void {
    const reportsDir = path.join(process.cwd(), 'coverage', 'design-system-reports');
    
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const reportFile = path.join(reportsDir, `design-system-test-report-${Date.now()}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    console.log(`📄 Test report saved to: ${reportFile}`);
  }
}

// Export for use in other files
export { DesignSystemTestRunner, TestReport, TestResult };

// CLI runner
if (require.main === module) {
  const runner = new DesignSystemTestRunner();
  runner.runAllTests()
    .then(report => {
      process.exit(report.passedTests === report.totalTests ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Test runner failed:', error);
      process.exit(1);
    });
}