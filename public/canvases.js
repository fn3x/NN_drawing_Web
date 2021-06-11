var inputCanvas,
  inputCtx,
  flag = false,
  prevX = 0,
  currX = 0,
  prevY = 0,
  currY = 0,
  dot_flag = false;

var x = "black", y = 3;

function init() {
  inputCanvas = document.getElementById('InputCanvas');
  inputCtx = inputCanvas.getContext("2d");

  w = inputCanvas.width;
  h = inputCanvas.height;

  inputCanvas.addEventListener("mousemove", function (e) {
      findxy('move', e)
  }, false);
  inputCanvas.addEventListener("mousedown", function (e) {
      findxy('down', e)
  }, false);
  inputCanvas.addEventListener("mouseup", function (e) {
      findxy('up', e)
  }, false);
  inputCanvas.addEventListener("mouseout", function (e) {
      findxy('out', e)
  }, false);
}

function draw() {
  inputCtx.beginPath();
  inputCtx.moveTo(prevX, prevY);
  inputCtx.lineTo(currX, currY);
  inputCtx.strokeStyle = x;
  inputCtx.lineWidth = y;
  inputCtx.stroke();
  inputCtx.closePath();
}

function erase() {
  inputCtx.clearRect(0, 0, w, h);
  document.getElementById("InputCanvas").src = null
  document.getElementById("ResultImg").src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
}

function getCheckedBoxes(chkboxName) {
  var checkboxes = document.getElementsByName(chkboxName)
  var checkboxesChecked = []
  for (var i=0; i<checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      checkboxesChecked.push(parseInt(checkboxes[i].value))
    }
  }

  return checkboxesChecked.length > 0 ? checkboxesChecked : null
}

function Send() {
  var dataURL = inputCanvas.toDataURL('image/png')

  var digits = getCheckedBoxes("checkbox")

  if (!digits) {
    digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  }

  fetch('http://127.0.0.1:5000', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      base64Img: dataURL.replace('data:image/png;base64,', ''),
      digits
    })
  })
    .then(response => response.text())
    .then(body => {
      const image = document.getElementById('ResultImg')
      image.src = body
    })
}

function findxy(res, e) {
  if (res == 'down') {
    prevX = currX;
    prevY = currY;
    currX = e.clientX - inputCanvas.offsetLeft;
    currY = e.clientY - inputCanvas.offsetTop;

    flag = true;
    dot_flag = true;
    if (dot_flag) {
        inputCtx.beginPath();
        inputCtx.fillStyle = x;
        inputCtx.fillRect(currX, currY, 2, 2);
        inputCtx.closePath();
        dot_flag = false;
    }
  }
  if (res == 'up' || res == "out") {
      flag = false;
  }
  if (res == 'move') {
    if (flag) {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - inputCanvas.offsetLeft;
        currY = e.clientY - inputCanvas.offsetTop;
        draw();
    }
  }
}