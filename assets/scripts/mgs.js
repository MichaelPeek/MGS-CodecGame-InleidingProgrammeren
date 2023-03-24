// Start vars
const buttonsContainerEl = document.getElementById('button_parent');
const nameEL = document.getElementById('level_name');
const descriptionEL = document.getElementById('level_description');
const startButtonEL = document.getElementById('start_btn');
const successDescriptionEL = document.getElementById('success_description');
const failDescriptionEL = document.getElementById('fail_description');
const rankEL = document.getElementById('rank');
let levels = undefined;
// End vars

// Start functions
function getCodecElement() {
    return document.getElementById('codec');
}

function changeHeadsImgToTalk() {
    getCodecElement().src = 'assets/images/codectalk.jpg';
}

function changeHeadsImgToListen() {
    getCodecElement().src = 'assets/images/codeclisten.jpg';
}

function changeHeadsImgToSilent() {
    getCodecElement().src = 'assets/images/codecsilent.jpg';
}

function getLevel(levelId) {
    const index = levels.findIndex(l => l.id === levelId);
    if (index < 0) {
        // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Error
        throw new Error('Level niet gevonden!')
    }

    return levels[index];
}

function buildButton(option) {
    return '<button onclick="nextLevel(' + option.action + ')" type="button">' + option.text + '</button>';
}

function nextLevel(levelId) {
    // Get set level
    const level = getLevel(levelId);

    // Clear buttons
    buttonsContainerEl.innerHTML = '';
    rankEL.innerHTML = '';
    successDescriptionEL.innerHTML = '';
    failDescriptionEL.innerHTML = '';

    // Play button click audio when its not the first level
    if (levelId !== 11) {
        // source: https://stackoverflow.com/a/18628124
        (new Audio('./assets/sfx/Metal_Gear_Solid_Item_Open_Sound_Effect.wav')).play();

        // This is removed to trigger the typewriter animation again.
        descriptionEL.classList.remove('typewriter');
        descriptionEL.offsetWidth;
    }

    // Set level name
    nameEL.innerText = level.name;

    // Set level description
    descriptionEL.innerText = level.description;
    descriptionEL.classList.add('typewriter');

    // Set level success or failure description
    if (level.success) {
        successDescriptionEL.innerHTML = level.success_description;

        if (level.rank) {
            rankEL.innerHTML = 'Mission rank = <span class="text-gold">' + level.rank + '</span>';
        }
    }

    if (level.failed) {
        failDescriptionEL.innerHTML = level.fail_description;

        if (level.rank) {
            rankEL.innerHTML = 'Mission rank = <span class="text-red">' + level.rank + '</span>';
        }
    }

    // Set codec img (This can also be seen as a if else, but the switch is cleaner to use.)
    switch (level.name) {
        case 'Colonel campbell':
            changeHeadsImgToTalk();
            break;
    
        case 'Snake':
        default:
            changeHeadsImgToListen();
            break;
    }

    // source: https://developer.mozilla.org/en-US/docs/Web/API/setTimeout
    setTimeout(() => {
        changeHeadsImgToSilent();

        // Set option buttons
        let buttons = '';
        level.options.forEach(option => buttons += buildButton(option));
        buttonsContainerEl.innerHTML = buttons;

        changeHeadsImgToSilent();
    }, 2000); // MS 1000 = 1 sec

    // Play level audio
    if (level.sound) {
        (new Audio('./assets/sfx/' + level.sound)).play();    
    }

    if (level.success || level.failed) {
        startButtonEL.innerHTML = '<button onclick="nextLevel(11); hideMe(this)" class="start-btn" type="button">Restart Game</button>';
    }
}

function hideMe(el) {
    el.remove();
}
// End functions

// Start onload
window.onload = function() {
    fetch('./assets/json/spel_verloop.json') // source: https://www.freecodecamp.org/news/how-to-read-json-file-in-javascript/
        .then(response => response.json())
        .then(json => {
            levels = json;
            // User must start the game because i'm not allowed to auto play sound: https://developer.chrome.com/blog/autoplay/
            startButtonEL.innerHTML = '<button onclick="nextLevel(11); hideMe(this)" class="start-btn" type="button">Start</button>';
        });
}
// End onload
