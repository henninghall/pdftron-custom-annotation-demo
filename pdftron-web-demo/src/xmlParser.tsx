import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { imageData } from "./imageData";

export const size = 200;

type IssueNode = { parent: any; issues: any };

// Alternative to custom annotation
export const transformIssueXml = (xml: string): string => {
  const { issueNodes, xmlObj } = parseXml(xml);
  issueNodes.forEach(transformToStamp);
  return buildXml(xmlObj);
};

function parseXml(xml: string) {
  const issuePaths = new Set<string>();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeValueProcessor: (_, __, jPath) => {
      if (jPath.endsWith(".issue")) issuePaths.add(jPath);
    },
  });
  const xmlObj = parser.parse(xml);
  const issueNodes = Array.from(issuePaths).map(getIssueNodes(xmlObj));
  return { issueNodes, xmlObj };
}

function buildXml(xmlObj: any) {
  const builder = new XMLBuilder({ ignoreAttributes: false });
  return builder.build(xmlObj);
}

function transformToStamp({ issues, parent }: IssueNode) {
  parent.stamp = issues.map(toStamp);
  delete parent.issue;
}

function toStamp(issue: Record<string, string>) {
  const x = parseInt(issue["@_x"]);
  const y = parseInt(issue["@_y"]);
  return {
    "@_id": issue["@_id"],
    "@_page": issue["@_page"],
    "@_rect": `${x},${y},${x + size},${y + size}`,
    imagedata: imageData,
  };
}

const getIssueNodes =
  (jsonObj: any) =>
  (issuesPath: string): IssueNode => {
    return issuesPath.split(".").reduce(
      (acc, cur) =>
        cur === "issue"
          ? ({
              parent: acc,
              issues: Array.isArray(acc[cur]) ? acc[cur] : [acc[cur]],
            } as IssueNode)
          : acc[cur],
      jsonObj
    );
  };
