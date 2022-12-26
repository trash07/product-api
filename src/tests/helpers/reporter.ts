import {
	DisplayProcessor,
	SpecReporter,
	StacktraceOption,
} from 'jasmine-spec-reporter';
// @ts-ignore
import SuiteInfo = jasmine.SuiteInfo;

class CustomProcessor extends DisplayProcessor {
	public displayJasmineStarted(info: SuiteInfo, log: string): string {
		return `TypeScript ${log}`;
	}
}

// @ts-ignore
jasmine.getEnv().clearReporters();
// @ts-ignore
jasmine.getEnv().addReporter(
	// @ts-ignore
	new SpecReporter({
		spec: {
			displayStacktrace: StacktraceOption.NONE,
		},
		customProcessors: [CustomProcessor],
	})
);
