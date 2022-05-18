!(function () {
  for (
    var t = 0, i = ["ms", "moz", "webkit", "o"], e = 0;
    e < i.length && !window.requestAnimationFrame;
    ++e
  )
    (window.requestAnimationFrame = window[i[e] + "RequestAnimationFrame"]),
      (window.cancelAnimationFrame =
        window[i[e] + "CancelAnimationFrame"] ||
        window[i[e] + "CancelRequestAnimationFrame"]);
  window.requestAnimationFrame ||
    (window.requestAnimationFrame = function (i, e) {
      var s = new Date().getTime(),
        n = Math.max(0, 16 - (s - t)),
        a = window.setTimeout(function () {
          i(s + n);
        }, n);
      return (t = s + n), a;
    }),
    window.cancelAnimationFrame ||
      (window.cancelAnimationFrame = function (t) {
        clearTimeout(t);
      });
})();
var Nodes = {
  density: 15,
  drawDistance: 65,
  baseRadius: 6,
  maxLineThickness: 3,
  reactionSensitivity: 6,
  lineThickness: 1,
  points: [],
  mouse: { x: -1e3, y: -1e3, down: !1 },
  animation: null,
  canvas: null,
  context: null,
  imageInput: null,
  bgImage: null,
  bgCanvas: null,
  bgContext: null,
  bgContextPixelData: null,
  init: function () {
    (this.canvas = document.getElementById("canvas")),
      (this.context = canvas.getContext("2d")),
      (this.context.globalCompositeOperation = "lighter"),
      screen.width > 767
        ? ((this.canvas.width = 460), (this.canvas.height = 460))
        : ((this.canvas.width = 280), (this.canvas.height = 280)),
      (this.canvas.style.display = "block"),
      (this.imageInput = document.createElement("input")),
      this.imageInput.setAttribute("type", "file"),
      (this.imageInput.style.visibility = "hidden"),
      (this.imageInput.style.display = "none"),
      this.imageInput.addEventListener("change", this.upload, !1),
      document.body.appendChild(this.imageInput),
      this.canvas.addEventListener("mousemove", this.mouseMove, !1),
      this.canvas.addEventListener("mousedown", this.mouseDown, !1),
      this.canvas.addEventListener("mouseup", this.mouseUp, !1),
      this.canvas.addEventListener("mouseout", this.mouseOut, !1),
      (window.onresize = function (t) {
        Nodes.onWindowResize();
      }),
      this.loadData(
        "./assets/images/services/blockchain-app-development/blockchain-circle.jpg",
      );
  },
  preparePoints: function () {
    var t, i;
    this.points = [];
    var e = this.bgContextPixelData.data;
    for (t = 0; t < this.canvas.height; t += this.density)
      for (i = 0; i < this.canvas.width; i += this.density) {
        var s = 4 * (i + t * this.bgContextPixelData.width);
        if (
          !((e[s] > 200 && e[s + 1] > 200 && e[s + 2] > 200) || 0 === e[s + 3])
        ) {
          var n = "rgba(" + e[s] + "," + e[s + 1] + "," + e[s + 2] + ",1)";
          this.points.push({
            x: i,
            y: t,
            originalX: i,
            originalY: t,
            color: n,
          });
        }
      }
  },
  updatePoints: function () {
    var t, i, e, s;
    for (t = 0; t < this.points.length; t++)
      (i = this.points[t]),
        (e = Math.atan2(i.y - this.mouse.y, i.x - this.mouse.x)),
        (s = this.mouse.down
          ? (200 * this.reactionSensitivity) /
            Math.sqrt(
              (this.mouse.x - i.x) * (this.mouse.x - i.x) +
                (this.mouse.y - i.y) * (this.mouse.y - i.y),
            )
          : (100 * this.reactionSensitivity) /
            Math.sqrt(
              (this.mouse.x - i.x) * (this.mouse.x - i.x) +
                (this.mouse.y - i.y) * (this.mouse.y - i.y),
            )),
        (i.x += Math.cos(e) * s + 0.05 * (i.originalX - i.x)),
        (i.y += Math.sin(e) * s + 0.05 * (i.originalY - i.y));
  },
  drawLines: function () {
    var t, i, e, s, n;
    for (t = 0; t < this.points.length; t++)
      for (
        e = this.points[t],
          this.context.fillStyle = e.color,
          this.context.strokeStyle = e.color,
          i = 0;
        i < this.points.length;
        i++
      )
        (s = this.points[i]) != e &&
          (n = Math.sqrt(
            (s.x - e.x) * (s.x - e.x) + (s.y - e.y) * (s.y - e.y),
          )) <= this.drawDistance &&
          ((this.context.lineWidth =
            (1 - n / this.drawDistance) *
            this.maxLineThickness *
            this.lineThickness),
          this.context.beginPath(),
          this.context.moveTo(e.x, e.y),
          this.context.lineTo(s.x, s.y),
          this.context.stroke());
  },
  drawPoints: function () {
    var t, i;
    for (t = 0; t < this.points.length; t++)
      (i = this.points[t]),
        (this.context.fillStyle = i.color),
        (this.context.strokeStyle = i.color),
        this.context.beginPath(),
        this.context.arc(i.x, i.y, this.baseRadius, 0, 2 * Math.PI, !0),
        this.context.closePath(),
        this.context.fill();
  },
  draw: function () {
    (this.animation = requestAnimationFrame(function () {
      Nodes.draw();
    })),
      this.clear(),
      this.updatePoints(),
      this.drawLines(),
      this.drawPoints();
  },
  clear: function () {
    this.canvas.width = this.canvas.width;
  },
  loadData: function (t) {
    (this.bgImage = new Image()),
      (this.bgImage.src = t),
      (this.bgImage.onload = function () {
        Nodes.drawImageToBackground();
      });
  },
  drawImageToBackground: function () {
    var t, i;
    if (
      ((this.bgCanvas = document.createElement("canvas")),
      (this.bgCanvas.width = this.canvas.width),
      (this.bgCanvas.height = this.canvas.height),
      this.bgImage.width > this.bgCanvas.width - 100 ||
        this.bgImage.height > this.bgCanvas.height - 100)
    ) {
      var e = Math.max(
        this.bgImage.width / (this.bgCanvas.width - 100),
        this.bgImage.height / (this.bgCanvas.height - 100),
      );
      (t = this.bgImage.width / e), (i = this.bgImage.height / e);
    } else (t = this.bgImage.width), (i = this.bgImage.height);
    (this.bgContext = this.bgCanvas.getContext("2d")),
      this.bgContext.drawImage(
        this.bgImage,
        (this.canvas.width - t) / 2,
        (this.canvas.height - i) / 2,
        t,
        i,
      ),
      (this.bgContextPixelData = this.bgContext.getImageData(
        0,
        0,
        this.bgCanvas.width,
        this.bgCanvas.height,
      )),
      this.preparePoints(),
      this.draw();
  },
  mouseDown: function (t) {
    Nodes.mouse.down = !0;
  },
  mouseUp: function (t) {
    Nodes.mouse.down = !1;
  },
  mouseMove: function (t) {
    (Nodes.mouse.x = t.offsetX || t.layerX - Nodes.canvas.offsetLeft),
      (Nodes.mouse.y = t.offsetY || t.layerY - Nodes.canvas.offsetTop);
  },
  mouseOut: function (t) {
    (Nodes.mouse.x = -1e3), (Nodes.mouse.y = -1e3), (Nodes.mouse.down = !1);
  },
  onWindowResize: function () {
    cancelAnimationFrame(this.animation), this.drawImageToBackground();
  },
};
