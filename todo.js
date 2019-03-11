var library = require("module-library")(require)

backlog(
  // Add items to a todo today list

  // Anything not done, next morning pops up as "you must break this down into smaller steps" and can only add the first one to your list.

  // Also available: "This isn't that important"

  // Avoiding something? Add a distraction task. something that you’re itching to do because you are avoiding the other thing. Get points for doing that task, but also have to look at the task you’re avoiding for 5 minutes once a day.
  )

function backlog() {}

library.using([
  "web-element",
  "basic-styles",
  "browser-bridge",
  "web-site"],
  function(element, basicStyles, BrowserBridge, WebSite) {

    var seconds = 1000
    var minutes = seconds * 60


    var site = new WebSite()
    site.start(process.env.PORT || 4141)

    var bridge = new BrowserBridge()
    basicStyles.addTo(bridge)

    var doIt = element(
      ".lil-page",[
      element("h1", "Are there things to do?"),
      element("textarea"),
      element("p", element("input",{"type": "submit", "value": "Yes"})),
      ])

    var stylesheet = element.stylesheet([
      element.style(
        ".time-block",{
        "display": "inline-block",
        "margin": "0 8px 8px 0",
        "width": "25px",
        "height": "25px"}),

      element.style(
        ".time-block__done",{
        "font-size": "15px",
        "background": "orange"}),

      element.style(
        ".time-block__now",{
        "width": "50px",
        "height": "50px",
        "font-size": "1.7em",
        "animation-name": "flash",
        "animation-delay": "0",
        "animation-iteration-count": "infinite",
        "animation-direction": "forward",
        "background": "lightgreen",
      }),

      element.style(
        "@keyframes flash",{
        "from": {
          "opacity": "0.1"},
        "to": {
          "opacity": "1.0"},
        }),

      element.style(
        ".time-block__upcoming", {
        "background": "gray"}),

      ])

    bridge.addToHead(
      stylesheet)

    bridge.domReady(
      function() {
        setInterval(
          function() {
            console.log("tick")},
          1000)})

    var head = element(".lil-page",[
      element("h1", "Inner Limits"),
      element("p", "Skyline Friendly Organizations"),
      element("p", "Wholesome Encounters")
      ])

    site.addRoute(
      "get",
      "/",
      function(request, response) {
        var now = timeSlice(
          new Date())
        var woke = timeSlice(
          new Date(
            "2019-03-11 12:45"))
        var num = number(
          now,
          woke)
        var percent = Math.ceil(
          num/64*100)

        var pre = element()
        var post = element()

        for (var i=1; i<num; i++) {
          pre.addChild(
            element(".time-block.time-block__done", element.raw("#"+i)))
        }

        for (var i=num+1; i<64; i++) {
          post.addChild(
            element(".time-block.time-block__upcoming"))
        }

        var nowBlock = element(".time-block.time-block__now", element.raw("#"+num))

        var context = element(
          "span",
          "/64 ("+percent+"%) ",
          progressBar(percent))

        var spaceship = element(
          ".lil-page",[
          element("h1", "Hi!"),
          element("p", "We are in slice "+now),
          element(
            "div",
            nowBlock,
            context),
          element("p", "There are "+timeLeft(now)+" minutes left"),
          ])

        bridge.forResponse(
          response)
        .send([
          head,
          pre,
          spaceship,
          doIt,
          post])})

    function progressBar(percent) {
      percent = percent / 5
      var bar = ""
      var space = ""
      for(var i=0; i<20; i++) {
        if (i < percent) {
          bar += "x"
        } else {
          space += "-"
        }
      }

      var progress = element(
        "span",
        element.style({
          "white-space": "nowrap",
          "display": "inline-block",
          "font-family": "monospace",
          "font-size": "8px",
          "background": "gray",
          "color": "transparent",
          "vertical-align": "middle"}),
        element(
          "span",
          element.style({
            "background": "lightgreen"}),
          bar),
        element(
          "span",
          space))

      return progress}

    // Time functions

    function timeSlice(time) {
      var date = time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()
      var mins = roundTo15(time.getMinutes())
      var slice = padTime(time.getHours())+":"+padTime(mins)
      return date+" "+slice
    }

    function padTime(number) {
      return ("0"+number).slice(-2)
    }

    function roundTo15(minutes) {
      return Math.floor(minutes/15)*15
    }

    function timeLeft(slice) {
      var currentSlice = timeSlice(new Date())
      if (slice < currentSlice) {
        return 0
      } else if (slice > currentSlice) {
        return 15
      }
      var parts = slice.split(/[-: ]/)
      var startMinute = Math.round(new Date().getMinutes())
      var endMinute = Math.ceil(new Date().getMinutes() / 15)*15

      return endMinute - startMinute
    }

    function number(slice, since) {
      var dt = new Date(slice) - new Date(since)
      return dt / minutes / 15 + 1
    }
  })
