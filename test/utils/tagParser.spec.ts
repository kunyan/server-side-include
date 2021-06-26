import { expect } from "chai";
import { ssiTagParser } from "../../src/utils/tagParser";

describe("send", () => {
  it("should parse include tag", async () => {
    const includeTag = `<!--#include virtual="https://access.redhat.com/services/chrome/head/$locale?legacy=false" -->`;
    const tag = ssiTagParser(includeTag);
    expect(tag.name).to.eq("include");
    expect(tag.attributes.virtual).to.eq(
      "https://access.redhat.com/services/chrome/head/$locale?legacy=false"
    );
  });
});
