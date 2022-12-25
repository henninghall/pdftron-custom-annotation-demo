import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { imageData } from "./imageData";

export const size = 200;

// Alternative to custom annotation
export const transformToIssueXml = (source: string, image: string): string => {
  const issuePaths = new Set<string>();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeValueProcessor: (_, __, jPath) => {
      if (jPath.endsWith(".issue")) issuePaths.add(jPath);
    },
  });
  const jsonObj = parser.parse(source);

  issuePaths.forEach((issuesPath) => {
    const pathParts = issuesPath.split(".");

    const issuesParent = pathParts.reduce(
      (acc, cur, currentIndex, array) =>
        currentIndex === array.length - 1 ? acc : acc[cur],
      jsonObj
    );
    const issueNode = issuesParent.issue;

    issuesParent.stamp = Array.isArray(issueNode)
      ? issueNode.map(toImage)
      : toImage(issueNode);

    delete issuesParent.issue;
  });

  const builder = new XMLBuilder({ ignoreAttributes: false });
  return builder.build(jsonObj);
};

const toImage = (issue: any) => {
  const x = parseInt(issue["@_x"]);
  const y = parseInt(issue["@_y"]);
  return {
    "@_id": issue["@_id"],
    "@_page": issue["@_page"],
    "@_rect": `${x},${y},${x + size},${y + size}`,
    imagedata: imageData,
  };
};
