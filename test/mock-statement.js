const mockStatement = {
  address: {
    line1: 'A Farm',
    line2: '',
    line3: 'Near a field',
    line4: 'Newcastle Upon Tyne',
    line5: 'Tyne & Wear',
    postcode: 'NE1 1AA'
  },
  businessName: 'Mr A Farmer',
  email: 'farmer@farms.com',
  frn: '12345674890',
  funding: [
    {
      annualValue: '110.00',
      area: '5.00',
      level: 'Introductory',
      name: 'Arable and horticultural soils',
      quarterlyPayment: '27.50',
      quarterlyReduction: '0.00',
      quarterlyValue: '27.50',
      rate: '22.00',
      reductions: [

      ]
    },
    {
      annualValue: '388.60',
      area: '12.00',
      level: 'Introductory',
      name: 'Moorland',
      quarterlyPayment: '97.15',
      quarterlyReduction: '0.00',
      quarterlyValue: '97.15',
      rate: '32.38',
      reductions: [

      ]
    },
    {
      annualValue: '400.00',
      area: '10.00',
      level: 'Intermediate',
      name: 'Arable and horticultural soils',
      quarterlyPayment: '25.00',
      quarterlyReduction: '75.00',
      quarterlyValue: '100.00',
      rate: '40.00',
      reductions: [
        {
          reason: 'Late claim submission',
          value: '25.00'
        },
        {
          reason: 'Over declaration reduction',
          value: '50.00'
        }
      ]
    },
    {
      annualValue: '420.00',
      area: '15.00',
      level: 'Introductory',
      name: 'Improved grassland soils',
      quarterlyPayment: '92.50',
      quarterlyReduction: '50.00',
      quarterlyValue: '105.00',
      rate: '28.00',
      reductions: [
        {
          reason: 'Over declaration reduction',
          value: '50.00'
        }
      ]
    },
    {
      annualValue: '1318.60',
      area: '42.00',
      level: '',
      name: 'Total',
      quarterlyPayment: '342.15',
      quarterlyReduction: '125.00',
      quarterlyValue: '329.65',
      rate: ''
    }
  ],
  payments: [
    {
      calculated: '16 June 2022',
      dueDate: '1 July 2022',
      invoiceNumber: 'S0000001C000001V001',
      reference: 'PY123456',
      settled: '1 July 2022',
      value: '242.15'
    }
  ],
  sbi: '1234567489',
  scheme: {
    frequency: 'Quarterly',
    name: 'Sustainable Farming Incentive',
    shortName: 'SFI',
    year: '2022'
  }
}

module.exports = mockStatement
