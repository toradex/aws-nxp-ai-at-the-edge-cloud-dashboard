/* eslint-disable no-console */
/* eslint-disable max-len */
import curry from 'ramda/src/curry'
import compose from 'ramda/src/compose'
import toUpper from 'ramda/src/toUpper'
import head from 'ramda/src/head'
import tail from 'ramda/src/tail'
import concat from 'ramda/src/concat'
import converge from 'ramda/src/converge'
import split from 'ramda/src/split'
import map from 'ramda/src/map'
import equals from 'ramda/src/equals'
import prop from 'ramda/src/prop'
import reduce from 'ramda/src/reduce'
import join from 'ramda/src/join'

export const capitalize = converge(concat, [compose(toUpper, head), tail])
export const maxPlus = (list) => reduce((a, b) => Math.max(a, b), list[0], list)
export const compareObjectProp = (obj1, obj2, propName) => equals(prop(propName, obj1), prop(propName, obj2))
export const compareObjectProps = (obj1, obj2, propNames) => map(propName => compareObjectProp(obj1, obj2, propName), propNames)
export const getTail = curry((separator, string) => compose(join(separator), tail, split(separator))(string))
