import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//   render() {
//     return (
//       <button
//        className="square"
//        onClick={()=>{this.props.onClick()}}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }
function Square(props){
  let className="square";
  if(props.highlight){
    className += " highlight";
  }
  return(
    <button
    className = {className}
    onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    const shoudBeHighlighted = this.props.line? this.props.line.includes(i) : "";
    return (
      <Square
        value={this.props.squares[i]}
        onClick={()=>this.props.onClick(i)}
        highlight={shoudBeHighlighted}
      />
    );
  }

  render() {
    const ary = [0,1,2];

    return(
      <div>
        {ary.map(i =>
        <div className="board-row">
          {ary.map( j=> this.renderSquare(j + i*ary.length) )}
        </div>
        )}
      </div>
    );


    // return (
    //   <div>
    //     <div className="board-row">
    //       {this.renderSquare(0)}
    //       {this.renderSquare(1)}
    //       {this.renderSquare(2)}
    //     </div>
    //     <div className="board-row">
    //       {this.renderSquare(3)}
    //       {this.renderSquare(4)}
    //       {this.renderSquare(5)}
    //     </div>
    //     <div className="board-row">
    //       {this.renderSquare(6)}
    //       {this.renderSquare(7)}
    //       {this.renderSquare(8)}
    //     </div>
    //   </div>
    // );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history:[{squares :Array(9).fill(null)}],
      xIsNext:true,
      stepNumber:0,
      historyIsAsc:true,
    }
  }

  handleClick(i){
    const history = this.state.history.slice(0,this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    const row = Math.floor(i / 3) +1;
    const col = (i % 3) +1;
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext? "X": "O";
    this.setState({
      history:history.concat([{squares:squares , row:row , col:col}]),
      xIsNext : !this.state.xIsNext,
      stepNumber: history.length,
    });

  }

  jumpTo(step){
    this.setState({
        stepNumber:step,
        xIsNext:step%2 === 0,
    });

  }

  swap(){
    this.setState({
      // history:this.state.history.reverse(),
      historyIsAsc:!this.state.historyIsAsc
    }
    )
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const winningLine = winner? winner.line : null;

    const moves = history.map((step,move)=>{
      const desc = move?
        "Go to move after #" + move +"(" + (move%2===0? "O":"X") + "->" + history[move].row + ":" + history[move].col + ")":
        "Go to game start";
        return (
          <li key={move}>
            <button className={move === this.state.stepNumber? "bold":""} onClick={()=>this.jumpTo(move)}> {desc} </button>
          </li>
        );
    })
    let status;
    if(winner){
      status = "Winner:" + winner.player;
    }else{
      status = this.state.stepNumber >=9 ? 'Draw' : ('Next player:' + (this.state.xIsNext? 'X':'O'));
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i =>this.handleClick(i)}
            line = {winningLine}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={()=>this.swap()}>Asc ↔ Desc</button>
          <ol >{this.state.historyIsAsc?moves:moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares){
  const lines =[
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [2,4,6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
     return {player:squares[a],line:lines[i]};
   }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
