import ts from 'typescript';
import type { TransformationContext, SourceFile, Expression } from 'typescript';

export default function(context: TransformationContext) {
    const { factory } = context;
    return (node: SourceFile) => {
        function visitor(node: any) {
            if (ts.isArrowFunction(node)) {
                const children = node.getChildren();
                const count = node.getChildCount();
                const funBody = count ? children[count - 1] : null;
                
                if (funBody && !ts.isBlock(funBody)) {
                    // const temp = factory.createCallExpression(factory.createIdentifier('say'), undefined, [factory.createNumericLiteral(0)])
                    return factory.updateArrowFunction(
                        node,
                        node.modifiers,
                        node.typeParameters,
                        node.parameters,
                        node.type,
                        node.equalsGreaterThanToken,
                        factory.createBlock([factory.createReturnStatement(funBody as Expression)])
                    );
                }
            }
            return ts.visitEachChild(node, visitor, context);
        }

        return ts.visitNode(node, visitor);
    }
}