import PriorityQueue from "./queue.js";
import dropPopup from "./script.js";

// Выключить кнопки
export function disableButtons()
{
    document.getElementById('submitButton').disabled = true;
    document.getElementById('generateLabyrinth').disabled = true;
    document.getElementById('startCellButton').disabled = true;
    document.getElementById('goalCellButton').disabled = true;
    document.getElementById('startAlgorithm').disabled = true;
}

// Включить кнопки
export function enableButtons()
{
    document.getElementById('submitButton').disabled = false;
    document.getElementById('generateLabyrinth').disabled = false;
    document.getElementById('startCellButton').disabled = false;
    document.getElementById('goalCellButton').disabled = false;
    document.getElementById('startAlgorithm').disabled = false;
}

// Отключить взаимодействие с клетками
export function disableCells()
{
    document.getElementById("grid").querySelectorAll('.cell').forEach(cell => cell.classList.add("disabledCells"));
}

// Включить взаимодействие с клетками
export function enableCells()
{
    if (document.getElementById("grid")) document.getElementById("grid").querySelectorAll('.cell').forEach(cell => cell.classList.remove("disabledCells"));
}

export class AStar
{
    constructor(graph, start, goal)
    {
        this.graph = graph;
        this.start = start;
        this.goal = goal;
        this.frontier = new PriorityQueue();
        this.frontier.enqueue(start, 1);
        this.came_from = {};
        this.cost_so_far = {};
        this.came_from[start] = null;
        this.cost_so_far[start] = 0;
    }

    heuristic(a, b)
    {
        // Манхэттенское расстояние
        const [x1, y1] = a;
        const [x2, y2] = b;

        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }  

    search()
    {
        let flag = false;
        let delaysList = {1: 100, 2: 50, 3: 25, 4: 10, 5: 1};
        let delay = delaysList[document.getElementById("algorithmSpeed").value]; // Задержка
        disableButtons();
        disableCells();
        
        const processNextNeighbor = () => {
            setTimeout(() => {
                try
                {
                    const current = this.frontier.dequeue();
        
                    if (JSON.stringify(current) === JSON.stringify(this.goal))
                    {
                        flag = true;
                        
                        const path = [];
                        let currentVertex = this.goal;
                
                        while (currentVertex !== this.start)
                        {
                            path.unshift(currentVertex);
                            currentVertex = this.came_from[currentVertex];
                            let curCell = document.getElementById(`cell-${currentVertex[0]}-${currentVertex[1]}`);
                            curCell.classList.remove("visited");
                            curCell.classList.add("path");
                        }
                        path.unshift(this.start);
                        
                        this.travelAlongPath(path);
                        return;
                    }
        
                    for (const next of this.graph.neighbors(current))
                    {
                        const new_cost = this.cost_so_far[current] + this.graph.cost(current, next);
                        if (!(next in this.cost_so_far) || new_cost < this.cost_so_far[next])
                        {
                            const nextCell = document.getElementById(`cell-${next[0]}-${next[1]}`);
                            nextCell.classList.remove("white");
                            nextCell.classList.add('visited');

                            for (const nextnext of this.graph.neighbors(next))
                            {
                                document.getElementById(`cell-${nextnext[0]}-${nextnext[1]}`).classList.add("possible");
                            }
        
                            this.cost_so_far[next] = new_cost;
                            const priority = new_cost + this.heuristic(this.goal, next);
                            this.frontier.enqueue(next, priority);
                            this.came_from[next] = current;
                        }
                    }
        
                    if (!flag && !this.frontier.isEmpty())
                    {
                        processNextNeighbor();
                    }
                    else
                    {
                        if (!flag)
                        {
                            dropPopup("Путь не найден");
                            enableButtons();
                            enableCells();
                        }
                    }
                }
                
                catch(err)
                {
                    dropPopup("Работа алгоритма прервана");
                    enableButtons();
                    enableCells();
                }
            }, delay);
        };

        processNextNeighbor();
    }

    travelAlongPath(path) {
        let i = 0;
        let delaysList = {1: 50, 2: 25, 3: 10, 4: 5, 5: 1};
        let delay = delaysList[document.getElementById("pathTraverseSpeed").value]; // Задержка
    
        const traversePath = () => {
            try
            {
            const lastCell = document.getElementById(`cell-${path[path.length - 1][0]}-${path[path.length - 1][1]}`);
            lastCell.classList.add("pathFinish")
            if (i < path.length)
            {

                let curCell, prevCell;
    
                if (i === 0)
                {
                    curCell = document.getElementById(`cell-${path[i][0]}-${path[i][1]}`);
                    curCell.classList.add("pathTravelling");
                } 
                else
                {
                    prevCell = document.getElementById(`cell-${path[i - 1][0]}-${path[i - 1][1]}`);
                    prevCell.classList.remove("pathTravelling");
                    curCell = document.getElementById(`cell-${path[i][0]}-${path[i][1]}`);
                    curCell.classList.add("pathTravelling");
                }
    
                i++;
                setTimeout(traversePath, delay);
            }
            else
            {
                lastCell.classList.remove("pathFinish");
                dropPopup(`Найден кратчайший путь длины ${path.length}`);
                enableButtons();
                enableCells();
            }
            }
            catch(err)
            {
                dropPopup("Работа алгоритма прервана");
                enableButtons();
                enableCells();
            }
        };
    
        traversePath();
    }
}