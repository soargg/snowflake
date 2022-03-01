export interface Range {
    start: Location;
    end: Location;
}
export interface BranchMapping {
    loc: Range;
    type: string;
    locations: Range[];
    line: number;
}
export interface FunctionMapping {
    name: string;
    decl: Range;
    loc: Range;
    line: number;
}
export interface SourceCoverageData {
    path: string;
    statementMap: { [key: string]: Range };
    fnMap: { [key: string]: FunctionMapping };
    branchMap: { [key: string]: BranchMapping };
    s: { [key: string]: number };
    f: { [key: string]: number };
    b: { [key: string]: number[] };
}

interface SourceMeta {
    last: {
        s: number;
        f: number;
        b: number;
    }
} 

export class SourceCoverage {
    // statement、branch、function数量统计
    private meta: SourceMeta = {
        last: {
            s: 0,
            f: 0,
            b: 0
        }
    }

    public data: SourceCoverageData = {
        path: '',
        statementMap: {},
        fnMap: {},
        branchMap: {},
        s: {},
        f: {},
        b: {}
    };

    constructor() {}

    public newStatement() {
        const s: number = this.meta.last.s;
        this.data.s[s] = 0;
        this.meta.last.s += 1;
        return s;
    }

    public newFunction() {
        const f: number = this.meta.last.f;
        this.data.f[f] = 0;
        this.meta.last.f += 1;
        return f;
    }

    public newBranch() {
        const b: number = this.meta.last.b;
        this.meta.last.b += 1;
        return b;
    }
}