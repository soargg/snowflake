import ts from 'typescript';
import { SourceCoverage } from './sourceCoverage';
import type {
    TransformationContext,
    NodeFactory,
    Statement,
    FunctionDeclaration,
    ArrowFunction,
    MethodDeclaration
} from 'typescript';

const COVERAGE_FUNCTION = 'yydsbby';

export class Visitor {
    private context: TransformationContext;
    private factory: NodeFactory;

    public sourceCov: SourceCoverage;

    constructor(context: TransformationContext) {
        this.context = context;
        this.factory = this.context.factory;
        this.sourceCov = new SourceCoverage();
    }

    private createFunctionCounter(): Statement {
        const index = this.sourceCov.newFunction();
        return this.createCounter('f', index)
    }

    // yydsbby()['f'] ++
    private createCounter(type: 's' | 'f' | 'n', index: number): Statement {
        const factory = this.factory;

        return factory.createExpressionStatement(
            factory.createPostfixUnaryExpression(
                factory.createElementAccessExpression(
                    factory.createElementAccessExpression(
                        factory.createCallExpression(
                            factory.createIdentifier(COVERAGE_FUNCTION),
                            undefined,
                            []
                        ),
                        factory.createStringLiteral(type)
                    ),
                    factory.createNumericLiteral(index)
                ),
                ts.SyntaxKind.PlusPlusToken
            )
        );
    }

    // function 定义
    public functionDeclaration(node: FunctionDeclaration): FunctionDeclaration {
        const factory = this.factory;
        const funBody = node.body;
        return factory.updateFunctionDeclaration(
            node,
            node.decorators,
            node.modifiers,
            node.asteriskToken,
            node.name,
            node.typeParameters,
            node.parameters,
            node.type,
            factory.updateBlock(funBody, [this.createFunctionCounter(), ...funBody.statements])
        );
    }
    // 箭头函数
    public arrowFunction(node: ArrowFunction) {
        const factory = this.factory;
        const statements = [this.createFunctionCounter()];

        if (ts.isBlock(node.body)) {
            [].push.apply(statements, node.body.statements);
        } else {
            const children = node.getChildren();
            const count = node.getChildCount();
            const funBody = count ? children[count - 1] : null;

            if (funBody) {
                statements.push(factory.createReturnStatement({...funBody, _expressionBrand: 'return funBody'}));
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
    // 成员函数
    public methodDeclaration(node: MethodDeclaration) {
        const factory = this.factory;
        const funBody = node.body;       
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
            factory.updateBlock(funBody, [this.createFunctionCounter(), ...funBody.statements])
        );
    }

    test() {
        console.log(this.sourceCov.data)
    }
}