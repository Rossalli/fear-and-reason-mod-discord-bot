

const ATRIBUTE = '3';

describe('My Test Suite', () => {
    it('My Test Case', () => {
        expect(true).toEqual(true);
    });
});


// describe('Roll !fear __tests__', () => {
//     it('roll one dice', () => {
//         let cmd = ['!fear', '1d6', ATRIBUTE];
//         let result = bot.fear(cmd);
//         console.log(result)
//         if(isFearSuccess(result))  {
//             assert.match(result, '.*Você conseguiu');
//         } else{
//             assert.match(result, '.*Você não conseguiu.*');
//         }
//
//         if(isCritcRolling()) {
//             assert.equal(result, '  .*vislumbrou a verdade do oculto e desconhecido.*');
//         }
//
//     });
// });


function isFearSuccess(result) {
    return result.includes('3') || result.includes('4') || result.includes('5') || result.includes('6') ;
}

function isCritcRolling(result) {
    return result.includes(ATRIBUTE);
}