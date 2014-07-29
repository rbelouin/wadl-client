var resources = resources || require("./resources.js");
var WadlClient = WadlClient || require("../wadl-client.js");

var client = WadlClient.buildClient(resources, {
  host: "http://localhost:3000"
});

describe("wadl-client", function() {
  it("should be able to download resources", function(done) {
    var res = client.test.static.get();

    res.onValue(function(data) {
      expect(data).toBe("OK");
      done();
    });
  });

  it("should be able to download resources with query params", function(done) {
    var res = client.test.query.get.withQuery({a: 12345})();

    res.onValue(function(data) {
      expect(data).toBe("a=12345");
      done();
    });
  });

  it("should be able to download resources with path params", function(done) {
    var res = client.test.dynamic._.get.withParams(["12345"])();

    res.onValue(function(data) {
      expect(data).toBe("12345");
      done();
    });
  });

  it("should be able to download resources by giving specific header at building time", function(done) {
    var client = WadlClient.buildClient(resources, {
      host: "http://localhost:3000",
      headers: {
        Authorization: "12345"
      }
    });

    var res = client.test.private.get();

    res.onValue(function(data) {
      expect(data).toBe("OK");
      done();
    });
  });

  it("should be able to download resources by giving specific header at sending time", function(done) {
    var res = client.test.private.get.withHeaders({
        Authorization: "12345"
    })();

    res.onValue(function(data) {
      expect(data).toBe("OK");
      done();
    });
  });

  it("should be able to upload resources", function(done) {
    var res = client.test.upload.post("12345");

    res.onValue(function(data) {
      expect(data).toBe("12345");
      done();
    });
  });

  it("should be able to upload resources with a specific header", function(done) {
    var res = client.test.private.upload.put.withHeaders({
      Authorization: "12345"
    })("12345");

    res.onValue(function(data) {
      expect(data).toBe("12345");
      done();
    });
  });

  it("should be able to parse JSON resources if parse setting is set to true", function(done) {
    var res = client.test.json.get.withParsing()();

    res.onValue(function(data) {
      expect(data.a).toBe(1);
      expect(data.b).toBe(2);
      done();
    });
  });

  it("should be able to parse JSON resources even if Content-Type header has a charset token", function(done) {
    var res = client.test.json2.get.withParsing()();

    res.onValue(function(data) {
      expect(data.a).toBe(1);
      expect(data.b).toBe(2);
      done();
    });
  });

  it("should be able to parse XML resources if parse setting is set to true", function(done) {
    var res = client.test.xml.get.withParsing()();

    res.onValue(function(data) {
      if(data.getElementsByTagName) {
        var a = data.getElementsByTagName("a");
        expect(a && a[0]).not.toBeUndefined();
        expect(a[0].textContent).toBe("1");
      }
      else {
        expect(data.a).not.toBeUndefined();
        expect(data.a[0]).toBe(1);
      }
      done();
    });
  });

  it("should be able to parse JSON resources if parse setting is set to true, even on error", function(done) {
    var res = client.test.json.fail.get.withParsing()();

    res.onError(function(data) {
      expect(data.a).toBe(1);
      expect(data.b).toBe(2);
      done();
    });
  });

  it("must not fail when checking Content-Type header", function(done) {
    var res = client.test.json3.get.withParsing()();

    res.onValue(function() {
      done();
    });
  });
});
