<script lang="ts">
    import Shell from "../../components/Shell.svelte";
    import GamePeice from "../../components/GamePeice.svelte";

    interface gamePieceOption {
        color: 0|1,
        size: 0|1,
        outline: 0|1,
        shape: 0|1,
        name: string,
        selected?: boolean,
        placed?: boolean
    }

    interface boardLocation {
        row: number,
        col: number,
        name: string,
        piece?: string
    }

    const boardLocationOptions: boardLocation[] = [
        { row: 0, col: 0, name: "A1", piece: null},
        { row: 0, col: 1, name: "A2", piece: null},
        { row: 0, col: 2, name: "A3", piece: null},
        { row: 0, col: 3, name: "A4", piece: null},
        { row: 1, col: 0, name: "B1", piece: null},
        { row: 1, col: 1, name: "B2", piece: null},
        { row: 1, col: 2, name: "B3", piece: null},
        { row: 1, col: 3, name: "B4", piece: null},
        { row: 2, col: 0, name: "C1", piece: null},
        { row: 2, col: 1, name: "C2", piece: null},
        { row: 2, col: 2, name: "C3", piece: null},
        { row: 2, col: 3, name: "C4", piece: null},
        { row: 3, col: 0, name: "D1", piece: null},
        { row: 3, col: 1, name: "D2", piece: null},
        { row: 3, col: 2, name: "D3", piece: null},
        { row: 3, col: 3, name: "D4", piece: null}
    ];

    const gamePieces: gamePieceOption[] = [
        { color: 0, size: 0, outline: 0, shape: 0, name: '0000', selected: false, placed: false },
        { color: 0, size: 0, outline: 0, shape: 1, name: '0001', selected: false, placed: false },
        { color: 0, size: 0, outline: 1, shape: 0, name: '0010', selected: false, placed: false },
        { color: 0, size: 0, outline: 1, shape: 1, name: '0011', selected: false, placed: false },
        { color: 0, size: 1, outline: 0, shape: 0, name: '0100', selected: false, placed: false },
        { color: 0, size: 1, outline: 0, shape: 1, name: '0101', selected: false, placed: false },
        { color: 0, size: 1, outline: 1, shape: 0, name: '0110', selected: false, placed: false },
        { color: 0, size: 1, outline: 1, shape: 1, name: '0111', selected: false, placed: false },
        { color: 1, size: 0, outline: 0, shape: 0, name: '1000', selected: false, placed: false },
        { color: 1, size: 0, outline: 0, shape: 1, name: '1001', selected: false, placed: false },
        { color: 1, size: 0, outline: 1, shape: 0, name: '1010', selected: false, placed: false },
        { color: 1, size: 0, outline: 1, shape: 1, name: '1011', selected: false, placed: false },
        { color: 1, size: 1, outline: 0, shape: 0, name: '1100', selected: false, placed: false },
        { color: 1, size: 1, outline: 0, shape: 1, name: '1101', selected: false, placed: false },
        { color: 1, size: 1, outline: 1, shape: 0, name: '1110', selected: false, placed: false },
        { color: 1, size: 1, outline: 1, shape: 1, name: '1111', selected: false, placed: false },
    ];

    let unPlayedPieces: gamePieceOption[] = $state([]);
    let playedPieces: gamePieceOption[] = $state([]);

    let selectedPiece: gamePieceOption = $state(null);

    let boardLocations: boardLocation[] = $state([]);

    let currentPlayer: "John"|"Sophie" = $state("J");

    let showModal: boolean = $state(true);

    let showChooseNewGameModal: boolean = $state(false);

    let fetchingEnabled : boolean = $state(true);


    let me: "John"|"Sophie";

    let action: "Choose Piece For Next Player"|"Place Your Piece" = $state("Choose Next Piece");

    let startNewGame: boolean = $state(false);


    async function init() {

        //randomly assign the first player
        currentPlayer = Math.random() > 0.5 ? "John" : "Sophie";
        action = "Choose Piece For Next Player";

        if (startNewGame) {
            unPlayedPieces = gamePieces;
            playedPieces = [];
            boardLocations = boardLocationOptions;
            await pushToServer();
        } else {
            await pullFromServer();
        }

        setInterval(() => {
            pullFromServer();
        }, 750);

    }



    let paramsNumber = 0;

    function updateParams() {
        paramsNumber++;
        //if the last digit of the params number is 2, then
    }

    function updateAction() {
        if (action === "Choose Piece For Next Player") {
            action = "Place Your Piece";
        } else {
            action = "Choose Piece For Next Player";
        }
    }

    function updatePlayer() {
        currentPlayer = currentPlayer === "John" ? "Sophie" : "John";
    }

    function isMyTurn() {
        return currentPlayer === me || true;
    }

    function isSelectingPhase() {
        return action === "Choose Piece For Next Player";
    }

    function isPlacingPhase() {
        return action === "Place Your Piece";
    }

    function getUnPlayedPiece(name) {
        return unPlayedPieces.find(piece => piece.name === name);
    }

    function getPlayedPiece(name) {
        return playedPieces.find(piece => piece.name === name);
    }

    async function handleSelecting(name) {
        if (!isMyTurn() || !isSelectingPhase()) return;


        unPlayedPieces = unPlayedPieces.map(piece =>
            piece.name === name
                ? { ...piece, selected: true } // Create a new object for the updated piece
                : { ...piece, selected: false }
        );

        selectedPiece = getUnPlayedPiece(name);

        updateAction();

        updatePlayer();
        //temporarily stop the fetching from server
        fetchingEnabled = false;
        await pushToServer();
        //resume fetching from server
        fetchingEnabled = true;
    }

    async function playPiece(locationName) {

        if (!selectedPiece || !isMyTurn() || !isPlacingPhase()) return;


        // Find the board location
        let locationObject = boardLocations.find(loc => loc.name === locationName);

        if (!locationObject || locationObject.piece) return; // Prevent placing on an occupied spot

        // Assign the piece to the location
        locationObject.piece = selectedPiece.name;

        // Remove the placed piece from `unPlayedPieces`
        unPlayedPieces = unPlayedPieces.filter(piece => piece.name !== selectedPiece.name);

        // Add the placed piece to `playedPieces` and set `selected` to false
        playedPieces = [...playedPieces, { ...selectedPiece, selected: false, placed: true }];

        // Reset selectedPiece
        selectedPiece = null;


        updateAction();

        fetchingEnabled = false;
        await pushToServer();
        //resume fetching from server
        fetchingEnabled = true;

        if (checkForWin()) {
            handleWin();
            return;
        }
    }

    function handleWin() {
        alert(`${currentPlayer} wins!`);
        // startNewGame = true;
        // init();
    }

    function checkSequenceForWin(a: gamePieceOption, b: gamePieceOption, c: gamePieceOption, d: gamePieceOption) {
        if (!(a && b && c && d)) return false;


        console.log($state.snapshot(a));
        console.log($state.snapshot(b));
        console.log($state.snapshot(c));
        console.log($state.snapshot(d));


        let sameSize = a.size === b.size && b.size === c.size && c.size === d.size;
        let sameColor = a.color === b.color && b.color === c.color && c.color === d.color;
        let sameOutline = a.outline === b.outline && b.outline === c.outline && c.outline === d.outline;
        let sameShape = a.shape === b.shape && b.shape === c.shape && c.shape === d.shape;

        if (sameSize || sameColor || sameOutline || sameShape) {
            return true;
        }
    }


    function checkForWin() {
        // Check for a win
        let win = false;

        // Check rows
        for (let i = 0; i < 4; i++) {
            let row = boardLocations.filter(loc => loc.row === i);
            let pieces = row.map(loc => loc.piece).filter(piece => piece !== null);
            if (pieces.length !== 4) continue;
            win = checkSequenceForWin(
                getPlayedPiece(pieces[0]),
                getPlayedPiece(pieces[1]),
                getPlayedPiece(pieces[2]),
                getPlayedPiece(pieces[3])
            );
            if (win) break;
        }

        if (win) {
            return win;
        }

        // Check columns
        for (let i = 0; i < 4; i++) {
            let col = boardLocations.filter(loc => loc.col === i);
            let pieces = col.map(loc => loc.piece).filter(piece => piece !== null);
            if (pieces.length !== 4) continue;
            win = checkSequenceForWin(
                getPlayedPiece(pieces[0]),
                getPlayedPiece(pieces[1]),
                getPlayedPiece(pieces[2]),
                getPlayedPiece(pieces[3])
            );
            if (win) break;
        }

        if (win) {
            return win;
        }

        //Check diagonal 1
        win = checkSequenceForWin(
            getPlayedPiece(boardLocations[0].piece),
            getPlayedPiece(boardLocations[5].piece),
            getPlayedPiece(boardLocations[10].piece),
            getPlayedPiece(boardLocations[15].piece)
        );

        if (win) {
            return win;
        }

        //Check diagonal 2
        win = checkSequenceForWin(
            getPlayedPiece(boardLocations[3].piece),
            getPlayedPiece(boardLocations[6].piece),
            getPlayedPiece(boardLocations[9].piece),
            getPlayedPiece(boardLocations[12].piece)
        );

        return win;

    }



    function choosePlayer(player: "John" | "Sophie") {
        me = player;
        showModal = false; // Close the modal
        showChooseNewGameModal = true;
    }

    function chooseToStartNewGame(decision: boolean) {
        startNewGame = decision;
        showChooseNewGameModal = false;
        init(); // Start the game

    }

    async function pullFromServer() {
        if (fetchingEnabled) {
            let response = await fetch('https://cookiestoeat.com/quarto');
            if (response.ok && fetchingEnabled) {
                let data = await response.json();
                // Update the game state with the data
                let state = data.state;
                unPlayedPieces = state.unPlayedPieces;
                playedPieces = state.playedPieces;
                boardLocations = state.boardLocations;
                selectedPiece = state.selectedPiece;
                if (action != state.action || currentPlayer != state.currentPlayer) {
                    alert(2);
                    checkForWin();
                }
                currentPlayer = state.currentPlayer;
                action = state.action;

            } else if (!response.ok) {
                alert("HTTP-Error: " + response.status);
            }
        }
    }

    async function pushToServer() {
        let data: string = JSON.stringify(
            {
                state:
                    {
                        unPlayedPieces,
                        playedPieces,
                        boardLocations,
                        currentPlayer,
                        selectedPiece,
                        action
                    }
            }
        )
        await fetch('https://cookiestoeat.com/quarto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });
    }


    // init();

</script>

<style lang="scss">

  .shell {
    display: flex;
    height: 100vh;
  }

  .sidebar {
    width: 280px;
    background-color: #f8f9fa;
    padding: 15px;
    border-right: 1px solid #ddd;
    transition: transform 0.3s ease-in-out;
  }

  .sidebar.closed {
    transform: translateX(-100%);
  }

  .main-content {
    flex-grow: 1;
    padding: 20px;
    background-color: #fff;
  }

  .navbar {
    background-color: #007bff;
    color: white;
    padding: 10px;
  }

  .toggle-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
  }


  .left-border {
        border-left: 3px solid black;
    }

    .board-location {
        border: 1px solid black;
        height: 120px;
      text-align: center;

        &.has-piece {
            background-color: #eaeaea;
            cursor: not-allowed;
        }

      //hover and not has-peice
        &:hover:not(.has-piece) {
            background-color: lightgray;
          cursor: pointer;
        }
    }



  .mozal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .mozal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9;
  }

  .mozal button {
    margin: 10px;
    padding: 10px 20px;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }

  .mozal button:hover {
    background-color: #0056b3;
  }

</style>

<div class="shell">
    <!-- Sidebar -->
    <div class="sidebar">
        {#if !(showModal || showChooseNewGameModal)}
            <h3>{currentPlayer}'s Turn!</h3>
            <span>{action}</span>
        {/if}
    </div>

    <!-- Main content -->
    <div class="main-content">
        <!-- Modal -->
        {#if showModal}
            <div class="mozal-overlay"></div>
            <div class="mozal">
                <h2>Choose Your Player</h2>
                <button on:click={() => choosePlayer("John")}>John</button>
                <button on:click={() => choosePlayer("Sophie")}>Sophie</button>
            </div>
        {/if}

        {#if showChooseNewGameModal}
            <div class="mozal-overlay"></div>
            <div class="mozal">
                <h2>Do you want to start a new game?</h2>
                <button on:click={() => chooseToStartNewGame(true)}>Yes</button>
                <button on:click={() => chooseToStartNewGame(false)}>No</button>
            </div>
        {/if}

        <!-- Game Board -->
        {#if !(showModal || showChooseNewGameModal)}
            <div class="row">
                <div class="col-1"></div>
                <div class="col-6">
                    <div class="row">
                        {#each boardLocations as location (location.name)}
                            <div
                                    class="col-md-3 board-location {location.piece ? 'has-piece' : ''}"
                                    on:click={() => playPiece(location.name)}
                            >
                                {#if location.piece}
                                    {#each playedPieces as piece (piece.name)}
                                        {#if piece.name === location.piece}
                                            <GamePeice {...piece} />
                                        {/if}
                                    {/each}
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
                <div class="col-1"></div>
                <div class="col-4 left-border">
                    <div class="row">
                        {#each unPlayedPieces as piece (piece.name)}
                            <div class="col-md-3">
                                <GamePeice clicker={handleSelecting} {...piece} />
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>
