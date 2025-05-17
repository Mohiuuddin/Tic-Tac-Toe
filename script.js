const GameBoard = (()=>{
    let board = ["", "", "", "", "", "", "", "", ""];
    const getBoard = ()=> board;
    const updateCell=(index, marker)=>{
        if(board[index]===""){
            board[index] = marker;
            return true;
        }
        return false;
    };

    const resetBoard =()=>{
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, updateCell, resetBoard};

})();

const Player = (name, marker, isComputer = false)=>{
  return  {name,marker, isComputer};
};

const GameController = (()=>{
    let humanPlayer, computerPlayer, currentPlayer;
    const gridItems = document.querySelectorAll(".gridItem");

    const playerSelection = () => {
    const player1 = document.querySelector(".player1");
    const player2 = document.querySelector(".player2");

    [player1, player2].forEach(playerDiv => {
      playerDiv.addEventListener("click", () => {
        const humanMarker = playerDiv.dataset.value;
        const computerMarker = humanMarker === "X" ? "O" : "X";

        humanPlayer = Player("You", humanMarker);
        computerPlayer = Player("Computer", computerMarker, true);
        currentPlayer = humanPlayer;

        disablePlayerSelection();
        startGame();
      }, { once: true });
    });
  };

    const disablePlayerSelection = ()=>{
        document.querySelectorAll(".player1, .player2").forEach(div=>{
            div.classList.add("disabled");
        })
    };


    const startGame = ()=>{
        GameBoard.resetBoard();
        renderBoard();
        gridItems.forEach((cell, index)=>{
            cell.addEventListener("click", ()=>{
                if(currentPlayer.isComputer || GameBoard.getBoard()[index] !== "") return;
                GameBoard.updateCell(index, currentPlayer.marker);
                renderBoard();

                if(checkWinner(currentPlayer)){
                  setTimeout(()=> alert(`${currentPlayer.name} wins!`), 100);
                } else if(isTie()){
                  setTimeout(()=>alert("It isa tie!"), 100);
                } else{
                  switchTurn();
                  if(currentPlayer.isComputer){
                    setTimeout(computerMove, 500);
                  }
                }



            });
        });
    };

    const computerMove = ()=>{
        const emptyIndices = GameBoard.getBoard().map((val, i)=>(val ===""? i: null)).filter(i=> i != null);
        if(emptyIndices.length === 0) return;
        const move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        GameBoard.updateCell(move, currentPlayer.marker);
        renderBoard();

        if (checkWinner(currentPlayer)) {
      setTimeout(() => alert(`${currentPlayer.name} wins!`), 100);
    } else if (isTie()) {
      setTimeout(() => alert("It's a tie!"), 100);
    } else {
      switchTurn();
    }

    };

    const switchTurn = ()=>{
      currentPlayer = currentPlayer === humanPlayer ? computerPlayer : humanPlayer;
    };

    const isTie = ()=> GameBoard.getBoard().every(cell=> cell !== "");
    const checkWinner = (player)=>{
      const b = GameBoard.getBoard();
      const wins = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];

    return wins.some(patter => patter.every(i=> b[i] === player.marker));


    };

    const renderBoard = () => {
    GameBoard.getBoard().forEach((value, index) => {
      gridItems[index].textContent = value;
      
    });
  };


 document.querySelector(".card h3").addEventListener("click", () => {
    GameBoard.resetBoard();
    renderBoard();
    window.location.reload(); // allow re-selection
  });

  return {playerSelection};

})();


GameController.playerSelection();