import { imageData } from "./imageData";
import { transformIssueXml } from "./xmlParser";

const image = `<imagedata>${imageData}</imagedata>`;

describe("xmlParser", () => {
  it("should transform issues to stamps", () => {
    const xfdf = `
    <xfdf>
      <issue id="1" page="0" x="100" y="200"/>
    </xfdf>`;
    const expected = `
      <xfdf>
        <stamp id="1" page="0" rect="100,200,300,400">${image}</stamp>
      </xfdf>`;
    expectEqualXml(transformIssueXml(xfdf), expected);
  });

  it("should parse multiple annotations", () => {
    const xfdf = `
      <xfdf>
        <issue id="1" page="0" x="100" y="200"/>
        <issue id="2" page="0" x="300" y="400"/>
      </xfdf>
      `;
    const expected = `
      <xfdf>
        <stamp id="1" page="0" rect="100,200,300,400">${image}</stamp>
        <stamp id="2" page="0" rect="300,400,500,600">${image}</stamp>
      </xfdf>
      `;
    expectEqualXml(transformIssueXml(xfdf), expected);
  });

  it("should include annots tags", () => {
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
    expectEqualXml(transformIssueXml(xfdf), expected);
  });

  it("should parse issues on different levels", () => {
    const xfdf = `
    <xfdf>
      <annots>
        <issue id="1" page="0" x="100" y="200"/>
      </annots>
      <issue id="2" page="0" x="300" y="400"/>
    </xfdf>
      `;
    const expected = `
    <xfdf>
      <annots>
        <stamp id="1" page="0" rect="100,200,300,400">${image}</stamp>
      </annots>
      <stamp id="2" page="0" rect="300,400,500,600">${image}</stamp>
    </xfdf>
      `;
    expectEqualXml(transformIssueXml(xfdf), expected);
  });

  it("should keep any random element", () => {
    const xfdf = `
    <xfdf>
      <issue id="1" page="0" x="100" y="200"/>
      <circle page="0" />
    </xfdf>`;
    const expected = `
      <xfdf>
        <stamp id="1" page="0" rect="100,200,300,400">${image}</stamp>
        <circle page="0" />
      </xfdf>`;
    expectEqualXml(transformIssueXml(xfdf), expected);
  });
});

function expectEqualXml(actual: string, expected: string) {
  const removeLinesAndSpaces = (str: string) =>
    str.replace(/([ ] +)/g, "").replace(/\n/g, "");
  expect(removeLinesAndSpaces(actual)).toEqual(removeLinesAndSpaces(expected));
}
