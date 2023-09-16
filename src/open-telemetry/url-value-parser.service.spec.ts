import { Test, TestingModule } from "@nestjs/testing";
import { UrlValueParserService } from "./url-value-parser.service";

describe("UrlValueParserService", () => {
  let service: UrlValueParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlValueParserService],
    }).compile();

    service = module.get<UrlValueParserService>(UrlValueParserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("replacePathValues", () => {
    it("works with default replacement", () => {
      const replaced = service.replacePathValues(
        "/in/world/14/userId/abca12d231",
      );
      expect(replaced).toBe("/in/world/#val/userId/#val");
    });

    it("works with custom replacement", () => {
      const replaced = service.replacePathValues(
        "/in/world/14/userId/abca12d231",
        "<id>",
      );
      expect(replaced).toBe("/in/world/<id>/userId/<id>");
    });

    it("works with negative decimal numbers", () => {
      const replaced = service.replacePathValues(
        "/some/path/-154/userId/-ABC363AFE2",
      );
      expect(replaced).toBe("/some/path/#val/userId/-ABC363AFE2");
    });

    it("works with spotify ids", () => {
      const replaced = service.replacePathValues(
        "/v1/albums/2PzfMWIpq6JKucGhkS1X5M",
      );
      expect(replaced).toBe("/v1/albums/#val");
    });
  });
});
