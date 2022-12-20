import { useEffect, useState } from "react";
import "./App.css";

import WebViewer, { WebViewerInstance } from "@pdftron/webviewer";
import { initIssueAnnotation } from "./IssueAnnotation";
import { transformToIssueXml } from "./xmlParser";

const xfdf = `<annots><issue id="1" page="0" x="1000" y="900"/><issue id="2" page="0" x="1100" y="900" /></annots>`;

function App() {
  const [ref, setRef] = useState<WebViewerInstance>();

  transformToIssueXml(xfdf);

  useEffect(() => {
    WebViewer(
      {
        path: "/webviewer",
      },
      document.getElementById("viewer")!
    ).then((instance) => {
      setRef(instance);
      instance.UI.loadDocument(
        "https://testibinderstatic.z16.web.core.windows.net/test/A03-57-002.PDF"
      );
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
  initIssueAnnotation(instance);

  return (
    <>
      <button
        onClick={async () => {
          await annotationManager!.importAnnotations(xfdf);
        }}
      >
        Import annotations
      </button>
      <button
        onClick={async () => {
          const annots = await annotationManager!.exportAnnotations();
          console.log(annots);
        }}
      >
        Export annotations
      </button>
    </>
  );
}

export default App;
