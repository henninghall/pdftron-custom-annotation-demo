import { imageData } from "./imageData";
import { transformToIssueXml } from "./xmlParser";

const annotation = `<issue id="1" page="0" x="1000" y="900"/>`;
const xfdf = `<annots>${annotation}</annots>`;

describe("xmlParser", () => {
  it("should parse xml", () => {
    const pin = `<STAMP id="1" page="0" rect="1000,900,1050,950" xmlns="http://www.w3.org/1999/xhtml"><IMAGEDATA>${imageData}</IMAGEDATA></STAMP>`;
    expect(transformToIssueXml(xfdf)).toEqual(`<annots>${pin}</annots>`);
  });
});
