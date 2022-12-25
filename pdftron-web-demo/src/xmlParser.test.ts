import { imageData } from "./imageData";
import { transformToIssueXml } from "./xmlParser";

const annotation = `<issue id="1" page="0" x="1000" y="900"/>`;
const xfdf = `<annots>${annotation}</annots>`;
const image = `<imagedata>${imageData}</imagedata>`;

describe("xmlParser", () => {
  it("should be equal", () => {
    const annots = `<annots><stamp id="1" page="0" rect="1000,900,1200,1100"><imagedata>data:image/png;base64,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</imagedata></stamp></annots>`;
    expect(transformToIssueXml(xfdf, image)).toEqual(annots);
  });

  it("should parse multiple annotations", () => {
    const xfdf = `
      <annots>
        <issue id="1" page="0" x="100" y="200"/>
        <issue id="2" page="0" x="300" y="400"/>
      </annots>
      `;
    const expected = `
      <annots>
        <stamp id="1" page="0" rect="100,200,300,400">${image}</stamp>
        <stamp id="2" page="0" rect="300,400,500,600">${image}</stamp>
      </annots>
      `;
    expectEqualXml(transformToIssueXml(xfdf, image), expected);
  });

  it("should include xfdf tags", () => {
    const xfdf = `
    <xfdf>
      <annots>
        <issue id="1" page="0" x="100" y="200"/>
      </annots>
    </xfdf>
      `;
    const expected = `
    <xfdf>
      <annots>
        <stamp id="1" page="0" rect="100,200,300,400">${image}</stamp>
      </annots>
    </xfdf>
      `;
    expectEqualXml(transformToIssueXml(xfdf, image), expected);
  });
});

function expectEqualXml(actual: string, expected: string) {
  const removeLinesAndSpaces = (str: string) =>
    str.replace(/([ ] +)/g, "").replace(/\n/g, "");
  expect(removeLinesAndSpaces(actual)).toEqual(removeLinesAndSpaces(expected));
}
