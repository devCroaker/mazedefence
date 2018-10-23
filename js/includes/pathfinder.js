// Start location will be in the following format:
// [distanceFromTop, distanceFromLeft]
var findShortestPath = function(startCoordinates, grid, goal) {
    var distanceFromTop = startCoordinates.arrY;
    var distanceFromLeft = startCoordinates.arrX;
    var visited = [];

    // Each "location" will store its coordinates
    // and the shortest path required to arrive there
    var location = {
        distanceFromTop: distanceFromTop,
        distanceFromLeft: distanceFromLeft,
        path: [],
        route: [],
        strRoute: [],
        status: 'Start'
    };

    // Initialize the queue with the start location already inside
    var queue = [location];

    // Loop through the grid searching for the goal
    while (queue.length > 0) {
        // Take the first location off the queue
        var currentLocation = queue.shift();

        // Explore North
        var newLocation = exploreInDirection(currentLocation, 'North', grid, visited, goal);
        if (newLocation.status === 'Goal') {
            return newLocation;
        } else if (newLocation.status === 'Valid') {
            queue.push(newLocation);
        }

        // Explore East
        var newLocation = exploreInDirection(currentLocation, 'East', grid, visited, goal);
        if (newLocation.status === 'Goal') {
            return newLocation;
        } else if (newLocation.status === 'Valid') {
            queue.push(newLocation);
        }

        // Explore South
        var newLocation = exploreInDirection(currentLocation, 'South', grid, visited, goal);
        if (newLocation.status === 'Goal') {
            return newLocation;
        } else if (newLocation.status === 'Valid') {
            queue.push(newLocation);
        }

        // Explore West
        var newLocation = exploreInDirection(currentLocation, 'West', grid, visited, goal);
        if (newLocation.status === 'Goal') {
            return newLocation;
        } else if (newLocation.status === 'Valid') {
            queue.push(newLocation);
        }
    }

    // No valid path found
    return false;

};

// This function will check a location's status
// (a location is "valid" if it is on the grid, is not an "obstacle",
// and has not yet been visited by our algorithm)
// Returns 0=path,1=wall/water,2=water_shallow,3=tower,4=goal,5=visited
// Evens are walkable, odds are obstacles or previously visited.
var locationStatus = function(location, grid, visited, goal) {
    var gridHeight = grid.length;
    var gridWidth = grid[0].length;
    var dft = location.distanceFromTop;
    var dfl = location.distanceFromLeft;

    if (location.distanceFromLeft < 0 ||
        location.distanceFromLeft >= gridWidth ||
        location.distanceFromTop < 0 ||
        location.distanceFromTop >= gridHeight) {

        // location is not on the grid--return false
        return 'Invalid';
    } else if (dft === goal.y && dfl === goal.x || grid[dft][dfl] === 4) {
        return 'Goal';
    } else if (grid[dft][dfl]%2 !== 0 || visited.indexOf('dft'+dft+'dfl'+dfl) !== -1) {
        // location is either an obstacle or has been visited
        return 'Blocked';
    } else {
        return 'Valid';
    }
};


// Explores the grid from the given location in the given
// direction
var exploreInDirection = function(currentLocation, direction, grid, visited, goal) {
    var newPath = currentLocation.path.slice();
    newPath.push(direction);

    var dft = currentLocation.distanceFromTop;
    var dfl = currentLocation.distanceFromLeft;

    if (direction === 'North') {
        dft -= 1;
    } else if (direction === 'East') {
        dfl += 1;
    } else if (direction === 'South') {
        dft += 1;
    } else if (direction === 'West') {
        dfl -= 1;
    }

    var newRoute = currentLocation.route.slice();
    newRoute.push({x:dfl,y:dft});
    var newStrRoute = currentLocation.strRoute.slice();
    newStrRoute.push('dft'+dft+'dfl'+dfl);

    var newLocation = {
        distanceFromTop: dft,
        distanceFromLeft: dfl,
        path: newPath,
        route: newRoute,
        strRoute: newStrRoute,
        status: 'Unknown'
    };
    newLocation.status = locationStatus(newLocation, grid, visited, goal);

    // If this new location is valid, mark it as 'Visited'
    if (newLocation.status === 'Valid') {
        //grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 5;
        visited.push('dft'+newLocation.distanceFromTop+'dfl'+newLocation.distanceFromLeft);
    }

    return newLocation;
};
