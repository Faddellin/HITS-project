
import {AStar, disableButtons, enableButtons, disableCells, enableCells} from "./astar.js";
import Graph from "./graph.js";

// Отображение всплывающего окна
export default function dropPopup(popupText)
{
    let popup = document.getElementById("popup");
    let popupContent = document.getElementById("popupText");
    popupContent.textContent = popupText;
    popup.style.display = "block";
    setTimeout(function() {
        popup.classList.add("fadeOut");
        setTimeout(function() {
            popup.style.display = "none";
            popup.classList.remove("fadeOut");
        }, 500)
    }, 3500);

    document.querySelector(".closePopup").addEventListener("click", function() {
        document.getElementById("popup").style.display = "none";
    });
}

// Динамическое обновление значения слайдера с размером лабиринта
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('labyrinthSize');
    const rangeValue = document.getElementById('labyrinthSizeValue');
    
    slider.addEventListener('input', () => {
    rangeValue.textContent = slider.value;
    });
});

// Динамическое обновление значения слайдера со скоростью работы алгоритма
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('algorithmSpeed');
    const rangeValue = document.getElementById('algorithmSpeedValue');
    
    slider.addEventListener('input', () => {
    rangeValue.textContent = slider.value;
    });
});

// Динамическое обновление значения слайдера со скоростью мышки
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('pathTraverseSpeed');
    const rangeValue = document.getElementById('pathTraverseSpeedValue');
    
    slider.addEventListener('input', () => {
    rangeValue.textContent = slider.value;
    });
});


const graph = new Graph();
let startCell = null;
let goalCell = null;
let startCellChosen = false;
let goalCellChosen = false;

// EventListener, в котором происходит весь движ
document.addEventListener('DOMContentLoaded', function() {
    const labyrinthForm = document.getElementById('labyrinthForm');
    const resetButton = document.getElementById('resetButton');
    const generateLabyrinthButton = document.getElementById('generateLabyrinth');
    const startCellButton = document.getElementById('startCellButton');
    const goalCellButton = document.getElementById('goalCellButton');
    const startAlgorithmButton = document.getElementById('startAlgorithm');
    
    // Запуск алгоритма
    startAlgorithmButton.addEventListener('click', function() {
        resetCellColors()
        astar();
    });

    // Сброс всего
    resetButton.addEventListener("click", function() {
        resetLabyrinth();
    });

    // Формирование таблицы после нажатия на submit
    labyrinthForm.addEventListener('submit', function(event) {
        event.preventDefault();

        graph.vertices = [];
        if (startCell !== null) startCell = null;
        if (goalCell !== null) goalCell = null;
        if (!startCellChosen) startCellChosen = false;
        if (!goalCellChosen) goalCellChosen = false;
        
        const table = document.getElementById('grid');
        if (table)
        {
            table.parentNode.removeChild(table);
        }

        const labyrinthContainer = document.getElementById('labyrinthContainer');
        const labyrinthSize = parseInt(document.getElementById('labyrinthSize').value);

        const newTable = document.createElement('table');
        newTable.id = 'grid';
        let squareDimension;
        if (labyrinthSize < 50)
        {
            squareDimension = Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight) * 0.8;
        }
        else if (labyrinthSize < 100) 
        {
            squareDimension = Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight) * 1.5;
        }
        else
        {
            squareDimension = Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight) * 1.8;
        }
        
        newTable.style.width = `${squareDimension}px`;
        newTable.style.height = `${squareDimension}px`;

        for (let i = 0; i < labyrinthSize; i++)
        {
            const row = document.createElement('tr');
            for (let j = 0; j < labyrinthSize; j++)
            {
                const cell = document.createElement('td');
                cell.className = 'cell';
                cell.id = `cell-${i}-${j}`;
                cell.classList.add("white");
                const cellSize = 100 / labyrinthSize;
                cell.style.width = `${cellSize}%`;
                cell.style.height = `${cellSize}%`;
                row.appendChild(cell);
                graph.addVertex([i, j]);
            }
            newTable.appendChild(row);
        }

        newTable.classList.add("frameForGrid");
        labyrinthContainer.appendChild(newTable);

        // Отображаем все кнопки и надписи после изготовления таблицы
        displayButtonsAndInscriptions();

        // Генерация лабиринта после нажатия на generate
        generateLabyrinthButton.addEventListener('click', function() {
            const labyrinth = generateLabyrinth(labyrinthSize);

            newTable.querySelectorAll('.cell').forEach(cell => {
                if (cell.classList.contains("pathTravelling")) cell.classList.remove("pathTravelling");
            })

            for (let x = 0; x < labyrinthSize; x++)
            {
                for (let y = 0; y < labyrinthSize; y++)
                {
                    let curCell = document.getElementById(`cell-${x}-${y}`);
                    if (curCell)
                    {
                        if (curCell.classList.contains("start"))
                        {
                            startCell = null;
                            startCellChosen = false;
                        }
                        if (curCell.classList.contains("goal"))
                        {
                            goalCell = null;
                            goalCellChosen = false;
                        }
                        curCell.classList.remove("white", "black", "path", "visited", "start", "goal", "possible");
                        if (labyrinth[x][y] === 1)
                        {
                            curCell.classList.add("black");
                        }
                        else
                        {
                            curCell.classList.add("white");
                        }
                    }
                }
            }
        });

        // Выбор начальной клетки
        startCellButton.addEventListener('click', function() {
            let flajok = true;

            newTable.querySelectorAll('.cell').forEach(cell =>  
                cell.addEventListener('click', function(event) {
                    if (flajok)
                    {
                        if (startCell)
                        {
                            let st = document.getElementById(`cell-${startCell[0]}-${startCell[1]}`)
                            st.classList.remove("start");
                            st.classList.add("white");
                        }
                        event.preventDefault();
                        if (cell.classList.contains("white")) cell.classList.remove("white");
                        if (cell.classList.contains("black")) cell.classList.remove("black");
                        cell.classList.add("start");
                        startCell = getCellCoordinates(cell);
                        startCellChosen = true;
                        flajok = false;
                    }
                })
        )});
        
        // Выбор конечной клетки
        goalCellButton.addEventListener('click', function() {
            let flajochek = true;

            newTable.querySelectorAll('.cell').forEach(cell =>  
                cell.addEventListener('click', function(event) {
                    if (flajochek)
                    {
                        if (goalCell)
                        {
                            let nd = document.getElementById(`cell-${goalCell[0]}-${goalCell[1]}`)
                            nd.classList.remove("goal");
                            nd.classList.add("white");
                        }
                        event.preventDefault();
                        if (cell.classList.contains("white")) cell.classList.remove("white");
                        if (cell.classList.contains("black")) cell.classList.remove("black");

                        newTable.querySelectorAll('.cell').forEach(cell => {
                            if (cell.classList.contains("pathTravelling")) cell.classList.remove("pathTravelling");
                        })

                        cell.classList.add("goal");
                        goalCell = getCellCoordinates(cell);
                        goalCellChosen = true;
                        flajochek = false;
                    }
                })
        )});

        // Окрашивание клеток в черный или белый(создание стен)
        newTable.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('mousedown', function(event) {
                event.preventDefault();
                if (cell.classList.contains("start"))
                {
                    cell.classList.remove("start")
                    cell.classList.remove('black');
                    cell.classList.remove('path');
                    cell.classList.remove('visited');
                    cell.classList.remove('possible');
                    cell.classList.add("white");
                    startCell = null;
                    startCellChosen = false;
                }
                else if (cell.classList.contains("goal"))
                {
                    cell.classList.remove("goal")
                    cell.classList.remove('black');
                    cell.classList.remove('path');
                    cell.classList.remove('visited');
                    cell.classList.remove('possible');
                    if (cell.classList.contains("pathTravelling")) cell.classList.remove("pathTravelling");
                    cell.classList.add("white");
                    goalCell = null;
                    goalCellChosen = false;
                }
                else
                {
                toggleCellColor(cell);
                }
            });

            cell.addEventListener('mouseenter', function(event) {
                event.preventDefault();
                if (event.buttons === 1)
                {
                    if (cell.classList.contains("start"))
                    {
                        cell.classList.remove("start")
                        cell.classList.remove('black');
                        cell.classList.remove('path');
                        cell.classList.remove('visited');
                        cell.classList.remove('possible');
                        cell.classList.add("white");
                        startCell = null;
                        startCellChosen = false;
                    }
                    else if (cell.classList.contains("goal"))
                    {
                        cell.classList.remove("goal")
                        cell.classList.remove('black');
                        cell.classList.remove('path');
                        cell.classList.remove('visited');
                        cell.classList.remove('possible');
                        cell.classList.add("white");
                        if (cell.classList.contains("pathTravelling")) cell.classList.remove("pathTravelling");
                        goalCell = null;
                        goalCellChosen = false;
                    }
                    else
                    {
                    toggleCellColor(cell);
                    }
                }
            });
        });
    });

    // Изменение цвета клетки(добавление/уничтожение стены)
    function toggleCellColor(cell)
    {
        cell.classList.add('enlarge');

        setTimeout(function() {
            cell.classList.remove('enlarge');
        }, 100);

        if (cell.classList.contains('black') || cell.classList.contains('path') || cell.classList.contains('visited')
            || cell.classList.contains('possible'))
        {
            cell.classList.remove('black');
            cell.classList.remove('path');
            cell.classList.remove('visited');
            cell.classList.remove('possible');
            cell.classList.add("white");
        }
        else
        {
            cell.classList.remove('white');
            cell.classList.add('black');
        }
    }

    // Получение координат клетки
    function getCellCoordinates(cell)
    {
        const id = cell.id.split('-');
        const x = parseInt(id[1]);
        const y = parseInt(id[2]);
        return [x, y];
    }

    // Формирование рёбер графа и последующий вызов алгоритма поиска
    function astar()
    {
        if (!goalCell || !startCell)
        {
            return;
        }

        for (let i = 0; i < graph.vertices.length; i++)
        {
            const [x, y] = graph.vertices[i];
            graph.edges[[x, y]] = [];

            if (document.getElementById(`cell-${x}-${y}`).classList.contains('black')) continue;
            if (x > 0 && !document.getElementById(`cell-${x-1}-${y}`).classList.contains('black'))
            {
                graph.addEdge([x, y], [x - 1, y], 1);
            }
            if (x < labyrinthSize - 1 && !document.getElementById(`cell-${x+1}-${y}`).classList.contains('black'))
            {
                graph.addEdge([x, y], [x + 1, y], 1);
            }
            if (y > 0 && !document.getElementById(`cell-${x}-${y-1}`).classList.contains('black'))
            {
                graph.addEdge([x, y], [x, y - 1], 1);
            }
            if (y < labyrinthSize - 1 && !document.getElementById(`cell-${x}-${y+1}`).classList.contains('black'))
            {
                graph.addEdge([x, y], [x, y + 1], 1);
            }
        }

        const alg = new AStar(graph, startCell, goalCell);
        alg.search();
    }

    // Сброс лабиринта
    function resetLabyrinth()
    {
        const table = document.getElementById('grid');
        if (table)
        {
            table.parentNode.removeChild(table);
        }
        hideButtonsAndInscriptions();
        enableButtons();
        enableCells();
    }

    // Сброс цветов клеток перед следующим заходом
    function resetCellColors()
    {
        const table = document.getElementById("grid");
        if (table)
        {
            table.querySelectorAll(".cell").forEach(cell => {
                if (cell.classList.contains("pathTravelling")) cell.classList.remove("pathTravelling");

                if (cell.classList.contains("visited") || cell.classList.contains("path") || cell.classList.contains("possible"))
                {
                    cell.classList.remove("visited");
                    cell.classList.remove("path");
                    cell.classList.remove("possible");
                    cell.classList.add("white");
                }

                try
                {
                document.getElementById(`cell-${startCell[0]}-${startCell[1]}`).classList.remove("white");
                document.getElementById(`cell-${startCell[0]}-${startCell[1]}`).classList.add("start");
                document.getElementById(`cell-${goalCell[0]}-${goalCell[1]}`).classList.remove("white");
                document.getElementById(`cell-${goalCell[0]}-${goalCell[1]}`).classList.add("goal");
                }
                catch(err)
                {
                    dropPopup("Укажите начальную и конечную клетки");
                }
            })
        }
    }

    // Скрыть кнопки и надписи
    function hideButtonsAndInscriptions()
    {
        resetButton.style.display = "none";
        generateLabyrinthButton.style.display = "none";
        startCellButton.style.display = "none";
        goalCellButton.style.display = "none";
        startAlgorithmButton.style.display = "none";
        document.getElementById("algorithmSpeed").style.display = "none";
        document.getElementById("algorithmSpeedValue").style.display = "none";
        document.getElementById("algorithmSpeedLabel").style.display = "none";
        document.getElementById("pathTraverseSpeed").style.display = "none";
        document.getElementById("pathTraverseSpeedLabel").style.display = "none";
        document.getElementById("pathTraverseSpeedValue").style.display = "none";
    }

    // Отобразить кнопки и надписи
    function displayButtonsAndInscriptions()
    {
        resetButton.style.display = "inline-block";
        generateLabyrinthButton.style.display = "inline-block";
        startCellButton.style.display = "inline-block";
        goalCellButton.style.display = "inline-block";
        startAlgorithmButton.style.display = "inline-block";
        document.getElementById("algorithmSpeed").style.display = "inline-block";
        document.getElementById("algorithmSpeedValue").style.display = "inline-block";
        document.getElementById("algorithmSpeedLabel").style.display = "inline-block";
        document.getElementById("pathTraverseSpeed").style.display = "inline-block";
        document.getElementById("pathTraverseSpeedLabel").style.display = "inline-block";
        document.getElementById("pathTraverseSpeedValue").style.display = "inline-block";
    }
});


// Генерация лабиринта(на выходе матрица из нулей и единиц: 0 - проход; 1 - стена)
function generateLabyrinth(labyrinthSize)
{
    // Создание пустой матрицы для лабиринта
    const maze = Array.from({ length: labyrinthSize }, () => Array.from({ length: labyrinthSize }, () => 1));

    // Проверка валидности клетки
    function isValid(x, y)
    {
        return x >= 0 && x < labyrinthSize && y >= 0 && y < labyrinthSize && maze[x][y] === 1;
    }

    // Проверка наличия стенок вокруг клетки
    function hasWallsAround(x, y)
    {
        return (isValid(x - 1, y) && isValid(x + 1, y) && isValid(x, y - 1) && isValid(x, y + 1));
    }

    // Случайный выбор соседа
    function getRandomNeighbor(x, y)
    {
        const neighbors = [];
        if (isValid(x - 2, y)) neighbors.push([x - 2, y]);
        if (isValid(x + 2, y)) neighbors.push([x + 2, y]);
        if (isValid(x, y - 2)) neighbors.push([x, y - 2]);
        if (isValid(x, y + 2)) neighbors.push([x, y + 2]);
        if (neighbors.length === 0) return null;
        return neighbors[Math.floor(Math.random() * neighbors.length)];
    }

    // Выбор случайной стартовой клетки
    let startX = Math.floor(Math.random() * labyrinthSize);
    let startY = Math.floor(Math.random() * labyrinthSize);
    startX = startX % 2 === 0 ? startX : startX - 1;
    startY = startY % 2 === 0 ? startY : startY - 1;
    maze[startX][startY] = 0;

    // Генерация лабиринта
    for (let x = 1; x < labyrinthSize; x += 2)
    {
        for (let y = 1; y < labyrinthSize; y += 2)
        {
            if (hasWallsAround(x, y))
            {
                maze[x][y] = 0;
                let currentX = x;
                let currentY = y;
                let stack = [];
                stack.push([currentX, currentY]);

                while (stack.length > 0)
                {
                    let nextCell = getRandomNeighbor(currentX, currentY);
                    if (nextCell !== null)
                    {
                        let [nextX, nextY] = nextCell;
                        maze[nextX][nextY] = 0;
                        maze[(currentX + nextX) / 2][(currentY + nextY) / 2] = 0;
                        stack.push([nextX, nextY]);
                        currentX = nextX;
                        currentY = nextY;
                    }
                    else
                    {
                        [currentX, currentY] = stack.pop();
                    }
                }
            }
        }
    }

    return maze;
}