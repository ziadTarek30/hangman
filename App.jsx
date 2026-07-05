import React, { useState } from "react";
import "./index.css";
import { languages } from "./languages"
import { nanoid } from "nanoid";
import { clsx } from 'clsx';
import { getFarewellText } from "./utils";
import { words } from './words';
import Confetti from 'react-confetti';


export default function Hangman() {
    const [currentWord, setCurrentWord] = useState
    (getRandomWord);
    console.log('word', currentWord)
    const [guessedLetters, setGuessedLetters] = useState([]);

    function getRandomWord() {
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex];
    }

    let wrongGuessCount = 0;

    for (let guessLetter of guessedLetters) {
        if (!currentWord.toUpperCase().includes(guessLetter))
            wrongGuessCount++;
    }
    console.log(wrongGuessCount);
    const isGameWon = currentWord.split('').every(letter => guessedLetters.includes(letter.toUpperCase()));
    const isGameLost = wrongGuessCount >= languages.length - 1;
    const isGameOver = isGameLost || isGameWon;

    const langsItems = languages.map((lang, index) => {
        const {backgroundColor, color} = lang
        const style = {
            backgroundColor, color
        };
        return (
        <div key={lang.name} className="language" style={style}>
            {lang.name}
            <div className={index < wrongGuessCount ?'lost': 'lost hidden'}>💀</div>
        </div>)
    });

   
    

    const displayWordsElems = [];
    for (let i = 0; i < currentWord.length; i++) {
        const letter = guessedLetters.includes(currentWord[i].toUpperCase()) ? currentWord[i].toUpperCase(): ''
        displayWordsElems.push(
        <span
        key={i}>{letter}</span>)
    }
    if (isGameLost) {
        for (let i = 0; i < currentWord.length; i++) {
            if (!guessedLetters.includes(currentWord[i].toUpperCase())) {
                displayWordsElems[i] = <span
                style={{color: '#EC5D49'}}
                key={i}>
                    {currentWord[i].toUpperCase()}
                </span>
            }
        }
    }

    const alphabet = 'abcdefghijklmnopqrstuvwxyz'
    const keyboardElems = [];
    
    function pickLetter(letter) {
        setGuessedLetters(prevGusses => {
            if (prevGusses.includes(letter))
                return prevGusses;
            else
                return [...prevGusses, letter];
        });
    }

    
    for (let char of alphabet.toUpperCase()) {
        const isGuessed = guessedLetters.join('').includes(char);

        const isInWord = currentWord.toUpperCase().includes(char);

        const className = clsx({
            correct: isGuessed && isInWord,
            wrong: isGuessed && !isInWord
        })

        keyboardElems.push(
        <button
        className={className}
        // style={{backgroundColor}}
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(char)}
        onClick={() => pickLetter(char)} 
        key={char}>
            {char}
        </button>)
    }
    console.log('letters', guessedLetters);
    const guessedWrong = guessedLetters.length !== 0 && !currentWord.toUpperCase().includes(guessedLetters[guessedLetters.length - 1]);
    console.log('guessedWrong', guessedWrong)
    const gameStatusClassName = clsx({
        'game-status': true,
        won: isGameWon,
        lost: isGameLost,
        'wrong-guess': !isGameOver && guessedWrong
    })
    console.log(isGameWon)
    function gameStatusContent() {
        if (isGameOver) {
            if (isGameWon) {
                return (
                    <>
                        <h2>You win!</h2>
                        <p>Well done! 🎉</p>
                    </>
                    
                ) 
            } else {
                return (
                    <>
                        <h2>Game over!</h2>
                        <p>You lose! Better start learning Assembly 😭</p>
                    </>
                )
            }
            
        } else if (guessedWrong) {
            return (
                <h2>{getFarewellText(languages[wrongGuessCount - 1].name)}</h2>
            )
        } else {
            return <></>
        }
    }

    function playNewGame() {
        setGuessedLetters([]);
        setCurrentWord(getRandomWord());
    }
    return (
        <> 

        <main>
            {isGameWon && <Confetti numberOfPieces={1000} recycle={false}/>}
            <header>
                <h1>Assembly: Endgame</h1>
                <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
            </header>

            <section 
            aria-live="polite"
            role={'status'} className={gameStatusClassName}>
                {gameStatusContent()}
            </section>

            <section className="languages-container">
                {langsItems}
            </section>
            
            <section className="letters-display">
                {displayWordsElems}
            </section>

            {/* aria-live screen reader section for displayed guesses status */}
            <section
            aria-live='polite'
            role='status'
            className="sr-only">
                <p>
                    {guessedWrong ? `sorry, the letter ${guessedLetters[guessedLetters.length-1]} is not in the word`: `correct! the letter ${guessedLetters[guessedLetters.length-1]} is in the word`}
                     {`you have ${languages.length-1-wrongGuessCount} attempts left`}
                </p>

                <p>current word: {currentWord.split('').map(letter => guessedLetters.includes(letter.toUpperCase()) ? letter + '.': 'blank.').join(' ')}</p>
            </section>
            
            <section className="keyboard">
                {keyboardElems}
            </section>
            {isGameOver &&
            <div className="new-game-container">
                <button onClick={playNewGame} className="new-game">
                    New Game
                </button>
            </div>}
            
        </main>
        </>
    )
}
