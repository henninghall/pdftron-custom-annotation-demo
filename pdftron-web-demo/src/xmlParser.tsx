// import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
import { imageData } from "./imageData";

export const transformToIssueXml = (source: string): string => {
  const parser = new DOMParser();
  const obj = parser.parseFromString(source, "text/xml");
  const size = 50;
  const annots = obj.getElementsByTagName("annots")[0];
  const issueAnnots = obj.getElementsByTagName("issue");

  for (let index = 0; index < issueAnnots.length; index++) {
    const issue = issueAnnots[index];
    const id = issue.getAttribute("id")!;
    const page = issue.getAttribute("page")!;
    const x = parseInt(issue.getAttribute("x")!);
    const y = parseInt(issue.getAttribute("y")!);

    const newElement = document.createElement("stamp");
    const rec = `${x},${y},${x + size},${y + size}`;
    const imagedata = document.createElement("imagedata");
    imagedata.innerHTML = imageData;
    newElement.appendChild(imagedata);
    newElement.setAttribute("id", id);
    newElement.setAttribute("page", page);
    newElement.setAttribute("rect", rec);
    const serializer = new XMLSerializer();
    annots.appendChild(newElement);
    return serializer.serializeToString(annots);
  }
  return "";
};
