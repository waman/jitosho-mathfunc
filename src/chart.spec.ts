import * as fs from 'fs';
import { gamma } from './GammaFunction'

it('Output function graph', () => {
    outputChart('./dist/chart.html', 'Gamma function', gamma, -5, 5);
});

function outputChart(file: string, name: string, f: (x: number) => number,
        xMin = -1, xMax = 1, yMin = -10, yMax = 10){
    const n = 10000;
    const delta = (xMax - xMin)/n;
    const data = new Array<{x: number, y: number|null}>();
    for(let x = xMin; x < xMax; x+=delta){
        const y = f(x);
        const yy = yMin <= y && y <= yMax ? y : null;
        data.push({x: x, y: yy});
    }

    const labelsStr = data.map(d => `"${Math.floor(d.x*n)/n}"`).join(',');
    const dataStr = data.map(d => d.y !== null ? d.y.toString() : 'null').join(',');

    const content =
        '<!DOCTYPE html>\n' +
        '<html>\n' +
        '<head>\n' +
        '  <meta charset="UTF-8">\n' +
        '  <title>' + name + '</title>\n' +
        '  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\n' +
        '</head>\n' +
        '<body>\n' +
        '  <div><canvas id="pdf" width="400" height="150"></canvas><\div>\n' +
        '  <script>\n' +
        '    const labels = [' + labelsStr + '];\n' +
        '    const data = {\n' +
        '      labels: labels,\n' +
        '      datasets: [{\n' +
        '        backgroundColor: "rgb(255, 99, 132)",\n' +
        '        borderColor: "rgb(255, 99, 132)",\n' +
        '        data: [' + dataStr + ']\n' +
        '      }]\n' +
        '    };\n' +
        '    \n' +
        '    const config = {\n' +
        '      type: "line",\n' +
        '      data,\n' +
        '      options: {\n' +
        '        scales: {\n' +
        '          y: {\n' +
        '            suggestedMin: ' + yMin + ',\n' +
        '            suggestedMax: ' + yMax + '\n' +
        '          }\n' +
        '        },\n' +
        '      }\n' +
        '    };\n' +
        '    \n' +
        '    var pdf = new Chart(\n' +
        '      document.getElementById("pdf"),\n' +
        '      config\n' +
        '    );\n' +
        '  </script>\n' +
        '</body>\n' +
        '</html>\n';

    fs.writeFile(file, content,
        error => { if(error) console.error('error writing!', error)});
}