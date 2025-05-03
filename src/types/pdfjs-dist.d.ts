// Provide basic type declaration for pdfjs-dist to support dynamic import
declare module "pdfjs-dist" {
  const GlobalWorkerOptions: any;
  export { GlobalWorkerOptions };
}

