import { useEffect, useRef, useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";

import WebViewer, { WebViewerInstance } from "@pdftron/webviewer";

function App() {
  const [ref, setRef] = useState<WebViewerInstance>();

  useEffect(() => {
    WebViewer(
      {
        path: "/webviewer",
      },
      document.getElementById("viewer")!
    ).then((instance) => {
      console.log("settings instance");

      setRef(instance);
      const { UI, Core } = instance;
      const { documentViewer, annotationManager, Tools, Annotations } = Core;
      // call methods from UI, Core, documentViewer and annotationManager as needed

      documentViewer.addEventListener("documentLoaded", () => {
        // call methods relating to the loaded document
      });

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
  const { Annotations, annotationManager } = instance.Core;

  class IssueAnnotation extends Annotations.CustomAnnotation {
    constructor(...args: any[]) {
      super("issue"); // provide the custom XFDF element name
      this.Subject = "issue";
    }
    draw(ctx: any, pageMatrix: any, ...args: any[]) {
      // the setStyles function is a function on markup annotations that sets up
      // certain properties for us on the canvas for the annotation's stroke thickness.
      this.setStyles(ctx, pageMatrix);

      // first we need to translate to the annotation's x/y coordinates so that it's
      // drawn in the correct location
      ctx.translate(this.X, this.Y);
      ctx.beginPath();
      ctx.moveTo(this.Width / 2, 0);
      ctx.lineTo(this.Width, this.Height);
      ctx.lineTo(0, this.Height);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  Annotations.setCustomSerializeHandler(
    IssueAnnotation,
    function (element, pageMatrix, options) {
      console.log("serilize", { element, options });

      // const annot = options.annotation;
      options.originalSerialize(element, pageMatrix);
      // if (annot.Width > 100) {
      //   element.setAttribute("myAttr", annot.myProperty);
      // }
      return element;
    }
  );

  Annotations.setCustomDeserializeHandler(
    IssueAnnotation,
    function (element, pageMatrix, options) {
      const annot = options.annotation;
      const x = element.getAttribute("x");
      const y = element.getAttribute("y");
      console.log("deserilize", {
        element,
        options,
        y: element.getAttribute("y"),
        rect: element.getAttribute("rect"),
        a: element,
      });

      if (!x || !y) throw new Error("x or y is missing");
      annot["rect"] = [x, y, x + 100, y + 100].join(",");
      options.originalDeserialize(element, pageMatrix);

      // if (annot.Width > 100) {
      //   annot.myProperty = element.getAttribute('myAttr');
      // }
    }
  );

  // this is necessary to set the elementName before instantiation
  IssueAnnotation.prototype.elementName = "issue";
  const bool = annotationManager.registerAnnotationType(
    IssueAnnotation.prototype.elementName,
    IssueAnnotation
  );
  console.log("bool", bool);

  return (
    <>
      <button
        onClick={async () => {
          const xfdf = `
          <annots>
            <issue 
              name="issue-id"
              x="1000"
              y="900"
              page="0" 
               rect="1100,850,1210,960"
            />
            </annots>`;
          // rect="1100,850,1210,960"

          console.log("importing annotations");
          const annots = await annotationManager!.importAnnotations(xfdf);
          console.log(annots);
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
