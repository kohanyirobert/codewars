export function parseMolecule(formula) {
    const normalized = normalizeFormula(formula)
    const tokens = tokenizeFormula(normalized)
    return calculateFormula(tokens)
}

function normalizeFormula(formula) {
    formula = formula.replaceAll('{', '(')
    formula = formula.replaceAll('}', ')')
    formula = formula.replaceAll('[', '(')
    return formula.replaceAll(']', ')')
}

function calculateFormula(node) {
    const results = {}
    if (node.type === 'group') {
        for (let i = 0; i < node.value.length; i++) {
            const currentNode = node.value[i]
            if (currentNode.type === 'group') {
                const partialResults = calculateFormula(currentNode)
                const nextNode = node.value[i + 1]
                if (nextNode.type === 'number') {
                    multipleMolecules(partialResults, nextNode.value)
                }
                mergeResults(results, partialResults)
            } else if (currentNode.type === 'molecule') {
                if (!results[currentNode.value]) {
                    results[currentNode.value] = 0
                }
            } else if (currentNode.type === 'number') {
                const previousNode = node.value[i - 1]
                if (previousNode.type === 'molecule') {
                    results[previousNode.value] += currentNode.value
                }
            }
        }
    }
    return results
}

export function tokenizeFormula(formula) {
    const rootGroup = { type: 'group', value: [], parent: null }
    let lastNumber = null
    let lastMolecule = null
    let group = rootGroup
    for (const char of formula) {
        if (isOpeningParen(char)) {
            if (lastMolecule) {
                group.value.push(lastMolecule)
                group.value.push({ type: 'number', value: 1 })
                lastMolecule = null
            } else if (lastNumber) {
                group.value.push(lastNumber)
                lastNumber = null
            }
            group = { type: 'group', value: [], parent: group }
            group.parent.value.push(group)
        } else if (isClosingParen(char)) {
            if (lastMolecule) {
                group.value.push(lastMolecule)
                group.value.push({ type: 'number', value: 1 })
                lastMolecule = null
            }
            if (lastNumber) {
                group.value.push(lastNumber)
                lastNumber = null
            }
            group = group.parent
        } else if (isNumber(char)) {
            if (lastMolecule) {
                group.value.push(lastMolecule)
                lastMolecule = null
            }
            if (lastNumber) {
                lastNumber.value += char
            } else {
                lastNumber = { type: 'number', value: char }
            }
            lastNumber.value = parseInt(lastNumber.value)
        } else if (isUpperCase(char)) {
            if (lastMolecule) {
                group.value.push(lastMolecule)
                group.value.push({ type: 'number', value: 1 })
                lastMolecule = null
            } else if (lastNumber) {
                group.value.push(lastNumber)
                lastNumber = null
            }
            lastMolecule = { type: 'molecule', value: char }
        } else if (isLowerCase(char)) {
            lastMolecule.value += char
        }
    }
    if (lastNumber) {
        group.value.push(lastNumber)
        lastNumber = null
    }
    if (lastMolecule) {
        group.value.push(lastMolecule)
        group.value.push({ type: 'number', value: 1 })
        lastMolecule = null
    }
    return rootGroup
}

function multipleMolecules(results, multiplier) {
    for (const molecule in results) {
        results[molecule] *= multiplier
    }
}

function mergeResults(results, partialResults) {
    for (const molecule in partialResults) {
        if (results[molecule]) {
            results[molecule] += partialResults[molecule]
        } else {
            results[molecule] = partialResults[molecule]
        }
    }
}

function isOpeningParen(char) {
    return char === '('
}

function isClosingParen(char) {
    return char === ')'
}

function isLowerCase(char) {
    return char === char.toLowerCase()
}

function isUpperCase(char) {
    return char === char.toUpperCase()
}

function isNumber(char) {
    return !Number.isNaN(parseInt(char))
}