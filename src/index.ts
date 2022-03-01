import ts from 'typescript';
import { Visitor } from './visitor';

import type { TransformationContext, SourceFile, VisitResult, Node } from 'typescript';

export function snowflake (context: TransformationContext) {
    const v = new Visitor(context);
    
    return (source: SourceFile) => {
        function visitor(node: Node): VisitResult<Node>  {
            // function 定义
            if (ts.isFunctionDeclaration(node)) {
                return v.functionDeclaration(node);
            }
            // 箭头函数
            if (ts.isArrowFunction(node)) {
                return v.arrowFunction(node);
            }
            // 成员函数
            if (ts.isMethodDeclaration(node)) {
                return v.methodDeclaration(node);
            }

            return ts.visitEachChild(node, visitor, context);
        };

        return ts.visitNode(source, visitor);
    }
}