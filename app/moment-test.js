'use strict'

const moment = require('moment')
const dateVal = '01/12/2022'
// const dateVal = 'Tue Feb 08 2022 00:00:00 GMT+0000 (Greenwich Mean Time)'
// console.log(moment(dateVal, 'DD/MM/YYYY').format('D MMMM YYYY'))

const formatDate = (dateVal) => {
  return moment(dateVal, ['DD/MM/YYYY', 'ddd MMM DD YYYY HH:mm:ss']).format('D MMMM YYYY')
}
console.log(formatDate(dateVal))
