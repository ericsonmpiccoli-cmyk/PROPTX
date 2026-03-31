const fs = require('fs');

const code = fs.readFileSync('popup.js', 'utf8');

// Extract the initial array (before rotation) using balanced bracket counting
const arrFuncStart = code.match(/function\s+a0_0xe957\(\)\{const\s+\w+=/);
if (!arrFuncStart) { console.log('No array function found'); process.exit(1); }

const startIdx = arrFuncStart.index + arrFuncStart[0].length;
let bracketDepth = 0;
let arrayEndIdx = startIdx;
let foundStart = false;

for (let i = startIdx; i < code.length; i++) {
    if (code[i] === '[') {
        if (!foundStart) foundStart = true;
        bracketDepth++;
    } else if (code[i] === ']') {
        bracketDepth--;
        if (foundStart && bracketDepth === 0) {
            arrayEndIdx = i + 1;
            break;
        }
    }
}

const rawArrayStr = code.substring(startIdx, arrayEndIdx);
let rawArray;
try {
    rawArray = eval(rawArrayStr);
} catch (e) {
    console.error('Failed to eval array:', e.message);
    process.exit(1);
}

// Find the rotation IIFE target value
const iifeMatch = code.match(/\(a0_0xe957,(0x[a-f0-9]+)\)/);
const targetVal = parseInt(iifeMatch[1], 16);

// Find the offset in the lookup function
const lookupMatch = code.match(/function\s+a0_0x2017\(\w+,\w+\)\{\w+=\w+-(0x[a-f0-9]+)/);
const offset = parseInt(lookupMatch[1], 16);

console.log('Target rotation value:', targetVal);
console.log('Lookup offset:', offset, '(0x' + offset.toString(16) + ')');
console.log('Array length:', rawArray.length);

// Simulate the rotation
const arr = [...rawArray];
const getVal = (shift) => {
    const a = [...rawArray];
    for (let i = 0; i < shift; i++) a.push(a.shift());
    return a;
};

// Find the rotation by brute force
// The IIFE tries parseInt combinations until they equal targetVal
// Instead, let's just try all possible rotations and check which one makes sense
// by looking for known strings at known positions

// The rotation IIFE uses the a0_0x2017 function internally with the same offset
// After rotation, a0_0x2017(hex) = arr[hex - offset]
// We know 'proxy_webhook' should be in the array

// Let's try all 567 rotations
for (let rot = 0; rot < rawArray.length; rot++) {
    const testArr = [...rawArray];
    for (let i = 0; i < rot; i++) testArr.push(testArr.shift());

    // Check if this rotation makes known strings appear at expected positions
    // We can verify by checking if common strings like 'proxy_webhook', 'fetch' etc exist
    const hasProxy = testArr.includes('proxy_webhook');
    const hasMistral = testArr.some(s => s.includes('mistral'));

    if (hasProxy && hasMistral) {
        // Function: a0_0x2017(x) returns testArr[x - offset]
        // Find where proxy_webhook is
        const proxyPos = testArr.indexOf('proxy_webhook');
        const proxyHex = proxyPos + offset;


        // Build decoded map
        const decoded = {};
        for (let i = 0; i < testArr.length; i++) {
            decoded['0x' + (i + offset).toString(16)] = testArr[i];
        }

        fs.writeFileSync('all_decoded.json', JSON.stringify(decoded, null, 2));
        break;
    }
}
