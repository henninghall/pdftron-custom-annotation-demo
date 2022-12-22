import { useEffect, useState } from "react";
import "./App.css";

import WebViewer, { WebViewerInstance } from "@pdftron/webviewer";
import { initIssueAnnotation } from "./IssueAnnotation";
import { pdfDocument } from "./pdfDocument";
import { xfdf } from "./xfdf";
import { transformToIssueXml } from "./xmlParser";

function App() {
  const [ref, setRef] = useState<WebViewerInstance>();

  useEffect(() => {
    WebViewer(
      {
        path: "/webviewer",
      },
      document.getElementById("viewer")!
    ).then((instance) => {
      setRef(instance);
      instance.UI.loadDocument(pdfDocument);
    });
  }, []);

  return (
    <div>
      <div style={{ width: 500, height: 500 }} id="viewer" />
      <div className="card">{ref && <Content instance={ref} />}</div>
    </div>
  );
}

function Content({ instance }: { instance: WebViewerInstance }) {
  const { annotationManager } = instance.Core;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <button
        onClick={async () => {
          initIssueAnnotation(instance);
          await annotationManager!.importAnnotations(xfdf);
        }}
      >
        Import annotations (custom annotation)
      </button>
      <button
        onClick={async () => {
          const annots = transformToIssueXml(xfdf);
          await annotationManager!.importAnnotations(annots);
        }}
      >
        Import annotations (transform xml)
      </button>
      <button
        onClick={async () => {
          const annots = annotationManager!.getAnnotationsList();
          annotationManager!.deleteAnnotations(annots);
        }}
      >
        Delete annotations
      </button>
    </div>
  );
}

export default App;
