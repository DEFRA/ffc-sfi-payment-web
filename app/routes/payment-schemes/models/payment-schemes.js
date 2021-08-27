const { forEach } = require("../../static")

function ViewModel (values, error) {
  this.model = {
    caption: "Payment Schemes",
    captionClasses: "govuk-table__caption--m",
    firstCellIsHeader: true,
    head: getHeaders(),
    rows: getAllRows(values)
  }
}
  
const getHeaders = () => {
  return [
    {
      text: "Scheme Id"
    },
    {
      text: "Name"
    },
    {
      text: "Active/Not Active"
    },
    {
      text : ""
    }
  ]
}

const getAllRows = (values) => {
  const items = []

  for(const val of values) {
    // console.log(val)
    val.active = val.active ? 'Active' : 'Not Active'
    items.push(val)
        // items.push(getScheme(val))
  }
  return items
}

module.exports = ViewModel


//   const getScheme = (val) => {
//     const items = []
//     const itemText = {}
//     itemText.text = val.schemeId
//     items.push(itemText)
//     const itemName = {}
//     itemName.text = val.name
//     items.push(itemName)
//     const itemActive = {}
//     itemActive.text = val.active ? 'Active' : 'Not Active'
//     items.push(itemActive) 
//     // const itemUpdate = {}
//     // itemUpdate.text = "{{ govukButton({" 
//     //    + "text: \"Update\""
//     //   +"}) }}"

//     // items.push(itemUpdate) 

//     // for(const i of items) {
//     //     console.log(i)
//     // }

//     return items
//   }



  //   [ { schemeId: 1, name: 'SFI', active: true } ]

