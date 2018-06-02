var library = require("module-library")(require)

library.using(
  ["web-element", "web-site", "browser-bridge", "basic-styles", "appeared-a-wild", "./timer"],
  function(element, WebSite, BrowserBridge, basicStyles, appearedAWild, xxx) {

    var baseBridge = new BrowserBridge()
    var site = new WebSite()

    basicStyles.addTo(baseBridge)

    var pageStyle = element.style(".lil-page", {
      "min-height": "inherit",
      "margin-top": "30px",
      "margin-bottom": "50px",
      "padding-top": "20px",
      "padding-left": "10px",
      "padding-bottom": "40px",
    })

    baseBridge.addToHead(element.stylesheet(pageStyle))

    site.addRoute(
      "get",
      "/",
      baseBridge.requestHandler(
        element(
          "form",{
          "method": "get",
          "action": "/timely-matter"},[
          element("p", "Do you have any matters which are time pressing?"),
          element(
            "input",{
            "name": "matter",
            "value": "My passport",
            "type": "text"}),
          element("p", element(
            "input",{
            "type": "submit",
            "value": "This matter is timely"}))
          ])
      ))

    function highlightable(bridge) {
      var high = bridge.remember("highlightable")
      if (!high) {
        high = bridge.defineFunction(
          function highlightable(event) {
            console.log(event.target.style["background-color"])
            var color = event.target.style["background-color"] == "#9ef" ? "#0ad188" : "#9ef"
            event.target.style["background-color"] = color
          })
        bridge.see("highlightable", high)
      }

      return {
        onclick: high.withArgs(bridge.event).evalable()
      }
    }

    var highlight = highlightable(baseBridge)

    var hidden = element.template(
      "input",{
      "type": "hidden"},
      function(name, value) {
        this.addAttribute("name", name)
        this.addAttribute("value", value)
      })

    var submit = element.template(
      "form",
      function(text, path, values) {
        for(var name in values) {
          var value = values[name]
          this.addChild(
            hidden(name, value))
        }
        this.addAttribute("action", path)
        this.addAttribute("method", "get")
        this.appendStyles({
          "display": "inline"})
        this.addChild(
          element(
            "input",{
            "type": "submit",
            "value": text}))
      })

    baseBridge.addToBody(
      element("p", submit("I need help", "/help")))

    site.addRoute(
      "get",
      "/help",
      baseBridge.requestHandler([
        element("p", "It's ok, breathe"),
        element("p", "You don't need to work right now."),
        submit("I hate you", "/hate"),
        " ",
        submit("I'm ready to start", "/"),
      ]))

    appearedAWild("web-site", site)


    // timers and todo items need to be permanent

    // am i fucking insane?


    site.addRoute(
      "get",
      "/timely-matter",
      function(request, response) {
        var matter = request.query.matter
        var bridge = baseBridge.forResponse(response)
        bridge.send([
          element(
            ".lil-page",[
            element("p", "How long do you have to act on <b>"+matter+"</b>?"),
            element("button", highlight, "1 hour"),
            " ",
            submit(
              "2 hours",
              "/timer",{
              "length": "2 hours",
              "matter": matter}),
            " ",
            " ",
            submit(
              "10 hours",
              "/timer",{
              "length": "10 hours",
              "matter": matter}),
            " ",
            element("button", highlight, "24 hours")
          ]),
          element(
            ".lil-page",[
            element("p", "Do you have other matters on your mind?"),
            element(
              "input",{
              "name": "item",
              "value": "",
              "type": "text"}),
            element("p", element(
              "input",{
              "type": "submit",
              "value": "Start a list"}))
          ]),
        ])
      })

    site.start(7654)

    console.log("A narrative is up and running! Visit http://localhost:7654 in your browser to see it!")
  }
)
