const ts = require('typescript');
const path = require('path');
const filename = path.resolve(__dirname, './test.ts');
const { snowflake } = require('./lib/index')

const program = ts.createProgram({
    rootNames: [filename],
    options: {}
});

const sourceFile = program.getSourceFile(filename);

const { transformed } = ts.transform(sourceFile, [ snowflake ]);

const printer = ts.createPrinter();
const code = printer.printNode(0, transformed[0], transformed[0]);

console.log(code)

