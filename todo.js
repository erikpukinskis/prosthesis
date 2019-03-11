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
    site.start(4141)

    var bridge = new BrowserBridge()
    basicStyles.addTo(bridge)

    var now = timeSlice(new Date())

    var woke = timeSlice(new Date("2019-03-11 12:45"))

    bridge.domReady(
      function() {
        setInterval(
          function() {
            console.log("tick")},
          1000)})

    var num = number(now, woke)
    var percent = Math.ceil(num/64*100)+"%"
    var page = element(".lil-page",[
      element("h1", "Hi!"),
      element("p", "We are in slice "+now),
      element("p", element.raw("#"+num+"/64 ("+percent+")")),
      element("p", "There are "+timeLeft(now)+" minutes left")
      ])

    site.addRoute(
      "get",
      "/",
      bridge.requestHandler(
        page))

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