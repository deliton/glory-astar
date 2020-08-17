# Glory A*

![Glory A* demo](demo/demo.gif)


A visual implementation of the A* algorithm originally made by Peter Hart, Nils Nilsson and Bertram Raphael in 1968. It was made using Javascript and ReactJS.

## Test it in your browser

Open the following link to test this project quickly in your browser: http://glory-astar.herokuapp.com

## Description

A* (pronounced "A-star") is a graph traversal and path search algorithm, which is often used in many fields of computer science due to its completeness, optimality, and optimal efficiency. Thus, in practical travel-routing systems, it is generally outperformed by algorithms which can pre-process the graph to attain better performance, as well as memory-bounded approaches; however, A* is still the best solution in many cases.

## Instructions and how to use it

- The blue cell represents the beginning node, while the red cell represents the target or goal.
- The A* algortithm will try to find the best path possible to the target.
- Click on the empty cells to draw barriers. If you want to remove a barrier just click on it to erase it.
- Click on the "Run simulation" button to run the A* algorithm and wait for the results.
- To erase and reset the current grid, click on the "Reset grid" button.

## Building it

In order to run it locally, you need nodeJS installed on your computer. After installing it, do the following:

```console
user@admin:~$ cd glory-astar
user@admin:~$ npm install
user@admin:~$ npm start

```

And then, just open http://localhost:3000

## Issues

This is a work in progress so expect some bugs and issues. I hope to solve all of them in future updates.

