"use strict";

var cont = document.getElementById("container");
var maze = document.getElementById("maze");
var thingie = document.getElementById("thingie");
var home = document.getElementById("home");
var emo = document.getElementById("emo");
var bu = document.getElementById("bu");
var bd = document.getElementById("bd");
var bl = document.getElementById("bl");
var br = document.getElementById("br");
var step = 20;
var size = 20;
var bwidth = 2;
var mazeHeight = 200;
var mazeWidth = 300;
var nogoX = [];
var nogoX2 = [];
var nogoY = [];
var nogoY2 = [];
var prevDist = mazeWidth * 2; //tilt vars

var lastUD = 0;
var lastLR = 0;
var mThreshold = 15;
var firstMove = true;
var allowTilt = true; //swipe vars

var sThreshold = 15; //scroll vars

var scThreshold = 20; //generate sides and starting position

genSides(); //define size

var my = mazeHeight / step;
var mx = mazeWidth / step; //create full grid

var grid = [];

for (var i = 0; i < my; i++) {
  var sg = [];

  for (var a = 0; a < mx; a++) {
    sg.push({
      u: 0,
      d: 0,
      l: 0,
      r: 0,
      v: 0
    });
  }

  grid.push(sg);
} //create direction arrays


var dirs = ["u", "d", "l", "r"];
var modDir = {
  u: {
    y: -1,
    x: 0,
    o: "d"
  },
  d: {
    y: 1,
    x: 0,
    o: "u"
  },
  l: {
    y: 0,
    x: -1,
    o: "r"
  },
  r: {
    y: 0,
    x: 1,
    o: "l"
  }
}; //generate maze

genMaze(0, 0, 0);
drawMaze(); //get all the barriers

var barriers = document.getElementsByClassName("barrier");

for (var b = 0; b < barriers.length; b++) {
  nogoX.push(barriers[b].offsetLeft);
  nogoX2.push(barriers[b].offsetLeft + barriers[b].clientWidth);
  nogoY.push(barriers[b].offsetTop);
  nogoY2.push(barriers[b].offsetTop + barriers[b].clientHeight);
} //console.log(nogoX, nogoX2, nogoY, nogoY2);


document.addEventListener("keydown", keys);

function keys(e) {
  var code = e.code;

  switch (code) {
    //arrows
    case "ArrowUp":
      up();
      break;

    case "ArrowDown":
      down();
      break;

    case "ArrowLeft":
      left();
      break;

    case "ArrowRight":
      right();
      break;
    //wasd

    case "KeyW":
      up();
      break;

    case "KeyS":
      down();
      break;

    case "KeyA":
      left();
      break;

    case "KeyD":
      right();
      break;
  }
}

bu.addEventListener("click", function (e) {
  up();
  firstMove = true;
});
bd.addEventListener("click", function (e) {
  down();
  firstMove = true;
});
bl.addEventListener("click", function (e) {
  left();
  firstMove = true;
});
br.addEventListener("click", function (e) {
  right();
  firstMove = true;
});

function up() {
  animKeys(bu);

  if (checkYboundry("u")) {
    thingie.style.top = thingie.offsetTop - step + "px";
    updateEmo(false);
  }
}

function down() {
  animKeys(bd);

  if (checkYboundry("d")) {
    thingie.style.top = thingie.offsetTop + step + "px";
    updateEmo(false);
  }
}

function left() {
  animKeys(bl);

  if (checkXboundry("l")) {
    thingie.style.left = thingie.offsetLeft - step + "px";
  }

  updateEmo(true);
}

function right() {
  animKeys(br);

  if (checkXboundry("r")) {
    thingie.style.left = thingie.offsetLeft + step + "px";
  }

  updateEmo(true);
} //check if one can move horizontally


function checkXboundry(dir) {
  var x = thingie.offsetLeft;
  var y = thingie.offsetTop;
  var ok = [];
  var len = Math.max(nogoX.length, nogoX2.length, nogoY.length, nogoY2.length);
  var check = 0;

  for (var _i = 0; _i < len; _i++) {
    check = 0;

    if (y < nogoY[_i] || y > nogoY2[_i] - size) {
      check = 1;
    }

    if (dir === "r") {
      if (x < nogoX[_i] - size || x > nogoX2[_i] - size) {
        check = 1;
      }
    }

    if (dir === "l") {
      if (x < nogoX[_i] || x > nogoX2[_i]) {
        check = 1;
      }
    }

    ok.push(check);
  } //check what to return


  var res = ok.every(function (e) {
    return e > 0;
  });
  return res;
} //check if one can move vertically


function checkYboundry(dir) {
  var x = thingie.offsetLeft;
  var y = thingie.offsetTop;
  var ok = [];
  var len = Math.max(nogoX.length, nogoX2.length, nogoY.length, nogoY2.length);
  var check = 0;

  for (var _i2 = 0; _i2 < len; _i2++) {
    check = 0;

    if (x < nogoX[_i2] || x > nogoX2[_i2] - size) {
      check = 1;
    }

    if (dir === "u") {
      if (y < nogoY[_i2] || y > nogoY2[_i2]) {
        check = 1;
      }
    }

    if (dir === "d") {
      if (y < nogoY[_i2] - size || y > nogoY2[_i2] - size) {
        check = 1;
      }
    }

    ok.push(check);
  } //check what to return


  var res = ok.every(function (e) {
    return e > 0;
  });
  return res;
} //generate sides with random entry and exit points


function genSides() {
  var max = mazeHeight / step;
  var l1 = Math.floor(Math.random() * max) * step; //let l1 = 0;

  var l2 = mazeHeight - step - l1; //console.log(l1, l2);

  var lb1 = document.createElement("div");
  lb1.style.top = step + "px";
  lb1.style.left = step + "px";
  lb1.style.height = l1 + "px";
  var lb2 = document.createElement("div");
  lb2.style.top = l1 + step * 2 + "px";
  lb2.style.left = step + "px";
  lb2.style.height = l2 + "px";
  var rb1 = document.createElement("div");
  rb1.style.top = step + "px";
  rb1.style.left = mazeWidth + step + "px";
  rb1.style.height = l2 + "px";
  var rb2 = document.createElement("div");
  rb2.style.top = l2 + step * 2 + "px";
  rb2.style.left = mazeWidth + step + "px";
  rb2.style.height = l1 + "px"; //create invisible barriers for start and end: vertical left, vertical right, left top, left bottom, right top, right bottom

  nogoX.push(0, mazeWidth + 2 * step, 0, 0, mazeWidth + step, mazeWidth + step);
  nogoX2.push(0 + bwidth, mazeWidth + 2 * step + bwidth, step, step, mazeWidth + 2 * step, mazeWidth + 2 * step);
  nogoY.push(l1 + step, l2 + step, l1 + step, l1 + 2 * step, l2 + step, l2 + 2 * step);
  nogoY2.push(l1 + 2 * step, l2 + 2 * step, l1 + step + bwidth, l1 + 2 * step + bwidth, l2 + step + bwidth, l2 + 2 * step + bwidth); //set start-pos

  thingie.style.top = l1 + step + "px";
  thingie.style.left = 0 + "px"; //set end-pos & store height of end

  home.style.top = l2 + step + "px";
  home.style.left = mazeWidth + step + "px"; //style & append

  var els = [lb1, lb2, rb1, rb2];

  for (var _i3 = 0; _i3 < els.length; _i3++) {
    confSideEl(els[_i3]);
    maze.appendChild(els[_i3]);
  }
}

function confSideEl(el) {
  el.setAttribute("class", "barrier");
  el.style.width = bwidth + "px";
} //gen maze using Recursive Backtracking


function genMaze(cx, cy, s) {
  // shuffle unchecked directions
  var d = limShuffle(dirs, s);

  for (var _i4 = 0; _i4 < d.length; _i4++) {
    var nx = cx + modDir[d[_i4]].x;
    var ny = cy + modDir[d[_i4]].y;
    grid[cy][cx].v = 1;

    if (nx >= 0 && nx < mx && ny >= 0 && ny < my && grid[ny][nx].v === 0) {
      grid[cy][cx][d[_i4]] = 1;
      grid[ny][nx][modDir[d[_i4]].o] = 1; //avoid shuffling d if d's not exhausted.. hence the i

      genMaze(nx, ny, _i4);
    }
  }
} //draw maze


function drawMaze() {
  for (var x = 0; x < mx; x++) {
    for (var y = 0; y < my; y++) {
      var l = grid[y][x].l;
      var r = grid[y][x].r;
      var u = grid[y][x].u;
      var d = grid[y][x].d;
      drawLines(x, y, l, r, u, d);
    }
  }
} //draw the actual lines


function drawLines(x, y, l, r, u, d) {
  var top = (y + 1) * step;
  var left = (x + 1) * step;

  if (l === 0 && x > 0) {
    var el = document.createElement("div");
    el.style.left = left + "px";
    el.style.height = step + "px";
    el.style.top = top + "px";
    el.setAttribute("class", "barrier");
    el.style.width = bwidth + "px";
    maze.appendChild(el);
  }

  if (d === 0 && y < my - 1) {
    var _el = document.createElement("div");

    _el.style.left = left + "px";
    _el.style.height = bwidth + "px";
    _el.style.top = top + step + "px";

    _el.setAttribute("class", "barrier");

    _el.style.width = step + bwidth + "px";
    maze.appendChild(_el);
  }
}

function limShuffle(array, s) {
  var con = array.slice(0, s);
  var ran = array.slice(s, array.length);

  for (var _i5 = ran.length - 1; _i5 > 0; _i5--) {
    var j = Math.floor(Math.random() * (_i5 + 1)); //console.log(i, j);

    var _ref = [ran[j], ran[_i5]];
    ran[_i5] = _ref[0];
    ran[j] = _ref[1];
  }

  var comb = con.concat(ran);
  return comb;
}

function animKeys(key) {
  if (key.id === "bu") {
    key.style.border = "3px #fff solid";
    key.style.borderTop = "1px #fff solid";
    key.style.borderBottom = "4px #fff solid";
    key.style.transform = "translateY(-2px)";
  }

  if (key.id === "bd") {
    key.style.border = "3px #fff solid";
    key.style.borderBottom = "1px #fff solid";
    key.style.borderTop = "4px #fff solid";
    key.style.transform = "translateY(2px)";
  }

  if (key.id === "bl") {
    key.style.border = "3px #fff solid";
    key.style.borderLeft = "1px #fff solid";
    key.style.borderRight = "4px #fff solid";
    key.style.transform = "translateX(-2px)";
  }

  if (key.id === "br") {
    key.style.border = "3px #fff solid";
    key.style.borderRight = "1px #fff solid";
    key.style.borderLeft = "4px #fff solid";
    key.style.transform = "translateX(2px)";
  } //reset


  setTimeout(function () {
    key.style.border = "2px #fff solid";
    key.style.borderTop = "2px #fff solid";
    key.style.borderBottom = "2px #fff solid";
    key.style.borderLeft = "2px #fff solid";
    key.style.borderRight = "2px #fff solid";
    key.style.transform = "translateY(0px)";
    key.style.transform = "translateX(0px)";
  }, "150");
}

var maxl = 0;
var prevl = 0;

function updateEmo(lr) {
  //simple/manual emo-adjustment - old
  if (lr) {
    if (thingie.offsetLeft < maxl) {
      emo.innerHTML = "🙄";
    }

    if (thingie.offsetLeft < maxl - 2 * step) {
      emo.innerHTML = "😒";
    }

    if (thingie.offsetLeft < maxl - 4 * step) {
      emo.innerHTML = "😣";
    }

    if (thingie.offsetLeft < maxl - 6 * step) {
      emo.innerHTML = "🤬";
    }

    if (thingie.offsetLeft > prevl) {
      emo.innerHTML = "😐";
    }

    if (thingie.offsetLeft >= maxl) {
      if (thingie.offsetLeft > mazeWidth * 0.6) {
        emo.innerHTML = "😀";
      } else {
        emo.innerHTML = "🙂";
      }

      maxl = thingie.offsetLeft;
    }

    if (thingie.offsetLeft === 0) {
      emo.innerHTML = "😢";
    }

    if (thingie.offsetLeft > mazeWidth - step && thingie.offsetTop === home.offsetTop) {
      emo.innerHTML = "🤗";
      home.innerHTML = "🏠";
    }

    if (thingie.offsetLeft > mazeWidth) {
      emo.innerHTML = "";
      home.innerHTML = "🥳";
    }

    prevl = thingie.offsetLeft;
  } else {
    if (thingie.offsetLeft > mazeWidth - step && thingie.offsetTop === home.offsetTop) {
      emo.innerHTML = "🤗";
    } else {
      if (thingie.offsetLeft > mazeWidth - step && thingie.offsetTop != home.offsetTo) {
        emo.innerHTML = "🙄";
      }
    }
  } // 	//Variant: Detect distance to target using old Greeks: Phytagoras (More scientifically interesting, but somehow less funny 🙃)
  // 	let h = home.offsetLeft - thingie.offsetLeft;
  // 	let v = Math.abs(home.offsetTop - thingie.offsetTop);
  // 	let dist = Math.hypot(h, v);
  // 	console.log(h, v, dist);
  // 	//dist = h;
  // 	//dynamic stuff
  // 	if (dist <= prevDist) {
  // 		//happy
  // 		emo.innerHTML = "😀";
  // 	} else {
  // 		//sad
  // 		emo.innerHTML = "🙄";
  // 	}
  // 	//fixed values
  // 	if (dist === 20) {
  // 		emo.innerHTML = "🤗";
  // 	}
  // 	if (dist === 0) {
  // 		emo.innerHTML = "🥳";
  // 		home.innerHTML = "";
  // 	} else {
  // 		home.innerHTML = "🏠";
  // 	}
  // 	prevDist = dist;

} //navigate with tilting


window.addEventListener("deviceorientation", handleOrientation);

function tiltTimer() {
  allowTilt = false;
  setTimeout(function () {
    allowTilt = true;
  }, "200");
}

function handleOrientation(e) {
  //up/down = beta (smaller = up)
  //left/right = gamma (neg = left)
  if (firstMove) {
    lastUD = e.beta;
    lastLR = e.gamma;
    firstMove = false;
  }

  if (allowTilt) {
    if (e.beta < lastUD - mThreshold) {
      up();
      tiltTimer();
    }

    if (e.beta > lastUD + mThreshold) {
      down();
      tiltTimer();
    }

    if (e.gamma < lastLR - mThreshold) {
      left();
      tiltTimer();
    }

    if (e.gamma > lastLR + mThreshold) {
      right();
      tiltTimer();
    }
  }
} //navigate with controller


var haveEvents = "ongamepadconnected" in window;
var gp = [];
var allowU = true;
var allowD = true;
var allowL = true;
var allowR = true;
var allowAU = true;
var allowAD = true;
var allowAL = true;
var allowAR = true;
window.addEventListener("gamepadconnected", connectGamepad);
window.addEventListener("gamepaddisconnected", disconnectGamepad);

function disconnectGamepad() {
  gp = [];
}

function connectGamepad(e) {
  console.log("trying to connect");
  gp[0] = e.gamepad;
  requestAnimationFrame(updateStatus);
}

function updateStatus() {
  if (!haveEvents) {
    scangamepads();
  }

  for (var _i6 = 0; _i6 < gp[0].buttons.length; _i6++) {
    //up
    if (gp[0].buttons[12].pressed) {
      if (allowU) {
        up();
        gpTimer("u");
      }
    }

    if (gp[0].buttons[12].pressed === false) {
      allowU = true;
    } //down


    if (gp[0].buttons[13].pressed) {
      if (allowD) {
        down();
        gpTimer("d");
      }
    }

    if (gp[0].buttons[13].pressed === false) {
      allowD = true;
    } //left


    if (gp[0].buttons[14].pressed) {
      if (allowL) {
        left();
        gpTimer("l");
      }
    }

    if (gp[0].buttons[14].pressed === false) {
      allowL = true;
    } //up


    if (gp[0].buttons[15].pressed) {
      if (allowR) {
        right();
        gpTimer("r");
      }
    }

    if (gp[0].buttons[15].pressed === false) {
      allowR = true;
    }
  }

  for (var j = 0; j < gp[0].axes.length; j++) {
    //console.log(gp[0].axes[3]);
    if (gp[0].axes[1] < -0.8 || gp[0].axes[3] < -0.8) {
      if (allowAU) {
        up();
        gpATimer("u");
      }
    }

    if (gp[0].axes[1] > 0.8 || gp[0].axes[3] > 0.8) {
      if (allowAD) {
        down();
        gpATimer("d");
      }
    }

    if (gp[0].axes[0] < -0.8 || gp[0].axes[2] < -0.8) {
      if (allowAL) {
        left();
        gpATimer("l");
      }
    }

    if (gp[0].axes[0] > 0.8 || gp[0].axes[2] > 0.8) {
      if (allowAR) {
        right();
        gpATimer("r");
      }
    }
  }

  requestAnimationFrame(updateStatus);
}

function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [];

  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (gamepads[i].index in gp) {
        gp[gamepads[i].index] = gamepads[i];
      } else {
        addgamepad(gamepads[i]);
      }
    }
  }
}

if (!haveEvents) {
  setInterval(scangamepads, 500);
}

function gpTimer(adir) {
  switch (adir) {
    case "u":
      allowU = false;
      break;

    case "d":
      allowD = false;
      break;

    case "l":
      allowL = false;
      break;

    case "r":
      allowR = false;
      break;
  }

  setTimeout(function () {
    allowU = true;
    allowD = true;
    allowL = true;
    allowR = true;
  }, "200");
}

function gpATimer(adir) {
  switch (adir) {
    case "u":
      allowAU = false;
      break;

    case "d":
      allowAD = false;
      break;

    case "l":
      allowAL = false;
      break;

    case "r":
      allowAR = false;
      break;
  }

  setTimeout(function () {
    allowAU = true;
    allowAD = true;
    allowAL = true;
    allowAR = true;
  }, "200");
} //Navigate with swipe


var lasttouchpY = 0;
var lasttouchpX = 0;
cont.addEventListener("touchstart", function (e) {
  lasttouchpY = e.changedTouches[0].pageY;
  lasttouchpX = e.changedTouches[0].pageX;
});
cont.addEventListener("touchmove", function (e) {
  e.preventDefault(); //console.log("touch " + e.changedTouches[0].pageY);

  var diffY = e.changedTouches[0].pageY - lasttouchpY;
  var diffX = e.changedTouches[0].pageX - lasttouchpX;

  if (diffY > sThreshold) {
    down();
    lasttouchpY = e.changedTouches[0].pageY;
  } else {
    if (diffY < -1 * sThreshold) {
      up();
      lasttouchpY = e.changedTouches[0].pageY;
    }
  }

  if (diffX > sThreshold) {
    right();
    lasttouchpX = e.changedTouches[0].pageX;
  } else {
    if (diffX < -1 * sThreshold) {
      left();
      lasttouchpX = e.changedTouches[0].pageX;
    }
  }
}); //Navigate with scrolling

var lastscrollpY = 0;
var lastscrollpX = 0;
cont.addEventListener("wheel", function (e) {
  //console.log("scrollY: " + e.deltaY + " scrollX: " + e.deltaX);
  //handle Y scrolling
  lastscrollpY = lastscrollpY + e.deltaY;

  if (lastscrollpY > 0 && e.deltaY < 0) {
    lastscrollpY = 0;
  }

  if (lastscrollpY < 0 && e.deltaY > 0) {
    lastscrollpY = 0;
  }

  if (lastscrollpY > scThreshold) {
    up();
    lastscrollpY = 0;
  }

  if (lastscrollpY < -1 * scThreshold) {
    down();
    lastscrollpY = 0;
  } //handle X scrolling


  lastscrollpX = lastscrollpX + e.deltaX;

  if (lastscrollpX > 0 && e.deltaX < 0) {
    lastscrollpX = 0;
  }

  if (lastscrollpX < 0 && e.deltaX > 0) {
    lastscrollpX = 0;
  }

  if (lastscrollpX > scThreshold) {
    left();
    lastscrollpX = 0;
  }

  if (lastscrollpX < -1 * scThreshold) {
    right();
    lastscrollpX = 0;
  }
});
//# sourceMappingURL=script.dev.js.map
