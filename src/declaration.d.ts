declare module '*.scss' {
    const classNames: Record<string, string>;
    export default classNames;
}
declare module "*.svg" {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    export default content;
}
