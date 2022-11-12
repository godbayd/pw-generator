import { knuthShuffle } from 'knuth-shuffle'

// returns thunk of generated password
export function generatePassword(state) {
    return () => {
        return knuthShuffle(fillChars(state))
            .map(thunk => thunk())
            .join('')
    }
}

/**
 * @description - creates a list of thunks that contain random
 * characters. the amount of random characters from each 
 * charset is specified by the getMinCharCounts.
 */
function fillChars(state) {
    const minCharCounts = getMinCharCounts(state)
    const charsets = getCharset(state.avoidAmbiguous)
    /** @type {(() => string)[]} */
    const minChars = Object.keys(minCharCounts)
        .map(key => {
            const charCount = minCharCounts[key]
            return new Array(charCount)
                .fill(() => charsets[key][rand(0, charsets[key].length - 1)], 0, charCount)
        }).flat()
    const minPwLength = getMinPwLength(state)
    if (minPwLength >= state.pwLength) return minChars
    const restOfChars = fillRest(state, charsets, minCharCounts, minPwLength)
    return [...minChars, ...restOfChars]
}

function fillRest(state, charsets, minCharCounts, minPwLength) {
    const restOfChars = []
    const keys = Object.keys(minCharCounts)
    for (let i = minPwLength; i < state.pwLength; i++) {
        const randomCharsetKey = keys[rand(0, keys.length - 1)]
        const randomCharset = charsets[randomCharsetKey]
        const randomChar = randomCharset[rand(0, randomCharset.length - 1)]
        restOfChars.push(() => randomChar)
    }
    return restOfChars
}

export function getMinPwLength(state) {
    return Object.values(getMinCharCounts(state))
        .reduce((acc, count) => acc + count, 0)
}

/** 
 * @description - creates an object of 
 * how many of the enabled keys is necessary
 * at a minimum
 * @returns {{[key: string]: number}} 
 */
function getMinCharCounts(state) {
    return {
        ...(state.specials ? {specials: Math.max(1, state.minSpecials)} : {}),
        ...(state.digits ? {digits: Math.max(1, state.minDigits)} : {}),
        ...(state.uppercase ? {uppercase: 1} : {}),
        ...(state.lowercase ? {lowercase: 1} : {})
    }
}


function getCharset(avoidAmbiguous) {
    const amiguousChars = 'OlI01'
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'
    const charsets = {
        digits: '0123456789',
        specials: '!@#$%^&*',
        lowercase: alphabet,
        uppercase: alphabet.toUpperCase()
    }
    return avoidAmbiguous
        ? Object.entries(charsets).reduce((acc, [key, charset]) => {
            const noAmbigCharset = Array.from(charset)
                .filter(char => !amiguousChars.includes(char))
                .join('')
            return { ...acc, [key]: noAmbigCharset }
        }, {})
        : charsets
}


function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min)
}
