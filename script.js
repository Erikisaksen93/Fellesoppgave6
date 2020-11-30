// model
let playerObject;
let enemyObject;
let animation = "idle";
let healthBarPlayer = 100;
let healthBarNPC = 200;
let highAttack = 30;
let midAttack = 20;
let lowAttack = 20;
let buttonState = "";
let backgroundMusic = new Audio('soundtrack.mp3');
let fatalityImg = "";
let announcerShow = "";
let activeButton = 'disabled';



// view
const appDiv = document.getElementById('app');

updateView();
// playMusic();
function updateView() {
    appDiv.innerHTML = `   
                            <div id="attackSelector" class="playerChoice">
                                <h1>Select attack style:</h1>
                                <button ${buttonState} id="high" onclick="attackSelector('high')">High Attack</button>
                                <button ${buttonState} id="mid" onclick="attackSelector('mid')">Mid Attack</button>
                                <button ${buttonState} id="low" onclick="attackSelector('low')">Low Attack</button>
                            </div>
                            <div class="player">
                                <h2>Player health:</h2>
                                <progress id="player_health" value="${healthBarPlayer}" min="0" max="100"></progress>
                            </div>

                            <div class="announcer">
                                <h1>${announcerShow}</h1>
                                <img id="fatality" src="${fatalityImg}"/>
                            </div>
                            <div class="animations">
                                <img src="./animations/${animation}.gif"/>
                                <img src="./images/vs.png" id="versus"/>
                            </div>

                            <div class="npc">
                                <h2>NPC health:</h2>
                                <progress id="npc_health" value="${healthBarNPC}" min="0" max="200"></progress>
                            </div>
                            <div>
                                <button onclick="window.location.reload();" ${activeButton} id="play_again">Play again?!</button>
                            </div>
                            `
}









// controller


function attackSelector(attack) {
    announcerShow = "";
    if (attack === 'high') {
        animation = 'high_attack_player'
        setTimeout(postPlayerAttack, 4800, highAttack)
        
    } else if (attack === 'mid'){
        animation = 'mid_attack_player';
        setTimeout(postPlayerAttack, 4650, midAttack)
    } else {
        animation = 'low_attack_player'; 
        setTimeout(postPlayerAttack, 4650, lowAttack)
    }
    buttonState = "disabled";
    updateView();
}




function NPCAttacks() {
   let randomAttack = Math.floor(Math.random() * 5);
   switch(randomAttack) {
        case 0:
            animation = 'high_attack_npc'
            setTimeout(postNPCAttack, 4650, highAttack + 5)
            break;
        case 1:
            animation = 'mid_attack_npc'
            setTimeout(postNPCAttack, 4650, midAttack + 5)
            break;
        case 2:
            animation = 'low_attack_npc'
            setTimeout(postNPCAttack, 4650, lowAttack + 5)
            break;
        default:
            animation = 'miss_attack_npc'
            setTimeout(postNPCAttack, 3300, 0)
            break;
   } 
   updateView();
}



function postPlayerAttack(attackDamage) {
    // announcerShow = "";
    let attackResult = calculateDamage(attackDamage, 50, healthBarNPC);
    if (attackResult.Crit) {
        announcerShow+=`Critical hit! </br>`;
        console.log("Critical hit!")
    };
    console.log("Player attacks for " + attackResult.DamageDealt)
    announcerShow+= `Player attacks for ${attackResult.DamageDealt}</br>`;
    if (attackResult.newHealth < 0) {
        healthBarNPC = 0;
        gameEnd("player");
        return;
    };
    healthBarNPC = attackResult.newHealth;
    updateView();

    NPCAttacks();   
}

function postNPCAttack(attackDamage) {
    let attackResult = calculateDamage(attackDamage, 0, healthBarPlayer);
    if (attackResult.DamageDealt == 0 ) {console.log("Miss"), announcerShow+=`NPC missed!</br>`};
    console.log("NPC attacks for " + attackResult.DamageDealt), announcerShow+=`NPC attacks for ${attackResult.DamageDealt}</br>`;
    if (attackResult.newHealth < 0) {
        healthBarPlayer = 0;
        gameEnd("npc");
        return;
    };
    healthBarPlayer = attackResult.newHealth;
    updateView();
    turnEnd();
}

function turnEnd() {
    animation = 'idle';
    buttonState = "";
    updateView();
}

function gameEnd(winner) {
switch(winner) {
    case "player":
        console.log("Player wins");
        announcerShow = `Player wins.`;
        fatalityImg = "./images/fatality.png";
        animation = "player_wins";
        break;
    case "npc":
        console.log("NPC wins");
        announcerShow = `NPC wins. it's official </br> you suck`;
        fatalityImg = "./images/fatality.png";
        animation = "npc_wins";
        break;
    };
activeButton = '';
updateView();
}


function calculateDamage(attackDamage, critChance, targetHealthbar) {
let randomInt = Math.floor(Math.random() * 101);
let crit = (critChance > randomInt);
if (crit) {attackDamage = attackDamage * 2};
let oldHealth = targetHealthbar;
targetHealthbar = (oldHealth - attackDamage);
return { "Crit" : crit, "RNG" : randomInt, "DamageDealt" : attackDamage, "OldHealth": oldHealth, "newHealth": targetHealthbar};

}

function playMusic() {
    backgroundMusic.play();
    backgroundMusic.volume = 0.2;
}