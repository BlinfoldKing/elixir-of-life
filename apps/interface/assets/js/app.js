// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css";

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import "phoenix_html";
import * as p5 from "./p5.min.js";

// Import local files
//
// Local files can be imported directly using relative paths, for example:
// import socket from "./socket"
//
//

const Xsize = 640;
const Ysize = 480;

let Grid = [];
let liveCount = 0;

let simulationRun = false;

let s = sk => {
    sk.setup = () => {
        sk.createCanvas(Xsize, Ysize);
        sk.background("#333");

        for (let i = 0; i < sk.floor(Xsize / 10); i++) {
            Grid[i] = [];
            for (let j = 0; j < sk.floor(Ysize / 10); j++) {
                Grid[i][j] = false;
            }
        }

        let startButton = sk.createButton("Toogle Simulation");
        startButton.mouseClicked(() => (simulationRun = !simulationRun));
        let resetButton = sk.createButton("RESET");
        resetButton.mousePressed(() => {
            for (let i = 0; i < sk.floor(Xsize / 10); i++) {
                Grid[i] = [];
                for (let j = 0; j < sk.floor(Ysize / 10); j++) {
                    Grid[i][j] = false;
                }
            }
            simulationRun = false;
        });
    };

    sk.draw = () => {
        if (simulationRun) {
            liveCount = 0;
            let newGrid = [];
            for (let i = 0; i < Grid.length; i++) {
                newGrid[i] = [];
                for (let j = 0; j < Grid[i].length; j++) {
                    let n = sk.countNeighbour(i, j);
                    if (n == 3 && !Grid[i][j]) {
                        newGrid[i][j] = true;
                    } else if (n < 2 || n > 3) {
                        newGrid[i][j] = false;
                    } else {
                        newGrid[i][j] = Grid[i][j];
                    }
                    if (newGrid[i][j]) liveCount++;
                }
            }
            Grid = newGrid;
        }

        if (liveCount < 0) simulationRun = false;

        sk.stroke(100);
        for (let i = 0; i < Xsize; i += 10) {
            for (let j = 0; j < Ysize; j += 10) {
                sk.push();
                if (Grid[i / 10][j / 10]) {
                    sk.fill(255);
                } else {
                    sk.fill("#333");
                }
                sk.rect(i, j, 10, 10);
                sk.pop();
            }
        }
    };

    sk.mousePressed = () => {
        let pos = sk.screenToGrid(sk.mouseX, sk.mouseY);
        if (pos[0] < sk.floor(Xsize / 10) - 1 && sk.floor(Ysize / 10) - 1) {
            Grid[pos[0]][pos[1]] = !Grid[pos[0]][pos[1]];
            if (Grid[pos[0]][pos[1]]) {
                liveCount++;
            } else {
                liveCount--;
            }
        }
    };

    sk.screenToGrid = (screenX, screenY) => {
        return [sk.floor(screenX / 10), sk.floor(screenY / 10)];
    };

    sk.countNeighbour = (x, y) => {
        let sum = 0;

        if (x > 0) {
            if (Grid[x - 1][y]) sum += 1;

            if (y + 1 < sk.floor(Ysize / 10)) {
                if (Grid[x - 1][y + 1]) sum += 1;
            }

            if (y > 0) {
                if (Grid[x - 1][y - 1]) sum += 1;
            }
        }

        if (y > 0) {
            if (Grid[x][y - 1]) sum += 1;

            if (x + 1 < sk.floor(Ysize / 10)) {
                if (Grid[x + 1][y - 1]) sum += 1;
            }
        }

        if (x + 1 < sk.floor(Xsize / 10) - 1) {
            if (Grid[x + 1][y]) sum += 1;

            if (y + 1 < sk.floor(Ysize / 10) - 1) {
                if (Grid[x + 1][y + 1]) sum += 1;
            }
        }

        if (y + 1 < sk.floor(Ysize / 10)) {
            if (Grid[x][y + 1]) sum += 1;
        }

        return sum;
    };
};

const P5 = new p5(s);
