require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const rollType = {
    FEAR: '!fear',
    REASON: '!reason'
}
const TEMP_INSANITY = 3;
const INSANITY = 6;

client.once('ready', () => {
    console.log('Fear&Reason Mod Bot Ready!');
});

// Event listener when a user sends a message in the chat.
client.on('message', message => {
    let cmd = message.content.split(' ');
    let action = cmd[0];
    switch(action) {
            case '!fear': //!fear nd6 atr ?d
                return message.channel.send(fear(cmd));
            case '!reason':  //!reason nd6 atr ?d
                return message.channel.send(reason(cmd));
            case '!insanity':  //!insanity ins
                return message.channel.send(insanity(cmd));
            case '!control':  //!control
                return message.channel.send(control(cmd));
            case '!damage':  //!damage d
                return message.channel.send(damage(cmd));
            case '!sos':  //!sos a
                return message.channel.send(sos(cmd));
    }
});

client.login(process.env.BOT_TOKEN);

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fear(cmd) {
    return rollFearOrReason(cmd, rollType.FEAR)
}

function reason(cmd) {
  return  rollFearOrReason(cmd, rollType.REASON)
}

function rollFearOrReason(cmd, rollType) {
    let params = {
        atribute: cmd[2],
        modifier: cmd[3],
        diceQtd: cmd[1].substring(0, 1)
    }

    if(params.atribute === undefined) {
        return "Por favor informe seu atributo!";
    }

    let response = 'Seu resultado foi: ';
    let conditions = {
        success: false,
        critic: false
    }

    for (let i = 0; i < params.diceQtd; i++) {
        let diceResult = rollDice(1, 6,  params.modifier);
        response = response.toString() + ' [ '  + diceResult.toString() +  ' ]';
        conditions = verifyConditions(rollType, diceResult, params.atribute, conditions);
    }
    return getResponseWithConditions(conditions, response);
}

function rollDice(min, max, modifier) {
    let diceResult = getRandomIntInclusive(min, max);
    return calcModifier(diceResult, modifier);
}

function verifyConditions(rollType, diceResult, atribute, conditions) {

    if (diceResult === atribute && !conditions.critic) {
        conditions.critic = true;
    }

    if(!conditions.success) {
        switch (rollType) {

            case '!fear':
                if(diceResult >= atribute) {
                    conditions.success = true;
                }
                break;
            case '!reason':
                if(parseInt(diceResult) <= parseInt(atribute)) {
                    conditions.success = true;
                }
                break;
        }
    }
    return conditions;
}

function getResponseWithConditions(conditions, response) {
    if(conditions.success) {
        response = response + '\nVocê conseguiu!!! ';
    } else {
        response = response + '\nVocê não conseguiu x.x';
    }

    if(conditions.critic) {
        response = response + '\nAlém disso, você atravessou o véu do nosso mundo e vislumbrou a verdade do oculto e desconhecido';
    }
    return response;
}

function calcModifier(diceResult, modifier) {
    if(modifier === 'd') {
        diceResult = parseInt(diceResult) + parseInt(-1);
    }
    return diceResult;
}

function insanity(cmd) {
    let insanity = cmd[1];
    if(insanity === undefined) {
        return "Por favor informe sua insanidade!";
    }
    let response = 'Seu resultado foi: ';
    let diceResult = rollDice(1, 6);
    response = response + diceResult.toString() + '';
    if(diceResult <= insanity ) {
        let newInsanity = parseInt(insanity) + parseInt(1);
        response = response + '\nVocê foi afetado e adquiriu um novo ponto de insanidade: ' + newInsanity;
        if(newInsanity >= TEMP_INSANITY && newInsanity <INSANITY) {
            response = response + '\nAlém disso está emocionalmente abalado: ' + getTempInsanity();
        }

        if(newInsanity >= INSANITY) {
            let permInsanity = getInsanity();
            response = response + '\n Além disso você foi permanentemente afetado: ' + permInsanity;
        }
        return response;
    }
    return  response + " Você manteve o controle e não foi afetado."
}

function control() {
    let diceResult = rollDice(1, 6);
    let result = diceResult/2;
    let response = "Seu resultado foi: [ " + result + " ]\n";
    if(result === 0){
       response = response + "Ufa! Você conseguiu se controlar!"
    }
    response = response + "Ops! Sua insanidade assumiu o controle :c"
    return response;
}

function damage(cmd) {
    let actualDamage = cmd[1];
    let diceResult = rollDice(1, 6)
    let response = 'Seu resultado foi: ' + diceResult + '\n';
    if(diceResult > actualDamage) {
        let newDamage = parseInt(diceResult) + parseInt(1);
        return response +  "Você se feriu. Seu dano atual é: " +  newDamage;
    }
    return  response + "Vocẽ não sofreu nenhum dano.";
}

function sos(cmd) {
    let action = cmd[1];

    let help = {
        fearDesc: "fear => nd6 atributo d(opcional) \n Onde: \n - n é o qtd de dados que se deseja rolar \n- atributo é o valor do seu atributo \n- d é para rolar com desvantagem",
        reasonDesc : "reason => nd6 atributo d(opcional) \n Onde: \n- n é o qtd de dados que se deseja rolar \n- atributo é o valor do seu atributo \n- d é para rolar com desvantagem",
        insanityDesc: "insanity => i \n Onde: \n - i é o valor da sua insanidade",
        damageDesc: "damage => d \n Onde: \n- d é o valor do seu dano atual",
        controlDesc: "control => Não possui nenhum parametro adicional"
    }

    switch (action) {
        case 'fear':
            return help.fearDesc;
            break;
        case 'reason':
            return help.reasonDesc;
            break;
        case 'insanity':
            return help.insanityDesc;
            break;
        case 'damage':
            return help.damageDesc;
            break;
        case 'control':
            return help.controlDesc;
            break;
        default:
            return help.fearDesc + '\n\n\n' + help.reasonDesc + '\n\n\n' + help.insanityDesc + '\n\n\n' + help.controlDesc + '\n\n\n' + help.damageDesc;
            break;
    }
}

function getTempInsanity() {
  let d1 = getRandomIntInclusive(1, 6);
  let d2 = getRandomIntInclusive(1, 6);
  let result = parseInt(d1) + parseInt(d2);
  switch (result) {
      case 1:
          return "Você desmaiou."
          break;
      case 2:
          return "Você está imobilizado e gritando sem parar."
          break;
      case 3:
          return "Você fugiu em pânico."
          break;
      case 4:
          return "Você começa a rir sem parar."
          break;
      case 5:
          return "Você tenta se ferir."
          break;
      case 6:
          return "Você tenta ferir um aliado."
          break;
      case 7:
          return "Você caiu no chão em posição fetal."
          break;
      case 8:
          return "Você começa bater a cabeça na parede sem parar."
          break;
      case 9:
          return "Você não consegue falar."
          break;
      case 10:
          return "Você não consegue enxergar."
          break;
      case 11:
          return "Você não sabe quem você é."
          break;
      case 12:
          return "Você começa a falar em uma língua que ninguém conhece."
          break;
  }
}

function getInsanity() {
    var result = rollDice(1, 6);
    switch (result) {
        case 1:
            return "Agora você tem alucinações.."
            break;
        case 2:
            return "Agora você tem ataques permanentes de ponto."
            break;
        case 3:
            return "Agora você tem desmaios constantes."
            break;
        case 4:
            return "Agora você tem catatonia."
            break;
        case 5:
            return "Agora você tem acessos de fúria."
            break;
        case 6:
            return "Agora você tem piromania."
            break;
    }

}