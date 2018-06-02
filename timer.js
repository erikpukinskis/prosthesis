var library = require("module-library")(require)

module.exports = library.export(
  "timer",
  ["web-element", "appeared-a-wild"],
  function(element, appearedAWild) {

    appearedAWild(
      ["web-site"],
      function(site) {
        site.addRoute(
          "get",
          "/timer",
          function(request, response) {
            var bridge = baseBridge.forResponse(response)
            sendTimer(bridge)
          })
      })

    function sendTimer(bridge) {
      var matter = request.query.matter
      var length = request.query.length

      function lengthInMilliseconds(timeText) {
        var ms = 0

        var parts = timeText.match(/([0-9]+) ?h/)
        if (parts) {
          ms += parseInt(parts[1]) * 60 * 60 * 1000
        }

        var parts = timeText.match(/([0-9]+) ?m/)
        if (parts) {
          ms += parseInt(parts[1]) * 60 * 1000
        }

        var parts = timeText.match(/([0-9]+) ?s/)
        if (parts) {
          ms += parseInt(parts[1]) * 1000
        }

        return ms
      }

      bridge.domReady(
        [lengthInMilliseconds(length)],
        function startTimer(length) {
          var start = new Date()

          var ms = document.getElementById("time")
          setInterval(function() {
            var now = new Date()
            var elapsed = now - start
            var remaining = length - elapsed
            var seconds = remaining/1000
            var minutes = Math.floor(seconds/60)
            seconds = Math.floor(seconds - minutes*60)
            var hours = Math.floor(minutes/60)
            minutes = Math.floor(minutes - hours*60)
            text = " "
            if (hours) {
              text += hours+" hours "
            }
            if (minutes) {
              text += minutes+" minutes "
            }
            if (seconds) {
              text += seconds+" seconds "
            }
            ms.innerText = text.trim()
          }, 1000)
        })

      var body = []

      body.push(
        element(
          ".lil-page",[
          element("p", "<b id=\"time\">"+length+"</b> left to <b>"+matter+"</b>")
        ]))

      if (lengthInMilliseconds(length) > 5 * 60 * 1000) {
        body.push(
          element(
            ".lil-page",[
            element("p", "Is there a chance you could do it in 5 minutes?"),
            submit("Yes", "/timer", {
              "length": "5 minutes",
              "matter": matter}),
          ]))
      }

      bridge.send(body)
    }

    return { nothing: true }
  }
)