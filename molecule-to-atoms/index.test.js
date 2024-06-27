import { test, expect } from 'vitest'
import { parseMolecule } from './index'

test("parseMolecule", () => {
    expect(parseMolecule("H")).toEqual({ H: 1 })
    expect(parseMolecule("HC")).toEqual({ H: 1, C: 1 })
    expect(parseMolecule("H2O")).toEqual({ H: 2, O: 1 })
    expect(parseMolecule("B2H6")).toEqual({ B: 2, H: 6 })
    expect(parseMolecule("C6Hg12O6")).toEqual({ C: 6, Hg: 12, O: 6 })
    expect(parseMolecule("C6H12O6")).toEqual({ C: 6, H: 12, O: 6 })
    expect(parseMolecule("Mo(CO)6")).toEqual({ Mo: 1, C: 6, O: 6 })
    expect(parseMolecule("Mg(OH)2")).toEqual({ Mg: 1, O: 2, H: 2 })
    expect(parseMolecule("K4[ON(SO3)2]2")).toEqual({ K: 4, O: 14, N: 2, S: 4 })
    expect(parseMolecule("(C5H5)Fe(CO)2CH3")).toEqual({ C: 8, H: 8, Fe: 1, O: 2 })
    expect(parseMolecule("Fe(C5H5)2")).toEqual({ Fe: 1, C: 10, H: 10 })
    expect(parseMolecule("Pd[P(C6H5)3]4")).toEqual({ Pd: 1, P: 4, C: 72, H: 60 })
    expect(parseMolecule("As2{Be4C5[BCo3(CO2)3]2}4Cu5")).toEqual({ As: 2, Be: 16, C: 44, B: 8, Co: 24, O: 48, Cu: 5 })
    expect(parseMolecule("{[Co(NH3)4(OH)2]3Co}(SO4)3")).toEqual({ Co: 4, N: 12, H: 42, O: 18, S: 3 })
    expect(parseMolecule("C2H2(COOH)2")).toEqual({ C: 4, H: 4, O: 4 })
})