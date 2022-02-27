const ts = require('typescript');
const path = require('path');
const filename = path.resolve(__dirname, '../test.ts');

const program = ts.createProgram({
    rootNames: [filename],
    options: {}
});

const sourceFile = program.getSourceFile(filename);
program.getSourceFile()

const nod = ts.createSourceFile('temp.ts', 'console.log(456)');

const { transformed } = ts.transform(sourceFile, [
    function(context) {
        const { factory } = context;
        return (source) => {
            function visitor(node) {
                if (ts.isFunctionDeclaration(node)) {
                    const funBody = node.body;
                    if (ts.isBlock(funBody)) {
                        const temp = factory.createCallExpression(factory.createIdentifier('say'), undefined, [factory.createNumericLiteral(0)])
                        return factory.updateFunctionDeclaration(
                            node,
                            node.decorators,
                            node.modifiers,
                            node.asteriskToken,
                            node.name,
                            node.typeParameters,
                            node.parameters,
                            node.type,
                            factory.updateBlock(funBody, [temp, ...funBody.statements])
                        );
                    }
                }

                if (ts.isArrowFunction(node)) {
                    const temp = factory.createCallExpression(factory.createIdentifier('say'), undefined, [factory.createNumericLiteral(0)])
                    const statements = [temp];
                    if (ts.isBlock(node.body)) {
                        [].push.apply(statements, node.body.statements);
                    } else {
                        const children = node.getChildren();
                        const count = node.getChildCount();
                        const funBody = count ? children[count - 1] : null;
                        if (funBody) {
                            statements.push(factory.createReturnStatement(funBody))
                        }
                    }

                    return factory.updateArrowFunction(
                        node,
                        node.modifiers,
                        node.typeParameters,
                        node.parameters,
                        node.type,
                        node.equalsGreaterThanToken,
                        factory.createBlock(statements, true)
                    );
                }

                if (ts.isMethodDeclaration(node)) {
                    const funBody = node.body;
                    if (ts.isBlock(funBody)) {
                        const temp = factory.createCallExpression(factory.createIdentifier('say'), undefined, [factory.createNumericLiteral(0)])
                        return factory.updateMethodDeclaration(
                            node,
                            node.decorators,
                            node.modifiers,
                            node.asteriskToken,
                            node.name,
                            node.questionToken,
                            node.typeParameters,
                            node.parameters,
                            node.type,
                            factory.updateBlock(funBody, [temp, ...funBody.statements])
                        );
                    }
                }

                return ts.visitEachChild(node, visitor, context);
            };

            const newnode = ts.visitNode(source, visitor);
            return factory.updateSourceFile(newnode, [newnode, nod])
        }
    }
]);

const printer = ts.createPrinter();
const code = printer.printNode(0, transformed[0], transformed[0]);

console.log(code)

