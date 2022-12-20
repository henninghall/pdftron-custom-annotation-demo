// import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
import { imageData } from "./imageData";

export const transformToIssueXml = (source: string): string => {
  const parser = new DOMParser();
  const obj = parser.parseFromString(source, "text/xml");
  const size = 50;
  const newAnnots = document.createElement("annots", { is: "" });
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
    newAnnots.appendChild(newElement);
    return lowerCaseTags(removeXmlns(serializer.serializeToString(newAnnots)));
  }
  throw Error("invalid format");
};

const removeXmlns = (xml: string) =>
  xml.replaceAll(` xmlns=\"http://www.w3.org/1999/xhtml\"`, ``);

const lowerCaseTags = (xml: string) =>
  xml
    .replaceAll(`ANNOTS`, `annots`)
    .replaceAll(`IMAGEDATA`, `imagedata`)
    .replaceAll(`STAMP`, `stamp`);
