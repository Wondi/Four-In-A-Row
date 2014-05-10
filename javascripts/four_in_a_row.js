var grid_columns = [[], [], [], [], [], [], []];
var playercoins = 0;
var game_started_flag = false;
var game_running_flag = true;
var grid_rows = 6;

var find_in_grid = function(type, x, y) {
    if((x < 0) || (x > 6)){
        return false;
    }
    if((y < 0) || (y > grid_rows - 1)){
        return false;
    }
    if(grid_columns[x].length < (y + 1)){
        return false;
    }
    return (grid_columns[x][y] === type);
};

// Driver Function to check for Draw
var checkForDraw = function() {
    for(var i = 0; i < grid_columns.length; i++)
        if(grid_columns[i].length < grid_rows)
            return;
    $(".gamestats h2").text("Game Drawn");
    $(".win").show();
    game_running_flag = false;
};


// Driver Function to Check for Draw
var checkWinner = function(type, x, y) {
    if(!find_in_grid(type, x, y)){
        alert("Cannot Insert!");
        return false;
    }
    var winning_combination = [[1,0], [1,1], [0,1], [1,-1]];
    var matches = 0;
    for(var i = 0; i < 4; i++) {
        for(var j = 1; ; j++)
            if(find_in_grid(type, x+j*winning_combination[i][0], y+j*winning_combination[i][1]))
                matches++;
            else break;
        for(var j = 1; ; j++)
            if(find_in_grid(type, x-j*winning_combination[i][0], y-j*winning_combination[i][1]))
                matches++;
            else break;
        if(matches >= 3) return true;
        matches = 0;
    }
    return false;
};

// Driver Function to update the game,it checks for game results whenever new event occurs
var process_game_board = function(index) {
    if(!game_running_flag) return false;
    var colLength = grid_columns[index].length;
    if(colLength >= grid_rows) return false;
    playercoins++;
    var type = playercoins % 2;
    grid_columns[index].push(type);
    if(checkWinner(type, index, colLength)) {
        $(".win").show();
        game_running_flag = false;
    }
    if(game_running_flag && grid_columns[index].length === grid_rows)
        checkForDraw();
    return true;
};

var change_current_player = function() {
    if(game_started_flag) return; // Don't allow to change_current_player once game has started!
    playercoins++;
    refresh_players_symbol(); // Update the Player Symbols
};

// Driver Function to Update the Player Symbols and Game Stats
var refresh_players_symbol = function() {
    $(".gamestats .playercoin").addClass("deleteme");
    $(".deleteme").remove();
    var p = playercoins%2 ? "player1" : "player2";
    var newplayercoin = "<div style=\"display:none\" class=\"playercoin "
        + p + "\"></div>";
    $(".gamestats > div").prepend($(newplayercoin));
    $(".gamestats .playercoin").show();
    $(".gamestats .playercoin").click(change_current_player);
};

$(document).ready(function() {
    
    // On Hover over add column coin add effect
    $(".button").mouseenter(function() {
        $(this).addClass("buttonhover");
    });
    // On no Hover over add column coin remove effect
    $(".button").mouseleave(function() {
        $(this).removeClass("buttonhover");
    });

    // Function to set New Game
    $(".newgame").click(function() {
        $(".gameboard .playercoin").fadeOut(function()
            {$(this).remove();});
        for(var i = 0; i < grid_columns.length; i++) grid_columns[i] = [];
        $(".win").hide();
        game_running_flag = true;
        game_started_flag = false;
        refresh_players_symbol();
    });

    // Driver Function
    $(".grid .button").click(function() {
        var index = $(this).parent().index();
        if(!process_game_board(index)) return;
        game_started_flag = true;
        var p = playercoins%2 ? "player2" : "player1";
        var newplayercoin = "<div class=\"playercoin " + p + "\"></div>";
        $(this).prev().prepend(newplayercoin);
        if(!game_running_flag) return;
        refresh_players_symbol();
    });
    $(".gamestats .playercoin").click(change_current_player);
    
});